import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import AXIOS_HTTP from '../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { Avatar, Box, Button, Dialog, Divider, Icon, MobileStepper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { FormStep1 } from './Steps/FormStep1';
import { FormStep2 } from './Steps/FormStep2';
import { FormStep3 } from './Steps/FormStep3';
import { ActionButton } from '../../../components/partials/Buttons/ActionButton';
import { Requisito_Table } from '../../SettingsPage/types';
import { convertData, createOptionArray } from '../../SettingsPage/functions';
import { FormStep4 } from './Steps/FormStep4';
import { FormStep5 } from './Steps/FormStep5';
import { useWizardBandoContext } from './WizardBandoContext';
import { useAppDispatch, useAppSelector } from '../../../app/ReduxTSHooks';
import { ListePub, PubblicazioniSelect, setPubblicazioniData, setPubblicazioniSelect } from '../../../app/store/Slices/pubblicazioneSlice';
import { Liste, OrganizzaDocumentoSelect, selectOrganizzaDocumentoSelect, setOrganizzaDocumentoData, setOrganizzaDocumentoSelect } from '../../../app/store/Slices/organizzaDocumentoSlice';

type Params = {
    close: () => void;
    isOpen: boolean
}

type PunteggiFinali = {
    reqId: number | null;
    puntVal: number | null;
}

export type AttList = {
    actionId: number, // -> id
    actionDesc: string; // descrizione attività
    ActionDett: string; // dettaglio es(UPLOAD_DOC) -> value
    actionName: string; // lable attività -> lable
};

export const WizardBando4 = (params: Params) => {
    const { close, isOpen } = params;
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const selectValues = useAppSelector(selectOrganizzaDocumentoSelect);
    //react Hook Forms
    const { register, handleSubmit, trigger, formState, control, watch, unregister } = useForm<any>();
    const { errors } = formState;
    const [activeStep, setActiveStep] = useState(0);
    //-----------------------variabili di state che servono per invio form finale.-----------------------------------------//
    //variabile di State per sezione "archivio collegato"
    const { archivioCollegato } = useWizardBandoContext().archivi
    //variabile di State per TipologiaEsperto
    const [TEsp, setTEsp] = useState<number | null>(null);
    //variabile di State per salvataggio punteggi (già formattati)
    const [punteggi, setPunteggi] = useState<Requisito_Table[] | []>([]);
    //punteggi da inviare alla fine 
    const [punteggiFinali, setPunteggiFinali] = useState<PunteggiFinali[] | []>([]);
    //dati nel conext wizardBando
    const context = useWizardBandoContext();
    const procedimento = context.attivita.listaAttivita;
    const fascicoliSelezionati = context.fascicoli.fascicoliSelezionati;

    //funzione per chiamare i punteggi e salvarli nello state
    async function GET_ALL_PUNTEGGI_COLLEGATI(id: number) {
        console.log(id)
        await AXIOS_HTTP.Retrieve({ url: '/api/launch/retrieve', sService: 'READ_PUNTEGGI', sModule: 'IMPOSTAZIONI_GET_ALL_PUNTEGGI', body: { TEspId: id } })
            .then((resp) => {
                console.log(resp)
                const allPunteggi = convertData(resp.response);
                console.log('PUNTEGGI COLLEGATI: ', allPunteggi);
                setPunteggi(allPunteggi);
            })
    };
    //watcher per poter caricare il bando senza errori o crash

    //useEffect che utilizzo per chiamare i punteggi collegati alla tipologiaEsperto e salvarli per mostrarli nel 4o step
    useEffect(() => {
        if (TEsp) {
            GET_ALL_PUNTEGGI_COLLEGATI(TEsp);
        }
        if (TEsp === undefined || null && punteggi.length > 0) {
            setPunteggi([]);
            console.log('punteggi cancellati', punteggi);
        }
    }, [TEsp]);

    useEffect(() => {
        //funzione che prende i punteggi e li traduce in array di oggetti da mandare con form
        let resultArr: any = [];
        punteggi.map((item) => {
            const firstItem = {
                reqId: item.fi_ee_req_id,
                puntVal: 0
            }
            resultArr.push(firstItem)
            if (item.requisiti_list.length > 0) {
                item.requisiti_list.map((sottoItem) => {
                    const sottoReq = {
                        reqId: sottoItem.fi_ee_req_id,
                        puntVal: sottoItem.fi_ee_req_punteggio
                    }
                    resultArr.push(sottoReq)
                })
            }
        })
        console.log('PUNTEGGI DA INVIARE CON CREAZIONE DEL BANDO: ', resultArr)
        setPunteggiFinali(resultArr)
    }, [punteggi])

    const dispatch = useAppDispatch();
    //-----------------------------------------------------------------------CHIAMATE PER VALORI DELLE SELECT----------------------------------------------------------------------------------------------------
    //CHIAMATE PER INIZIALIZZARE L'APPLICAZIONE
    //CHIAMATA PER INIZIALIZZARE I DATI CHE VERRANNO DATI ALLE SELECT PER L APPLICAZIONE

    async function GET_DATA() {
        let OrganizzaDocumentoObj: OrganizzaDocumentoSelect = {
            aoo: [],
            archivi: [],
            assegnatari: [],
            classi_documentali: [],
            gruppo_utenti: [],
            modelli_procedimento: [],
            tipi_attivita: [],
            titolari: [],
            utenti_firmatari: []
        };

        let PubblicazioniObj: PubblicazioniSelect = {
            trasparenza: [],
            uffici: [],
            atti: [],
            bacheche: [],
            anagrafiche: []
        };

        try {
            const requests = [
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_AOO2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_ARCHIVI2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_CLASSI_DOCUMENTALE2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_ASSEGNATARI2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_GRUPPI_UTENTI2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_UTENTI_FIRMA_DIGITALE2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_UTENTI_TIPI_ATTIVITA2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_MODELLI_PROCEDIMENTO2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_TITOLARI2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_UFFICI2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_TIPI_ANAGRAFICHE2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_TIPI_ATTO2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_SEZIONI_TRASPARENZA2', sService: 'READ_DOCUMENTI', body: {} }),
                AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_ATTI_BACHECHE2', sService: 'READ_DOCUMENTI', body: {} }),
            ];

            const responses = await Promise.all(requests);

            const listeDoc: Liste = {
                lista_aoo: responses[0].response,
                lista_archivi: responses[1].response,
                lista_classi_documentali: responses[2].response,
                lista_assegnatari:responses[3].response,
                lista_gruppo_utenti: responses[4].response,
                lista_utenti_firmatari: responses[5].response,
                lista_modelli_procedimento: responses[6].response,
                lista_tipi_attivita: responses[7].response,
                lista_titolari: responses[8].response,
            }; 

            const listePub: ListePub = {
                sezioni_trasparenza_list: responses[9].response,
                lista_tipi_anagrafica: responses[10].response,
                lista_tipi_atto: responses[11].response,
                lista_tipi_atto_bacheche: responses[12].response,
                lista_uffici: responses[13].response
            };

            OrganizzaDocumentoObj.aoo = createOptionArray({ arr: responses[0].response, value: 'id', label: 'descrizione' });
            OrganizzaDocumentoObj.archivi = createOptionArray({ arr: responses[1].response, value: 'dossier_id', label: 'dossier_name' });
            OrganizzaDocumentoObj.classi_documentali = createOptionArray({ arr: responses[2].response, value: 'type_id', label: 'type_name' });
            OrganizzaDocumentoObj.assegnatari = createOptionArray({ arr: responses[3].response, value: 'fgId', label: 'fsAssigneeUser' });
            OrganizzaDocumentoObj.gruppo_utenti = createOptionArray({ arr: responses[4].response, value: 'id', label: 'groupName' });
            OrganizzaDocumentoObj.utenti_firmatari = createOptionArray({ arr: responses[6].response, value: 'user_id', label: 'utente' });
            OrganizzaDocumentoObj.tipi_attivita = createOptionArray({ arr: responses[7].response, value: 'actionId', label: 'actionName' });
            OrganizzaDocumentoObj.modelli_procedimento = createOptionArray({ arr: responses[8].response, value: 'pm_id', label: 'pm_ext_desc' });
            OrganizzaDocumentoObj.titolari = createOptionArray({ arr: responses[9].response, value: 'id', label: 'descrizione' });
            PubblicazioniObj.uffici = createOptionArray({ arr: responses[10].response, value: 'id', label: 'descrizione' });
            PubblicazioniObj.anagrafiche = createOptionArray({ arr: responses[11].response, value: 'id', label: 'descrizione' });
            PubblicazioniObj.atti = createOptionArray({ arr: responses[12].response, value: 'id', label: 'descrizione' });
            PubblicazioniObj.trasparenza = createOptionArray({ arr: responses[13].response, value: 'id', label: 'name' });
            PubblicazioniObj.bacheche = createOptionArray({ arr: responses[14].response, value: 'Key', label: 'Value' });

            dispatch(setOrganizzaDocumentoData(listeDoc))
            dispatch(setPubblicazioniData(listePub))
            dispatch(setOrganizzaDocumentoSelect(OrganizzaDocumentoObj));
            dispatch(setPubblicazioniSelect(PubblicazioniObj));

        } catch (error) {
            console.error("Error fetching data: ", error);
        }

    };



    //eseguo chiamate di inizializzazione dati
    useEffect(() => {
        if (isOpen) {
            GET_DATA();
        }

    }, [isOpen]);

    useEffect(() => {
        if (selectValues) {
            setIsLoaded(true)
        } else {
            setIsLoaded(false)
        }
    }, [selectValues])



    //steps (x stepper MUI)
    const steps = [
        {
            label: 'Dati Generali e metadati',
            isCurrentStep: true,
            isStepCompleted: false
        },
        {
            label: 'Attività',
            isCurrentStep: false,
            isStepCompleted: false
        },
        {
            label: 'Arch. e fascicolazione',
            isCurrentStep: false,
            isStepCompleted: false
        },
        {
            label: 'Requisiti e punteggio',
            isCurrentStep: false,
            isStepCompleted: false
        },
        {
            label: 'Riepilogo',
            isCurrentStep: false,
            isStepCompleted: false
        },
    ];


    //funzione che gestisce validazione degli step e logica per prossimo step !**PULSANTE 'AVANTI', NON SUBMIT**!
    const handleNextStep = async (params: string[]) => {
        console.log('validazione :', params)
        const result = await trigger(params)
        console.log(result)
        if (!result) return result;
        setActiveStep((prev) => prev + 1)
        return true
    }

    //funzione di submit
    const submitWizard = (data: any) => {
        setActiveStep(0)
        close()
        //struttura dati riformattati
        const dataToSubmit = {
            documento: { ...data },
            requisiti: punteggiFinali,
            procedimento: [...procedimento],
            linkFascicoliId: [...fascicoliSelezionati],
            archivioCollegato: archivioCollegato
        };

        AXIOS_HTTP.Execute({ url: '/api/launch/execute', sService: 'WRITE_BANDI', sModule: 'INSERT_BANDO', body: dataToSubmit })
            .then((res) => {
                console.log(res);
            })
            .catch(err => console.error(err));
    }

    //se si vuole si possono inserire gli array di stringhe 
    const formStep1Validation: string[] = ['TEsp'];
    const formStep2Validations: string[] = ['scadenza', 'pubblicazione_albo_richiedente', 'pubblicazione_albo_oggetto', 'bacheche_istituzionali_pubblica_documento', 'amministrazione_trasparente_pubblica_documento', "protocollazione_oggetto"];
    const formStep3Validations: string[] = ['responsabile']

    const ValidateAndGoNext = () => {
        switch (activeStep) {
            case 0:
                //stringhe messe manualmente o array di strighe preparati prima
                handleNextStep(formStep1Validation)
                break;

            case 1:
                handleNextStep(formStep2Validations)
                break;

            case 2:
                setActiveStep((prev) => prev + 1)
                break;

            case 3:
                setActiveStep((prev) => prev + 1)
                break;
            case 4:
                handleNextStep(formStep3Validations);
                break;
        }
    }


    return (
        <>
            {
                isLoaded === true && isOpen === true && selectValues &&

                <Dialog className='modello-creazione-bando' fullScreen onClose={close} open={isOpen} keepMounted={false}>
                    <Box className={'creazione-bando-header'}>
                        <Box width={'90%'} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                            <Typography variant='h6' fontWeight={600}>Crea nuovo Bando</Typography>
                            <Avatar sx={{ height: '30px', width: '30px', marginLeft: '5rem' }}></Avatar>
                        </Box>
                        <Box width={'10%'} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                            <Button onClick={() => close()} sx={{ color: 'black' }} ><Icon>close</Icon></Button>
                        </Box>
                        <Divider />
                    </Box>

                    <Box className={'creazione-bando-body'}  >
                        {/*---------------------------------------- STEPPER ------------------------------------------------*/}
                        <Box className={'stepper-container'} sx={{ padding: '0.5rem .5rem' }} >
                            {/* MOBILE STEPPER XS+ */}
                            <Box className={'mobile-stepper'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                <MobileStepper
                                    sx={{ margin: '0 1.5rem' }}
                                    variant='dots'
                                    steps={steps.length}
                                    position='static'
                                    activeStep={activeStep}
                                    backButton={<></>}
                                    nextButton={<></>}
                                />
                                <Typography textAlign={'center'} fontWeight={600}>{steps[activeStep].label}</Typography>
                            </Box>

                            {/* NORMAL STEPPER MD + */}
                            <Box className={'stepper'}>
                                <Stepper sx={{ margin: '0 1.5rem' }} activeStep={activeStep} orientation='vertical' >
                                    {steps.map((step, index) => (
                                        <Step key={index} >
                                            <StepLabel>
                                                {step.label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>
                        </Box>

                        {/*-----------------------------------------FINE STEPPER ------------------------------------------------*/}
                        {/*------------------------------------------------------------------------------------------------------*/}
                        {/*-------------------------------------FORM + NAVIGATION------------------------------------------------*/}

                        <Box className={'form-container'} >
                            {/* form con logica per visualizzare i form */}
                            <Box component={'form'} noValidate onSubmit={handleSubmit(submitWizard)}>
                                <Box className={'ms_form-group'}>
                                    {/* qui vanno renderizzati i vari form input in base agli steps */}
                                    <FormStep1 className={`${activeStep !== 0 && 'd-none'}`} register={register} errors={errors} control={control} setState={setTEsp} />
                                    <FormStep2 className={`${activeStep !== 1 && 'd-none'}`} register={register} errors={errors} control={control} fn={watch} unregister={unregister} />
                                    <FormStep3 className={`${activeStep !== 2 && 'd-none'}`} register={register} errors={errors} />
                                    <FormStep4 className={`${activeStep !== 3 && 'd-none'}`} register={register} errors={errors} data={punteggi} setState={setPunteggi} TEspId={TEsp} />
                                    <FormStep5 className={`${activeStep !== 4 && 'd-none'}`} register={register} errors={errors} control={control} />
                                </Box>

                                {/* mobile navigation xs -> md */}
                                <Box sx={{ padding: '.5rem 1rem', borderTop: '1px solid #efefef', backgroundColor: '#fafbffff' }} className={'mobile-navigation'} textAlign={'center'} >
                                    <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}><Icon>chevron_left</Icon></Button>
                                    {activeStep === steps.length - 1 &&
                                        <ActionButton type='submit' text='Crea Bando' color='secondary'>Submit</ActionButton>
                                    }
                                    <Button disabled={activeStep === steps.length - 1} onClick={ValidateAndGoNext}><Icon>chevron_right</Icon></Button>
                                </Box>
                                {/* END Mobilie navigation */}

                                {/* Navigation md -> xl */}
                                <Box className='navigation' >
                                    <Box className='cancel-button'>
                                        <ActionButton color='error' text='Annulla' icon='cancel' onClick={() => close()} />
                                    </Box>
                                    <Box display={'flex'} gap={'.5rem'} justifyContent={'flex-end'} width={'50%'}>
                                        <ActionButton onClick={() => setActiveStep((prev) => prev - 1)} disabled={activeStep === 0} color='primary' text='Indietro' icon='chevron_left' direction={'row-reverse'} />
                                        {activeStep === steps.length - 1 &&
                                            <ActionButton type='submit' color='secondary' icon='save' text='Crea Bando' />
                                        }

                                        {activeStep !== steps.length - 1 &&
                                            <ActionButton onClick={ValidateAndGoNext} color='primary' text='avanti' icon='chevron_right' />
                                        }
                                    </Box>
                                </Box>
                                {/* End Navigation */}
                            </Box>
                        </Box>
                        {/*---------------------------------FINE FORM -----------------------------------------------*/}
                    </Box>

                </Dialog>
            }
        </>
    )
}
