import cv2
import numpy as np

def detect_deforestation(before_path, after_path, output_path):
    """
    Compare two satellite images and highlight deforestation (vegetation loss).
    Returns: percent change (vegetation loss %)
    """

    # Load images
    before = cv2.imread(before_path)
    after = cv2.imread(after_path)

    if before is None or after is None:
        raise ValueError("Error: Could not load input images.")

    # Resize images to the same size (important!)
    after = cv2.resize(after, (before.shape[1], before.shape[0]))

    # Convert both to HSV (Hue-Saturation-Value) for vegetation detection
    before_hsv = cv2.cvtColor(before, cv2.COLOR_BGR2HSV)
    after_hsv = cv2.cvtColor(after, cv2.COLOR_BGR2HSV)

    # Define vegetation color range (tuned for green)
    lower_green = np.array([35, 40, 20])
    upper_green = np.array([90, 255, 255])

    # Mask vegetation areas
    before_mask = cv2.inRange(before_hsv, lower_green, upper_green)
    after_mask = cv2.inRange(after_hsv, lower_green, upper_green)

    # Detect vegetation loss (areas that were green before but not after)
    loss_mask = cv2.subtract(before_mask, after_mask)

    # Optional: Apply morphological filters to clean noise
    kernel = np.ones((5, 5), np.uint8)
    loss_mask = cv2.morphologyEx(loss_mask, cv2.MORPH_OPEN, kernel)

    # Calculate total vegetation area change
    before_area = np.sum(before_mask > 0)
    loss_area = np.sum(loss_mask > 0)

    if before_area == 0:
        percent_loss = 0
    else:
        percent_loss = (loss_area / before_area) * 100

    # Create a color overlay to visualize deforestation
    overlay = after.copy()
    red_mask = np.zeros_like(after)
    red_mask[:, :] = (0, 0, 255)  # red for lost areas

    # Highlight loss in red (semi-transparent)
    mask_bool = loss_mask > 0
    overlay[mask_bool] = cv2.addWeighted(after[mask_bool], 0.5, red_mask[mask_bool], 0.5, 0)

    # Save result image
    cv2.imwrite(output_path, overlay)

    return {
        "before_area": int(before_area),
        "loss_area": int(loss_area),
        "percent_loss": round(percent_loss, 2),
        "output_path": output_path
    }

# Example usage (for quick test)
if __name__ == "__main__":
    result = detect_deforestation(
        "data/sierra_madre_2000.png",
        "data/sierra_madre_2024.png",
        "data/diff.png"
    )
    print(result)