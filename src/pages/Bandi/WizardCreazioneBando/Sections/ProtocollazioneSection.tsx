import { Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { SingleValue } from 'react-select';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { useWizardBandoContext } from '../WizardBandoContext';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import useDebounce from '../../../../app/Hooks/useDebounceHook';
import { AttivitaObj } from '../WizardCreazioneBando_types';
type Params = {
    openSection : React.Dispatch<React.SetStateAction<boolean>>;
    isOpen : boolean;
    className: string;
    control:any;
    options?:any[];
    selectValues?: any;
    register: UseFormRegister<any>;
    errors:  FieldErrors<any>;
}

export const ProtocollazioneSection = (params:Params) => {
    const {openSection, isOpen, className, control, selectValues, register, errors} = params;
    const newId = uuid();
    const [id, setId] = useState<string>(newId);
    const [tipoProtocollo, setTipoProtocollo] = useState<Option | null>(null)

    //dati WizardBandoContext
    const attivita = useWizardBandoContext().attivita;
    const {listaAttivita, setListaAttivita} = attivita;
    
    const ProtocollazioneOptions = {
        daProtocollare: [
            { value: 0, label: 'si' },
            { value: 1, label: 'no' },

        ],
        tipoProtocollo: [
            { value: 'PROT_E', label: 'In entrata' },
            { value: 'PROT_U', label: 'In uscita' },
            
        ],
        gruppo:selectValues!.gruppo_utenti,
        utenti_firmatari:selectValues!.utenti_firmatari,
    }
    const organizzaDocumentoListe = useWizardBandoContext().listeOrganizzaDocumento
    const protocolloInUscitaAction = organizzaDocumentoListe?.lista_tipi_attivita.find(item => item.actionDett === "PROT_U");
    const protocolloInEntrataAction = organizzaDocumentoListe?.lista_tipi_attivita.find(item => item.actionDett=== "PROT_E");
    

    //watcher per creare l'oggetto attività firma e modificarlo in live
    useEffect(() => {
        if(isOpen){
            //check per non duplicare attività
            if(listaAttivita.some((item) => item.Id === id)) return;

            const initialObj:AttivitaObj = {
                Id: id,
                daProtocollare:true,
                delete: false,
                gruppoUtenti: null, //gruppo firmatario
                utente: null, //utente firmatario
                posizione: listaAttivita.length,
                descrizioneAttivitaUtente: '',
                oggetto:'',
                ...protocolloInEntrataAction
                
            }
            setListaAttivita(prev => [...prev, initialObj])
        }
        
        if(!isOpen){
            //console.log("'protocollo' deselezionato, rimuovo l'attività dalla lista")
            const protocolloRemovedActivityList = listaAttivita.filter((item) => item.Id !== id)
            setListaAttivita(protocolloRemovedActivityList)
        }
    }, [isOpen])

    //handlers
    const handleProtocolloChange = (opt:SingleValue<Option>) => {
        if(opt?.value === 0){
            openSection(true)
            return
        }
        openSection(false)
        
    }

    const  handleChange= useDebounce(( newValue:any,  field:string, ) => {
        const value = newValue.value;
        const activity = listaAttivita.find(item => item.Id === id);
        switch (field) {
            case 'protocollo-tipo':
                if(value === "PROT_E"){
                     const newActivity: AttivitaObj ={
                         ...activity!,
                         ...protocolloInEntrataAction,
                     };
                     setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item))
                }else{
                    const newActivity: AttivitaObj ={
                        ...activity!,
                        ...protocolloInUscitaAction,
                       
                    };
                    setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item))
                };
                break;
        
            case 'gruppo-firmatario':

                const newActivity: AttivitaObj = {
                    ...activity!,
                    gruppoUtenti:value
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item));
                break;

            case 'utente-firmatario':

                const newActivity1: AttivitaObj = {
                    ...activity!,
                    utente: value
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity1 : item));
                break;

            case 'oggetto':   
                
                const newActivity2: AttivitaObj = {
                    ...activity!,
                    oggetto: newValue
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity2 : item));
                break;
            
            case 'descrizioneAttivitaUtente':   
            
            const newActivity3: AttivitaObj = {
                ...activity!,
                descrizioneAttivitaUtente: newValue
            };
            setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity3 : item));
            break;

        }

    },300);

  return (
    <>
        <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Protocollazione</Typography>
                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select2
                            onChangeSelect={(e) => handleProtocolloChange(e)}
                            label={'Da Protocollare ?'}
                            options={ProtocollazioneOptions.daProtocollare}
                            defaultValue={ProtocollazioneOptions.daProtocollare[1]}
                        />
                    </Grid>

                    {isOpen && 
                        <>
                            <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                                <Custom_Select2
                                    label={'Tipo Protocollo'}
                                    options={ProtocollazioneOptions.tipoProtocollo}
                                    control={control}
                                    name='protocollo-tipo'
                                    defaultValue={ProtocollazioneOptions.tipoProtocollo[0]}
                                    onChangeSelect={(newValue) => handleChange(newValue, 'protocollo-tipo')}
                                />
                            </Grid>

                            <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                                <Custom_Select2
                                    label={"Utente a cui assegnare l'attività"}
                                    options={ProtocollazioneOptions.utenti_firmatari}
                                    placeholder='sleleziona utente...'
                                    control={control}
                                    name='protocollo-utente-assegnato'
                                    onChangeSelect={(newValue) => handleChange(newValue, 'utente-firmatario')}
                                />
                            </Grid>

                            <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                                <Custom_Select2
                                    label={"Gruppo di utenti a cui assegnare l'attività"}
                                    options={ProtocollazioneOptions.gruppo}
                                    control={control}
                                    name='protocollo-gruppo-utenti-assegnati' 
                                    placeholder='seleziona gruppo utenti...' 
                                    onChangeSelect={(newValue) => handleChange(newValue, 'gruppo-firmatario')}
                                />
                            </Grid>

                            <Grid padding={'0 1rem'} item xs={12} >
                                <Custom_TextField 
                                    label={'Oggetto'}
                                    isRequired
                                    error={!!errors.protocollazione_oggetto}
                                    errorMessage={errors.protocollazione_oggetto?.message as string}
                                    {...register('protocollazione_oggetto',{required:"l'oggetto della protocollazione è obbligatorio"})}
                                    onChange={(e) => handleChange( e.target.value, 'oggetto')}
                                    backgroundColor='#fff'
                                />
                            </Grid>

                            <Grid padding={'0 1rem'} item xs={12} >
                                <Custom_TextField 
                                    backgroundColor='#fff'
                                    label={'note libere attività'}
                                    onChange={(e) => handleChange( e.target.value, 'descrizioneAttivitaUtente')}
                                />
                            </Grid>
                        </>
                    }
                    </Grid>
            </Paper>

    </>
  )
}
