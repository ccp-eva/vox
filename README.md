<a href="https://www.repostatus.org/#wip"><img src="https://www.repostatus.org/badges/latest/wip.svg" alt="Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public." /></a> ![GitHub package.json version](https://img.shields.io/github/package-json/v/ccp-eva/vox?label=Version)
# 🦊 VOX
> VOX (Vectorized Online eXperiments) is an approach to parse an SVG composition and to return an interactive online experiment in your browser. The near-future goal is to use a single SVG file—that was composed by the user in a GUI with which they are familiar with (e.g., Illustrator)—and to transform it into an online experiment using various automation steps. To long-future goal is to create an interactive SVG sandbox, which would allow users to drag & drop their assets into a the browser and compose their experiment in one environment.

## Why SVG?
The rules of Responsive Web Design (RWD)—a beautiful thing in general—do not apply to standardized psychological/behavioral experiments. We **do not** want media queries or any fluid grid in the composition. Yet, we **do want** our composition to scales according to the user’s viewport keeping the aspect ratio. The SVG container makes an awesome sandbox to capture your design and grants your layout to scale without breaking your design choices (i.e., objects will keep their relative positions).

📚 See our [Wiki](https://github.com/ccp-eva/vox/wiki) for more help and resources.


## Setup

### Local Development
1. `git clone git@github.com:ccp-eva/vox.git`
1. `npm install`
2. `npm run dev`


### Deploy Application To A Server
1. `git clone git@github.com:ccp-eva/vox.git`
1. `npm install`
2. `npm run build`
3. Upload the contents within the `dist` folder to your web hoster.
