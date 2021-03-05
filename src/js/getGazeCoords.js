// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CALCULATING LINE EQUATION BETWEEN EYE CENTER AND TARGET POSITION
// FOR MOVING PUPIL AND IRIS; LETTING THEM FOLLOW BALLOONS
// ---------------------------------------------------------------------------------------------------------------------
export default (target, targetLocation, pupil, eyeline) => {
  // first, get all elements that we need
  const eyeRadius = parseFloat(eyeline.getAttribute('r'), 10);
  const eyelineCenterX = parseFloat(eyeline.getAttribute('cx'), 10);
  const eyelineCenterY = parseFloat(eyeline.getAttribute('cy'), 10);
  const pupilRadius = parseFloat(pupil.getAttribute('r'), 10);

  // define max movement value for eye movement
  const maxEyeMovement = eyeRadius - pupilRadius / 1.1;

  // define target’s center point, use bounding box
  const targetWidth = target.getBBox().width;
  const targetHeight = target.getBBox().height;
  const targetX = targetLocation.x;
  const targetY = targetLocation.y;

  // calculate where the center of the target is
  const targetCenterX = targetX + targetWidth / 2;
  const targetCenterY = targetY + targetHeight / 2;

  // create line equation for the path on which the pupil can move.
  // that is, path between center of the target and the pupil
  const slope = (eyelineCenterY - targetCenterY) / (eyelineCenterX - targetCenterX);
  const intercept = targetCenterY - slope * targetCenterX;

  // circle equation: (x - m1)^2 + (y - m2)^2 = r^2
  // where m1 is the eyelineCenterX and m2 is eyelineCenterY. so in our case:
  // (x - eyelineCenterX)^2 + (y - eyelineCenterY)^2 = maxEyeMovement^2
  // now, we replace y with our line equation (that we just calculated):
  // (x - eyelineCenterX)^2 + (intercept + slope * x - eyelineCenterY)^2 = maxEyeMovement^2
  // rearranging this formula leads to this looong formula. we get two separate solutions for both intersections
  // (https://www.mathepower.com/freistell.php)
  const gazeX1 = Math.sqrt(
    (eyelineCenterX ** 2 * slope ** 2
        + 2 * eyelineCenterX * intercept * slope
        - 2 * eyelineCenterX * eyelineCenterY * slope
        + intercept ** 2
        - 2 * intercept * eyelineCenterY
        + eyelineCenterY ** 2
        - maxEyeMovement ** 2 * slope ** 2
        - maxEyeMovement ** 2)
        / (-(slope ** 4) - 2 * slope ** 2 - 1),
  )
    + (eyelineCenterX - intercept * slope + eyelineCenterY * slope)
      / (slope ** 2 + 1);

  const gazeX2 = -Math.sqrt(
    (eyelineCenterX ** 2 * slope ** 2
        + 2 * eyelineCenterX * intercept * slope
        - 2 * eyelineCenterX * eyelineCenterY * slope
        + intercept ** 2
        - 2 * intercept * eyelineCenterY
        + eyelineCenterY ** 2
        - maxEyeMovement ** 2 * slope ** 2
        - maxEyeMovement ** 2)
        / (-(slope ** 4) - 2 * slope ** 2 - 1),
  )
    + (eyelineCenterX - intercept * slope + eyelineCenterY * slope)
      / (slope ** 2 + 1);

  // to get y coordinate of the wanted eye location, insert just calculated x value into the line equation
  const gazeY1 = slope * gazeX1 + intercept;
  const gazeY2 = slope * gazeX2 + intercept;

  // always choose the intersection with the higher y value (eye always looks down)
  if (gazeY1 >= gazeY2) {
    return { x: gazeX1, y: gazeY1 };
  }
  return { x: gazeX2, y: gazeY2 };
};
