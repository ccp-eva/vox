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
  transitionHeading.innerHTML = '<h1> Super! Das war klasse! </h1>';
  goodbyeHeading.innerHTML = '<h1> Geschafft! Das hast du klasse gemacht! </h1>';

  // for tablet version
  if (exp.subjData.touchScreen) {
    // instruction for hedge version
    instructionsParagraph.innerHTML = `<p>
    Willkommen zu unserem Ballon-Spiel! <br>
    Siehst du den Ballon auf dem Bild? <br> <br>
    Deine Aufgabe ist es, den Ballon zu finden. <br>
    Der Ballon fällt nach unten und landet immer hinter einer Hecke. 
    Die Tiere helfen Dir und schauen den Ballon an. <br> <br> 
    Klicke auf die Hecke, wo der Ballon ist. <br> 
    Denk dran - die Tiere helfen dir. Sie schauen immer dorthin, wo der Ballon ist. <br> <br> 
    </p>`;

    instructionsImage.src = instructionsImageTabletSrc;

    // transition for hedge version
    transitionParagraph.innerHTML = `<p> 
    Das hast du super gemacht! Jetzt spielen wir weiter. <br> <br>
    Der Ballon fällt wieder nach unten auf den Boden. <br>
    Diesmal kannst du das nicht sehen, weil die Hecke schon da ist.
    Aber die Tiere sehen es! <br> <br>
    Du musst wieder herausfinden, wo der Ballon ist. <br>
    Denk dran - die Tiere helfen dir. Sie schauen immer den Ballon an. <br> <br>
    Klicke auf die Hecke, wo der Ballon ist. <br> 
    Die Tiere helfen dir und schauen immer dorthin, wo der Ballon ist.
    </p>`;

    transitionImage.src = transitionImageTabletSrc;

  // for PC version
  } else if (!exp.subjData.touchScreen) {
    // instruction for box version
    instructionsParagraph.innerHTML = `<p> 
    Willkommen zu unserem Ballon-Spiel! <br>
    Siehst du den Ballon auf dem Bild? <br> <br>
    Deine Aufgabe ist es, den Ballon zu finden. <br>
    Der Ballon fällt nach unten und landet immer in einer Kiste. 
    Die Tiere helfen Dir und schauen den Ballon an. <br> <br> 
    Klicke auf die Kiste mit dem Ballon. <br> 
    Denk dran - die Tiere helfen dir. Sie schauen immer dorthin, wo der Ballon ist. <br> <br> 
    </p>`;

    instructionsImage.src = instructionsImagePCSrc;

    // transition for box version
    transitionParagraph.innerHTML = `<p> 
    Das hast du super gemacht! Jetzt spielen wir weiter. <br> <br>
    Der Ballon fällt wieder nach unten in eine Kiste. <br>
    Diesmal kannst du das nicht sehen, weil da eine Hecke ist. 
    Aber die Tiere sehen es! <br> <br>
    Du musst wieder herausfinden, wo der Ballon ist. <br>
    Denk dran - die Tiere helfen dir. Sie schauen immer den Ballon an. <br> <br>
    Klicke auf die Kiste mit dem Ballon. <br> 
    Die Tiere helfen dir und schauen immer dorthin, wo der Ballon ist.
    </p>`;

    transitionImage.src = transitionImagePCSrc;
  }

  // goodbye text
  goodbyeParagraph.innerHTML = `<p> 
  <br> <br> <br>
  Die Tiere sind schon ganz müde und glücklich vom Spielen! <br> <br>
  Vielen Dank für deine Hilfe! <br> <br>
  Bis zum nächsten Mal und liebe Grüße <br> <br>
  vom Schwein, Affen und Schaf
  </p>`;

  goodbyeImage.src = goodbyeImageSrc;

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
