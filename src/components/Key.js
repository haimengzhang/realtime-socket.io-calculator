// This file contains logic for button click, triggering diffent handles to change state
import React, { useContext } from 'react'
import { CalculatorContext } from './Calculator'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    color: 'white',
    fontSize: '26px',
    fontWeight: '400',
    font: 'Raleway'
  }
}))

const Key = props => {
  const classes = useStyles()
  const { value } = props
  const {
    handleOnDigitSetResult,
    handleOperatorButton,
    handleToggleNegative,
    handleDotButton,
    handleClearButton,
    handleDeleteButton,
    handleExecution
  } = useContext(CalculatorContext)

  return (
    <Button
      xs={1}
      className={classes.button}
      size='large'
      onClick={() => {
        switch (true) {
          case /[0-9]/.test(value):
            console.log('the clicked value is a number: ', value)
            return handleOnDigitSetResult(value)
          case ['+', '-', '*', '/'].includes(value):
            console.log('the clicked value is an operator: ', value)
            return handleOperatorButton(value)
          case value === '.':
            console.log('the clicked value is an operator: ', value)
            return handleDotButton()
          case value === '+/-':
            return handleToggleNegative()
          case value === '=':
            console.log('the clicked value is an operator: ', value)
            return handleExecution()
          case value === 'C':
            return handleClearButton()
          case value === 'DEL':
            return handleDeleteButton()
          default:
            return value
        }
      }}
    >
      {value}
    </Button>
  )
}

export default Key
