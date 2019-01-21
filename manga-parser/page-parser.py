import numpy as np
from scipy.spatial import ConvexHull
from skimage import measure
from skimage import filters
import cv2
import time

def draw_contour(img, i, contours, hull,hierarchy):
    # create an empty black image
    drawing = np.zeros((img.shape[0], img.shape[1], 3), np.uint8)
    # draw contours and hull points
    color_contours = (0, 255, 0)  # green - color for contours
    color = (255, 0, 0)  # blue - color for convex hull
    # draw ith contour
    cv2.drawContours(drawing, contours, i, color_contours, 1, 8, hierarchy)
    # draw ith convex hull object
    cv2.drawContours(drawing, hull, i, color, 1, 8)

    cv2.imshow('image', drawing)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    img = cv2.imread("exmangapg.png", cv2.IMREAD_GRAYSCALE)
    naruto1 = cv2.imread("naruto_1_test.jpg", cv2.IMREAD_GRAYSCALE)
    blur = cv2.blur(naruto1, (5, 5))
    height, width = blur.shape
    mask = np.zeros((height + 2, width + 2), np.uint8)
    # Floodfill from point (height-1, width-1)
    flags = 4 | ( 255 << 8 ) | cv2.FLOODFILL_MASK_ONLY
    cv2.floodFill(blur, mask, (width-1, height-1), 255, 1, 1, flags)
    cv2.floodFill(blur, mask, (width - 1, 0), 255, 1, 1, flags)
    ret, thresh = cv2.threshold(mask, 254, 255, cv2.THRESH_BINARY)
    im2, contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    # create hull array for convex hull points
    hull = []

    # calculate points for each contour
    for i in range(len(contours)):
        # creating convex hull object for each contour
        hull.append(cv2.convexHull(contours[i], False))
        c = contours[i]
        # for j in range(len(contours[i])):
        #     print(str(contours[i][j]))
        #     time.sleep(1)
        print(str(np.amax(c, axis=0)))
        extLeft = np.amin(c, axis=0)[0][0]
        extRight = np.amax(c, axis=0)[0][0]
        extTop = np.amin(c, axis=0)[0][1]
        extBot = np.amax(c, axis=0)[0][1]
        print(type(extLeft))
        crop_img = thresh[extLeft:extRight, extTop:extBot]
        temp_name = "panel" + str(i) + ".png"
        cv2.imwrite(temp_name, crop_img)

        # black_mask = np.zeros(thresh.shape).astype(img.dtype)
        # color = 255
        # cv2.fillPoly(black_mask, contours[i], color)
        # result = cv2.bitwise_and(thresh, black_mask)
        # filename = "result" + str(i) + ".png"
        # cv2.imwrite(filename, result)

    # for i in range(len(contours)):
    #     for j in range(len(contours[i])):
    #         print(contours[i][j], end = " ")
    #     time.sleep(4)

    # # create an empty black image
    # drawing = np.zeros((thresh.shape[0], thresh.shape[1], 3), np.uint8)
    # # draw contours and hull points
    # for i in range(len(contours)):
    #     color_contours = (0, 255, 0)  # green - color for contours
    #     color = (255, 0, 0)  # blue - color for convex hull
    #     # draw ith contour
    #     cv2.drawContours(drawing, contours, i, color_contours, 1, 8, hierarchy)
    #     # draw ith convex hull object
    #     cv2.drawContours(drawing, hull, i, color, 1, 8)
    #
    # cv2.imshow('image', blur)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    # cv2.imwrite('testing.png', thresh)


if __name__ == "__main__":
    main()