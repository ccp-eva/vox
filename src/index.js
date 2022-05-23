import './style.css';
import logoImg from './experiment.svg';

// embed SVG
const root = document.getElementById('root');
root.innerHTML = logoImg;

const hideBgButton = document.getElementById('hide-bg');
hideBgButton.addEventListener('click', () => {
  const svgDarkBg = document.getElementById('flower-bg');
  svgDarkBg.style.display = 'none';
});
