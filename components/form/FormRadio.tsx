import React from 'react'
import RadioInput from '../ui/RadioInput'

type FormRadioProps = {
  form: any
  id: any
  label: string
  name: string
  onChange: (name: string, id: any) => void
  children: JSX.Element
}

const FormRadio = ({ name, label, id, form, onChange, children }: FormRadioProps) => {
  const hasState = !!form?.formState
  const isChecked = form?.getValue(name) === id

  const handleChange = (evt: any) => {
    onChange(name, evt.id)
    if (hasState) {
      form.setValue({ [name]: evt.id })
    }
  }
  return (
    <RadioInput id={id} name={name} onPress={handleChange} label={label} checked={isChecked}>
      {children}
    </RadioInput>
  )
}

export default FormRadio
