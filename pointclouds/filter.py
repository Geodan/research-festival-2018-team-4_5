import numpy as np

def cast_type(ins, outs):
    #outs = ins
    Int = ins['Intensity']
    outs['Intensity'] = (255*Int.astype(int)/65535).astype(np.uint16)
    return True
