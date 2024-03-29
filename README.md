# Mini-Rte

Pure Elm rich text editor for relatively short texts (< 2000 words / 12K characters).

[Demo](https://dkodaj.github.io/rte)

## Limitations

It gets sluggish for longer texts ([discussion on Elm-Discourse](https://discourse.elm-lang.org/t/pure-elm-rich-text-editor/7111)). If you need better performance, use [mweiss/elm-rte-toolkit](https://package.elm-lang.org/packages/mweiss/elm-rte-toolkit/latest/).

It cannot justify text.

## Non-Western Keyboard Input

This is currently not supported out of the box, because it is hard to channel [CompositionEvent](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)s to the Elm RTE object (which is not an `input` or `textarea` node).

## Javascript
To communicate with the browser's clipboard (to be able to copy text from the RTE to other apps and paste text from other apps into the RTE), you'll need to add two ports to your app:

```elm
--from JavaScript to Elm

port fromBrowserClipboard : (String -> msg) -> Sub msg

--from Elm to JavaScript

port toBrowserClipboard : String -> Cmd msg
```

These ports belong in your `subscriptions` and `update` functions. See the example's [Main.elm](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm).

You will also need a bit of JS:

```javascript
app.ports.toBrowserClipboard.subscribe(txt => {
    navigator.clipboard.writeText(txt).then(function() {
        // Copied from app to clipboard
    }, function(err) {
        console.log(err)
    });
});

window.addEventListener('paste', (event) => {            
    app.ports.fromBrowserClipboard.send(event.clipboardData.getData('text'))                        
})

```

You can use a more complicated callback to allow copy/pasting images into the RTE. See the example's [index.html](https://github.com/dkodaj/rte/blob/master/example/html/index.html).