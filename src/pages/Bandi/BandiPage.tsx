import  { useEffect, useState } from 'react'
import { ActionButton } from '../../components/partials/Buttons/ActionButton'
import { Box, Grid } from '@mui/material'
import './BandiPage.scss'
import AXIOS_HTTP from '../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { WizardCreazioneBando } from './WizardCreazioneBando/WizardCreazioneBando'
import WizardBandoContextProvider from './WizardCreazioneBando/WizardBandoContext'
import { useAppDispatch } from '../../app/ReduxTSHooks'
import { setOrganizzaDocumentoData, setOrganizzaDocumentoSelect } from '../../app/store/Slices/organizzaDocumentoSlice'
import { WizardBando4 } from './WizardCreazioneBando/WizardBando4'


export const BandiPage = () => {
  
  const [isOpen, setOpenModal] = useState<boolean>(false);
  const [isOpen4, setIsOpen4] = useState<boolean>(false);
  const [aooSelect, setAooSelect] = useState<any>([])
  const dispatch = useAppDispatch()
  const closeModal = () => {
    setIsOpen4(false)
    setOpenModal(false);
    dispatch(setOrganizzaDocumentoSelect(undefined))
    dispatch(setOrganizzaDocumentoData(undefined))
  };
  
  const GET_ALL_BANDI =  async () => {
    AXIOS_HTTP.Retrieve({sModule:'GET_ALL_BANDI',sService:'READ_BANDI',url:'/api/launch/retrieve', body:{}})
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
  };
  
  const GET_AOO = async () => {
    AXIOS_HTTP.Retrieve({url:'/api/launch/organizzaDocumento', sModule:'GET_AOO', sService:'READ_DOCUMENTI', body:{}})
    .then((res) => {
      setAooSelect(res.response.lista_aoo)
    })
  }

  useEffect(() => {
    GET_AOO()
    console.log('lista solo AOO',aooSelect)
  }, [])
  
  return (
    <>
        <div>Pagina dei Bandi</div>
        <Box marginBottom={'1rem'} display={'flex'} gap={2}>
          <ActionButton color='secondary' text='GET ALL BANDI' onClick={ () => GET_ALL_BANDI() }/>
        </Box>
        <Grid gap={2} container>
          <ActionButton color='secondary' text=' Bando test 1 (JSON Singolo / selectValues formattate da Frontend - 500ms circa)' onClick={() => setOpenModal(true)}  />
          <ActionButton color='secondary' text=' Bando test 4 (SelectValues a liste singole - formattate da frontend - 450ms circa)' onClick={() => setIsOpen4(true)}  />
        </Grid>
        
        {/* MODAL CON WIZARD CREAZIONE DEL BANDO */}
        <WizardBandoContextProvider>
          <WizardCreazioneBando close={closeModal} isOpen={isOpen}/>
          <WizardBando4 close={closeModal} isOpen={isOpen4}/>
        </WizardBandoContextProvider>
    </>
    
  )
};


