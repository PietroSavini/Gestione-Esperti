import { Box, Grid, Paper, Switch, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { FieldErrors, UseFormUnregister } from 'react-hook-form';
import { Custom_Select2} from '../../../../components/partials/Inputs/Custom_Select2';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { AttivitaObj, useWizardBandoContext } from '../WizardBandoContext';
import { useSelector } from 'react-redux';
import { selectOrganizzaDocumentoData } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { v4 as uuid } from 'uuid';
import useDebounce from '../../../../app/Hooks/useDebounceHook';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    control: any;
    unregister?: UseFormUnregister<any>;
    errors: FieldErrors<any>
    className?:string
    selectValues?:any
}

export const AmministrazioneTrasparente_Section = (props : Props) => {

    const {isOpen, setIsOpen, className, control, errors, selectValues} = props;
    const newId = uuid();
    const [id, setId] = useState<string>(newId);
    //dati WizardBandoContext
    const attivita = useWizardBandoContext().attivita;
    const {listaAttivita, setListaAttivita} = attivita;
    const amministrazioneTrasparenteAction = useSelector(selectOrganizzaDocumentoData)!.lista_tipi_attivita.find(item => item.fsAction === "AT");

    //watcher per creare l'oggetto attività firma e modificarlo in live
    useEffect(() => {
        if(isOpen){
            console.log(amministrazioneTrasparenteAction)
            //check per non duplicare attività
            if(listaAttivita.some((item) => item.Id === id)) return;

            const initialObj:AttivitaObj = {
                Id: id,
                delete: false,
                fiGruppoId: null, //gruppo firmatario
                fiUserId: null, //utente firmatario
                posizione: listaAttivita.length,
                fsDescrizioneAttivita: '', //note libere at -> va al posto di fsDescriptionOfUserActivity
                fsAnnotazioni: '', //annotazioni at
                fsAttoId:'',//ID atto Amministrazione Trapsarente
                fiDaPubblicare: true,
                ...amministrazioneTrasparenteAction
                
            }
            setListaAttivita(prev => [...prev, initialObj])
        }
        
        if(!isOpen){
            console.log("'Amministrazione Trasparente' deselezionato, rimuovo l'attività dalla lista")
            const AmministrazioneTrasparenteRemovedActivityList = listaAttivita.filter((item) => item.Id !== id)
            setListaAttivita(AmministrazioneTrasparenteRemovedActivityList)
        }
    }, [isOpen])

    const handleChange = useDebounce(( newValue:any,  field:string, ) => {
        const value = newValue.value; 
        const activity = listaAttivita.find(item => item.Id === id);
        switch (field) {

            case 'tipo-atto': 
                const newActivity: AttivitaObj ={
                    ...activity!,
                    fiTipoAttoId: value,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item));
                break;

            case "annotazioni":
                const newActivity1: AttivitaObj ={
                    ...activity!,
                    fsAnnotazioni: newValue,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity1 : item));
                break;

            case "utente":
                const newActivity7: AttivitaObj ={
                    ...activity!,
                    fiUserId: value,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity7: item));
                break;

            case "gruppo-utenti":
                const newActivity8: AttivitaObj ={
                    ...activity!,
                    fiGruppoId: value,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity8: item));
                break;

            case "note-libere":
                const newActivity9: AttivitaObj ={
                    ...activity!,
                    fsDescrizioneAttivita: newValue,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity9 : item));
                break;
        }

    },300);

  return (
    <>
         <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Amministrazione Trasparente</Typography>
                    <Switch onClick={() => setIsOpen(!isOpen)} value={isOpen}/>
                </Box>
                {isOpen && 
                    <Box>
                        <Box padding={'0 1rem'}>
                            <Custom_Select2 
                                placeholder='Scegli dove pubblicare il documento' 
                                validations={{required:'il documento è obbligatorio'}} 
                                options={selectValues.trasparenza} 
                                label='Pubblica documento in'
                                isRequired
                                name='amministrazione_trasparente_pubblica_documento'
                                control={control}
                                error={!!errors.amministrazione_trasparente_pubblica_documento}
                                errorMessage={errors.amministrazione_trasparente_pubblica_documento?.message as string}
                                onChangeSelect={(newValue) => handleChange(newValue, 'tipo-atto')}
                            />
                        </Box>

                        <Box marginBottom={'1rem'} padding={'0 1rem'} >
                            <Custom_TextField 
                                backgroundColor='#fff' 
                                multiline 
                                minRows={2} 
                                label='Annotazioni non visibili in pubblicazione' 
                                placeholder='Scrivi eventuali annotazioni...' 
                                onChange={(e) => handleChange(e.target.value, 'annotazioni')}
                            />
                        </Box>
                        <Grid container marginBottom={'1.5rem'}>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_Select2 
                                    label="Utente a cui assegnare l'attività" 
                                    options={selectValues.utenti} 
                                    placeholder='Seleziona utente ...'
                                    onChangeSelect={(newValue) => handleChange(newValue, 'utente')}
                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_Select2 
                                    label="Grupo utenti a cui assegnare l'attività" 
                                    options={selectValues.gruppo_utenti} 
                                    placeholder='Seleziona gruppo ...'
                                    onChangeSelect={(newValue) => handleChange(newValue, 'gruppo-utenti')}
                                />
                            </Grid>


                        </Grid>
                        <Box padding={'0 1rem'}>
                            <Custom_TextField 
                                backgroundColor='#fff' 
                                multiline 
                                minRows={2} 
                                label='note libere attività' 
                                placeholder='' 
                                onChange={(e) => handleChange(e.target.value, 'note-libere')}
                            />
                        </Box>
                        
                    </Box> 
                }
            </Paper>
    </>
  )
}
