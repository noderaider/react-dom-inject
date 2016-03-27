import React from 'react'
import { connect as connectRedux, Provider } from 'react-redux'
import ReactDOMInject from './ReactDOMInject'

/**
 * Used just like react-redux connect.
 */
export const connect = (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  return ReactElement => {
    return store => {
      let InjectProvider = ReactDOMInjectProvider(ReactElement)(store)
      return connectRedux(mapStateToProps, mapDispatchToProps, mergeProps, options)(InjectProvider)
    }
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
