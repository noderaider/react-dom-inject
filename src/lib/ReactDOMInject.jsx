import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

/**
 * ReactDOMInject
 * Thunk that binds a ReactElement to properties of DOM elements based on selector and returns functions to render to first matching element or all matching elements.
 * You can pass a property with state object that will be injected into the ReactElement as redux state.
 * @param  {ReactElement} ReactElement  The ReactElement to bind properties found in HTML DOM selected elements to.
 * @return {Thunk}                      Returns an object with render and renderAll functions for binding the react element with elements found in the DOM.
 */
const ReactDOMInject = (ReactElement, store) => {
  const _render = (element, props = {}) => {
    let dataset = element.dataset || datasetShim(element)
    if(dataset)
      Object.assign(props, dataset)
    let __html = element.innerHTML.length > 0 ? element.innerHTML : null
    //const Element = () => __html ? <ReactElement {...props} dangerouslySetInnerHTML={{ __html }} /> : <ReactElement {...props} />
    return ReactDOM.render(<ReactElement {...props} store={store} />, element)
  }
  /** Renders the ReactElement onto the selected element and allows optional default props to be provided. */
  const render = (selector, props = {}) => {
    let attempts = 0
    let maxAttempts = 20
    let element = document.querySelector(selector)
    if(element) {
      return Promise.resolve(_render(element, props))
    } else {
      return new Promise((resolve, reject) => {
        attempts++
        let interval = setInterval(() => {
          let element = document.querySelector(selector)
          if(element) {
            clearInterval(interval)
            console.warn(`ReactDOMInject: Rendered in ${attempts} attempts => '${selector}'`)
            resolve(_render(element, props))
          } else if(attempts == maxAttempts) {
            clearInterval(interval)
            reject(new Error(`ReactDOMInject: Failed to find query selector in ${attempts} attempts => '${selector}'`))
          }
        }, 20)
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
  for(let attr of Array.from(element.attributes)) {
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
