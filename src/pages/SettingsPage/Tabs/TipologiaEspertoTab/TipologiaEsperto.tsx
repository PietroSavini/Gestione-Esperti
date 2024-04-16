import { Accordion, AccordionDetails, AccordionSummary, Box, Icon, Typography } from '@mui/material'
import{ Table_tipologieDiSistema, TipologiaEspertoRow }from './Tables/Table_tipologieDiSistema'
import { useEffect, useState } from 'react'
import { Table_tipologiePersonalizzate } from './Tables/Table_tipologiePersonalizzate'
import { useAppDispatch } from '../../../../app/ReduxTSHooks'
import { useSelector } from 'react-redux'
import { closeLoader, openLoader } from '../../../../app/store/Slices/loaderSlice'
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton'
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { convertData } from '../RequisitiTab/RequisitiTab'



type Data = {
  tipologiePersonalizzate: TipologiaEspertoRow[] | [];
  tipologieDiSistema: TipologiaEspertoRow[] | [];
}



export const TipologiaEsperto = () => {

    const dispatch = useAppDispatch();

   
    const GET_ALL_TIPOLOGIE = async () => {

      await AXIOS_HTTP.Retrieve({sService:'READ_TIPOLOGIA_ESPERTO', sModule:'IMPOSTAZIONI_GET_ALL_TIPOLOGIE_ESPERTO', url:'/api/launch/retrieve', body:null})
        .then((response)=> {
          if(response.errorCode && response.errorCode !== 0){
            console.log('errore durante la ricezione dei dati', response)
          }
          console.log('DATI RAW IN ARRIVO',response.response)
          const data:TipologiaEspertoRow[] =  response.response
          const TipologiePersonalizzate = data.filter((tipologia) => tipologia.TEspSys === false)
          const TipologieDiSistema = data.filter((tipologia) => tipologia.TEspSys === true)
          setTipologieDiSistema(TipologieDiSistema)
          setTipologiePersonalizzate(TipologiePersonalizzate)
          dispatch(closeLoader())
        
        })
        .catch((err)=>{
          console.log('errore nella chiamata per la ricezione dei dati',err);
          dispatch(closeLoader())
        })
    }

    

    const [tipologieDiSistema, setTipologieDiSistema] = useState<TipologiaEspertoRow[]|[]>([]);
    const [tipologiePersonalizzate, setTipologiePersonalizzate] = useState<TipologiaEspertoRow[]|[]>([])
    useEffect(() => {
       console.log('DI SISTEMA: ', tipologieDiSistema)
       console.log('PERSONALIZZATE: ', tipologiePersonalizzate)
    }, [tipologieDiSistema, tipologiePersonalizzate])
    
    useEffect(() => {
      dispatch(openLoader())
      GET_ALL_TIPOLOGIE();
    }, [])

    // hook per gestire espansione degli accordion
    const [expanded, setExpanded] = useState<boolean[]>([true,true]);

    //funzione che gestisce apertura e chiusura degli accordion
    const handleChange = (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      const newExpanded = [...expanded];
      newExpanded[panel] = isExpanded;
      setExpanded(newExpanded);
    };

    return (
      <> 
          <Accordion expanded={expanded[0]} onChange={handleChange(0)}>
            <AccordionSummary expandIcon={<Icon sx={{rotate:'90deg'}}>chevron_right</Icon>}>
              <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie di Sistema </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table_tipologieDiSistema rows={tipologieDiSistema} addToTipologiePersonalizzateFn={setTipologiePersonalizzate} />
            </AccordionDetails>
          </Accordion>
    
          <Accordion expanded={expanded[1]} onChange={handleChange(1)}>
            <AccordionSummary  expandIcon={<Icon sx={{rotate:'90deg'}}>chevron_right</Icon>}>
              <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie Personalizzate </Typography>
              
            </AccordionSummary>
            <AccordionDetails>
              <Box display={'flex'} sx={{justifyContent:'flex-end'}}>

                <ActionButton sx={{marginBottom:'1rem'}} color='primary' text='Crea Nuova Tipologia' icon='add'/>
              </Box>
              <Table_tipologiePersonalizzate rows={tipologiePersonalizzate} setRows={setTipologiePersonalizzate}/>
            </AccordionDetails>
          </Accordion>
       
      </>
    )
   
}
