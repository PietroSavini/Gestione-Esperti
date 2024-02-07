import { Box, Grid, Paper, Switch,Typography } from '@mui/material'
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Custom_Select from '../../../../components/partials/Inputs/Custom_Select';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { itIT } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/it';
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
export type FormStepProps = {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>
    className: string;
}

export const FormStep2 = (props: FormStepProps) => {
    const { register, errors, className } = props;
    //requisiti di validazione per campo
    const validations = {
        titolario: {
            required: 'il titolario è obbligatorio'
        }
    }

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
            { value: '0', label: 'Seleziona Gruppo' },
            { value: '1', label: 'Option 1' },
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
            { value: '0', label: 'Seleziona Gruppo' },
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
        utente: [
            { value: '0', label: 'Seleziona Utente' },
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ],
    }

    return (
        <>
            {/* -------------------------------FIRMA--------------------------------------------------------- */}
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Firma</Typography>
                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={'Da firmare ?'}
                            options={firmaOptions.daFirmare}
                            defaultValue={'0'}
                        />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={'Tipo Firma'}
                            options={firmaOptions.tipoFirma}
                            defaultValue={'0'}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={'Seleziona Gruppo Firmatario'}
                            options={firmaOptions.gruppoFirmatario}
                            defaultValue={'0'}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={'Seleziona utente Firmatario'}
                            options={firmaOptions.utenteFirmatario}
                            defaultValue={'0'}

                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <LocalizationProvider adapterLocale='it' dateAdapter={AdapterDayjs} localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
                            {/* da provare con mobile datepicker, forse è più adatto */}
                            <MobileDatePicker
                                disablePast
                                views={['day', 'month', 'year']}
                                label='Scadenza'
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

            </Paper>
            {/* -----------------------------------------FIRMA----------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------- */}
            {/* -------------------------------------PROTOCOLLO---------------------------------------------- */}

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Protocollazione</Typography>
                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={'Da Protocollare ?'}
                            options={ProtocollazioneOptions.daProtocollare}
                            defaultValue={'0'}

                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={'Tipo Protocollo'}
                            options={ProtocollazioneOptions.tipoProtocollo}
                            defaultValue={'0'}

                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={"Utente a cui assegnare l'attività"}
                            options={ProtocollazioneOptions.utente}
                            defaultValue={'0'}

                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                        <Custom_Select
                            label={"Gruppo di utenti a cui assegnare l'attività"}
                            options={ProtocollazioneOptions.gruppo}
                            defaultValue={'0'}

                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* -------------------------------------PROTOCOLLO---------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------- */}
            {/* -------------------------------------SWITCHES------------------------------------------------ */}

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Pubblica su albo on-line</Typography>
                    <Switch {...register('albo-on-line')}/>
                </Box>
            </Paper>

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Amministrazione trasparente</Typography>
                    <Switch {...register('amministrazione-transparente')}/>
                </Box>
            </Paper>

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Bacheche istituzionali</Typography>
                    <Switch {...register('Bacheche-istituzionali')} />
                </Box>
            </Paper>

        </>
    )
}
