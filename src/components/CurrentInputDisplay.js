import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

import { CalculatorContext } from './Calculator'

const useStyles = makeStyles(theme => ({
  grid: {
    // #acacac, #202326, ccdee5, aaaaaa, d3d3d3
    marginTop: '50px'
  },
  input: {
    height: 50,
    backgroundColor: '#FEFEFE',
    margin: '1px',
    fontSize: '30px',
    color: 'black'
  }
}))

export default function CurrentInputDisplay () {
  const classes = useStyles()
  const { equation } = useContext(CalculatorContext)
  return (
    <Grid container justify='center' m={4} p={1} className={classes.grid}>
      <Typography variant='body1' color='textSecondary' component='p'>
        <Box
          borderRadius={3}
          className={classes.input}
          bgcolor='#acacac'
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
              <Grid item>{equation}</Grid>
            </Box>
          </Grid>
        </Box>
      </Typography>
    </Grid>
  )
}
