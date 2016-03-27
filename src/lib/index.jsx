import React from 'react'
import ReactDOM from 'react-dom'

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


/**
 *
 * @param  {[type]} ReactElement [description]
 * @return {[type]}              [description]
 */
const ReactDOMInject = ReactElement => render = (selector, props = {}) => {
  let element = document.querySelector(id)
  if(!element) {
    console.warn(`ReactHTML: No element found with '${id}' id`)
    return
  }
  let dataset = element.dataset
  if(!dataset)
    dataset =  datasetShim(element)
  let combinedProps = dataset ? Object.assign(props, dataset) : props
  let __html = element.innerHTML.length > 0 ? element.innerHTML : null
  return ReactDOM.render(__html ? <ReactElement {...combinedProps} dangerouslySetInnerHTML={{ __html }} /> : <ReactElement {...combinedProps} />, element)
}

export default ReactHTML
