import { Box, Grid, Paper, Switch, Typography } from '@mui/material';
import React from 'react'
import { FieldErrors, UseFormUnregister } from 'react-hook-form';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';


type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    control: any;
    unregister?: UseFormUnregister<any>;
    errors: FieldErrors<any>
    className?:string
}

export const AmministrazioneTrasparente_Section = (props : Props) => {

    const {isOpen, setIsOpen, className, control, errors} = props;

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
                                validations={{required:'il campo è obbligatorio'}} 
                                options={[]} 
                                label='Pubblica documento in'
                                isRequired
                                
                            />
                        </Box>

                        <Box marginBottom={'1rem'} padding={'0 1rem'} >
                            <Custom_TextField multiline minRows={2} label='Annotazioni non visibili in pubblicazione' placeholder='Scrivi eventuali annotazioni...' />
                        </Box>
                        <Grid container marginBottom={'1.5rem'}>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_Select2 label="Utente a cui assegnare l'attività" options={[]} placeholder='Seleziona utente ...'/>
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_Select2 label="Grupo utenti a cui assegnare l'attività" options={[]} placeholder='Seleziona gruppo ...'/>
                            </Grid>


                        </Grid>
                        <Box padding={'0 1rem'}>
                            <Custom_TextField multiline minRows={1} label='note libere attività' placeholder='' />
                        </Box>
                        
                    </Box> 
                }
            </Paper>
    </>
  )
}
