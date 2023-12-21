import React, { useEffect, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import './settings.scss'
import { Link, Outlet} from 'react-router-dom'
import { TipologiaEsperto } from './Tabs/TipologiaEspertoTab/TipologiaEsperto'

export const SettingsPage = () => {
    useEffect(() => {
      // controllo se i dati che devo fetchare sono presenti nello state di Redux
      // se no, faccio chiamata per il fetching dei dati,
      // salvo i dati nello state di redux
      // mostro i dati sulla tabella
      // nella row della tabella il tasto "modifica" renderizza d una nuova pagina che si occupa di editare il contenuto dell oggetto della row
            // alla fine delle operazioni, se i dati della row in ingresso, differiscono con i dati della row in entrata sostituisco l'array di ogetti presente nello state di redux con l'oggetto aggiornato e faccio partire la chiamata con i nuovi dati verso l'endpoint di update.
            //OPPURE
            // potremmo utilizzare uno useEffect che fa partire la chiamata verso l'endpoint UPDATE dei dati, solo quando 'data' cambia.
      // se premo il pulsante "torna indietro" nella pagina modifica, deve esser fatto il controllo sui dati, se sono modificati chiedere se salvare o ignorare con un modal.
      // qunado si torna indietro, la pagina della tabella deve contenere la row modificata (se modificata)
      // quando si torna indietro la tabella deve mantenere il suo stato (ad es. eravamo su pagina 2 con il selected sulla row 10, deve rimanere così) (trovare modo di mantenere stato paginazione sulla table mostrata)

      //*utilizzare table di luca su progetto AGD ci stanno lavorando. potrebbe essere più responsiva ed ottimizzata

    
      
    }, [])
    const [activeTab, setActiveTab] = useState('Tipologia Esperto')
    const handleTabClick = ( string : string) => {
      setActiveTab(string)
    }
    const tabs = [
      {
        key:'Tipologia-esperto',
        text : 'Tipologia Esperto',
        active: activeTab === 'Tipologia Esperto'
      },
      {
        key:'Requisiti&punteggio',
        text : 'Requisiti e Punteggio',
        active: activeTab === 'Requisiti e Punteggio'
      }
    ]
    
    const fetchedData = [
      {
        id:0,
        title:'Medico competente',
        description:'medico sportivo per attività semi-agonistica',
        visible:true,
      },
      {
        id:1,
        title:'Psicologo',
        description:'Psicologo espertoi in psicologia infantile',
        visible:false,
      },
      {
        id:2,
        title:'DPO',
        description:'DPO',
        visible:true,
      },
    ]

  return (
    <>
        <Typography variant='h4' fontWeight={600}>Impostazioni Gestione esperti</Typography>
        
        <Box display={'flex'} alignItems={'flex-end'} position={'absolute'} sx={{left:'0' , right:'0',  height:'50px', marginBottom:'1.5rem'}}>
          <Divider absolute sx={{bottom:'0', backgroundColor:'#52A5CF', height:'2px'}}/>
          <Stack flexDirection={'row'} sx={{padding:'0 1.5rem'}} className='tab-lables-container'>
            {tabs && tabs.map((tab,index)=> (
                <Box 
                  key={index}
                  className={`tab-lable ${tab.active ? 'active' : ''}`}
                  onClick={()=>handleTabClick(tab.text)} >
                  <Typography variant='body2' fontWeight={600}>{tab.text}</Typography>
                </Box>
            ))}
            
          </Stack>
        </Box>
        
        <Box sx={{marginTop:'5rem'}}>
              {activeTab === 'Tipologia Esperto' ? (
                <TipologiaEsperto data={fetchedData} />
              ):(
                <p>requisiti e boh</p>
              )}
        </Box>
        
    </>
  )
}
