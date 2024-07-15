import { Box, Grid, Paper, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormUnregister, useForm } from 'react-hook-form';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { DatePicker } from '@mui/x-date-pickers';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { OrganizzaDocumentoSelect, selectOrganizzaDocumentoData } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { AttivitaObj, useWizardBandoContext } from '../WizardBandoContext';
import { v4 as uuid } from 'uuid';
import { useSelector } from 'react-redux';
import useDebounce from '../../../../app/Hooks/useDebounceHook';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    control: any;
    unregister?: UseFormUnregister<any>;
    errors: FieldErrors<any>
    className?: string;
    selectValues?: any;
    register: UseFormRegister<any>;
}
export const PubblicaAlbo_Section = (props: Props) => {
    const { isOpen, setIsOpen, className, control, errors, selectValues, register } = props;
    const newId = uuid();
    const [id, setId] = useState<string>(newId);
    const [dirittoOblioCheck, setDirittoOblio] = useState<boolean>(false)
    //dati WizardBandoContext
    const attivita = useWizardBandoContext().attivita;
    const {listaAttivita, setListaAttivita} = attivita;


    const pubblicaSuAlboAction = useSelector(selectOrganizzaDocumentoData)!.lista_tipi_attivita.find(item => item.fsAction === "ALBO");

    
    //watcher per creare l'oggetto attività firma e modificarlo in live
    useEffect(() => {
        if(isOpen){
            console.log(pubblicaSuAlboAction)
            //check per non duplicare attività
            if(listaAttivita.some((item) => item.Id === id)) return;

            const initialObj:AttivitaObj = {
                Id: id,
                delete: false,
                fiTipoAttoId: null,
                fiGruppoId: null, //gruppo firmatario
                fiUserId: null, //utente firmatario
                posizione: listaAttivita.length,
                fsDescrizioneAttivita: '', //note libere albo -> va al posto di fsDescriptionOfUserActivity
                fsOggetto: '',
                fsAnnotazioni: '', //descrizione addizionale
                fsRichiedente: '',//richiedente
                fsDestinatarioDescrizione: '', //destinatario albo
                fbDirittoOblio: false,
                fiPubblicazioneAlbo: true,
                ...pubblicaSuAlboAction
                
            }
            setListaAttivita(prev => [...prev, initialObj])
        }

       
        
        if(!isOpen){
            console.log("'pubblica su albo-online' deselezionato, rimuovo l'attività dalla lista")
            const pubblicaAlboRemovedActivityList = listaAttivita.filter((item) => item.Id !== id)
            setListaAttivita(pubblicaAlboRemovedActivityList)
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

            case "diritto-oblio":
                const newActivity1: AttivitaObj ={
                    ...activity!,
                    fbDirittoOblio: newValue,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity1 : item));
                break;
            
            case "richiedente" :
                const newActivity2: AttivitaObj ={
                    ...activity!,
                    fsRichiedente: newValue,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity2 : item));
                break;
            
            case "ufficio":
                const newActivity3: AttivitaObj ={
                    ...activity!,
                    fiUfficioId: value,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity3 : item));
                break;

            case "destinatario":
                const newActivity4: AttivitaObj ={
                    ...activity!,
                    fsDestinatarioDescrizione: newValue,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity4 : item));
                break;

            case "oggetto":
                const newActivity5: AttivitaObj ={
                    ...activity!,
                    fsOggetto: newValue,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity5 : item));
                break;

            case "descrizione-addizionale":
                const newActivity6: AttivitaObj ={
                    ...activity!,
                    fsAnnotazioni: newValue,
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity6 : item));
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

    }, 300);

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Pubblica su albo on-line</Typography>
                    <Switch onClick={() => setIsOpen(!isOpen)} value={isOpen} />
                </Box>
                {isOpen &&
                    <Box>
                        <Grid container marginBottom={'1.5rem'}>
                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3}>
                                <Custom_Select2
                                    placeholder='Scegli dove pubblicare il documento'
                                    validations={{ required: 'il campo è obbligatorio' }}
                                    options={selectValues.atti}
                                    label='Pubblica Documento in'
                                    isRequired

                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3} alignItems={'center'} justifyContent={'center'} display={'flex'}>
                                <Typography fontWeight={600} fontSize={'.9rem'} sx={{ color: '#127aa3ff' }}>Diritto all' Oblio</Typography>
                                <Switch checked={dirittoOblioCheck} onClick={(e) => {
                                        setDirittoOblio(!dirittoOblioCheck);
                                        const dirittoOblioRealValue = dirittoOblioCheck ? false : true //hack per ovviare all asincronicità dello useState
                                        handleChange(dirittoOblioRealValue, 'diritto-oblio')
                                    }}/>
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3}>
                                inizio affissione
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3} >
                                fine affissione
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid padding={'0 1rem'} item xs={12} md={6}>
                                <Custom_TextField
                                    backgroundColor='#fff'
                                    placeholder='Scrivi il nominativo del richiedente'
                                    {...register('pubblicazione_albo_richiedente', { required: 'il richiedente è obbligatorio' })}
                                    label='Richiedente'
                                    isRequired
                                    error={!!errors.pubblicazione_albo_richiedente}
                                    errorMessage={errors.pubblicazione_albo_richiedente?.message as string}
                                    onChange={(e) => handleChange(e.target.value, 'richiedente')}
                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_Select2
                                    placeholder='Seleziona un ufficio...'
                                    validations={{ required: 'il campo è obbligatorio' }}
                                    options={selectValues.uffici}
                                    label='Ufficio (UDR)'
                                    onChangeSelect={(newValue) => handleChange(newValue, 'ufficio')}
                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_TextField
                                    backgroundColor='#fff'
                                    placeholder='Scrivi il nominativo del destinatario...'
                                    label='Destinatario'
                                    onChange={(e) => handleChange(e.target.value, 'destinatario')}
                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_TextField
                                    backgroundColor='#fff'
                                    {...register('pubblicazione_albo_oggetto', { required: "l'oggetto è obbligatorio" })}
                                    placeholder="Scrivi l'oggetto della pubblicazione"
                                    label='Oggetto'
                                    isRequired
                                    error={!!errors.pubblicazione_albo_oggetto}
                                    errorMessage={errors.pubblicazione_albo_oggetto?.message as string}
                                    onChange={(e) => handleChange(e.target.value, 'oggetto')}
                                />
                            </Grid>
                        </Grid>

                        <Box padding={'0 1rem'} marginBottom={'1.5rem'}>
                            <Custom_TextField
                                backgroundColor='#fff'
                                label='Descrizione addizionale'
                                minRows={3}
                                multiline
                                placeholder='digita un eventuale descrizione estesa...'
                                onChange={(e) => handleChange(e.target.value, 'descrizione-addizionale')}
                            />
                        </Box>

                        <Grid container  >
                            <Grid padding={'0 1rem'} item xs={12} md={6}>
                                <Custom_Select2
                                    options={selectValues.utenti}
                                    label="Utente a cui asseggnare l'attività"
                                    placeholder='seleziona un utente...'
                                    onChangeSelect={(newValue) => handleChange(newValue, 'utente')}

                                />
                            </Grid>
                            <Grid padding={'0 1rem'} item xs={12} md={6}>
                                <Custom_Select2
                                    options={selectValues.gruppo_utenti}
                                    label="Gruppo utenti a cui assegnare l'attività"
                                    placeholder='Seleziona utenti...'
                                    onChangeSelect={(newValue) => handleChange(newValue, 'gruppo-utenti')}
                                />
                            </Grid>
                        </Grid>

                        <Box padding={'0 1rem'} marginBottom={'1.5rem'}>
                            <Custom_TextField
                                backgroundColor='#fff'
                                label='Note libere attività'
                                minRows={2}
                                multiline
                                onChange={(e) => handleChange(e.target.value, 'note-libere')}
                            />
                        </Box>
                    </Box>
                }

            </Paper>
        </>
    )
}
