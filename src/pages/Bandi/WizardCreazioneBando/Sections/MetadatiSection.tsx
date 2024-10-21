import React from 'react'
import { Paper, Grid, Typography } from '@mui/material'
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField'
import { FieldErrors, UseFormRegister } from 'react-hook-form'


type Props = {
    register: UseFormRegister<any>;
    className: string;
    control: any;
    errors: FieldErrors<any>
    selectValues?: any
}

export const MetadatiSection = (props: Props) => {
    const {className, control, errors, selectValues, register } = props

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Metadati</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>

                    <Grid padding={'0 1rem'} item xs={12} md={6} >
                        <Custom_Select2
                            placeholder='Seleziona A.O.O...'
                            control={control}
                            name='aoo'
                            options={selectValues.aoo}
                            label='A.O.O'
                            isClearable
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6} >
                        <Custom_Select2
                            control={control}
                            name='classeAddizionale'
                            options={selectValues!.classi_documentali}
                            label='Classe Addizionale'
                            placeholder='Seleziona classe Addizionale...'

                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12}>
                        <Custom_TextField
                            {...register('tagDocumento')}
                            label='Tag documento (min 2 e max 20 caratteri)'
                            placeholder='Inserisci tag...'
                            backgroundColor='#fff'
                        />
                    </Grid>

                </Grid>
            </Paper>
        </>
    )
}
