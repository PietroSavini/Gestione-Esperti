import { Box, Grid, Paper, Typography } from '@mui/material'
import './Dashboard.scss'
import { useAppDispatch } from '../../app/ReduxTSHooks'
import { openLoader } from '../../app/store/Slices/loaderSlice';
import { useEffect } from 'react';
import { Widget } from '../../components/Widget/Widget';
import { Section } from '../../components/Section/Section';
import { RowBando } from '../../components/SectionRows/Bandi/RowBando';

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
    
   const data =[
    {
      id: 0,
      expirationDate: '15/12/2023',
      role:'Psicologo',
      icon:'document_scanner',
      
    },
    {
      id: 1,
      expirationDate: '28/11/2023',
      role:'Medico Competente',
      icon:'document_scanner',
      
    },
    {
      id: 2,
      expirationDate: '13/01/2024',
      role:'Traduttore Tedesco',
      icon:'document_scanner',
      
    },
    {
      id: 3,
      expirationDate: '13/12/2023',
      role:'Madrelingua - Inglese',
      icon:'document_scanner',
      
    },
    {
      id: 4,
      expirationDate: '15/12/2024',
      role:'Madrelingua - Tedesco',
      icon:'document_scanner',
      
    },
    {
      id: 0,
      expirationDate: '15/12/2023',
      role:'Psicologo',
      icon:'document_scanner',
      
    },
    {
      id: 1,
      expirationDate: '28/11/2023',
      role:'Medico Competente',
      icon:'document_scanner',
      
    },
    {
      id: 2,
      expirationDate: '13/01/2024',
      role:'Traduttore Tedesco',
      icon:'document_scanner',
      
    },
    {
      id: 3,
      expirationDate: '13/12/2023',
      role:'Madrelingua - Inglese',
      icon:'document_scanner',
      
    },
    {
      id: 4,
      expirationDate: '15/12/2024',
      role:'Madrelingua - Tedesco',
      icon:'document_scanner',
      
    },
    {
      id: 0,
      expirationDate: '15/12/2023',
      role:'Psicologo',
      icon:'document_scanner',
      
    },
    {
      id: 1,
      expirationDate: '28/11/2023',
      role:'Medico Competente',
      icon:'document_scanner',
      
    },
    {
      id: 2,
      expirationDate: '13/01/2024',
      role:'Traduttore Tedesco',
      icon:'document_scanner',
      
    },
    {
      id: 3,
      expirationDate: '13/12/2023',
      role:'Madrelingua - Inglese',
      icon:'document_scanner',
      
    },
    {
      id: 4,
      expirationDate: '15/12/2024',
      role:'Madrelingua - Tedesco',
      icon:'document_scanner',
      
    },
    
   
  ]
  return (
    <>
      {/* //widgets
          // widget statici ma possono essere mappati con dati in entrata quando si renderizza la dashboard */}
      <Grid sx={{marginBottom:'2rem'}} container spacing={2}>
        {/* eventuale mapping di tutto il grid Item con all'interno il widget */}
          <Grid item xs={12} sm={6}  lg={3} >
              <Widget handleCall={{url:'test/decazz'}} data={{icon:'document_scanner',title:'Bandi', to:'/Bandi', body:[{counter:0,text:'Aperti'},{counter:0,text:'Chiusi'}]}} />
          </Grid>

          <Grid item xs={12} sm={6}  lg={3} >
              <Widget data={{icon:'contact_mail',title:'Affidamento Diretto', to:'/Affidamento-diretto', body:[{counter:0,text:'Affidati'}]}}  />
          </Grid>

          <Grid item xs={12} sm={6}  lg={3} >
              <Widget data={{icon:'checklist',title:'Incarichi', to:'/Incarichi', body:[{counter:0,text:'Incarichi'}]}}/>
          </Grid>

          <Grid item xs={12} sm={6}  lg={3} >
              <Widget data={{icon:'summarize',title:'Contratti', to:'/Contratti', body:[{counter:0,text:'Contratti'}]}}/>
          </Grid>
      </Grid>
      {/* // end widgets*/}

        {/*Section bandi in scadenza */}
        <Box component='section'>
          <Grid container spacing={2}>
            {/* eventuale ciclo di mapping da dati in ingresso */}
              <Grid item xs={12} lg={6}>
                  <Section title='Bandi in scadenza/scaduti' type='bandi' data={data} />
              </Grid> 
          </Grid>
        </Box>
    </>
    
  )
}
