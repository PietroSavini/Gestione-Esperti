import { Grid, Paper, Typography } from '@mui/material';
import React from 'react'
import { SingleValue } from 'react-select';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';

type Params = {
    openSection : React.Dispatch<React.SetStateAction<boolean>>;
    isOpen : boolean;
    className: string;
    control:any;
}

export const ProtocollazioneSection = (params:Params) => {
    const {openSection, isOpen, className, control} = params;

    const handleProtocolloChange = (opt:SingleValue<Option>) => {
        if(opt?.value === '0'){
            openSection(true)
            return
        }
        openSection(false)
        
    }
    
    const ProtocollazioneOptions = {
        daProtocollare: [
            { value: '0', label: 'si' },
            { value: '1', label: 'no' },

        ],
        tipoProtocollo: [
            { value: '0', label: 'In Entrata' },
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
        gruppo: [
           
            { value: '0', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
        utente: [
        
            { value: '0', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
    }

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
                                />
                            </Grid>

                            <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                                <Custom_Select2
                                    label={"Utente a cui assegnare l'attività"}
                                    options={ProtocollazioneOptions.utente}
                                    control={control}
                                    name='protocollo-utente-assegnato'
                                />
                            </Grid>

                            <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                                <Custom_Select2
                                    label={"Gruppo di utenti a cui assegnare l'attività"}
                                    options={ProtocollazioneOptions.gruppo}
                                    control={control}
                                    name='protocollo-gruppo-utenti-assegnati'  
                                />
                            </Grid>
                        </>
                    }
                    </Grid>
            </Paper>

    </>
  )
}
