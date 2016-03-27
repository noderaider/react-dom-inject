import React from 'react'
import ReactDOM from 'react-dom'

/**
 * ReactDOMInject
 * Thunk that binds a ReactElement to properties of DOM elements based on selector and returns functions to render to first matching element or all matching elements.
 * You can pass a property with state object that will be injected into the ReactElement as redux state.
 * @param  {ReactElement} ReactElement  The ReactElement to bind properties found in HTML DOM selected elements to.
 * @return {Thunk}                      Returns an object with render and renderAll functions for binding the react element with elements found in the DOM.
 */
const ReactDOMInject = ReactElement => {
  const _render = (element, props = {}) => {
    let dataset = element.dataset || datasetShim(element)
    if(dataset)
      Object.assign(props, dataset)
    let __html = element.innerHTML.length > 0 ? element.innerHTML : null
    return ReactDOM.render(__html ? <ReactElement {...props} dangerouslySetInnerHTML={{ __html }} /> : <ReactElement {...props} />, element)
  }
  const _tryRender = (selector, props) => {
    let element = document.querySelector(selector)
    return element || false
    if(element)
      return _render(element, props)
  }
  /** Renders the ReactElement onto the selected element and allows optional default props to be provided. */
  const render = (selector, props = {}) => {
    let rendered = _tryRender(selector, props)
    let attempts = 0
    let maxAttempts = 20
    if(rendered)
      return Promise.resolve(rendered)
    else {
      return new Promise((resolve, reject) => {
        attempts++
        let interval = setInterval(() => {
          let rendered = _tryRender(selector, props)
          if(rendered) {
            clearInterval(interval)
            console.warn(`ReactDOMInject: Rendered in ${attempts} attempts => '${selector}'`)
            Promise.resolve(rendered)
          } else if(attempts == maxAttempts) {
            clearInterval(interval)
            const message = `ReactDOMInject: Failed to find query selector in ${attempts} attempts => '${selector}'`
            console.warn(message)
            Promise.reject(new Error(message))
          }
        }, 100)
      })
    }
  }
  /** Renders the ReactElement onto all matching elements and allows optional default props to be provided. */
  const renderAll = (selector, props = {}) => {
    let elements = document.querySelectorAll(selector)
    if(elements && elements.length > 0)
      return Array.from(elements).map(x => _render(x, props))
    console.warn(`ReactDOMInject: No matching elements found for query selector => '${selector}'`)
  }
  return { render, renderAll }
}
export default ReactDOMInject


const datasetShim = element => {
  if(!element.hasAttributes())
    return
  let dataset = {}
  let attrs = Array.from(element.attributes)
  for(let attr of attrs) {
    let { name, value } = attr
    if(!name.startsWith('data-'))
      continue
    let key = name.split('data-')
                  .filter((x, i) => i > 0)
                  .map((word, i) => i === 0 ? word : word.map((letter, position) => position === 0 ? letter.toUpperCase() : letter.toLowerCase()))
    dataset[key] = value
  }
  return dataset
}
