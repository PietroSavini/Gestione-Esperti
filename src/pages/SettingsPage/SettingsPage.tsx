import { useEffect, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import './settings.scss'
import { TipologiaEsperto } from './Tabs/TipologiaEspertoTab/TipologiaEsperto'
import { RequisitiTab } from './Tabs/RequisitiTab/RequisitiTab'

export const SettingsPage = () => {
    useEffect(() => {
      
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
        key:'Requisiti',
        text : 'Requisiti',
        active: activeTab === 'Requisiti'
      }
    ]

    
  
    

  return (
    <>
        <Typography variant='h4' fontWeight={600}>Impostazioni Gestione esperti</Typography>
        <Box display={'flex'} alignItems={'flex-end'} position={'absolute'} sx={{left:'0' , right:'0',  height:'50px', marginBottom:'1.5rem'}}>
          <Divider absolute sx={{bottom:'0', backgroundColor:'#52A5CF', height:'2px'}}/>
          <Stack flexDirection={'row'} sx={{padding:'0 1.5rem'}} className='tab-labels-container'>
            {tabs && tabs.map((tab,index)=> (
                <Box 
                  key={index}
                  className={`tab-label ${tab.active ? 'active' : ''}`}
                  onClick={()=>handleTabClick(tab.text)} >
                  <Typography variant='body2' fontWeight={600}>{tab.text}</Typography>
                </Box>
            ))}
            
          </Stack>
        </Box>
        {/* implementare switchCase? */}
        <Box sx={{marginTop:'5rem'}}>
              {activeTab === 'Tipologia Esperto' ? (
                <TipologiaEsperto />
              ):(
                <RequisitiTab />
              )}
        </Box>
        
    </>
  )
}
