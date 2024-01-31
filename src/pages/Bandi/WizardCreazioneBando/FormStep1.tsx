import { Divider, Grid, Paper, Typography } from '@mui/material'
import { Custom_TextField } from '../../../components/partials/Inputs/CustomITextField';
import  Custom_Select  from '../../../components/partials/Inputs/Custom_Select';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

const options = {
    select1: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    select2: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    aoo: [
        { value: '1', label: 'NUOVA AOO' },
    ],
    adc: [
        { value: '1', label: 'Archivio corrente' },
    ]
}
//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione
type Props = {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>
    className: string;
}

export const FormStep1 = (props: Props) => {
    const { register, errors, className } = props;
    //requisiti di validazione per campo
    const validations = {
        titolario: {
            required: 'il titolario è obbligatorio'
        }
    }

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Nuovo Bando</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>

                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        <Custom_TextField
                            {...register('classe-documentale')}
                            label='Classe Documentale'
                            defaultValue={'Bandi di Gara'}
                            readOnly
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        <Custom_Select
                            {...register('titolario', validations.titolario)}
                            options={options.select1}
                            label='Titolario' 
                            defaultValue={''}
                            error={!!errors.titolario}
                            errorMessage={errors?.titolario?.message as string}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12}>
                        <Custom_Select
                            {...register('tipologia-esperto')}
                            options={options.select2}
                            label='Tipologia Esperto'
                            defaultValue={''}
                        />
                    </Grid>

                </Grid>

                <Divider />

                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Informazioni Generali</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_TextField
                            {...register('anno-di-riferimento')}
                            label='Anno di Riferimento'
                            defaultValue={'2024'}
                            readOnly

                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select
                            {...register('a-o-o')}
                            options={options.aoo}
                            label='A.O.O'
                            defaultValue={'1'}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select
                            {...register('archivio-di-collocazione')}
                            options={options.adc}
                            label='Archivio di Collocazione'
                            defaultValue={'1'}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select
                            {...register('classe-addizionale')}
                            options={options.select2}
                            label='Classe addizionale'
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12}>
                        <Custom_TextField
                            {...register('descrizione-estesa')}
                            multiline
                            minRows={4}
                            label='Descrizione estesa/oggetto'
                            placeholder='Scrivi un eventuale descrizione estesa...'
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12}>
                        <Custom_TextField 
                            {...register('tag-documento')} 
                            label='Tag documento (min. 2 max. 20 caratteri)' 
                            placeholder='Inserisci tag...' 
                        />
                    </Grid>

                </Grid>
            </Paper>
        </>
    )
}
