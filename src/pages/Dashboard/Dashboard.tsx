import { Grid } from '@mui/material'
import './Dashboard.scss'
import { useAppDispatch } from '../../app/ReduxTSHooks'
import { openLoader } from '../../app/store/Slices/loaderSlice';
import { useEffect } from 'react';
import { Widget } from '../../components/Widget/Widget';

export const Dashboard = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
      //controllo se i dati che devo fetchare non sono nello state
      //se ci sono non faccio nulla

      //se non ci sono =>
      //apro il loader
      //fetching dei dati per sidebar e dati per componente dashboard
      //salvo i dati nello state Di redux 
      //chiudo il loader

    }, [])
    
  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6}  lg={3} >
            <Widget handleCall={{url:'test/decazz'}}  data={{icon:'document_scanner',title:'Bandi', to:'/Bandi', body:[{counter:0,text:'Aperti'},{counter:0,text:'Chiusi'}]}} />
        </Grid>

        <Grid item xs={12} sm={6}  lg={3} >
            <Widget data={{title:'Affidamento Diretto', to:'/Affidamento-diretto', body:[{counter:0,text:'Affidati'}]}}  />
        </Grid>

        <Grid item xs={12} sm={6}  lg={3} >
            <Widget />
        </Grid>

        <Grid item xs={12} sm={6}  lg={3} >
            <Widget />
        </Grid>
    </Grid>
  )
}
