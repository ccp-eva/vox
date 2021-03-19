# List of all the variables that we save in our response log

* IF NOT STATED OTHERWISE, VALUES ARE IN THE SVG COORDINATE SYSTEM (NOT ACTUAL PIXEL)!
* offsetWidth, offsetHeight, clikX and clickY are in pixels and the user coordinate system.
* screenScalingWidth and screenScalingHeight are needed to transform the values from one coordinate system into the other.

| variable name              | description                                                                        |
|----------------------------|------------------------------------------------------------------------------------|
| agent                      | which animal character is shown in current trial                                   |
| box*CenterX                | X coordinate of the center of the respective box                                   |
| box*CenterY                | Y coordinate of the center of the respective box                                   |
| clickDistFromTargetBBoxX   | distance between clickScaledX and the target's bounding box                        |
| clickDistFromTargetBBoxY   | distance between clickScaledY and the target's bounding box                        |
| clickDistFromTargetCenterX | difference between clickScaledX and targetCenterX                                  |
| clickDistFromTargetCenterY | difference between clickScaledY and targetCenterY                                  |
| clickedArea                | in which SVG area the click is (clickable-area for fam, hedge or box1-8 for test)  |
| clickedBoxCenterX          | X coordinate of the center of the box that was clicked                             |
| clickScaledX               | X coordinate of click event in SVG coordinate system                               |
| clickScaledY               | Y coordinate of click event in SVG coordinate system                               |
| clickOriginalX             | X coordinate of click event in client screen coordinate system                     |
| clickOriginalY             | Y coordinate of click event in client screen coordinate system                     |
| clientScreenHeight         | client screen size height (px)                                                     |
| clientScreenWidth          | client screen size width (px)                                                      |
| clientScreenScaling        | how much smaller/bigger client screen size is compared to SVG coordinates          |
| eyeCenterLeftX             | X coordinate of the current agent's left eye center                                |
| eyeCenterLeftY             | Y coordinate of the current agent's left eye center                                |
| eyeCenterRightX            | X coordinate of the current agent's right eye center                               |
| eyeCenterRightY            | Y coordinate of the current agent's right eye center                               |
| eyeRadius                  | radius of the current agent's eye                                                  |
| hitBBTargetX               | boolean: true if clickScaledX is within the target's bounding box                  |
| hitBBTargetY               | boolean: true if clickScaledY is within the target's bounding box                  |
| pupilFinalLeftX            | X coordinate of the current agent's left pupil center after following target       |
| pupilFinalLeftY            | Y coordinate of the current agent's left pupil center after following target       |
| pupilFinalRightX           | X coordinate of the current agent's right pupil center after following target      |
| pupilFinalRightY           | Y coordinate of the current agent's right pupil center after following target      |
| responseTime               | msec between end of the animation and user click                                   |
| spaceBetweenBoxes          | space between two boxes (and also space to the border of the SVG)                  |
| subjID                     | unique participant identifier                                                      |
| target                     | which target (color) is shown in current trial                                     |
| targetCenterX              | X coordinate of target center (= targetX + targetWidth/2)                          |
| targetCenterY              | Y coordinate of target center (= targetY + targetHeight/2)                         |
| targetHeight               | height of the target's bounding box                                                |
| targetPosition             | in which area the target landed (1-10 for hedge version, box1-8 for box version)   |
| targetWidth                | width of the target's bounding box                                                 |
| targetX                    | X coordinate of upper left corner of target                                        |
| targetY                    | Y coordinate of upper left corner of target                                        |
| touchScreen                | boolean: true if user uses tablet, false if PC                                     |
| trialNr                    | number of the current trial                                                        |
| trialType                  | fam for familiarization trials, test for test trials                               |

### Calculation of the box positions
* space between the boxes is calculated as follows (in the SVG coordinate system): 
    * spaceOverall = origViewBoxWidth - boxesNr * boxesWidth
    * spaceBetweenBoxes = spaceOverall / (boxesNr + 1)
* here, spaceOverall means how many "SVG pixels" are not filled by all of the boxes
* thhe spaceOverall is then divided by the number of boxes + 1 (so that the space to the very left and very right side of the screen is also equal) 