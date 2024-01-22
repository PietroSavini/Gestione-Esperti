import { Box, Icon, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectTipologie } from '../../../../../app/store/Slices/TipologieSlice';
import { useAppSelector } from '../../../../../app/ReduxTSHooks';
import { Row } from '../Tables/Table_tipologieDiSistema';
import { useForm } from 'react-hook-form';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';

export const TipologiaEdit = () => {
    const navigate = useNavigate()
    const {state} = useLocation();
    const {title, id, description, visible, requisiti, rowId } = state
    const localState = useAppSelector(selectTipologie);
    const { tipologiePersonalizzate } = localState;
    //react hook form
    const form = useForm<any>();
    const { register, handleSubmit, control, formState } = form;
    const { errors } = formState;
    const submit = () => {
        console.log('hello')
    }
    
    //funzione che controlla se al click del pulsante "torna Indietro" ci sono modifiche non salvate
    //Funzione salva ed esci con useNavigate

    //

    useEffect(() => {
        //elemento di controllo nell ipotesi venga effettuato un regresh della pagina o se per qualche motivo la row non è presente nella tabella
        if(!tipologiePersonalizzate.some((tipologia) => tipologia.id === rowId)){
            navigate('/impostazioni')
        }
    }, [])
    
  return (
    <>
        <Box marginBottom='1rem'>
            <Typography className='link' onClick={() => navigate(-1)} fontSize='.7rem'  variant='body2' component={'span'} >Tipologie</Typography>
            <Typography fontWeight={600} variant='body2' component={'span'} > / Modifica Tipologia </Typography>
        </Box>

        <Box display='flex' alignItems='center'>
            <Icon onClick={() => navigate(-1)} className='link' sx={{marginRight:'1rem', fontSize:'2rem'}}>keyboard_backspace</Icon>
            <Typography variant='h5'>Modifica Tipologia: {title}</Typography>
        </Box>

        {/* form per modifica descrizioni */}
        <Box component={'form'} noValidate onSubmit={handleSubmit(submit)}>
            <ActionButton color='secondary' text='submit' type='submit' />
        </Box>
        {/* END form per modifica descrizioni */}
    </>
  )
}
