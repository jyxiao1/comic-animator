import numpy as np
from scipy.spatial import ConvexHull
from skimage import measure
from skimage import filters
import cv2


def main():
    img = cv2.imread("exmangapg.png", cv2.IMREAD_GRAYSCALE)
    height, width = img.shape
    mask = np.zeros((height + 2, width + 2), np.uint8)
    # Floodfill from point (height-1, width-1)
    flags = 4 | ( 255 << 8 ) | cv2.FLOODFILL_MASK_ONLY
    cv2.floodFill(img, mask, (width-1, height-1), 128, 1, 1, flags)
    cv2.imshow('image', mask)
    cv2.waitKey(0)
    cv2.destroyAllWindows()




if __name__ == "__main__":
    main()