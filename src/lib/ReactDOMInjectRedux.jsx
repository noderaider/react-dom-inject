import React from 'react'
import { connect as connectRedux, Provider } from 'react-redux'
import ReactDOMInject from './ReactDOMInject'

/**
 * Used just like react-redux connect.
 */
export const connect = (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  return ReactElement => {
    return store => ReactDOMInject(connectRedux(mapStateToProps, mapDispatchToProps, mergeProps, options)(ReactElement), store)
  }
}
