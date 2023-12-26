import React from 'react'

export const initialFormState = {
  values: {},
  focused: null,
  submitted: null,
  errors: {},
  required: {},
  validations: {},
  blurred: {}
}

const useForm = (initialValues = {}) => {
  const formState = React.useState({
    ...initialFormState,
    values: { ...initialValues }
  })
  const [state, setState] = formState
  const setValue = values => {
    setState(prevState => ({
      ...prevState,
      values: { ...prevState.values, ...values }
    }))
  }
  const setValidations = values => {
    setState(prevState => ({
      ...prevState,
      validations: { ...prevState.validations, ...values }
    }))
  }
  const setRequired = values => {
    setState(prevState => ({
      ...prevState,
      required: { ...prevState.required, ...values }
    }))
  }
  const setBlurred = values => {
    setState(prevState => ({
      ...prevState,
      blurred: { ...prevState.blurred, ...values }
    }))
  }
  const setError = values => {
    setState(prevState => ({
      ...prevState,
      errors: { ...prevState.errors, ...values }
    }))
  }
  const setFocused = name => {
    setState(prevState => ({
      ...prevState,
      focused: name
    }))
  }
  const setSubmitted = val => {
    setState(prevState => ({
      ...prevState,
      submitted: val
    }))
  }

  const isValid = () => {
    let valid = true
    const names = Object.keys(state.required)
    names.forEach(name => {
      if (state.required[name] && !state.values[name]) {
        valid = false
      }
    })
    const validations = Object.keys(state.required)
    validations.forEach(name => {
      const val = state.values[name]
      const functions = state.validations[name]
      if (functions && functions.length > 0) {
        functions.forEach(func => {
          if (!func(val)) {
            valid = false
          }
        })
      }
    })
    return valid
  }

  const getValue = name => state.values[name]

  const isSubmitted = () => state.submitted

  const hasError = (name, validations) => {
    let error = false
    if (validations && validations.length > 0) {
      validations.forEach(func => {
        if (!func(getValue(name))) {
          error = true
        }
      })
    }
    return error
  }

  const reset = () => {
    setState({ ...initialFormState })
  }

  return {
    formState,
    setValue,
    setBlurred,
    setRequired,
    setValidations,
    setFocused,
    setError,
    isValid,
    isSubmitted,
    getValues: () => state.values,
    getFocused: () => state.focused,
    getValue,
    hasBlurred: name => state.blurred[name],
    hasError,
    setSubmitted,
    submitted: state.submitted,
    reset
  }
}

export default useForm
