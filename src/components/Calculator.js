import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import KeyPad from './KeyPad'
import CurrentInputDisplay from './CurrentInputDisplay'
import HistoryDisplay from './HistoryDisplay'
export const CalculatorContext = React.createContext()

const endURL = '/'
export const socket = socketIOClient(endURL)

function Calculator () {
  const [result, setResult] = useState('')
  const [equation, setEquation] = useState('') //equation is displayed on input screen
  const [history, setHistory] = useState([])
  const [executed, setExecuted] = useState(false)

  // for updating output and emit side effects of execution 
  useEffect(() => {
    if (executed && equation !== result) {
      let temp = equation
      setEquation(result)
      let dataToSend = temp.concat(' = ').concat(result)
      socket.emit('new-calculation', dataToSend)
      // console.log('Data to send is: ', dataToSend)
      socket.on('new-remote-calculation', data => {
        setHistory(data)
        console.log('Client received server data: ', history)
      })
    }
  })

  // Handle new digit, change digits, update equation
  const handleOnDigitSetResult = num => {
    if (executed || !equation || ['ERROR', '0', "Infinity"].includes(equation)) {
      setEquation(num)
    }
    // handle when the last two digit is +0. Replace '0' with new num
    else if (equation.slice(-1) === '0' && isOperator((equation.charAt(equation.length - 2)))) {
      setEquation(equation.slice(0, equation.length - 1).concat(num))
    }
    else {
      setEquation(equation.concat(num))
    }
    setExecuted(false) // to ensure new calculation starts
    }

  const handleOperatorButton = op => {
    var lastDigit = equation.slice(-1)
    if (!equation || equation === 'ERROR') {
      if (op === '-') {
        setEquation(op)
      }
    }
    // if last digit is operator,
    else if (isOperator(lastDigit)) {
      // if operators are * or /, can directly concat '-' to equation
      if (['*', '/'].includes(lastDigit) && op === '-') {
        setEquation(equation.concat(op))
      } else {
        // must slice off the +, -, *, / with the new op (new op must not be '-')
        let tempStr = equation.slice(0, equation.length - 1)
        setEquation(tempStr.concat(op))
      }
    // if last digit is number
    } else if (/[0-9%]/.test(lastDigit)) {
      setEquation(equation.concat(op))
    }
    setExecuted(false)
  }

  const handleClearButton = () => {
    setEquation('')
    setResult('')
  }

  const handleDeleteButton = () => {
    if (equation) {
      setEquation(equation.slice(0, -1))
    }
  }

  const handleExecution = () => {
    setExecuted(true)
    console.log("equation before click '=' is ", equation)
    console.log("result before click '=' is ", result)
    if (result === 'ERROR') {
      setEquation('ERROR')
    }
    // Do not calculate when equation is invalid, e.g. '5+=', set result to error and return 
    if (/[\+\*\-\/]%+/.test(equation) || isOperator(equation.slice(-1))) {
      setResult('ERROR')
    } else {
      // use window.Function() constructor to calculate when valid
      var finalResult = Function('"use strict";return (' + equation + ')')()
      setResult(finalResult.toString())
      setEquation(equation)
      console.log('result is calculated:  ', result)
    }
  }

  // helpers
  function isOperator (digit) {
    if (['+', '-', '*', '/'].includes(digit)) {
      return true
    } else {
      return false
    }
  }

  return (
    <CalculatorContext.Provider
      value={{
        handleOnDigitSetResult,
        handleClearButton,
        handleDeleteButton,
        handleOperatorButton,
        handleExecution,
        setResult,
        setEquation,
        history,
        setHistory,
        result,
        equation,
        socket
      }}
    >
      <CurrentInputDisplay equation={equation} /> <KeyPad />
      <HistoryDisplay history={history} />{' '}
    </CalculatorContext.Provider>
  )
}

export default Calculator
