arenagebied.las:
	pdal pipeline pipeline.json

arenagebied_color.las: arenagebied.las
	python3 ./colorize/las_colorize.py -i arenagebied.las -o arenagebied_color.las

entwine: arenagebied_color.las
	docker run -it -v ~/festival/pointclouds:/pointclouds connormanning/entwine build \
		-c /pointclouds/entwinebuild.json

cesium: entwine
	docker run -it -v ~/festival/pointclouds:/pointclouds connormanning/entwine convert \
		-i /pointclouds/entwine \
		-o /pointclouds/cesium/entwine \
		--colorType rgb

clean:
	rm *.las
	rm -rf entwine
	rm -rf cesium
