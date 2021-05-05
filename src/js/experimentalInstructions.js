import instructionsTouchImageSrc from 'url:../images/touch.png';
import instructionsFamBoxImageSrc from 'url:../images/fam-box.png';
import instructionsFamHedgeImageSrc from 'url:../images/fam-hedge.png';
import instructionsTestBoxImageSrc from 'url:../images/test-box.png';
import instructionsTestHedgeImageSrc from 'url:../images/test-hedge.png';
import familyImageSrc from 'url:../images/familypic.png';

export default (exp) => {
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

  // add instruction pictures
  // for tablet version
  txt.instructionsTouchImage.src = instructionsTouchImageSrc;
  txt.familyImage.src = familyImageSrc;

  switch (exp.subjData.lang) {
    case 'De':
      // headings
      txt.welcomeHeading.innerHTML = '<h1> Willkommen zu unserer Online-Kinderstudie! </h1>';
      txt.instructionsTouchHeading.innerHTML = '<h1> Gleich geht es los... </h1>';
      txt.instructionsFamHeading.innerHTML = '<h1> Super! Den ersten Teil habt ihr geschafft! </h1>';
      txt.instructionsTestHeading.innerHTML = '<h1> Super! Jetzt kommt der letzte Teil. </h1>';
      txt.goodbyeHeading.innerHTML = '<h1> Fertig! </h1>';

      // text for the parents (children get audio instructions)
      txt.welcomeParagraph.innerHTML = `<p> 
        <br> <br>
        Vielen Dank für Ihr Interesse an unserer Studie! <br> <br>
        In unserem Spiel soll Ihr Kind einen Ballon finden. <br>
        Wir hoffen, dass Sie und Ihr Kind Spaß dabei haben werden. <br> <br>
        Auf der nächsten Seite erfahren Sie mehr über das Spiel. <br> <br>
        <strong> 
        Bitte schalten Sie Ihren Ton ein. <br> <br>
        Klicken Sie auf den blauen "weiter"-Knopf, um den Vollbildmodus zu aktivieren und zur nächsten Seite zu gelangen. 
        </strong>
        </p>`;

      if (exp.subjData.touchScreen) {
        txt.instructionsTouchParagraph.innerHTML = `<p> 
          Durch einen Klick auf das Lautsprecher-Symbol hören Sie eine kleine Begrüßung.
          Die Sprachaufnahme können Sie sich so oft anhören, wie Sie möchten. <br>
          Nachdem die Sprachaufnahme vollständig abgespielt ist, erscheint ein blauer "los geht's" Knopf unten auf der Seite.
          Diesen drücken Sie bitte, wenn Sie mit Ihrem Kind das Spiel starten möchten.
          Dann wird Ihr Kind mit einer Sprachaufnahme durch das Ballonspiel geführt. <br> <br>
          <strong> Bitte lassen Sie dafür Ihr Kind selbst auf den Touchscreen klicken. <br>
          Geben Sie Ihrem Kind keinerlei Hinweise - alles, was Ihr Kind macht, ist prima! </strong> <br> <br>
          Bitte klicken Sie auf das Lautsprecher-Symbol. <br>
          </p>`;

        txt.instructionsFamImage.src = instructionsFamHedgeImageSrc;
        txt.instructionsTestImage.src = instructionsTestHedgeImageSrc;
      } else if (!exp.subjData.touchScreen) {
        txt.instructionsTouchParagraph.innerHTML = `<p> 
          Durch einen Klick auf das Lautsprecher-Symbol hören Sie eine kleine Begrüßung.
          Die Sprachaufnahme können Sie sich so oft anhören, wie Sie möchten. <br>
          Nachdem die Sprachaufnahme vollständig abgespielt ist, erscheint ein blauer "los geht's" Knopf unten auf der Seite.
          Diesen drücken Sie bitte, wenn Sie mit Ihrem Kind das Spiel starten möchten.
          Dann wird Ihr Kind mit einer Sprachaufnahme durch das Ballonspiel geführt. <br> <br>
          <strong> Lassen Sie bitte Ihr Kind auf den Bildschirm zeigen. 
          Sie klicken dann genau dorthin, wohin Ihr Kind gezeigt hat.
          Geben Sie Ihrem Kind keinerlei Hinweise - alles, was Ihr Kind macht, ist prima! </strong> <br> <br>
          Schalten Sie bitte Ihren Ton ein und klicken auf das Lautsprecher-Symbol. <br>
          </p>`;

        txt.instructionsFamImage.src = instructionsFamBoxImageSrc;
        txt.instructionsTestImage.src = instructionsTestBoxImageSrc;
      }

      txt.instructionsFamParagraph.innerHTML = `<p> 
        <br> <br> <br> <br>
        Gleich könnt ihr weiterspielen. <br> <br>
        Die Aufgabe bleibt die Gleiche - Ihr Kind soll wieder den Ballon finden. <br> <br>
        Wir führen Ihr Kind wieder mit einer Sprachaufnahme durch eine Aufgabe. <br> <br>
        Sobald ihr weiterspielen möchtet, klicken Sie wieder den "los geht's!" Knopf. <br>
        </p>`;

      txt.instructionsTestParagraph.innerHTML = `<p> 
        <br> <br> <br> <br>
        Gleich könnt ihr weiterspielen. <br> <br>
        Die Aufgabe bleibt die Gleiche - Ihr Kind soll wieder den Ballon finden. <br> <br>
        Wir führen Ihr Kind wieder mit einer Sprachaufnahme durch eine Aufgabe. <br> <br>
        Sobald ihr weiterspielen möchtet, klicken Sie wieder den "los geht's!" Knopf. <br>
        </p>`;

      // goodbye text
      txt.goodbyeParagraph.innerHTML = `<p> 
        <br> <br>
        Wunderbar!
        Das hat Ihr Kind klasse gemacht! <br> <br>
        Wenn Sie auf das Lautsprecher-Symbol klicken, 
        kann Ihr Kind ein kleines Dankeschön und eine Verabschiedung hören. <br> <br>
        Vielen herzlichen Dank, dass Sie mit Ihrem Kind an unserer Studie teilgenommen haben. <br> <br>
        Beste Grüße, <br> 
        Ihr Forschungsteam vom Max-Planck-Institut
        </p>`;
      break;

    case 'En':
      // headings
      txt.welcomeHeading.innerHTML = '<h1> Welcome to our online child study! </h1>';
      txt.instructionsTouchHeading.innerHTML = '<h1> Before we start... </h1>';
      txt.instructionsFamHeading.innerHTML = '<h1> Great! Done with the first part! </h1>';
      txt.instructionsTestHeading.innerHTML = '<h1> Nice! Here comes the last part. </h1>';
      txt.goodbyeHeading.innerHTML = '<h1> Finished! </h1>';

      // text for the parents (children get audio instructions)
      txt.welcomeParagraph.innerHTML = `<p> 
        <br> <br>
        Thanks a lot for your interest in our study! <br> <br>
        In our game, we will ask your child to find a balloon. <br>
        We hope that you and your child will enjoy the little game.  <br> <br>
        On the next page, you'll get some more information about the game. <br> <br>
        <strong>
        Please turn on your sound. <br> <br>
        Click on the blue "continue" button to activate fullscreen mode and to go to the next page. 
        </strong>
        </p>`;

      if (exp.subjData.touchScreen) {
        txt.instructionsTouchParagraph.innerHTML = `<p> 
          By clicking on the speaker button, you can listen to a short welcome message.
          You can listen to the voice recording as often as you want. <br>
          Once the recording stopped playing, a blue "let's go" button will appear on the bottom of the screen.
          Please click on that button once you are ready to start the game.
          Your child will then be guided through the game with the help of voice recordings. <br> <br>
          <strong> Please let your child click on the touch screen. <br>
          Do not give any advice to your child - everything that your child does is great! <br> <br>
          Click on the speaker button to play the welcome message. </strong>
          </p>`;

        txt.instructionsFamImage.src = instructionsFamHedgeImageSrc;
        txt.instructionsTestImage.src = instructionsTestHedgeImageSrc;
      } else if (!exp.subjData.touchScreen) {
        txt.instructionsTouchParagraph.innerHTML = `<p> 
          By clicking on the speaker button, you can listen to a short welcome message.
          You can listen to the voice recording as often as you want. <br>
          Once the recording stopped playing, a blue "let's go" button will appear on the bottom of the screen.
          Please click on that button once you are ready to start the game.
          Your child will then be guided through the game with the help of voice recordings. <br> <br>
          <strong> Please let your child point at the screen. Then, please click exactly at that point.
          Do not give any advice to your child - everything that your child does is great! <br> <br>
          Click on the speaker button to play the welcome message. </strong>
          </p>`;

        txt.instructionsFamImage.src = instructionsFamBoxImageSrc;
        txt.instructionsTestImage.src = instructionsTestBoxImageSrc;
      }

      txt.instructionsFamParagraph.innerHTML = `<p> 
        <br> <br> <br> <br>
        Soon, you can continue playing. <br> <br>
        The task stays the same - your child will be asked to find the balloon again. <br> <br>
        We will again guide your child through the game with a voice recording. <br> <br>
        Whenever you want to continue playing, please press the blue "let's go" button. <br>
        </p>`;

      txt.instructionsTestParagraph.innerHTML = `<p> 
        <br> <br> <br> <br>
        Soon, you can continue playing. <br> <br>
        The task stays the same - your child will be asked to find the balloon again. <br> <br>
        We will again guide your child through the game with a voice recording. <br> <br>
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
        your research team from the Max Planck Institute
        </p>`;
      break;
    default:
      console.log('error in setting text instructions');
  }

  return (txt);
};
