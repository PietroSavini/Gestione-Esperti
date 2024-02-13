import { Divider, Grid, Paper, Typography } from '@mui/material'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import  Custom_Select  from '../../../../components/partials/Inputs/Custom_Select';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import  SelectThree  from '../../../../components/partials/Inputs/SelectThree';
import Select from 'react-select';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';

const validations={

  select2:{
    required:'il campo è obbligatorio'
  }
}

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
    ],
    selectThree:[
        {
          "label": "Campo 1",
          "children": [
            { "label": "Opzione 1.1" },
            { "label": "Opzione 1.2" }
          ]
        },
        {
          "label": "Campo 2",
          "children": [
            { "label": "Opzione 2.1" },
            { "label": "Opzione 2.2" }
          ]
        },
        {
          "label": "Campo 3",
          "children": [
            { "label": "Opzione 3.1" },
            { "label": "Opzione 3.2" }
          ]
        },
        {
          "label": "Campo 4",
          "children": [
            { "label": "Opzione 4.1" },
            { "label": "Opzione 4.2" }
          ]
        },
        {
          "label": "Campo 5",
          "children": [
            { "label": "Opzione 5.1" },
            { "label": "Opzione 5.2" }
          ]
        },
        {
          "label": "Campo 6",
          "children": [
            { 
              "label": "Opzione 6.1",
              "children": [
                { "label": "Opzione 6.1.1" },
                { "label": "Opzione 6.1.2" }
              ]
            },
            { 
              "label": "Opzione 6.2",
              "children": [
                { "label": "Opzione 6.2.1" },
                { "label": "Opzione 6.2.2" }
              ]
            }
          ]
        }
      ]
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
                        <Custom_TextField
                            {...register('classe-documentale')}
                            label='Classe Documentale'
                            value='Bandi di Gara'
                            readOnly
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        {/* da implementare select */}

                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12}>
                        <Custom_Select2 
                          placeholder='Seleziona Tipologia Esperto...' 
                          defautValue={options.select2[0].value} 
                          label='Tipologia Esperto' name={'ciaone'} 
                          control={control} error={!!errors.ciaone} 
                          errorMessage={errors.ciaone?.message as string} 
                          options={options.select2} validations={validations.select2}
                          
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
