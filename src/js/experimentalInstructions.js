import instructionsImageTabletSrc from 'url:../images/instructions-tablet-half-sheep.png';
import instructionsImagePCSrc from 'url:../images/instructions-PC-sheep.png';
import transitionImageTabletSrc from 'url:../images/transition-tablet-monkey.png';
import transitionImagePCSrc from 'url:../images/transition-PC-monkey.png';
import goodbyeImageSrc from 'url:../images/goodbye-img.png';

export default (exp) => {
  const instructionsHeading = document.createElement('div');
  const instructionsParagraph = document.createElement('div');
  const instructionsImage = document.createElement('img');
  instructionsImage.style = 'height: inherit';

  const transitionHeading = document.createElement('div');
  const transitionParagraph = document.createElement('div');
  const transitionImage = document.createElement('img');
  transitionImage.style = 'height: inherit';

  const goodbyeHeading = document.createElement('div');
  const goodbyeParagraph = document.createElement('div');
  const goodbyeImage = document.createElement('img');
  goodbyeImage.style = 'width: inherit';

  // headings
  instructionsHeading.innerHTML = '<h1> Herzlich Willkommen! </h1>';
  transitionHeading.innerHTML = '<h1> Super! Den ersten Teil habt ihr geschafft! </h1>';
  goodbyeHeading.innerHTML = '<h1> Fertig! </h1>';

  // text for the parents (children get audio instructions)
  instructionsParagraph.innerHTML = `<p> 
  Vielen Dank, dass Sie mit Ihrem Kind an unserer Studie teilnehmen. <br> <br>
  Ihr Kind hat gleich die Aufgabe, einen Ballon zu finden. <br>
  Dafür klickt Ihr Kind einfach auf den Bildschirm - dorthin, wo der Ballon ist. <br>
  Die Aufgabe erklären wir Ihrem Kind in einer Sprachaufnahme. <br>
  Um diese abzuspielen, schalten Sie Ihren Ton ein und klicken auf das Lautsprecher-Symbol.
  Sie können sich die Sprachaufnahme mehrmals anhören. 
  Sobald Sie mit Ihrem Kind das Spiel starten möchten, klicken Sie auf den "los geht's!" Knopf. <br> <br>
  Bitte geben Sie Ihrem Kind keinerlei Hinweise - alles, was Ihr Kind macht, ist prima! 
  </p>`;

  transitionParagraph.innerHTML = `<p> 
  <br> <br>
  Ihr könnt gleich weiterspielen. <br> <br>
  Die Aufgabe bleibt die Gleiche - Ihr Kind soll wieder den Ballon finden. <br> <br>
  Bitte hören Sie sich wieder die Sprachaufnahme an, in dem Sie auf das Lautsprecher-Symbol klicken. <br>
  Auch diese können Sie sich mehrmals anhören. <br> <br>
  Sobald Sie weiterspielen möchten, klicken Sie wieder "los geht's!". <br>
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
  goodbyeImage.src = goodbyeImageSrc;

  if (exp.subjData.touchScreen) {
    instructionsImage.src = instructionsImageTabletSrc;
    transitionImage.src = transitionImageTabletSrc;

  // for PC version
  } else if (!exp.subjData.touchScreen) {
    instructionsImage.src = instructionsImagePCSrc;
    transitionImage.src = transitionImagePCSrc;
  }

  return ({
    instructionsHeading,
    instructionsParagraph,
    instructionsImage,

    transitionHeading,
    transitionParagraph,
    transitionImage,

    goodbyeHeading,
    goodbyeParagraph,
    goodbyeImage,
  });
};
