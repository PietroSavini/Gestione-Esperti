import React, { useEffect, useState } from 'react'
import { SingleValue } from 'react-select'
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { Grid, Paper, Typography } from '@mui/material';
import { FieldErrors } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { useWizardBandoContext } from '../WizardBandoContext';
import dayjs from 'dayjs';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import useDebounce from '../../../../app/Hooks/useDebounceHook';
import { Custom_DatePicker } from '../../../../components/partials/Inputs/Custom_DatePicker';
import { DatePicker } from '@mui/x-date-pickers';
import { AttivitaObj } from '../WizardCreazioneBando_types';

type Params = {
    openSection: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    className: string;
    control: any;
    errors: FieldErrors<any>
    selectValues?: any
};

export const FirmaSection = (params: Params) => {

    const { openSection, isOpen, className, selectValues } = params;

    const firmaOptions = {
        daFirmare: [
            { value: 0, label: 'si' },
            { value: 1, label: 'no' },
        ],
        tipoFirma: [
            { value: 0, label: 'Firma digitale Pades', },
            { value: 1, label: 'Firma digitale Cades', },
            { value: 2, label: 'Firma digitale Xades', },
            { value: 3, label: 'Firma Grafometrica', }
        ],
        gruppoFirmatario: selectValues!.gruppo_utenti,
        utenteFirmatario: selectValues!.utenti_firmatari,

    };
    const organizzaDocumentoListe = useWizardBandoContext().listeOrganizzaDocumento;
    const FIRMA_D = organizzaDocumentoListe?.lista_tipi_attivita.find((item) => item.actionDett === "FIRMA_D");
    const FIRMA_G = organizzaDocumentoListe?.lista_tipi_attivita.find((item) => item.actionDett === "FIRMA_G");
    const newId = uuid();
    const today = dayjs();
    const [id] = useState<string>(newId);
    const [tipoFirma] = useState<Option>(firmaOptions.tipoFirma[0]);
    //dati WizardBandoContext
    const attivita = useWizardBandoContext().attivita;
    const { listaAttivita, setListaAttivita } = attivita;
    //states per datepiker
    const [firmaScadenza, setFirmaScadenza] = useState(today);
    //watcher per creare l'oggetto attività firma e modificarlo in live
    useEffect(() => {
        if (isOpen) {
            //check per non duplicare attività
            if (listaAttivita.some((item) => item.Id === id)) return;

            const initialObj: AttivitaObj = {
                Id: id,
                delete: false,
                daFirmare: true,
                scadenza: today,
                tipoFirma: tipoFirma.value as number,
                gruppoUtenti: null, //gruppo firmatario
                utente: null, //utente firmatario
                posizione: listaAttivita.length,
                ...FIRMA_D
            };
            setListaAttivita(prev => [...prev, initialObj]);
        }

        if (!isOpen) {
            //console.log("'firma' deselezionato, rimuovo l'attività dalla lista")
            const firmaRemovedActivityList = listaAttivita.filter((item) => item.Id !== id);
            setListaAttivita(firmaRemovedActivityList);
        };
    }, [isOpen]);

    //handlers
    const handleFirmaChange = (newValue: SingleValue<Option>) => {
        if (newValue?.value === 0) {
            openSection(true);
            return;
        };
        openSection(false);
    };

    const handleChange = useDebounce((newValue: any, field: string,) => {
        const value = newValue.value;
        const activity = listaAttivita.find(item => item.Id === id);
        switch (field) {
            case 'fiTipoFirma':
                if (value !== 3) {
                    const newActivity: AttivitaObj = {
                        ...activity!,
                        tipoFirma: value as number,
                    };
                    setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item));
                } else {
                    const newActivity: AttivitaObj = {
                        ...activity!,
                        tipoFirma: value as number,
                        ...FIRMA_G
                    };
                    setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity : item));
                };
                break;

            case 'gruppo-firmatario':

                const newActivity: AttivitaObj = {
                    ...activity!,
                    gruppoUtenti: value
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

            case 'fsDescriptionOfUserActivity':

                const newActivity2: AttivitaObj = {
                    ...activity!,
                    descrizioneAttivitaUtente: newValue
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity2 : item));
                break;

            case "scadenza":

                const date = dayjs(newValue);
                const isDateBeforeToday1 = dayjs(date).isBefore(dayjs(today));
                if (isDateBeforeToday1) {
                    console.log('data di scadenza non valida ');
                    return;
                }
                setFirmaScadenza(newValue);
                const newActivity3: AttivitaObj = {
                    ...activity!,
                    scadenza: date
                };
                setListaAttivita(listaAttivita.map((item) => item.Id === id ? newActivity3 : item));
                break;
        };

    }, 200);

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Firma</Typography>
                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select2
                            onChangeSelect={(newValue) => handleFirmaChange(newValue)}
                            label={'Da firmare ?'}
                            options={firmaOptions.daFirmare}
                            defaultValue={firmaOptions.daFirmare[1]}
                        />

                    </Grid>
                </Grid>
                {isOpen &&

                    <Grid container className={isOpen ? '' : 'd-none'}>
                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            <Custom_Select2
                                label={'Tipo Firma'}
                                options={firmaOptions.tipoFirma}
                                value={tipoFirma}
                                defaultValue={firmaOptions.tipoFirma[0]}
                                onChangeSelect={(newValue) => handleChange(newValue, 'fiTipoFirma')}
                                name='firmaTipoFirma'
                                placeholder='Seleziona tipo Firma...'
                                disabled={!isOpen}

                            />
                        </Grid>

                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            <Custom_Select2
                                label={'Seleziona Gruppo Firmatario'}
                                options={firmaOptions.gruppoFirmatario}
                                onChangeSelect={(newValue) => handleChange(newValue, 'gruppo-firmatario')}
                                placeholder='Seleziona gruppo firmatario...'
                                disabled={!isOpen}

                            />
                        </Grid>

                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            <Custom_Select2
                                label={'Seleziona utente Firmatario'}
                                options={firmaOptions.utenteFirmatario}
                                onChangeSelect={(newValue) => handleChange(newValue, 'utente-firmatario')}
                                placeholder='seleziona utente firmatario...'
                                disabled={!isOpen}
                            />
                        </Grid>

                        <Grid item padding={'0 1rem'} xs={12} md={6} lg={3}>
                            <Custom_DatePicker
                                disablePast
                                sx={{ backgroundColor: '#fff' }}
                                label='scadenza'
                                onChange={(e) => handleChange(e, 'scadenza')}
                             
                                value={firmaScadenza}
                            />

                        </Grid>
                        <Grid item padding={'0 1rem'} xs={12}>
                            <Custom_TextField
                                backgroundColor='#fff'
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
};
