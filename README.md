# 🦊 VOX
> VOX (Vectorized Online eXperiments) is an approach to parse an SVG composition and to return an interactive online experiment in your browser. The primary goal is to allow users to compose their experimental design in a GUI with which they are familiar with (e.g., Illustrator).

## Why SVG?
The rules of Responsive Web Design (RWD)—a beautiful thing in general—do not apply to standardized psychological/behavioral experiments. We **do not** want media queries or any fluid grid in the composition. Yet, we **do want** our composition to scales according to the user’s viewport keeping the aspect ratio. The SVG container makes an awesome sandbox to capture your design and grants your layout to scale without breaking your design choices (i.e., objects will keep their relative positions).

📚 See our [Wiki](https://github.com/ccp-eva/vox/wiki) for more help and resources.


## Setup

### Local Development
1. `git clone git@github.com:ccp-eva/vox.git`
1. `npm install`
2. `npm run dev`


### Depoly Application To A Server
1. `git clone git@github.com:ccp-eva/vox.git`
1. `npm install`
2. `npm run build`
3. Upload the contents within the `dist` folder to your web hoster.
