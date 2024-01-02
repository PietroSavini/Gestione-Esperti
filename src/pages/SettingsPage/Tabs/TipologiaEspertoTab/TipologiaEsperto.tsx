import { Accordion, AccordionDetails, AccordionSummary, Icon, Typography } from '@mui/material'
import{ Table_tipologieDiSistema, Row }from './Tables/Table_tipologieDiSistema'
import { useEffect, useState } from 'react'
import { Table_tipologiePersonalizzate } from './Tables/Table_tipologiePersonalizzate'
import { useAppDispatch } from '../../../../app/ReduxTSHooks'
import { useSelector } from 'react-redux'
import { addTipologiaPersonalizzata, selectTipologie, setTipologieData } from '../../../../app/store/Slices/TipologieSlice'
import { closeLoader, openLoader } from '../../../../app/store/Slices/loaderSlice'

//implementare lazy loading?  in quanto i dati della pagina in teoria dovrebbero essre gia presenti sullo state e presi da DB all' avvio dell app?

type Data = {
  tipologieDiSistema: Row[],
  tipologiePersonalizzate:Row[]
}
//il parametro 'data' passato al componente non dovrebbe esistere in situazione reale, il componente stesso farà chiamata all'endpoint o prende i dati già presenti nel redux store
export const TipologiaEsperto = (data:Data) => {
    const dispatch = useAppDispatch();
    const tipologieState = useSelector(selectTipologie);

    //estraggo i dati tabellari dallo store redux
    const {tipologieDiSistema, tipologiePersonalizzate} = tipologieState;
    // hook per gestire espansione degli accordion
    const [expanded, setExpanded] = useState<boolean[]>([true,true]);
    const [tableLoader, setTableLoader] = useState<boolean[]>([false,false]);
    
    //Hook useEffect che si avvia
    useEffect(() => {
      //controllo se const tipologieDiSistema è vuoto
      //SE VUOTO: (primo avvio dell'app)
      if(tipologieDiSistema.length === 0){
        console.log('NON HO LE TIPOLOGIE NELLO STORE, FACCIO CHIAMATA AD ENDPOINT')
        //effettuo la chiamata all'endpoint per prendere le tipologie da DB
        //una volta prese le tipologie (personalizzate e di sistema)
        //salvare i dati presi dalla risposta della chiamata nel Redux Store.
        dispatch(setTipologieData(data))
            //le tabelle saranno popolate
      }
      //SE NON E' VUOTO: 
          // non faccio nulla in qunato i dati per le tabelle sono già presenti nel Redux Store
          
      //funzione che avvia processo di update su dtate e su DB alla modifica di TipologiePersonalizzate
          console.log('tipologie di Sistema: ' , tipologieDiSistema)
          console.log('tipologie Personalizzate: ' , tipologiePersonalizzate)
    }, [dispatch, data])

    //funzione che gestisce apertura e chiusura degli accordion
    const handleChange = (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      const newExpanded = [...expanded];
      newExpanded[panel] = isExpanded;
      setExpanded(newExpanded);
     
    };

    //funzione che passo al bottone 'duplica' e che ha il compito di aggiungere la row a tipologiePersonalizzate partendo dalla row di sistema
    const addToCustom = (row:Row) => {
      
      //apro loader tabella tipologie personalizzate
      setTableLoader([false,true])
      //aggiungo row a tipologiePersonalizzate state
      dispatch(addTipologiaPersonalizzata(row))
      //aggiungo la row al DB
      //chiudo loader tabella tipologiepersonalizzate
      setTableLoader([false,false])

    }

  if(tipologieDiSistema.length !== 0){
    //attualmente gestire la chiusura del loader da qui da problemi, infatti l'apertura e la chiusura del loader andrebbe gestita all'interno dello useEffect quando si esegue la chiamata a DB
    dispatch(closeLoader())
    return (
      <>
  
        <Accordion expanded={expanded[0]} onChange={handleChange(0)}>
          <AccordionSummary expandIcon={<Icon>chevron_right</Icon>}>
            <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie di Sistema </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table_tipologieDiSistema loader={tableLoader[0]} fn={addToCustom} data={tipologieDiSistema} />
          </AccordionDetails>
        </Accordion>
  
        <Accordion expanded={expanded[1]} onChange={handleChange(1)}>
          <AccordionSummary expandIcon={<Icon>chevron_right</Icon>}>
            <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie Personalizzate </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table_tipologiePersonalizzate data={tipologiePersonalizzate} />
          </AccordionDetails>
        </Accordion>
       
      </>
    )
  }else{
    dispatch(openLoader())
  }  
}
