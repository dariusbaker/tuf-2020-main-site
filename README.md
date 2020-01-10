# The Fantastic Universe 2020

## Pre-requisites

- Node.js 12.3.1
- Gulp CLI

## Development

### Installation

```
npm i
```

That's all to it.

### Gulp and its tasks

| Task      | Description |
| ----------|---------|
| `default` | Runs `build`. |
| `build`   | Runs `copy`, `css`, `html`, `js`, and `svg`. |
| `copy`    | Copies files from `src/emails`. |
| `css`     | Minifies SCSS files and reloads BrowserSync. |
| `html`    | Compiles nunjucks files and minifies HTML. |
| `js`      | Uglifies JS. |
| `serve`   | Runs `build` and deploys a server on `localhost:3000` with hot-reloading. |
| `svg`     | Compiles SVG assets into a sprite and places it into `src/nunjucks/partials`. |

Paths and package options/configuration can be found/changed in `gulp/config.js`.

### Templating Language

[Nunjucks](https://mozilla.github.io/nunjucks/)

### Page content data

All page content data is structured by section/category in json file. All data is located in `data` folder