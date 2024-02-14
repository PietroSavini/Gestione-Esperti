import { Divider, Grid, Paper, Typography } from '@mui/material'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';

const validations={

  select2:{
    required:'il campo è obbligatorio'
  }
}

const options = {
    select1:[
        {value:'0', label:'Bandi di Gara'}
    ],
    select2: [
        { value: 'option1', label: 'Option 1', icon:'home' },
        { value: 'option2', label: 'Option 2' }
    ],
    select3: [
        { value: '0', label: '2024' },
       
    ],
    aoo: [
        { value: '1', label: 'NUOVA AOO' },
    ],
    adc: [
        { value: '1', label: 'Archivio corrente' },
    ],
    ca: [
      { value: '1', label: 'Archivio corrente' },
  ],
    
}
//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione
export type FormStepProps = {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>
    className: string;
    control?:any
}

export const FormStep1 = (props: FormStepProps) => {
    const { register, errors, className, control } = props;
    //requisiti di validazione per campo
  
const handleChange = (selectedOption:any) => {
  console.log('handleChange',selectedOption);
}

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Nuovo Bando</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>
                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        <Custom_Select2
                          options={options.select1}
                          disabled
                          defautValue={options.select1[0].value}
                          control={control}
                          name='classe-documentale'
                          label='Classe Documentale'
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        {/* da implementare select */}

                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12}>
                        <Custom_Select2 
                          placeholder='Seleziona Tipologia Esperto...' 
                          label='Tipologia Esperto' 
                          name={'ciaone'} 
                          control={control} 
                          error={!!errors.ciaone} 
                          errorMessage={errors.ciaone?.message as string} 
                          options={options.select2}
                          validations={validations.select2}
                          
                        />
                    </Grid>

                </Grid>

                <Divider />

                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Informazioni Generali</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                    <Custom_Select2
                          options={options.select3}
                          disabled
                          defautValue={options.select3[0].value}
                          control={control}
                          name='anno'
                          label='Anno di riferimento'
                        />
                     
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            placeholder='Seleziona A.O.O...'
                            control={control}
                            name='a-o-o'
                            options={options.aoo}
                            label='A.O.O'
                            defautValue={options.aoo[0].value}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            placeholder='Seleziona Archivio di Collocazione...'
                            control={control}
                            name='archivio-di-collocazione'
                            options={options.adc}
                            label='Archivio di Collocazione'
                            defautValue={options.adc[0].value}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            control={control}
                            name='classe-addizionale'
                            options={options.ca}
                            label='Classe Addizionale'
                            defautValue={options.adc[0].value}
                            placeholder='Seleziona classe Addizionale...'
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
