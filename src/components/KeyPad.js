import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Key from './Key'
import { keys } from './constants'

function KeyPad () {
  return (
    <Grid container justify='center'>
      <Box
        borderRadius={3}
        boxShadow={3}
        bgcolor='#acacac'
        m={1}
        p={1}
        style={{ width: '379px', height: '339px' }}
      >
        <Typography variant='body1' color='textSecondary' component='p'>
          <Grid container justify='center'>
            <Grid justify='center' item xs={9}>
              <Grid container justify='center' spacing={1}>
                {keys.map(item =>
                  item === 'DEL' ? (
                    <Grid key={item} item xs={6}>
                      <Key value={item} size='large' xs={1} />
                    </Grid>
                  ) : (
                    <Grid key={item} item>
                      <Key value={item} size='large' xs={1} />
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        </Typography>
      </Box>
    </Grid>
  )
}

export default KeyPad
