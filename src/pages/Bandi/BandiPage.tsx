import  { useState } from 'react'
import { ActionButton } from '../../components/partials/Buttons/ActionButton'
import { Avatar, Box, Button, Dialog, Divider, Icon, MobileStepper, Step, StepLabel, Stepper, Typography } from '@mui/material'
import './BandiPage.scss'
import { FormStep1 } from './WizardCreazioneBando/FormStep1'
import { useForm } from 'react-hook-form'


export const BandiPage = () => {
    const [isOpen, setOpenModal] = useState<boolean>(false)
    const closeModal = () => {
        setOpenModal(false)
    }

    //tutto da aggiungere nel modal creazione bando in componente separato
    interface FormData {
        classeDocumentale: string;
        titolario: string;
        tipologiaEsperto: string;
        annoRiferimento: string;
        aoo: string;
        archivioCollocazione: string;
        classeAddizionale: string;
        descrizioneEstesa: string;
        tagDocumento: string;
        
    }
    //react Hook Forms
    const { register, handleSubmit, trigger, formState } = useForm<any>();
    const { errors } = formState;
    const [activeStep, setActiveStep] = useState(0);    
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
    ]

    const handleNextStep = async (params:string[]) => {
        const result = await trigger(params)
        if(!result) return
        setActiveStep((prev) => prev +1)
    }

    const ValidateAndGoNext = () => {
        switch (activeStep){
            case 0:
                //valido primo form
                handleNextStep(['titolario'])
            break;

            case 1:

            break;

            case 2:

            break;

            case 3:

            break;

            case 4:
                //triggero ultima validazione
                //se passa submitto il form
            break;
        }
    }

  return (
    <>
        <div>Pagina dei Bandi</div>
        <ActionButton color='secondary' text='Crea nuovo Bando' onClick={() => setOpenModal(true)}  />
        <Dialog className='modello-creazione-bando' fullScreen onClose={closeModal} open={isOpen}>
            <Box className={'creazione-bando-header'}>
                <Box width={'90%'} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                    <Typography variant='h6' fontWeight={600}>Crea nuovo Bando</Typography>
                    <Avatar sx={{height:'30px', width:'30px', marginLeft:'5rem'}}></Avatar>
                </Box>
                <Box width={'10%'} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                    <Button onClick={closeModal} sx={{color:'black'}} ><Icon>close</Icon></Button>
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
                    <Box component={'form'}>
                        <Box className={'ms_form-group'}>
                            {/* qui vanno renderizzati i vari form input in base agli steps */}
                            <FormStep1 className={`${activeStep !== 0 && 'd-none'}`} register={register} errors={errors}/>
                        </Box>

                        {/* mobile navigation xs -> md */}
                        <Box sx={{padding:'.5rem 1rem', borderTop:'1px solid #efefef', backgroundColor:'#fafbffff'}} className={'mobile-navigation'} textAlign={'center'} >
                            <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev)=> prev -1)}><Icon>chevron_left</Icon></Button>
                            {activeStep === steps.length -1 &&                       
                                <ActionButton type='submit' text='Crea Bando' color='secondary'>Submit</ActionButton>
                            }
                            <Button disabled={activeStep === steps.length -1} onClick={() => setActiveStep((prev)=> prev +1)}><Icon>chevron_right</Icon></Button>
                        </Box>
                        {/* END Mobilie navigation */}

                        {/* Navigation md -> xl */}
                        <Box className='navigation' >
                            <Box className='cancel-button'>
                                <ActionButton color='error' text='Annulla' icon='cancel' onClick={closeModal}/>
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
