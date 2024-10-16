import { useState } from 'react'
import { Box, Divider, Typography } from '@mui/material'
import './settings.scss'
import { TipologiaEsperto } from './Tabs/TipologiaEspertoTab/TipologiaEsperto'
import { RequisitiTab } from './Tabs/RequisitiTab/RequisitiTab'
import { TabStack } from '../../components/partials/Tabs/TabStack'

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    {
      text: 'Tipologia Esperto',
    },
    {
      text: 'Requisiti',
    }
  ];

  return (
    <>
      <Typography variant='h4' fontWeight={600}>Impostazioni Gestione esperti</Typography>
      <Box display={'flex'} alignItems={'flex-end'} position={'relative'} sx={{ height: '50px', marginBottom: '1rem' }}>
        <Divider absolute sx={{ bottom: '0', backgroundColor: '#52A5CF', height: '2px' }} />
        <TabStack tabs={tabs} setTab={setActiveTab} activeTab={activeTab} />
      </Box>
      {/* implementare switchCase? */}
      <Box sx={{ marginTop: '5rem' }}>
        {activeTab === 0 ? (
          <TipologiaEsperto />
        ) : (
          <RequisitiTab />
        )}
      </Box>
    </>
  )
}




