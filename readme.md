# Poke

## How to use

Clone the repo and install local dependencies run:

```sh
npm i
```

You need also original pokemon red assets. Download/clone this repo:

https://github.com/pret/pokered/tree/98f09b6d26b1f83bdf1779cfe63a73b8a4265aef

and put `/gfx`, `/constants`, `/data` and `/maps` folder in `/poke-assets` folder (you need to create it).

Then just download and install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/). On macOS, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

```sh
brew install graphicsmagick
```

or

```sh
brew install imagemagick
```

--

To develop run:

```sh
npm start
```

and open [localhost:8080](http://localhost:8080/)

To build production package run:

```sh
npm run prod
```

and you will find compiled files in `/dist` directory.

## Support

Please [open an issue](https://github.com/smith-chris/poke/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/smith-chris/poke/compare).
