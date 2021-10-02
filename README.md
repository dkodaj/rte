# Mini-Rte

Pure Elm rich text editor for relatively short texts (< 2000 words / 12K characters).
It supports non-Western keyboard input via [CompositionEvent](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent).

[Demo](https://dkodaj.github.io/rte)

## Limitations

It cannot justify text.

It gets sluggish for longer texts ([discussion on Elm-Discourse](https://discourse.elm-lang.org/t/pure-elm-rich-text-editor/7111)). If you need better performance, use [mweiss/elm-rte-toolkit](https://package.elm-lang.org/packages/mweiss/elm-rte-toolkit/latest/).

## Javascript
To communicate with the browser's clipboard (to be able to copy text from the RTE to other apps and paste text from other apps into the RTE), you'll need to add two ports to your app:

```elm
--from JavaScript to Elm

port fromBrowserClipboard : (String -> msg) -> Sub msg

--from Elm to JavaScript

port toBrowserClipboard : String -> Cmd msg
```

These ports belong in your `subscriptions` and `update` functions. See the [example](https://github.com/dkodaj/rte/tree/master/example).

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
