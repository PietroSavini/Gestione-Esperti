import { Box, Icon, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectTipologie } from '../../../../../app/store/Slices/TipologieSlice';
import { useAppSelector } from '../../../../../app/ReduxTSHooks';

export const TipologiaEdit = () => {
    const {state} = useLocation();
    const {title} = state
    const localState = useAppSelector(selectTipologie)
    const [newTipologia, setNewTipologia] = useState(state)
    const navigate = useNavigate()
    
    //funzione che controlla se al click del pulsante "torna Indietro" ci sono modifiche non salvate

    //Funzione salva ed esci con useNavigate

    //

    useEffect(() => {
        console.log(localState.tipologieDiSistema)
        //controllo se i dati sono salvati nello store prima di procedere (ipotesi refresh pagina e state redux perso)
        if(localState.tipologieDiSistema.length === 0){
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
    </>
  )
}
