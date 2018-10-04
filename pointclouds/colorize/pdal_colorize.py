# -*- coding: utf-8 -*-
"""
Python3

@author: chrisl
"""

from io import BytesIO
import json
import math
import numpy as np
import matplotlib.image as mpimg
from owslib.wms import WebMapService
from requests.exceptions import ReadTimeout


def request_image(bbox, size, wms_url, wms_layer, wms_srs,
                  wms_version, wms_format, retries):

    for i in range(retries):
        try:
            wms = WebMapService(wms_url, version=wms_version)
            wms_img = wms.getmap(layers=[wms_layer],
                                 srs=wms_srs,
                                 bbox=bbox,
                                 size=size,
                                 format=wms_format,
                                 transparent=True)
            break
        except ReadTimeout as e:
            if i != retries-1:
                print("ReadTimeout, trying again..")
            else:
                raise e

    img = mpimg.imread(BytesIO(wms_img.read()))

    return img


def image_size(bbox, ppm=4):
    dif_x = bbox[2] - bbox[0]
    dif_y = bbox[3] - bbox[1]
    aspect_ratio = dif_x / dif_y
    resolution = int(dif_x * ppm)
    img_size = (resolution, int(resolution / aspect_ratio))

    return img_size


def retrieve_image(bbox, wms_url, wms_layer, wms_srs,
                   wms_version, wms_format, ppm, max_image_size):
    """
    Download an orthophoto from the PDOK WMS service.

    Parameters
    ----------
    bbox

    Returns
    -------
    out_filename : string
        The path to the output image file.

    Output
    ------
    PNG image
    """
    retries = 10

    [xmin, ymin, xmax, ymax] = bbox

    x_range = xmax - xmin
    y_range = ymax - ymin
    longest_side = max([x_range, y_range])

    if (longest_side * ppm > max_image_size):
        length = max_image_size / ppm
        length_pixels = max_image_size

        rows = int(math.ceil((ymax-ymin)/length))
        cols = int(math.ceil((xmax-xmin)/length))

        img = np.zeros((length_pixels*rows, length_pixels*cols, 3))

        for col in range(cols):
            for row in range(rows):
                cell = [xmin+col*length, ymin+row*length,
                        xmin+(col+1)*length, ymin+(row+1)*length]

                img_part = request_image(cell, (length_pixels, length_pixels),
                                         wms_url, wms_layer, wms_srs,
                                         wms_version, wms_format, retries)

                img[((length_pixels*rows)-(row+1) *
                     length_pixels):(length_pixels*rows)-row*length_pixels,
                    col*length_pixels:(col+1)*length_pixels] = img_part

        img = img[(length_pixels*rows)-int(y_range*ppm):,
                  :int(round(x_range*ppm))]
    else:
        size = image_size(bbox)
        img = request_image(bbox, size, wms_url, wms_layer, wms_srs,
                            wms_version, wms_format, retries)

    return img


def las_colorize(ins, outs):
    """
    Adds RGB information to a LAS file by downloading an orthophoto from
    the PDOK WMS service.

    Parameters
    ----------

    """
    wms = pdalargs
    if isinstance(pdalargs, str):
        wms = json.loads(pdalargs)
    X = ins['X']
    Y = ins['Y']

#    print("pdalargs: {}".format(wms))

    [xmin, ymin, xmax, ymax] = bbox = [min(X), min(Y), max(X), max(Y)]

#    print("Bounding box: {}".format(bbox))

    img = retrieve_image(bbox, wms['wms_url'], wms['wms_layer'],
                         wms['wms_srs'], wms['wms_version'],
                         wms['wms_format'], int(wms['wms_ppm']),
                         int(wms['wms_max_image_size']))

#    print("First pixel of retrieved image: {}".format(img[0][0]))
#    print("Last pixel of retrieved image: {}".format(img[-1][-1]))

    img_size = img.shape[:2]

#    print("Image size: {}".format(img_size))

    x_img = np.round(((X - xmin) / (xmax-xmin)) *
                     (img_size[1]-1)).astype(int)
#    print("First 10 x pixels: {}".format(x_img[:10]))
    y_img = np.round(((ymax - Y) / (ymax-ymin)) *
                     (img_size[0]-1)).astype(int)
#    print("First 10 y pixels: {}".format(y_img[:10]))

    rgb = img[y_img, x_img] * 255
#    print("First 10 RGB values: {}".format(rgb[:10]))
#
#    print("First 10 red values: {}".format(np.array(rgb[:10, 0], dtype=np.uint16)))
#
#    print("Length in: {}".format(len(X)))
#    print("Length out: {}".format(len(np.array(rgb[:, 0], dtype=np.uint16))))

    outs['Red'] = np.array(rgb[:, 0], dtype=np.uint16)
    outs['Green'] = np.array(rgb[:, 1], dtype=np.uint16)
    outs['Blue'] = np.array(rgb[:, 2], dtype=np.uint16)

    return True

#img = retrieve_image([185954.9, 434811.6, 187859.0, 436821.1], 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?', '2017_ortho25', 'EPSG:28992', '1.3.0', 'image/png', 4, 2000)
#img2 = retrieve_image([187459.7, 430601.5, 187625.2, 430756.1], 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?', 'Actueel_ortho25', 'EPSG:28992', '1.3.0', 'image/png', 4, 2000)
#img6 = retrieve_image([183729.4,431984.9,184391.5,432603.2], 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?', 'Actueel_ortho25', 'EPSG:28992', '1.3.0', 'image/png', 4, 2000)
#img = retrieve_image([180000.0, 431250.0, 185000.0, 437500.0], 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?', 'Actueel_ortho25', 'EPSG:28992', '1.3.0', 'image/png', 4, 2000)
#img = retrieve_image([180000, 431250, 184999.999, 437499.999], 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?', 'Actueel_ortho25', 'EPSG:28992', '1.3.0', 'image/png', 4, 2000)
