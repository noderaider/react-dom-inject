# react-dom-inject
Binds an HTML element by selector to a ReactElement and renders to a DOM tree (with redux injection)


## Install

`npm i -S react-dom-inject`


## Usage

This package was written to ease transition of legacy applications from older systems component by component. It can be used to rewrite legacy components as react components, and then inject them into placeholder elements in the legacy application without requiring them to be in the same tree as the new react application.


##### index.html

```html
<!-- ... -->

<!-- All data properties will be camelCased and injected into the components props object. -->
<div id="my-element" data-title="My Element!" data-color="#ff0000" data-default-visibility="false"><span>Some inner HTML to be injected here</span></div>

<!-- ... -->
```


##### MyReactElement.jsx

```jsx
import React from 'react'
import ReactDOMInject from 'react-dom-inject'

/**
 * ReactElement to be injected.
 * This could be a regular class element but for this example I'm using an inline function style element.
 */
export const MyReactElement = props => {
  const { title, color, defaultVisibility, children, description } = props
  const style = { color
                , display: defaultVisibility ? 'block' : 'none'
                }
  return (
    <div style={style}>
      <h1>{title}</h1>
      <div>
        {children}
      </div>
    </div>
  )
}

export const MyReactElementDOM = ReactDOMInject(MyReactElement)
```

#### render.js

```js
import { MyReactElementDOM } from './MyReactElement'

...

MyReactElementDOM.render('#my-element'[, { description: 'This is a way to pass properties to the element at render time.'[, state: reduxState ] } ])
```
