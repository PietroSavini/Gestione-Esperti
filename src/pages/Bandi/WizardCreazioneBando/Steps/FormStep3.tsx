import { Box, Divider, Grid, Paper, Switch, Typography } from '@mui/material'
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Custom_Select from '../../../../components/partials/Inputs/Custom_Select';

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

export const FormStep3 = (props: FormStepProps) => {
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
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Collega ad un archivio</Typography>
                <Grid container>
                    <Grid padding={'0 1rem'} item xs={12} md={6} lg={3}>
                
                    </Grid>
                </Grid>
            </Paper>
        
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Fascicoli elettronici collegati</Typography>
            </Paper>

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Collega altri documenti</Typography>
                </Box>
            </Paper>

            

        </>
    )
}