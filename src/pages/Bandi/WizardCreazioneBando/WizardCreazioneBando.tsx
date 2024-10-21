import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import AXIOS_HTTP from '../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { Avatar, Box, Button, Divider, Icon, MobileStepper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { FormStep1 } from './Steps/FormStep1';
import { FormStep2 } from './Steps/FormStep2';
import { FormStep3 } from './Steps/FormStep3';
import { ActionButton } from '../../../components/partials/Buttons/ActionButton';
import { convertData } from '../../SettingsPage/functions';
import { FormStep5 } from './Steps/FormStep5';
import { useWizardBandoContext } from './WizardBandoContext';
import { closeLoader, openLoader } from '../../../app/store/Slices/loaderSlice';
import Loader from '../../../components/partials/Loader/Loader';
import dayjs from 'dayjs';
import { AttivitaObj, DocumentoData } from './WizardCreazioneBando_types';
import { useAppDispatch } from '../../../app/ReduxTSHooks';

export const WizardCreazioneBando = () => {
    //react Hook Forms
    const { register, handleSubmit, trigger, formState, control, watch, unregister } = useForm<any>();
    const { errors } = formState;
    const [activeStep, setActiveStep] = useState(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    //-----------------------variabili di state che servono per invio form finale.-----------------------------------------//
    //variabile di State per sezione "archivio collegato"
    //variabile di State per TipologiaEsperto
    const [TEsp, setTEsp] = useState<number | null>(null);

    //punteggi da inviare alla fine 
    //dati nel conext wizardBando
    const context = useWizardBandoContext();
    const { archivioCollegato } = context.archivi
    const procedimento = context.attivita.listaAttivita;
    const fascicoliSelezionati = context.fascicoli.fascicoliSelezionati;
    const selectValues = context.selectOptions;
    const { punteggi, setPunteggi } = context.punteggi;
    const { requisitiPunteggi, setRequisitiPunteggi } = context.requisitiPunteggiList;
    //dispatcher azione redux per loader
    const dispatch = useAppDispatch();

    //funzione per chiamare i punteggi e salvarli nello state
    async function GET_ALL_PUNTEGGI_COLLEGATI(id: number) {
        await AXIOS_HTTP.Retrieve({ url: '/api/launch/retrieve', sService: 'READ_PUNTEGGI', sModule: 'IMPOSTAZIONI_GET_ALL_PUNTEGGI', body: { TEspId: id } })
            .then((resp) => {
                const allPunteggi = convertData(resp.response);
                setRequisitiPunteggi(allPunteggi);
            })
    };

    //all avvio apro il loader
    useEffect(() => {
        dispatch(openLoader());
    }, []);

    //watcher per poter caricare il bando senza errori o crash
    useEffect(() => {
        if (selectValues && selectValues.organizzaDocumentoSelectValues && selectValues.pubblicazioniSelectValues) {
            setIsLoaded(true);
        }
    }, [selectValues]);

    //watcher per verificare se il il wizard ha finito la fase di inizializzazione chiudendo il loader
    useEffect(() => {
        if (!isLoaded) return;
        dispatch(closeLoader());
    }, [isLoaded]);

    //watcher che utilizzo per chiamare i punteggi collegati alla tipologiaEsperto e salvarli per mostrarli nel 4o step
    useEffect(() => {
        if (TEsp) {
            GET_ALL_PUNTEGGI_COLLEGATI(TEsp);
        };
        if (TEsp === undefined || null && punteggi.length > 0) {
            setRequisitiPunteggi([]);
        };
    }, [TEsp]);

    //watcher che controlla la lista dei requisiti e punteggi e li traduce in array di oggetti da mandare con submit
    

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
            label: 'Riepilogo',
            isCurrentStep: false,
            isStepCompleted: false
        },
    ];


    //funzione che gestisce validazione degli step e logica per prossimo step !**PULSANTE 'AVANTI', NON SUBMIT**!
    const handleNextStep = async (params: string[]) => {
        const result = await trigger(params)
        if (!result) return result;
        setActiveStep((prev) => prev + 1)
        return true
    }

    // funzione che riprende l'array dei procedimenti, controlla gli oggetti che hanno i parametri delle date (oggetti date di dayjs) e li formatta in YYYY/MM/DD per il database.
    function formatDatesOfAttivitaObjArray(arr: AttivitaObj[]) {

        return arr.map(obj => {
            const formattedObj = { ...obj }; // Crea una copia dell'oggetto originale
            if (obj.scadenza) {
                formattedObj.scadenza = dayjs(obj.scadenza).format('YYYY/MM/DD');
            }
            if (obj.fdDataAffissioneInizio) {
                formattedObj.fdDataAffissioneInizio = dayjs(obj.fdDataAffissioneInizio).format('YYYY/MM/DD');
            }
            if (obj.fdDataAffissioneFine) {
                formattedObj.fdDataAffissioneFine = dayjs(obj.fdDataAffissioneFine).format('YYYY/MM/DD');
            }

            return formattedObj; // Restituisce l'oggetto con le date formattate
        });
    }

    //funzione di submit
    const submitWizard = (data: DocumentoData) => {
        setActiveStep(0)
        const documentoData: DocumentoData = {
            TEsp: data.TEsp ? data.TEsp : null,
            anno: data.anno ? data.anno : null,
            aoo: data.aoo ? data.aoo : null,
            archivioCollocazione: data.archivioCollocazione ? data.archivioCollocazione : null,
            classeAddizionale: data.classeAddizionale ? data.classeAddizionale : null,
            classeDocumentale: data.classeDocumentale ? data.classeDocumentale : null,
            descrizioneEstesa: data.descrizioneEstesa ? data.descrizioneEstesa : null,
            responsabile: data.responsabile ? data.responsabile : null,
            tagDocumento: data.tagDocumento ? data.tagDocumento : null,
        }
        //struttura dati riformattati
        const dataToSubmit = {
            documento: { ...documentoData },
            requisiti: punteggi,
            procedimento: formatDatesOfAttivitaObjArray(procedimento), // funzione per formattare le date contenute negli oggetti
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

    //const selectOptions = useAppSelector(selectOrganizzaDocumentoSelect)
    return (
        <>
            {isLoaded &&

                <Box className='modello-creazione-bando' height={'100%'}>
                    <Box className={'creazione-bando-header'}>
                        <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
                            <Typography variant='h6' fontWeight={600}>Crea nuovo Bando</Typography>
                            <Avatar sx={{ height: '30px', width: '30px', marginLeft: '5rem' }}></Avatar>
                        </Box>
                        <Divider />
                    </Box>

                    <Box className={'creazione-bando-body'} >
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
                                {
                                    isLoaded ? (
                                        <Box className={'ms_form-group'}>
                                            {/* qui vanno renderizzati i vari form input in base agli steps */}
                                            <FormStep1 className={`${activeStep !== 0 && 'd-none'}`} register={register} errors={errors} control={control} setState={setTEsp} TEspId={TEsp} />
                                            <FormStep2 className={`${activeStep !== 1 && 'd-none'}`} register={register} errors={errors} control={control} fn={watch} unregister={unregister} />
                                            <FormStep3 className={`${activeStep !== 2 && 'd-none'}`} register={register} errors={errors} />
                                            <FormStep5 className={`${activeStep !== 3 && 'd-none'}`} register={register} errors={errors} control={control} />
                                        </Box>
                                    ) : (
                                        <Loader />
                                    )
                                }

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
                                    <Box display={'flex'} gap={'.5rem'} justifyContent={'flex-end'} width={'100%'}>
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

                </Box>
            }
        </>
    )
}
