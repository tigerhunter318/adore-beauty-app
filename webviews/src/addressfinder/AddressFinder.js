import React, { useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import SvgAddress from './address.svg'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    color:#404040;
  }
  *{
  box-sizing: border-box;
  }
`

const StyledLabel = styled('label').attrs({ className: '' })`
  text-transform: uppercase;
  font-size: 13px;
  padding: 10px 25px;
  display: block;
`

const StyledInput = styled('input').attrs({ className: '' })`
  //background-color: blue;
  font-weight: bold;
  appearance: none;
  background-color: transparent;
  border: 0;
  border-radius: 0;
  display: block;
  width: 100%;
  border-bottom: dashed 1px #979797;
  font-family: 'Montserrat', sans-serif;
  color: black;
  padding: 20px 25px;
  font-size: 13px;
  outline: 0;
`

const StyledList = createGlobalStyle`
  .addressList{
    width:100%;
    padding: 0;
    margin: 0;
  }
  .addressListItem{
    font-size:14px;
    margin: 0;
    padding: 10px 25px;
    padding-left: 50px;
    position: relative;
    &:first-child{
      padding-top: 20px;
      &:before{
        top:20px;
      }
    }
    &:before{
      content:"";
      background-color:transparent;
      display: block;
      width: 18px;
      height:18px;
      margin-right: 0px;
      position: absolute;
      left:25px;
      top:10px;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: url("${props => props.icon}");
      background-size: 100% 100%;
    }
    span{
      background-color: rgba(151,151,151,0.5);
    }

  }
`

const dispatchMessage = object => {
  window.ReactNativeWebView.postMessage(JSON.stringify(object))
}

const addScript = ({ onload }) => {
  const script = document.createElement('script')
  script.src = 'https://api.addressfinder.io/assets/v3/widget.js'
  script.async = true
  script.onload = onload
  document.body.appendChild(script)
}

const loadWidget = () => {
  const options = {
    list_class: 'addressList',
    item_class: 'addressListItem',
    address_params: {}
  }
  const widget = new window.AddressFinder.Widget(
    document.getElementById('address_line_1'),
    'JW9ULDQGP6ARYCNFB3MK',
    'AU',
    options
  )

  widget.on('result:select', (fullAddress, metaData) => {
    dispatchMessage({ type: 'result:select', fullAddress, metaData })
  })
  // setTimeout( () => {
  document.getElementById('address_line_1').focus()
  dispatchMessage({ type: 'ready' })
  // },500)
}

const AddressFinder = () => {
  const onMount = () => {
    addScript({ onload: loadWidget })
  }

  useEffect(onMount, [])

  return (
    <>
      <GlobalStyle />
      <StyledList icon={SvgAddress} />
      <div className="App">
        <StyledLabel htmlFor="address_line_1">
          DELIVERY ADDRESS<span className="required">*</span>
        </StyledLabel>
        <StyledInput type="search" id="address_line_1" className="formInput" placeholder="Search address here..." />
      </div>
    </>
  )
}

export default AddressFinder
