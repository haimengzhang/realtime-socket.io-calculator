import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import KeyPad from './KeyPad'
import CurrentInputDisplay from './CurrentInputDisplay'
import HistoryDisplay from './HistoryDisplay'
export const CalculatorContext = React.createContext()

const host = "http://localhost:8000"
const endPoint = "https://realtime-socketio-calculator.herokuapp.com/"
const port = process.env.PORT
export const socket = socketIOClient(host)

function Calculator () {
  const [result, setResult] = useState('') // this is the stored calculation result
  const [equation, setEquation] = useState('') // an array that displays current equation on the Display, only one at a time in a row
  const [history, setHistory] = useState([])
  const [executed, setExecuted] = useState(false)
  // const [socket, setSocket] = useState()

  // for updating output
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



  // Handle new digit, change digits, update equation, equation is displayed on inputDisplay
  const handleOnDigitSetResult = num => {
    if (executed || !equation || equation === 'ERROR' || equation === '0') {
      setEquation(num) // 9
      // console.log('Equation after click a number is: ', equation)
    } else {
      setEquation(equation.concat(num))
      // console.log('Equation after click a number is: ', equation)
    }
    setExecuted(false);
  }

  const handleOperatorButton = op => {
    var lastDigit = equation.slice(-1)
    if (!equation || equation === 'ERROR') {
      if (op === '-') {
        setEquation(op)
      }
    }
    // if last digit is operator,
    else if (isOperator(equation.slice(-1))) {
      // if operators are * or /, can directly concat to equation
      if (['*', '/'].includes(lastDigit) && op === '-') {
        setEquation(equation.concat(op))
      } else {
        // must slice off the +, -, *, / with the new op (new op must not be '-')
        let tempStr = equation.slice(0, equation.length - 1)
        setEquation(tempStr.concat(op))
      }
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
    if (equation) setEquation(equation.slice(0, -1))
  }

  const handleExecution = () => {
    setExecuted(true)
    console.log("equation before click '=' is ", equation)
    console.log("result before click '=' is ", result)
    if (result === 'ERROR') {
      setEquation('ERROR')
    }
    if (/[\+\*\-\/]%+/.test(equation) || isOperator(equation.slice(-1))) {
      setResult('ERROR')
    } else {
      var finalResult = eval(equation)
      setResult(finalResult.toString())
      setEquation(equation)
      console.log('result is calculated:  ', result)
    }
  }

  // helper
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
