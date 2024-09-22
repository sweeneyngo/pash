# pash
![](https://img.shields.io/github/actions/workflow/status/sweeneyngo/pash/deploy-build.yml)

Run quick diagnostics on your passwords. Must be BitWarden-formatted exports, see how you can [export your passwords](https://bitwarden.com/help/export-your-data/).

<!-- <p align="center">
<a href="https://ifuxyl.dev/akro">
<img src="https://i.imgur.com/Jf5Fueu.png" width="800"><br>
<sup><strong>ifuxyl.dev/akro</a></strong></sup>
</p> -->

The application is written in Typescript + [React](https://react.dev/) and built with [Vite](https://vitejs.dev/).
<!-- Implemented with the [Markov chain generator](https://en.wikipedia.org/wiki/Markov_chain) with Go. Multiple independent replicas are hosted + provisioned in different distributed locations in U.S.A with [Fly](https://fly.io/). -->

<!-- See the [full article](https://www.ifuxyl.dev/blog/conway-hashlife) about seagull & HashLife! -->

## Building
Not necessarily in active development, but we welcome any contributions. Feel free to submit an issue or contribute code via PR to the `main` branch.

You need [Node.js v22](https://nodejs.org/en/) for the frontend.

To build the site for development:
```bash
# If you don't have Node v22 or pnpm v9:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install node
npm install -g pnpm

# Install in project root
pnpm install && pnpm run dev
```

You should now access the webpage at `http://localhost:5173/pash/`,
Any changes in `src` will be immediately available through [Vite](https://vitejs.dev/).

<!-- ### Deployment
```bash
fly deploy
``` -->

## License

<sup>
All code is licensed under the <a href="LICENSE">MIT license</a>.
</sup>
