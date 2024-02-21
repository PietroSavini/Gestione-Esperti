import  { useState } from 'react'
import { ActionButton } from '../../components/partials/Buttons/ActionButton'
import { Avatar, Box, Button, Dialog, Divider, Icon, MobileStepper, Step, StepLabel, Stepper, Typography } from '@mui/material'
import './BandiPage.scss'
import AXIOS_HTTP from '../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { WizardCreazioneBando } from './WizardCreazioneBando/WizardCreazioneBando'


export const BandiPage = () => {
    const [isOpen, setOpenModal] = useState<boolean>(false)
    const closeModal = () => {
        setOpenModal(false)
    }
    

  return (
    <>
        <div>Pagina dei Bandi</div>
        <Box marginBottom={'1rem'} display={'flex'} gap={2}>

            <ActionButton color='secondary' text=' tutta la datatable' onClick={ () => AXIOS_HTTP.Retrieve({url:'/api/Retrieve/retrieve', sService:'GET_ALL_CLASSI_DOC',body:{}, sModule:''})}/>
            <ActionButton color='warning' text='crea NOME su db' onClick={()=> AXIOS_HTTP.Execute({url:'/api/Execute/execute',sModule:'WRITE_BANDO',sService:'WRITE',body:{Username:'SNTONIOROBERTO',Password:'123456789'}})}/>
            <ActionButton color='secondary' text='filtra per username ' onClick={()=> AXIOS_HTTP.Retrieve({url:'/api/Retrieve/retrieve',sModule:'',sService:'GET_CLASSI_DOC',body:{Username:'Gabriele'}})}/>
            <ActionButton color='warning' text='update passando ID e newUsername' onClick={()=> AXIOS_HTTP.Execute({url:'/api/Execute/execute',sModule:'UPDATE_BANDO',sService:'WRITE',body:{ID:81, newUsername:'VECCHIOBACUCCO'}})}/>
            <ActionButton color='error' text='elimina passando ID' onClick={()=> AXIOS_HTTP.Execute({url:'/api/Execute/execute',sModule:'DELETE_BANDO',sService:'WRITE',body:{ID:100}})}/>

        </Box>
        <ActionButton color='secondary' text='Crea nuovo Bando' onClick={() => setOpenModal(true)}  />
        
        {/* MODAL CON WIZARD CREAZIONE DEL BANDO */}
        <WizardCreazioneBando close={closeModal} isOpen={isOpen}/>
    </>
  )
}