# Spectrum Chrome Extension

You can [install the extension in the Chrome store](https://chrome.google.com/webstore/detail/spectrum/jopdhoinfcaefobmlekemdaikoaaojln?authuser=1) which makes
it eash to get your Javascript logs out of devtools and into [Spectrum](http://www.devspectrum.com).

## Using the Spectrum Chrome Extension

1. First, [install the extension](https://chrome.google.com/webstore/detail/spectrum/jopdhoinfcaefobmlekemdaikoaaojln?authuser=1) from the Chrome Store.

2. By default the extension is off for your browser tabs.  Go to the browser tab that you are using locally and click the greyed out Spectrum icon.

3. Once enabled it will relay all of your `console.log()` and `console.dir()` messages to a REST Spectrum Stream on localhost and port 9000.  It will also use the level name of 'DEBUG' and sublevel of 'browser'.  These bits are all adjustable in the extension's options which you can find by going to _More Tools_ -> _Extensions_ -> Spectrum Options.

## Developers

This documentation is mostly for those wishing to fix or extend this extension
to [Spectrum](http://www.devspectrum.com).


To develop:

```
$ npm install
$ npm watch
```

To release:

```
$ npm run compile_dev
```
