import { Box, Grid, Paper, Switch,Typography } from '@mui/material'
import { Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import Custom_Select from '../../../../components/partials/Inputs/Custom_Select';
import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { itIT } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/it';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { FormStepProps } from './FormStep1';
import { useEffect, useState } from 'react';
import { Option } from  '../../../../components/partials/Inputs/Custom_Select2';
import { SingleValue } from 'react-select';
import { PubblicaAlbo_Section } from '../Sections/PubblicaAlbo_Section';
import { FirmaSection } from '../Sections/FirmaSection';
import { ProtocollazioneSection } from '../Sections/ProtocollazioneSection';
import { AmministrazioneTrasparente_Section } from '../Sections/AmministrazioneTrasparente_Section';
const options = {
    select1: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    select2: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    aoo: [
        { value: '1', label: 'NUOVA AOO' },
    ],
    adc: [
        { value: '1', label: 'Archivio corrente' },
    ]
}
//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione


export const FormStep2 = (props: FormStepProps) => {
    const { register, errors, className, control, fn , unregister} = props;

    //requisiti di validazione per campo ()DAINCLUDERE NELLE VARIE SEZIONI
    

    

    
  
   
    const [isFirmaExpanded, setFirmaExpanded] = useState(false)
    const[isProtocolloExpanded, setProtocolloExpanded] = useState(false)
    const [isPubblicaAlboSelected, setIsPubblicaAlboSelected] = useState<boolean>(false)
    const [isAmministrazioneTrasparenteSelected, setIsAmministrazioneTrasparenteSelected] = useState<boolean>(false)
    //funzione per apertura/chiusura form Firma
    

    //funzione per apertura/chiusura form Protocollazione
    

    //LOGICA PER ESCLUSIONE DEI CAMPI DI INPUT QUANDO I FORM NON SONO APERTI / SELEZIONATI
    //FIRMA
    useEffect(()=>{
        if(unregister && !isFirmaExpanded) unregister(['firma-tipo-firma', 'firma-utente-firmatario','firma-gruppo-firmatario','date' ])
    },[isFirmaExpanded]);
    
    //PROTOCOLLAZIONE
    useEffect(() => {   
        if(unregister && !isProtocolloExpanded) unregister(['protocollo-tipo', 'protocollo-utente-assegnato','protocollo-gruppo-utenti-assegnati'])
    },[isProtocolloExpanded]);

    //PUBBLICA SU ALBO ONLINE
    useEffect(()=>{
        if(unregister && !isPubblicaAlboSelected) unregister(['pubblicazione_albo_oggetto', 'pubblicazione_albo_richiedente'])
    },[isPubblicaAlboSelected]);

  
    

    return (
        <>
            {/* -------------------------------FIRMA--------------------------------------------------------- */}
            <FirmaSection openSection={setFirmaExpanded} isOpen={isFirmaExpanded} className={className} control={control} errors={errors}/>
            {/* -------------------------------------PROTOCOLLO---------------------------------------------- */}
            <ProtocollazioneSection openSection={setProtocolloExpanded} isOpen={isProtocolloExpanded} className={className} control={control} />
            {/* -------------------------------------SEZIONI CON SWITCHES------------------------------------------------ */}
            {/* Pubblica su albo online */}
            <PubblicaAlbo_Section className={className} isOpen={isPubblicaAlboSelected} setIsOpen={setIsPubblicaAlboSelected} control={control} errors={errors}/>
            {/* Amministrazione trasparente */}
            <AmministrazioneTrasparente_Section isOpen={isAmministrazioneTrasparenteSelected} setIsOpen={setIsAmministrazioneTrasparenteSelected} control={control} className={className} errors={errors}/>

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Bacheche istituzionali</Typography>
                    <Switch {...register('Bacheche-istituzionali')} />
                </Box>
            </Paper>

        </>
    )
}
