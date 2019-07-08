import React, { useContext } from 'react'
import { CalculatorContext } from './Calculator'

export default function CurrentEquationDisplay () {
  const { equation } = useContext(CalculatorContext)
  return (
    <div>
      <h2>
        Display for current equation:
        {equation}
      </h2>
    </div>
  )
}
