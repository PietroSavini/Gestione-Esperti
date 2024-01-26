import React, { useState } from 'react'
import { ActionButton } from '../../components/partials/Buttons/ActionButton'
import { Avatar, Box, Button, Dialog, Divider, Icon, Typography } from '@mui/material'
import './BandiPage.scss'

export const BandiPage = () => {
    const [isOpen, setOpenModal] = useState<boolean>(false)
    const closeModal = () => {
        setOpenModal(false)
    }

  return (
    <>
        <div>Pagina dei Bandi</div>
        <ActionButton color='secondary' text='Crea nuovo Bando' onClick={() => setOpenModal(true)}  />
        <Dialog className='modello-creazione-bando' fullScreen onClose={closeModal} open={isOpen}>
            <Box sx={{padding:'.5rem 1rem'}} display={'flex'}>
                <Box width={'30%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='h6' fontWeight={600}>Crea nuovo Bando</Typography>
                    <Avatar sx={{height:'30px', width:'30px'}}></Avatar>
                </Box>
                <Box width={'70%'} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                    <Button onClick={closeModal} sx={{color:'black'}} ><Icon>close</Icon></Button>
                </Box>
            </Box>
            <Box display={'flex'}>
                <Box>
                    
                </Box>
            </Box>
            <Divider/>
        </Dialog>
    </>
  )
}
