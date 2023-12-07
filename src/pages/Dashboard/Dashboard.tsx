import { Grid } from '@mui/material'
import './Dashboard.scss'
import { useAppDispatch } from '../../app/ReduxTSHooks'
import { openLoader } from '../../app/store/Slices/loaderSlice';
import { useEffect } from 'react';

export const Dashboard = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // fetching dati

    }, [])
    
  return (
    <Grid container>
        <Grid item xs={12} sm={6} md={3} lg={1} >
            <p>ciaoooooo</p>
        </Grid>
    </Grid>
  )
}
