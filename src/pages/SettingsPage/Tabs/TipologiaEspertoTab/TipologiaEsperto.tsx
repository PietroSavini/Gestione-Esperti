import { Accordion, AccordionDetails, AccordionSummary, Box, Icon, Typography } from '@mui/material'
import{ Table_tipologieDiSistema, TipologiaEspertoRow }from './Tables/Table_tipologieDiSistema'
import { useEffect, useState } from 'react'
import { Table_tipologiePersonalizzate } from './Tables/Table_tipologiePersonalizzate'
import { useAppDispatch } from '../../../../app/ReduxTSHooks'
import { useSelector } from 'react-redux'
import { selectTipologie, setTipologieData } from '../../../../app/store/Slices/TipologieSlice'
import { closeLoader, openLoader } from '../../../../app/store/Slices/loaderSlice'
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton'




type Data = {
  tipologieDiSistema: TipologiaEspertoRow[],
  tipologiePersonalizzate:TipologiaEspertoRow[]
}


export const TipologiaEsperto = () => {

    const dispatch = useAppDispatch();
    //estraggo i dati tabellari dallo store redux
    const tipologieState = useSelector(selectTipologie);
    const {tipologieDiSistema, tipologiePersonalizzate} = tipologieState;
    // hook per gestire espansione degli accordion
    const [expanded, setExpanded] = useState<boolean[]>([true,true]);
  
    useEffect(() => {
    
    }, [])

    //funzione che gestisce apertura e chiusura degli accordion
    const handleChange = (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      const newExpanded = [...expanded];
      newExpanded[panel] = isExpanded;
      setExpanded(newExpanded);
     
    };

  if(tipologieDiSistema.length !== 0){    
    return (
      <>
       
          <Accordion expanded={expanded[0]} onChange={handleChange(0)}>
            <AccordionSummary expandIcon={<Icon sx={{rotate:'90deg'}}>chevron_right</Icon>}>
              <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie di Sistema </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table_tipologieDiSistema data={tipologieDiSistema} />
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
              <Table_tipologiePersonalizzate data={tipologiePersonalizzate} />
            </AccordionDetails>
          </Accordion>
       
      </>
    )
  }else{
    dispatch(openLoader())
  }  
}
