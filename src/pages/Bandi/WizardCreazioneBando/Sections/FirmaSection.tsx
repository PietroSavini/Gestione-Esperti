import React from 'react'
import { SingleValue } from 'react-select'
import { Custom_Select2, Option } from  '../../../../components/partials/Inputs/Custom_Select2';
import { Grid, Paper, Typography } from '@mui/material';
import { FieldErrors } from 'react-hook-form';


type Params = {
    openSection : React.Dispatch<React.SetStateAction<boolean>>;
    isOpen : boolean;
    className: string;
    control:any;
    errors: FieldErrors<any>
}

export const FirmaSection = (params:Params) => {

    const { openSection, isOpen, className, control, errors } = params;
    
    const validations = {
        titolario: {
            required: 'il titolario è obbligatorio'
        }
    };

    const firmaOptions = {
        daFirmare: [
            { value: '0', label: 'si' },
            { value: '1', label: 'no' },

        ],
        tipoFirma: [
            { value: '0', label: 'Firma Digitale Pades' },
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
        gruppoFirmatario: [
            { value: '0', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
        utenteFirmatario: [
            { value: '0', label: 'Seleziona Utente' },
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
        scadenza: [
            { value: '0', label: '12/01/2025' }
        ]
    };

    const handleFirmaChange = (opt:SingleValue<Option>) => {
        if(opt?.value === '0'){
            openSection(true)
            return
        }
        openSection(false) 
    }
  return (
    <>
         <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Firma</Typography>
                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select2
                            onChange={(e)=> handleFirmaChange(e)}
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
                                defaultValue={firmaOptions.tipoFirma[0]}
                                name='firma-tipo-firma'
                                placeholder='Seleziona tipo Firma...'
                                disabled={!isOpen}
                                
                            />
                        </Grid>

                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            <Custom_Select2
                                label={'Seleziona Gruppo Firmatario'}
                                options={firmaOptions.gruppoFirmatario}
                                defaultValue={firmaOptions.gruppoFirmatario[0]}
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
                                defaultValue={firmaOptions.utenteFirmatario[0]}
                                control={control}
                                name='firma-utente-firmatario'
                                placeholder='seleziona utente firmatario...'
                                disabled={!isOpen}
                            />
                        </Grid>

                        <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                            DatePicker
                        </Grid>
                    </Grid>
                }

            </Paper>
    </>
  )
}
