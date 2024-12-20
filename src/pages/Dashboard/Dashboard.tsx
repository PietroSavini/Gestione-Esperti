import './Dashboard.scss'
import { Box, Grid } from '@mui/material'
import { Widget } from '../../components/Widget/Widget';
import { DashboardSection } from '../../components/DashboardSection/DashboardSection';
import { data, otherData } from '../../components/SectionRows/data';

export const Dashboard = () => {

  return (
    <>
      {/* //widgets
          // widget statici ma possono essere mappati con dati in entrata quando si renderizza la dashboard */}
      <Grid sx={{marginBottom:'2rem'}} container spacing={2}>
        {/* eventuale mapping di tutto il grid Item con all'interno il widget */}
          <Grid item xs={12} sm={6}  lg={3} >
              <Widget handleCall={{url:'test'}} data={{icon:'document_scanner',title:'Bandi', to:'/Bandi', body:[{counter:0,text:'Aperti'},{counter:0,text:'Chiusi'}]}} />
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
                  <DashboardSection to='/Bandi' title='Bandi in scadenza/scaduti' type='bandi' data={data} />
              </Grid> 
              <Grid item xs={12} lg={6}>
                <DashboardSection to='/Candidature' title='Ultime candidature ricevute' type='candidature' data={otherData} />
              </Grid> 
          </Grid>
        </Box>
    </>
    
  )
}
