import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { socket } from './Calculator'

import { CalculatorContext } from './Calculator'

const useStyles = makeStyles(theme => ({
  input: {
    height: 345,
    backgroundColor: '#FEFEFE',
    margin: '2px',
    fontSize: '18px',
    color: 'black'
  }
}))

const HistoryDisplay = () => {
  const classes = useStyles()
  const { history, setHistory, socket } = useContext(CalculatorContext)

  // This creates history display in rows
  const createHistoryRows = () => {

    // This socket lets user fetch history when first connected
    socket.on('history fetched', historyData => {
      setHistory(historyData)
      // console.log('Fetching history upon creating history rows: ', historyData)
    })
    // A socket to listen for real-time updates from server
    socket.on('new-remote-calculation', data => {
      setHistory(data)
      // console.log('Client received server data: ', history)
    })

    // populate history display
    let rows = []
    for (let i = history.length - 1; i >= 0; i--) {
      rows.push(
        <Grid key={i} item xs={12}>
          {history[i]}
        </Grid>
      )
    }
    return rows
  }

  return (
    <Grid container justify='center'>
      <Typography variant='body1' color='textSecondary' component='p'>
        <Box
          borderRadius={3}
          className={classes.input}
          bgcolor='#FEFEFE'
          justify='center'
          boxShadow={3}
          m={1}
          p={1}
          style={{ width: '379px' }}
        >
          <Grid
            container
            justify='center'
            direction='column'
            alignItems='flex-end'
          >
            <Box>
              <Grid
                container
                alignItems='flex-end'
                justify='center'
                spacing={1}
                direction='column'
              >
                {createHistoryRows()}
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Typography>
    </Grid>
  )
}

export default HistoryDisplay
