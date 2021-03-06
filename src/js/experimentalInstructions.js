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

  // headings
  txt.welcomeHeading.innerHTML = '<h1> Willkommen zu unserer Online-Kinderstudie! </h1>';
  txt.instructionsTouchHeading.innerHTML = '<h1> Gleich geht es los... </h1>';
  txt.instructionsFamHeading.innerHTML = '<h1> Super! Den ersten Teil habt ihr geschafft! </h1>';
  txt.instructionsTestHeading.innerHTML = '<h1> Super! Jetzt kommt der letzte Teil. </h1>';
  txt.goodbyeHeading.innerHTML = '<h1> Fertig! </h1>';

  // text for the parents (children get audio instructions)
  txt.welcomeParagraph.innerHTML = `<p> 
    <br> <br>
    Vielen Dank f??r Ihr Interesse an unserer Studie! <br> <br>

    In unserem Spiel soll Ihr Kind einen Ballon finden. <br>
    Wir hoffen, dass Sie und Ihr Kind Spa?? dabei haben werden. <br> <br>

    Auf der n??chsten Seite erfahren Sie mehr ??ber das Spiel. <br>
    Bitte schalten Sie Ihren Ton ein. <br> <br>

    <strong> Klicken Sie auf den blauen "weiter"-Knopf, um den Vollbildmodus zu aktivieren und zur n??chsten Seite zu gelangen. </strong>

    </p>`;

  if (exp.subjData.touchScreen) {
    txt.instructionsTouchParagraph.innerHTML = `<p> 
    Durch einen Klick auf das Lautsprecher-Symbol h??ren Sie eine kleine Begr????ung.
    Die Sprachaufnahme k??nnen Sie sich so oft anh??ren, wie Sie m??chten. <br>
    Nachdem die Sprachaufnahme vollst??ndig abgespielt ist, erscheint ein blauer "los geht's" Knopf unten auf der Seite.
    Diesen dr??cken Sie bitte, wenn Sie mit Ihrem Kind das Spiel starten m??chten.
    Dann wird Ihr Kind mit einer Sprachaufnahme durch das Ballonspiel gef??hrt. <br> <br>

    <strong> Bitte lassen Sie daf??r Ihr Kind selbst auf den Touchscreen klicken. <br>
    Geben Sie Ihrem Kind keinerlei Hinweise - alles, was Ihr Kind macht, ist prima! </strong> <br> <br>
    Bitte klicken Sie auf das Lautsprecher-Symbol. <br>
    </p>`;

    txt.instructionsFamImage.src = instructionsFamHedgeImageSrc;
    txt.instructionsTestImage.src = instructionsTestHedgeImageSrc;
  } else if (!exp.subjData.touchScreen) {
    txt.instructionsTouchParagraph.innerHTML = `<p> 
    Durch einen Klick auf das Lautsprecher-Symbol h??ren Sie eine kleine Begr????ung.
    Die Sprachaufnahme k??nnen Sie sich so oft anh??ren, wie Sie m??chten. <br>
    Nachdem die Sprachaufnahme vollst??ndig abgespielt ist, erscheint ein blauer "los geht's" Knopf unten auf der Seite.
    Diesen dr??cken Sie bitte, wenn Sie mit Ihrem Kind das Spiel starten m??chten.
    Dann wird Ihr Kind mit einer Sprachaufnahme durch das Ballonspiel gef??hrt. <br> <br>

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
  Gleich k??nnt ihr weiterspielen. <br> <br>
  Die Aufgabe bleibt die Gleiche - Ihr Kind soll wieder den Ballon finden. <br> <br>
  Wir f??hren Ihr Kind wieder mit einer Sprachaufnahme durch eine Aufgabe. <br> <br>
  Sobald ihr weiterspielen m??chtet, klicken Sie wieder den "los geht's!" Knopf. <br>
  </p>`;

  txt.instructionsTestParagraph.innerHTML = `<p> 
  <br> <br> <br> <br>
  Gleich k??nnt ihr weiterspielen. <br> <br>
  Die Aufgabe bleibt die Gleiche - Ihr Kind soll wieder den Ballon finden. <br> <br>
  Wir f??hren Ihr Kind wieder mit einer Sprachaufnahme durch eine Aufgabe. <br> <br>
  Sobald ihr weiterspielen m??chtet, klicken Sie wieder den "los geht's!" Knopf. <br>
  </p>`;

  // goodbye text
  txt.goodbyeParagraph.innerHTML = `<p> 
   <br> <br>
   Wunderbar!
   Das hat Ihr Kind klasse gemacht! <br> <br>
   Wenn Sie auf das Lautsprecher-Symbol klicken, 
   kann Ihr Kind ein kleines Dankesch??n und eine Verabschiedung h??ren. <br> <br>
   Vielen herzlichen Dank, dass Sie mit Ihrem Kind an unserer Studie teilgenommen haben. <br> <br>
   Beste Gr????e, <br> 
   Ihr Forschungsteam vom Max-Planck-Institut
   </p>`;

  // add instruction pictures
  // for tablet version
  txt.instructionsTouchImage.src = instructionsTouchImageSrc;
  txt.familyImage.src = familyImageSrc;

  return (txt);
};
