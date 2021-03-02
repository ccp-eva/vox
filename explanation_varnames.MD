# List of all the variables that we save in our response log

| variable name              | description                                                                        |
|----------------------------|------------------------------------------------------------------------------------|
| agent                      | which animal character is shown in current trial                                   |
| clickDistFromTargetBBoxX   | distance between clickScaledX and the target's bounding box                        |
| clickDistFromTargetBBoxY   | distance between clickScaledY and the target's bounding box                        |
| clickDistFromTargetCenterX | difference between clickScaledX and targetCenterX                                  |
| clickDistFromTargetCenterY | difference between clickScaledY and targetCenterY                                  |
| clickedArea                | in which SVG area the click is (clickable-area for fam, hedge or box 1-5 for test) |
| clickScaledX               | X coordinate of click event in SVG coordinate system                               |
| clickScaledY               | Y coordinate of click event in SVG coordinate system                               |
| clickX                     | X coordinate of click event in client screen coordinate system                     |
| clickY                     | Y coordinate of click event in client screen coordinate system                     |
| eyeCenterLeftX             | X coordinate of the current agent's left eye center                                |
| eyeCenterLeftY             | Y coordinate of the current agent's left eye center                                |
| eyeCenterRightX            | X coordinate of the current agent's right eye center                               |
| eyeCenterRightY            | Y coordinate of the current agent's right eye center                               |
| eyeRadius                  | radius of the current agent's eye (in SVG coords)                                  |
| hitBBTargetX               | boolean: true if clickScaledX is within the target's bounding box                  |
| hitBBTargetY               | boolean: true if clickScaledY is within the target's bounding box                  |
| offsetHeight               | client screen size height (px)                                                     |
| offsetWidth                | client screen size width (px)                                                      |
| positionBin                | in which area the target landed (1-10 for hedge version, 1-5 for box version)      |
| pupilTargetLeftX           | X coordinate of the current agent's left pupil center after following target       |
| pupilTargetLeftY           | Y coordinate of the current agent's left pupil center after following target       |
| pupilTargetRightX          | X coordinate of the current agent's right pupil center after following target      |
| pupilTargetRightY          | Y coordinate of the current agent's right pupil center after following target      |
| responseTime               | msec between end of the animation and user click                                   |
| screenScalingHeight        | how much taller/shorter client screen size is compared to SVG coordinates          |
| screenScalingWidth         | how much wider/narrower client screen size is compared to SVG coordinates          |
| subjID                     | unique participant identifier                                                      |
| target                     | which target (color) is shown in current trial                                     |
| targetCenterX              | X coordinate of target center (= targetX + targetWidth/2)                          |
| targetCenterY              | Y coordinate of target center (= targetY + targetHeight/2)                         |
| targetHeight               | height of the target's bounding box                                                |
| targetWidth                | width of the target's bounding box                                                 |
| targetX                    | X coordinate of upper left corner of target                                        |
| targetY                    | Y coordinate of upper left corner of target                                        |
| touchScreen                | boolean: true if user uses tablet, false if PC                                     |
| trialNr                    | number of the current trial                                                        |
| trialType                  | fam for familiarization trials, test for test trials                               |