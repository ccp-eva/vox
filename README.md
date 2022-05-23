# My Multipurpose Webpack 5 Config

## Config Overview

- Dev Server
- Top-Level await
- Single Webpack Config for Dev and Production
  - If this should be splitted check [this video](https://www.youtube.com/watch?v=VR5y93CNzeA&list=PLblA84xge2_zwxh3XJqy6UVxS60YdusY8&index=7)
- Auto-switch mode to production when using `npm run build`
- static assets sit in /public and get copied to dist on build (CRA style)
- Using HtmlWebpackPlugin with templates for multiple entry points and outputs
- Cache busting
- source-maps-enabled on dev
- MiniCssExtractPlugin to a get a `main.css` in dist
- CSS/SCSS/SASS (w/ `postcss.config.js` and `browserslistrc`)
- Boilerplate files
  - favicon.ico
  - site.webmanifest
  - apple/android icons
- Deploy script
  - `rsync`s the contents from dist to server (config via `.npmrc`)
- Support for multipage files
  - See entry points in `webpack.config.js`

## Resources

- https://www.youtube.com/watch?v=X1nxTjVDYdQ
- https://www.youtube.com/watch?v=SH6Y_MQzFVw
- https://www.youtube.com/watch?v=3On5Z0gjf4U&list=PLblA84xge2_zwxh3XJqy6UVxS60YdusY8
