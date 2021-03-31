import instructionsFamImageTabletSrc from 'url:../images/instructions-tablet-half-sheep.png';
import instructionsFamImagePCSrc from 'url:../images/instructions-PC-sheep.png';
import instructionsTestImageTabletSrc from 'url:../images/transition-tablet-monkey.png';
import instructionsTestImagePCSrc from 'url:../images/transition-PC-monkey.png';
import goodbyeImageSrc from 'url:../images/familypic.png';

export default (exp) => {
  const instructionsTrainHeading = document.createElement('div');
  const instructionsTrainParagraph = document.createElement('div');
  const instructionsTrainImage = document.createElement('img');
  instructionsTrainImage.style = 'width: inherit';

  const instructionsFamHeading = document.createElement('div');
  const instructionsFamParagraph = document.createElement('div');
  const instructionsFamImage = document.createElement('img');
  instructionsFamImage.style = 'height: inherit';

  const instructionsTestHeading = document.createElement('div');
  const instructionsTestParagraph = document.createElement('div');
  const instructionsTestImage = document.createElement('img');
  instructionsTestImage.style = 'height: inherit';

  const goodbyeHeading = document.createElement('div');
  const goodbyeParagraph = document.createElement('div');
  const goodbyeImage = document.createElement('img');
  goodbyeImage.style = 'width: inherit';

  // headings
  instructionsTrainHeading.innerHTML = '<h1> Herzlich Willkommen! </h1>';
  instructionsFamHeading.innerHTML = '<h1> Super! Den ersten Teil habt ihr geschafft! </h1>';
  instructionsTestHeading.innerHTML = '<h1> Super! Jetzt kommt der letzte Teil. </h1>';
  goodbyeHeading.innerHTML = '<h1> Fertig! </h1>';

  // text for the parents (children get audio instructions)
  if (exp.subjData.touchScreen) {
    instructionsTrainParagraph.innerHTML = `<p> 
    Vielen Dank, dass Sie mit Ihrem Kind an unserer Studie teilnehmen. <br>
    In unserem Spiel soll Ihr Kind einen Ballon finden. <br> <br>

    Durch einen Klick auf das Lautsprecher-Symbol hören Sie eine kleine Begrüßung.
    Wenn Sie danach mit Ihrem Kind das Spiel starten möchten, klicken Sie auf den "los geht's!" Knopf.
    Dann wird Ihr Kind mit einer Sprachaufnahme durch das Ballonspiel geführt. <br> <br>

    <strong> Bitte lassen Sie dafür Ihr Kind selbst auf den Touchscreen klicken. <br>
    Geben Sie Ihrem Kind keinerlei Hinweise - alles, was Ihr Kind macht, ist prima! </strong> <br> <br>
    Schalten Sie bitte Ihren Ton ein und klicken auf das Lautsprecher-Symbol. <br>
    </p>`;
  } else if (!exp.subjData.touchScreen) {
    instructionsTrainParagraph.innerHTML = `<p> 
    Vielen Dank, dass Sie mit Ihrem Kind an unserer Studie teilnehmen. <br>
    In unserem Spiel soll Ihr Kind einen Ballon finden. <br> <br>

    Durch einen Klick auf das Lautsprecher-Symbol hören Sie eine kleine Begrüßung.
    Wenn Sie danach mit Ihrem Kind das Spiel starten möchten, klicken Sie auf den "los geht's!" Knopf.
    Dann wird Ihr Kind mit einer Sprachaufnahme durch das Ballonspiel geführt. <br> <br>

    <strong> Lassen Sie bitte Ihr Kind auf den Bildschirm zeigen. Sie klicken dann genau dorthin, wohin Ihr Kind gezeigt hat.
    Geben Sie Ihrem Kind keinerlei Hinweise - alles, was Ihr Kind macht, ist prima! </strong> <br> <br>
    Schalten Sie bitte Ihren Ton ein und klicken auf das Lautsprecher-Symbol. <br>
    </p>`;
  }

  instructionsFamParagraph.innerHTML = `<p> 
  <br> <br> <br> <br>
  Gleich könnt ihr weiterspielen. <br> <br>
  Die Aufgabe bleibt die Gleiche - Ihr Kind soll wieder den Ballon finden. <br> <br>
  Wir führen Ihr Kind wieder mit einer Sprachaufnahme durch eine Aufgabe. <br> <br>
  Sobald ihr weiterspielen möchtet, klicken Sie wieder den "los geht's!" Knopf. <br>
  </p>`;

  instructionsTestParagraph.innerHTML = `<p> 
  <br> <br> <br> <br>
  Gleich könnt ihr weiterspielen. <br> <br>
  Die Aufgabe bleibt die Gleiche - Ihr Kind soll wieder den Ballon finden. <br> <br>
  Wir führen Ihr Kind wieder mit einer Sprachaufnahme durch eine Aufgabe. <br> <br>
  Sobald ihr weiterspielen möchtet, klicken Sie wieder den "los geht's!" Knopf. <br>
  </p>`;

  // goodbye text
  goodbyeParagraph.innerHTML = `<p> 
   <br> <br>
   Wunderbar!
   Das hat Ihr Kind klasse gemacht! <br> <br>
   Wenn Sie auf das Lautsprecher-Symbol klicken, 
   kann Ihr Kind ein kleines Dankeschön und eine Verabschiedung hören. <br> <br>
   Vielen herzlichen Dank, dass Sie mit Ihrem Kind an unserer Studie teilgenommen haben. <br> <br>
   Beste Grüße, <br> 
   Ihr Forschungsteam vom Max-Planck-Institut
   </p>`;

  // add instruction pictures
  // for tablet version
  instructionsTrainImage.src = goodbyeImageSrc;
  goodbyeImage.src = goodbyeImageSrc;

  if (exp.subjData.touchScreen) {
    instructionsFamImage.src = instructionsFamImageTabletSrc;
    instructionsTestImage.src = instructionsTestImageTabletSrc;

  // for PC version
  } else if (!exp.subjData.touchScreen) {
    instructionsFamImage.src = instructionsFamImagePCSrc;
    instructionsTestImage.src = instructionsTestImagePCSrc;
  }

  return ({
    instructionsTrainHeading,
    instructionsTrainParagraph,
    instructionsTrainImage,

    instructionsFamHeading,
    instructionsFamParagraph,
    instructionsFamImage,

    instructionsTestHeading,
    instructionsTestParagraph,
    instructionsTestImage,

    goodbyeHeading,
    goodbyeParagraph,
    goodbyeImage,
  });
};
