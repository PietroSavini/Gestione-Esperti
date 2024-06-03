import { Box, Grid, Paper, Switch, Typography } from '@mui/material'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormUnregister, useForm } from 'react-hook-form';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { DatePicker } from '@mui/x-date-pickers';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { OrganizzaDocumentoSelect } from '../../../../app/store/Slices/organizzaDocumentoSlice';


type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    control: any;
    unregister?: UseFormUnregister<any>;
    errors: FieldErrors<any>
    className?: string;
    selectValues?: any;
    register: UseFormRegister<any>;
}
export const PubblicaAlbo_Section = (props: Props) => {
    const { isOpen, setIsOpen, className, control, errors, selectValues, register } = props;



    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Pubblica su albo on-line</Typography>
                    <Switch onClick={() => setIsOpen(!isOpen)} value={isOpen} />
                </Box>
                {isOpen &&
                    <Box>
                        <Grid container marginBottom={'1.5rem'}>
                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3}>
                                <Custom_Select2
                                    placeholder='Scegli dove pubblicare il documento'
                                    validations={{ required: 'il campo è obbligatorio' }}
                                    options={[]}
                                    label='Pubblica Documento in'
                                    isRequired

                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3} alignItems={'center'} justifyContent={'center'} display={'flex'}>
                                <Typography fontWeight={600} fontSize={'.9rem'} sx={{ color: '#127aa3ff' }}>Diritto all' Oblio</Typography>
                                <Switch />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3}>
                                inizio affissione
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6} lg={3} >
                                fine affissione
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid padding={'0 1rem'} item xs={12} md={6}>
                                <Custom_TextField
                                    backgroundColor='#fff'
                                    placeholder='Scrivi il nominativo del richiedente'
                                    {...register('pubblicazione_albo_richiedente', { required: 'il richiedente è obbligatorio' })}
                                    label='Richiedente'
                                    isRequired
                                    error={!!errors.pubblicazione_albo_richiedente}
                                    errorMessage={errors.pubblicazione_albo_richiedente?.message as string}
                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_Select2
                                    placeholder='Seleziona un ufficio...'
                                    validations={{ required: 'il campo è obbligatorio' }}
                                    options={selectValues.uffici}
                                    label='Ufficio (UDR)'

                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_TextField
                                    backgroundColor='#fff'
                                    placeholder='Scrivi il nominativo del destinatario...'
                                    label='Destinatario'
                                    {...register('destinatario')}
                                />
                            </Grid>

                            <Grid item padding={'0 1rem'} xs={12} md={6}>
                                <Custom_TextField
                                    backgroundColor='#fff'
                                    {...register('pubblicazione_albo_oggetto', { required: "l'oggetto è obbligatorio" })}
                                    placeholder="Scrivi l'oggetto della pubblicazione"
                                    label='Oggetto'
                                    isRequired
                                    error={!!errors.pubblicazione_albo_oggetto}
                                    errorMessage={errors.pubblicazione_albo_oggetto?.message as string}
                                />
                            </Grid>
                        </Grid>

                        <Box padding={'0 1rem'} marginBottom={'1.5rem'}>
                            <Custom_TextField
                                {...register('descrizione_addizionale')}
                                backgroundColor='#fff'
                                label='Descrizione addizionale'
                                minRows={3}
                                multiline
                                placeholder='digita un eventuale descrizione estesa...'
                            />
                        </Box>

                        <Grid container  >
                            <Grid padding={'0 1rem'} item xs={12} md={6}>
                                <Custom_Select2
                                    options={selectValues.utenti}
                                    label="Utente a cui asseggnare l'attività"
                                    placeholder='seleziona un utente...'

                                />
                            </Grid>
                            <Grid padding={'0 1rem'} item xs={12} md={6}>
                                <Custom_Select2
                                    options={selectValues.gruppo_utenti}
                                    label="Gruppo utenti a cui assegnare l'attività"
                                    placeholder='Seleziona utenti...'
                                />
                            </Grid>
                        </Grid>

                        <Box padding={'0 1rem'} marginBottom={'1.5rem'}>
                            <Custom_TextField
                                backgroundColor='#fff'
                                label='Note libere attività'
                                minRows={2}
                                multiline
                            />
                        </Box>
                    </Box>
                }

            </Paper>
        </>
    )
}
