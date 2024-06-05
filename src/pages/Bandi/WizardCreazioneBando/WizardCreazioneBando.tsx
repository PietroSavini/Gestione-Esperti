import  { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import AXIOS_HTTP from '../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { Avatar, Box, Button, Dialog, Divider, Icon, MobileStepper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { FormStep1 } from './Steps/FormStep1';
import { FormStep2 } from './Steps/FormStep2';
import { FormStep3 } from './Steps/FormStep3';
import { ActionButton } from '../../../components/partials/Buttons/ActionButton';
import { Requisito_Table } from '../../SettingsPage/types';
import { convertData } from '../../SettingsPage/functions';
import { FormStep4 } from './Steps/FormStep4';
import { FormStep5 } from './Steps/FormStep5';


type Params = {
    close: () => void;
    isOpen: boolean
}

export type AttivitaObj = {
    Id:string | number;
    delete:boolean; //true se è componente che è cancellabile 
    posizione:number;
    actionDett:string;
    actionId:string|number;
    actionDesc:string;
    actionName:string;
    fdMaxDateExecution?: string | number | null;
    fiExtimatedDuration?: number | string | null;
    fiGruppoId?: string | number | null;
    fiUserId?: number | null;
    fsDescriptionOfUserActivity?:string | null;
    fiProcessOwnerId?: string |number | null;
    fsOggetto?:string | null,
}

export type AttList = {
    actionId:number, // -> id (value?)
    actionDesc:string; // descrizione attività
    ActionDett:string; // dettaglio es(UPLOAD_DOC)  (value?)
    actionName:string; // lable attività -> lable
};


export const WizardCreazioneBando = (params:Params) => {
    const {close, isOpen} = params
    //react Hook Forms
    const { register, handleSubmit, trigger, formState, control, watch, unregister } = useForm<any>();
    const { errors } = formState;
    const [activeStep, setActiveStep] = useState(0);    
    //-----------------------variabili di state che servono per invio form finale.-----------------------------------------//
    //variabile di State per sezione "archivio collegato"
    const [archivioCollegato, setArchivioCollegato] = useState<string|null>(null)
    //variabile di State per TipologiaEsperto
    const [TEsp, setTEsp] = useState<string|number|undefined>(undefined);
    //variabile di State per salvataggio punteggi (già formattati)
    const [punteggi, setPunteggi] = useState<Requisito_Table[]|[]>([]);
    //variabile di state per procedimenti (lista attività)
    const [procedimenti, setProcedimenti] = useState<AttivitaObj[]|[]>([])
    // Dati contennuti nello store Redux, i dati sono raw e vanno processati per renderli compatibili con le selecttramite funzione apposita;
   
    //funzione per chiamare i punteggi e salvarli nello state
    async function GET_ALL_PUNTEGGI_COLLEGATI (id:string|number) {
        await AXIOS_HTTP.Retrieve({url:'/api/launch/retrieve', sService:'READ_PUNTEGGI', sModule:'IMPOSTAZIONI_GET_ALL_PUNTEGGI', body:{TEspId:id}})
            .then((resp)=>{
                const allPunteggi = convertData(resp.response) ;
                console.log('PUNTEGGI COLLEGATI: ',allPunteggi );
                setPunteggi(allPunteggi);
            })
    };

    //useEffect che utilizzo per chiamare i punteggi collegati alla tipologiaEsperto e salvarli per mostrarli nel 4o step
    useEffect(() => {
        if(TEsp){
            GET_ALL_PUNTEGGI_COLLEGATI(TEsp);
        }
        if(TEsp === undefined || null && punteggi.length > 0){
            setPunteggi([]);
            console.log('punteggi cancellati', punteggi);
        }
    }, [TEsp]);
    
    //steps (x stepper MUI)
    const steps = [
        {
            label:'Dati Generali e metadati',
            isCurrentStep: true,
            isStepCompleted:false
        },
        {
            label:'Attività',
            isCurrentStep: false,
            isStepCompleted:false
        },
        {
            label:'Arch. e fascicolazione',
            isCurrentStep: false,
            isStepCompleted:false
        },
        {
            label:'Requisiti e punteggio',
            isCurrentStep: false,
            isStepCompleted:false
        },
        {
            label:'Riepilogo',
            isCurrentStep: false,
            isStepCompleted:false
        },
    ];


    //funzione che gestisce validazione degli step e logica per prossimo step !**PULSANTE 'AVANTI', NON SUBMIT**!
    const handleNextStep = async (params:string[]) => {
        console.log('validazione :' , params)
        const result = await trigger(params)
        console.log(result)
        if(!result) return result;
        setActiveStep((prev) => prev +1)
        return true
    }

    //funzione di submit
    const submitWizard = (data:any) => {
        setActiveStep(0)
        close()
        
        //********************* */
        const submittedData = {...data, 
            requisiti: punteggi,
            
        } //struttura dati da creare successivamente 
        console.log('form Inviato: ', submittedData)
        //******************** */

        //chiamata a WebService
    }

    //se si vuole si possono inserire gli array di stringhe 
    const formStep1Validation: string[] = ['TEsp'];
    const formStep2Validations: string[] = ['scadenza','pubblicazione_albo_richiedente','pubblicazione_albo_oggetto','bacheche_istituzionali_pubblica_documento','amministrazione_trasparente_pubblica_documento'];
    const formStep3Validations: string[] = ['responsabile']

    const ValidateAndGoNext = () => {
        switch (activeStep){
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
        <Dialog className='modello-creazione-bando' fullScreen onClose={close} open={isOpen}>
            <Box className={'creazione-bando-header'}>
                <Box width={'90%'} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                    <Typography variant='h6' fontWeight={600}>Crea nuovo Bando</Typography>
                    <Avatar sx={{height:'30px', width:'30px', marginLeft:'5rem'}}></Avatar>
                </Box>
                <Box width={'10%'} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                    <Button onClick={() => close()} sx={{color:'black'}} ><Icon>close</Icon></Button>
                </Box>
                <Divider/>
            </Box>

            <Box className={'creazione-bando-body'}  >
                {/*---------------------------------------- STEPPER ------------------------------------------------*/}
                <Box className={'stepper-container'} sx={{padding:'0.5rem .5rem'}} >
                    {/* MOBILE STEPPER XS+ */}
                    <Box className={'mobile-stepper'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <MobileStepper 
                            sx={{margin:'0 1.5rem'}}
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
                        <Stepper sx={{margin:'0 1.5rem'}} activeStep={activeStep} orientation='vertical' >
                            {steps.map((step,index)=>(
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
                                <FormStep2 className={`${activeStep !== 1 && 'd-none'}`} register={register} errors={errors} control={control} fn={watch} unregister={unregister}/>
                                <FormStep3 className={`${activeStep !== 2 && 'd-none'}`} register={register} errors={errors} setArchivio={setArchivioCollegato}/>
                                <FormStep4 className={`${activeStep !== 3 && 'd-none'}`} register={register} errors={errors} data={punteggi} setState={setPunteggi} TEspId={TEsp}/>
                                <FormStep5 className={`${activeStep !== 4 && 'd-none'}`} register={register} errors={errors} control={control} data={procedimenti} setState={setProcedimenti} />
                            </Box>

                            {/* mobile navigation xs -> md */}
                            <Box sx={{padding:'.5rem 1rem', borderTop:'1px solid #efefef', backgroundColor:'#fafbffff'}} className={'mobile-navigation'} textAlign={'center'} >
                                <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev)=> prev -1)}><Icon>chevron_left</Icon></Button>
                                {activeStep === steps.length -1 &&                       
                                    <ActionButton type='submit' text='Crea Bando' color='secondary'>Submit</ActionButton>
                                }
                                <Button disabled={activeStep === steps.length -1} onClick={ValidateAndGoNext}><Icon>chevron_right</Icon></Button>
                            </Box>
                            {/* END Mobilie navigation */}

                            {/* Navigation md -> xl */}
                            <Box className='navigation' >
                                <Box className='cancel-button'>
                                    <ActionButton color='error' text='Annulla' icon='cancel' onClick={() => close()}/>
                                </Box>
                                <Box display={'flex'} gap={'.5rem'} justifyContent={'flex-end'} width={'50%'}>
                                    <ActionButton  onClick={() => setActiveStep((prev) => prev -1)} disabled={activeStep === 0} color='primary' text='Indietro' icon='chevron_left' direction={'row-reverse'}/>
                                    {activeStep === steps.length -1 && 
                                        <ActionButton type='submit' color='secondary' icon='save' text='Crea Bando' />
                                    }

                                    {activeStep !== steps.length -1 && 
                                        <ActionButton onClick={ValidateAndGoNext} color='primary' text='avanti' icon='chevron_right'/>
                                    }
                                </Box>
                            </Box>
                            {/* End Navigation */}
                        </Box>
                    </Box>
                
                {/*---------------------------------FINE FORM + NAVIGATION------------------------------------------------*/}    
            </Box>
            
        </Dialog>
    </>
  )
}
