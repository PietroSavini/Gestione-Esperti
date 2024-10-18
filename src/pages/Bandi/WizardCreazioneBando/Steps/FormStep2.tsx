import 'dayjs/locale/it';
import { FormStepProps } from './FormStep1';
import { useEffect, useState } from 'react';
import { PubblicaAlbo_Section } from '../Sections/PubblicaAlbo_Section';
import { FirmaSection } from '../Sections/FirmaSection';
import { ProtocollazioneSection } from '../Sections/ProtocollazioneSection';
import { AmministrazioneTrasparente_Section } from '../Sections/AmministrazioneTrasparente_Section';
import { BachecheIstituzionali_Section } from '../Sections/BachecheIstituzionali_Section';
import { useWizardBandoContext } from '../WizardBandoContext';
import { Grid, Paper } from '@mui/material';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';

//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione

export const FormStep2 = (props: FormStepProps) => {
    const { register, errors, className, control, unregister} = props;
    const [isFirmaExpanded, setFirmaExpanded] = useState(false);
    const [isProtocolloExpanded, setProtocolloExpanded] = useState(false);
    const [isPubblicaAlboSelected, setIsPubblicaAlboSelected] = useState<boolean>(false);
    const [isAmministrazioneTrasparenteSelected, setIsAmministrazioneTrasparenteSelected] = useState<boolean>(false);
    const [isBachecheIstituzionaliSelected, setIsBachecheIstituzionaliSelected] = useState<boolean>(false);
    const selectOptions = useWizardBandoContext().selectOptions
    const selectValues = {...selectOptions.organizzaDocumentoSelectValues!, ...selectOptions.pubblicazioniSelectValues!}

    //LOGICA PER ESCLUSIONE DEI CAMPI DI INPUT QUANDO I FORM NON SONO APERTI / SELEZIONATI
    //FIRMA
    useEffect(()=>{
        if(unregister && !isFirmaExpanded) unregister(['firma-tipo-firma', 'firma-utente-firmatario','firma-gruppo-firmatario','date' ]);
    },[isFirmaExpanded]);
    
    //PROTOCOLLAZIONE
    useEffect(() => {   
        if(unregister && !isProtocolloExpanded) unregister(['protocollo-tipo', 'protocollo-utente-assegnato','protocollo-gruppo-utenti-assegnati',"protocollazione_oggetto"]);
    },[isProtocolloExpanded]);

    //PUBBLICA SU ALBO ONLINE
    useEffect(()=>{
        if(unregister && !isPubblicaAlboSelected) unregister(['pubblicazione_albo_oggetto', 'pubblicazione_albo_richiedente']);
    },[isPubblicaAlboSelected]);

    return (
        <>  
        <Paper className={className}>

            <Grid container sx={{ marginBottom: '1rem' }}>

                <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                    <Custom_Select2
                        options={[{ value: '2024', label: '2024' }]}
                        disabled
                        control={control}
                        defaultValue={{ value: '2024', label: '2024' }}
                        name='anno'
                        label='Anno di riferimento'
                    />

                </Grid>

                <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                    <Custom_Select2
                        placeholder='Seleziona A.O.O...'
                        control={control}
                        name='aoo'
                        options={selectValues.aoo}
                        label='A.O.O'
                        isClearable
                    />
                </Grid>

                <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                <Custom_Select2
                        control={control}
                        name='classeAddizionale'
                        options={selectValues!.classi_documentali}
                        label='Classe Addizionale'
                        placeholder='Seleziona classe Addizionale...'

                    />
                </Grid>

                <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                    
                </Grid>

                <Grid padding={'0 1rem'} item xs={12}>
                    <Custom_TextField
                        {...register('tagDocumento')}
                        label='Tag documento (min 2 e max 20 caratteri)'
                        placeholder='Inserisci tag...'
                        backgroundColor='#fff'
                    />
                </Grid>

            </Grid>
        </Paper>
            <FirmaSection selectValues={selectValues} openSection={setFirmaExpanded} isOpen={isFirmaExpanded} className={className} control={control} errors={errors}/>
    
            <ProtocollazioneSection selectValues={selectValues} openSection={setProtocolloExpanded} isOpen={isProtocolloExpanded} className={className} control={control} register={register} errors={errors} />
    
            <PubblicaAlbo_Section selectValues={selectValues} register={register} className={className} isOpen={isPubblicaAlboSelected} setIsOpen={setIsPubblicaAlboSelected} control={control} errors={errors}/>
    
            <AmministrazioneTrasparente_Section selectValues={selectValues} isOpen={isAmministrazioneTrasparenteSelected} setIsOpen={setIsAmministrazioneTrasparenteSelected} control={control} className={className} errors={errors}/>
    
            <BachecheIstituzionali_Section selectValues={selectValues} isOpen={isBachecheIstituzionaliSelected} setIsOpen={setIsBachecheIstituzionaliSelected} control={control} className={className} errors={errors}/>
      
        </>
    )
}
