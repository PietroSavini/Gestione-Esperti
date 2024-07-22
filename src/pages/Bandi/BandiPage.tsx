import  { useState } from 'react'
import { ActionButton } from '../../components/partials/Buttons/ActionButton'
import { Box } from '@mui/material'
import './BandiPage.scss'
import AXIOS_HTTP from '../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { WizardCreazioneBando } from './WizardCreazioneBando/WizardCreazioneBando'
import WizardBandoContextProvider from './WizardCreazioneBando/WizardBandoContext'

export const BandiPage = () => {

  const [isOpen, setOpenModal] = useState<boolean>(false);
  const closeModal = () => {
      setOpenModal(false);
  };

  const GET_ALL_BANDI =  async () => {
    AXIOS_HTTP.Retrieve({sModule:'GET_ALL_BANDI',sService:'READ_BANDI',url:'/api/launch/retrieve', body:{}})
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  };

  return (
    <>
        <div>Pagina dei Bandi</div>
        <Box marginBottom={'1rem'} display={'flex'} gap={2}>
          <ActionButton color='secondary' text='GET ALL BANDI' onClick={ () => GET_ALL_BANDI() }/>
        </Box>
        <ActionButton color='secondary' text='Crea nuovo Bando' onClick={() => setOpenModal(true)}  />
        
        {/* MODAL CON WIZARD CREAZIONE DEL BANDO */}
        <WizardBandoContextProvider>
          <WizardCreazioneBando close={closeModal} isOpen={isOpen}/>
        </WizardBandoContextProvider>
    </>
    
  )
};