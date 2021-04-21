import instructionsTouchImageSrc from 'url:../images/touch.png';
import instructionsFamHedgeImageSrc from 'url:../images/fam-hedge.png';
import instructionsTestHedgeImageSrc from 'url:../images/test-hedge.png';
import familyImageSrc from 'url:../images/familypic.png';

export default () => {
  const txt = {};
  txt.welcomeHeading = document.createElement('div');
  txt.welcomeParagraph = document.createElement('div');
  txt.welcomeImage = document.createElement('img');
  txt.welcomeImage.style = 'width: inherit';

  txt.instructionsTouchHeading = document.createElement('div');
  txt.instructionsTouchParagraph = document.createElement('div');
  txt.instructionsTouchImage = document.createElement('img');
  txt.instructionsTouchImage.style = 'width: inherit';

  txt.instructionsFamHeading = document.createElement('div');
  txt.instructionsFamParagraph = document.createElement('div');
  txt.instructionsFamImage = document.createElement('img');
  txt.instructionsFamImage.style = 'width: inherit';

  txt.instructionsTestHeading = document.createElement('div');
  txt.instructionsTestParagraph = document.createElement('div');
  txt.instructionsTestImage = document.createElement('img');
  txt.instructionsTestImage.style = 'width: inherit';

  txt.goodbyeHeading = document.createElement('div');
  txt.goodbyeParagraph = document.createElement('div');
  txt.familyImage = document.createElement('img');
  txt.familyImage.style = 'width: inherit';

  // headings
  txt.welcomeHeading.innerHTML = '<h1> Welcome to our online study! </h1>';
  txt.instructionsTouchHeading.innerHTML = '<h1> Before we start... </h1>';
  txt.instructionsFamHeading.innerHTML = '<h1> Great! Well done! </h1>';
  txt.instructionsTestHeading.innerHTML = '<h1> Great! Here comes the last part. </h1>';
  txt.goodbyeHeading.innerHTML = '<h1> Finished! </h1>';

  // text for the parents (children get audio instructions)
  txt.welcomeParagraph.innerHTML = `<p> 
    <br> <br>
    Thanks a lot for your interest in our study! <br> <br>
  
    Your task will be to search for balloons.
    On the next page, you will get to know more about the game.
    We hope that you'll enjoy it! <br> <br>
    
    <strong> Please note that this game was originally designed for children. 
    We would like to ask you to try your best and answer as accurately as possible. </strong> <br> <br>

    <strong> Please turn on your volume and click on the blue "continue" button to open the next page in fullscreen mode. </strong>

    </p>`;

  txt.instructionsTouchParagraph.innerHTML = `<p> 
    By clicking on the speaker button, you can listen to a short welcome message.
    You can listen to the voice recording as often as you want. <br> <br>
    Once the recording stopped playing, a blue "let's go" button will appear on the screen.
    Click the button to start the game. 
    You will then be guided through the balloon game with the help of voice recordings. <br> <br>

    <strong> Please note that the instructions were created for children. <br> <br>
    Click on the speaker button to play the welcome message. </strong>
    </p>`;

  txt.instructionsFamImage.src = instructionsFamHedgeImageSrc;
  txt.instructionsTestImage.src = instructionsTestHedgeImageSrc;

  txt.instructionsFamParagraph.innerHTML = `<p> 
  <br> <br> <br> <br>
  Soon, you can continue playing. <br> <br>
  The task stays the same - you will be asked to find the balloon again. <br> <br>
  We will again guide you through the game with a voice recording. <br> <br>
  Whenever you want to continue playing, please press the blue "let's go" button. <br>
  </p>`;

  txt.instructionsTestParagraph.innerHTML = `<p> 
  <br> <br> <br> <br>
  Soon, you can continue playing. <br> <br>
  The task stays the same - you will be asked to find the balloon again. <br> <br>
  We will again guide you through the game with a voice recording. <br> <br>
  Whenever you want to continue playing, please press the blue "let's go" button. <br>
  </p>`;

  // goodbye text
  txt.goodbyeParagraph.innerHTML = `<p> 
   <br> <br>
   Way to go!
   That was very well done! <br> <br>
   You can listen to a short goodbye message by clicking on the speaker button.
   Thank you very much for participating in our online study! <br> <br>
   Best regards, <br>
   your research team from the Max Planck Institute <br> <br> <br>

   <strong> Please click on the blue button to get redirected to the Prolific website! </strong>
   </p>`;

  // add instruction pictures
  // for tablet version
  txt.instructionsTouchImage.src = instructionsTouchImageSrc;
  txt.familyImage.src = familyImageSrc;

  return (txt);
};
