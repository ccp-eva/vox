import instructionsImageTabletSrc from 'url:../images/instructions-img-tablet.png';
import instructionsImagePCSrc from 'url:../images/instructions-img-PC.png';
import transitionImageTabletSrc from 'url:../images/transition-img-tablet.png';
import transitionImagePCSrc from 'url:../images/transition-img-PC.png';
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
  goodbyeHeading.innerHTML = '<h1> Geschafft! Das hast du super gemacht! </h1>';

  // for tablet version
  if (exp.subjData.touchScreen) {
    // instruction for hedge version
    instructionsParagraph.innerHTML = `<p>
    In diesem Spiel kannst du ein paar Tiere und Luftballoons sehen. <br> <br>
    Deine Aufgabe ist es, den Ballon zu finden. <br>
    Der Ballon fliegt immer auf den Boden. <br>
    Das Tier hilft dir und schaut den Ballon an. <br> <br>
    Klicke auf den Ballon - <br>
    die Tiere schauen immer den Ballon an. <br> <br>
    Bitte schalte deinen Ton an. <br>
    Klicke "los geht's!", <br>
    um mit ein paar Übungen anzufangen. 
    </p>`;

    instructionsImage.src = instructionsImageTabletSrc;

    // transition for hedge version
    transitionParagraph.innerHTML = `<p> 
    Die Tiere spielen nun in einem neuen Haus. <br> 
    Hier fällt der Ballon immer hinter eine Hecke. <br> <br> 
    Du musst herausfinden, auf welche Stelle der Ballon geflogen ist. <br>
    Das Tier hilft Dir und schaut immer auf die Stelle mit dem Ballon. <br> <br> 
    Klicke auf die Stelle der Hecke, <br> 
    hinter der sich der Ballon versteckt - <br> 
    die Tiere schauen immer den Ballon an. <br> <br> 
    Klicke "los geht's!", um das Spiel zu starten.
    </p>`;

    transitionImage.src = transitionImageTabletSrc;

  // for PC version
  } else if (!exp.subjData.touchScreen) {
    // instruction for box version
    instructionsParagraph.innerHTML = `<p> 
    In diesem Spiel kannst du ein paar Tiere und Luftballoons sehen. <br> <br> 
    Deine Aufgabe ist es, den Ballon zu finden. <br> 
    Der Ballon fliegt immer in eine Kiste. <br> 
    Das Tier hilft dir und schaut den Ballon an. <br> <br> 
    Klicke auf die Kiste mit dem Ballon - <br> 
    die Tiere schauen immer den Ballon an. <br> <br> 
    Bitte schalte deinen Ton an. <br> 
    Klicke "los geht's!", <br> 
    um mit ein paar Übungen anzufangen. 
    </p>`;

    instructionsImage.src = instructionsImagePCSrc;

    // transition for box version
    transitionParagraph.innerHTML = `<p> 
    Die Tiere spielen nun in einem neuen Haus. <br> 
    Hier fällt der Ballon immer hinter eine Hecke. <br> 
    Hinter der Hecke stehen Kisten. <br> <br> 
    Du musst herausfinden, in welche Kiste der Ballon geflogen ist. <br>
    Das Tier hilft Dir und schaut immer auf die Kiste mit dem Ballon. <br> <br> 
    Klicke auf die Kiste, <br> 
    in der sich der Ballon versteckt - <br> 
    die Tiere schauen immer den Ballon an. <br> <br> 
    Klicke "los geht's!", um das Spiel zu starten.
    </p>`;

    transitionImage.src = transitionImagePCSrc;
  }

  // goodbye text
  goodbyeParagraph.innerHTML = `<p> 
  <br> <br> <br>
  Die Tiere sind schon ganz müde und glücklich vom Spielen! <br> <br>
  Vielen Dank für deine Hilfe! <br> <br>
  Bis zum nächsten Mal! <br> <br>
  Liebe Grüße vom Schwein, Affen und Schaf
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
