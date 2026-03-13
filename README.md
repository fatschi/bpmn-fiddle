# BPMN Fiddle

A browser-based BPMN 2.0 editor that stores diagrams entirely in the URL — no backend, no login, no data sent to any server.

## How it works

The diagram XML is LZ-compressed and embedded in the URL hash fragment (`#xml=...`). Because it's a hash, it never leaves the browser. Sharing a diagram means sharing a URL.

## Features

- **Edit** — full BPMN 2.0 modeler powered by [bpmn-js](https://bpmn.io)
- **Share** — copy the URL and send it; the recipient opens the exact same diagram
- **Download** — export as a standard `.bpmn` XML file
- **Open** — drag & drop or open a local `.bpmn` / `.xml` file
- **Undo / Redo** — full command history
- **URL size indicator** — shows compressed size with green / amber / red feedback
- **Single-file deployable** — `bpmn-editor.html` is self-contained, no CDN dependencies

## Getting started

```bash
npm install
npm run dev        # development server at http://localhost:5173
npm run build      # production build → dist/index.html
```

To produce the single-file deployable:

```bash
npm run build
cp dist/index.html bpmn-editor.html
```

Host `bpmn-editor.html` on any static file server or open it directly in a browser.

## Tech stack

| Library | Purpose | License |
|---|---|---|
| [bpmn-js](https://bpmn.io) | BPMN 2.0 rendering & editing | MIT |
| [Vue 3](https://vuejs.org) | UI framework | MIT |
| [lz-string](https://github.com/pieroxy/lz-string) | URL compression | MIT |
| [Font Awesome Free](https://fontawesome.com) | Icons | CC BY 4.0 |
| [Vite](https://vitejs.dev) + [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) | Build tooling | MIT |

## License

MIT — see [LICENSE](LICENSE) for details.
Font Awesome icons used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — attribution included in the built HTML.
