import React, { useEffect, useState } from 'react'
import { SingleValue } from 'react-select'
import { Custom_Select2, Option } from  '../../../../components/partials/Inputs/Custom_Select2';
import { Grid, Paper, Typography } from '@mui/material';
import { FieldErrors } from 'react-hook-form';
import { OrganizzaDocumentoSelect, selectOrganizzaDocumentoData, setOrganizzaDocumentoData } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { useAppSelector } from '../../../../app/ReduxTSHooks';
import { v4 as uuid } from 'uuid';
import { AttivitaObj, useWizardBandoContext } from '../WizardBandoContext';
import dayjs from 'dayjs';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';

type Params = {
    openSection : React.Dispatch<React.SetStateAction<boolean>>;
    isOpen : boolean;
    className: string;
    control:any;
    errors: FieldErrors<any>
    selectValues?: any
}

export const FirmaSection = (params:Params) => {

    const { openSection, isOpen, className, control, errors, selectValues } = params;
    
    const validations = {
        titolario: {
            required: 'il titolario è obbligatorio'
        }
    };

    const firmaOptions = {
        daFirmare: [
            { value: 0, label: 'si' },
            { value: 1, label: 'no' },

        ],
        tipoFirma: [
            { value: 0 , label: 'Firma digitale Pades',},
            { value: 1 , label: 'Firma digitale Cades', },
            { value: 2 , label: 'Firma digitale Xades', },
            { value: 3 , label: 'Firma Grafometrica', }
        ],
        gruppoFirmatario: selectValues!.gruppo_utenti,
        utenteFirmatario: selectValues!.utenti,
       
    };

    const FIRMA_D = useAppSelector(selectOrganizzaDocumentoData)!.lista_tipi_attivita.find((item) => item.fsAction === "FIRMA_D");
    const FIRMA_G = useAppSelector(selectOrganizzaDocumentoData)!.lista_tipi_attivita.find((item) => item.fsAction === "FIRMA_G");
    const newId = uuid();
    const today = dayjs().format('DD/MM/YYYY');
    const [id, setId] = useState<string>(newId);
    const [tipoFirma, setTipoFirma] = useState<Option>(firmaOptions.tipoFirma[0]);

    //dati WizardBandoContext
    const attivita = useWizardBandoContext().attivita;
    const {listaAttivita, setListaAttivita} = attivita;

    
    //watcher per creare l'oggetto attività firma e modificarlo in live
    useEffect(() => {
        if(isOpen){
            //check per non duplicare attività
            if(listaAttivita.some((item) => item.Id === id)) return;

            const initialObj:AttivitaObj = {
                Id: id,
                delete: false,
                fbDaFirmare: true,
                fdMaxDateExecution: `${today} 23:59`,
                fiActionId: FIRMA_D!.fiActionId,
                fsActionDesc: FIRMA_D!.fsActionDescription,
                fsAction: FIRMA_D!.fsAction,
                fsActionName: FIRMA_D!.fsActionName,
                fiTipoFirma: tipoFirma.value as number,
                fiGruppoId: null, //gruppo firmatario
                fiUserId: null, //utente firmatario
                posizione: listaAttivita.length,
            }
            setListaAttivita(prev => [...prev, initialObj])
        }
        
        if(!isOpen){
            console.log("'firma' deselezionato, rimuovo l'attività dalla lista")
            const firmaRemovedActivityList = listaAttivita.filter((item) => item.Id !== id)
            setListaAttivita(firmaRemovedActivityList)
        }
    }, [isOpen])
    
    //handlers
    const handleFirmaChange = (newValue:SingleValue<Option>) => {
        if(newValue?.value === 0){
            openSection(true);
            return;
        };
        openSection(false);
    };

    function handleChange( newValue:any,  field:string, ) {
        const value = newValue.value;
        const activity = listaAttivita.find(item => item.Id === id);
        switch (field) {
            case 'fiTipoFirma':

                if(value !== 3){
                    const newActivity: AttivitaObj ={
                        ...activity!,
                        fiTipoFirma: value as number,
                    };
                    setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item))
                }else{
                    const newActivity: AttivitaObj ={
                        ...activity!,
                        fiTipoFirma: value as number,
                        actionDett: FIRMA_G!.fsAction,
                        actionDesc: FIRMA_G!.fsActionDescription,
                        actionId: FIRMA_G!.fiActionId,
                        actionName: FIRMA_G!.fsActionName,
                    };
                    setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item))
                };
                break;
        
            case 'gruppo-firmatario':
                const newActivity: AttivitaObj = {
                    ...activity!,
                    fiGruppoId:value
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item));
                break;

            case 'utente-firmatario':   
                const newActivity1: AttivitaObj = {
                    ...activity!,
                    fiUserId:value
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity1 : item));
                break;

            case 'fsDescriptionOfUserActivity':
                const newActivity2: AttivitaObj = {
                    ...activity!,
                    fsDescriptionOfUserActivity: newValue
                };

                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity2 : item));
        }

    };

  return (
    <>
         <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Firma</Typography>
                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select2
                            onChangeSelect={(newValue)=> handleFirmaChange(newValue)}
                            label={'Da firmare ?'}
                            options={firmaOptions.daFirmare}
                            defaultValue={firmaOptions.daFirmare[1]}
                            
                        />
                    </Grid>
                </Grid>
                {isOpen && 
                
                    <Grid container className={isOpen ? '': 'd-none'}>
                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            <Custom_Select2
                                control={ control }
                                label={'Tipo Firma'}
                                options={firmaOptions.tipoFirma}
                                value={tipoFirma}
                                defaultValue={firmaOptions.tipoFirma[0]}
                                onChangeSelect={(newValue) => handleChange(newValue,'fiTipoFirma')}
                                name='firma-tipo-firma'
                                placeholder='Seleziona tipo Firma...'
                                disabled={!isOpen}
                                
                            />
                        </Grid>

                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            <Custom_Select2
                                label={'Seleziona Gruppo Firmatario'}
                                options={firmaOptions.gruppoFirmatario}
                                onChangeSelect={(newValue) => handleChange(newValue,'gruppo-firmatario')}
                                control={control}
                                placeholder='Seleziona gruppo firmatario...'
                                name='firma-gruppo-firmatario'
                                disabled={!isOpen}

                            />
                        </Grid>

                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            <Custom_Select2
                                label={'Seleziona utente Firmatario'}
                                options={firmaOptions.utenteFirmatario}
                                onChangeSelect={(newValue) => handleChange(newValue,'utente-firmatario')}
                                control={control}
                                name='firma-utente-firmatario'
                                placeholder='seleziona utente firmatario...'
                                disabled={!isOpen}
                            />
                        </Grid>

                        <Grid item padding={'0 1rem'} xs={12} md={6} lg={3}>
                            DatePicker
                        </Grid>
                        <Grid item  padding={'0 1rem'} xs={12}>
                            <Custom_TextField
                                multiline
                                minRows={1.4}
                                maxRows={2}
                                label={'Note libere Attività'}
                                onChange={(e) => handleChange(e.target.value, 'fsDescriptionOfUserActivity')}
                            />
                        </Grid>
                    </Grid>
                }

            </Paper>
    </>
  )
}
