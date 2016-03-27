import React from 'react'
import ReactDOMInject from './ReactDOMInject'
import { connect as connectRedux } from 'react-redux'

/**
 * Used just like react-redux connect.
 */
export const connect = (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  return ReactElement => {
    let ReactElementInject = ReactDOMInject(ReactElement)
    connectRedux(mapStateToProps, mapDispatchToProps, mergeProps, options)(ReactElementInject)
  }
}

/**
 * Wraps ReactDOMInject with a thunk to inject the store.
 */
export const ReactDOMInjectProvider = ReactElement =>  {
  return store => {
    const ReactElementProvider = props => (
      <Provider store={store}>
        <ReactElement {...props} />
      </Provider>
    )
    return ReactDOMInject(ReactElementProvider)
  }
}
