import { Divider, Grid, Paper, Typography } from '@mui/material'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';

import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormUnregister } from 'react-hook-form';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { useEffect, useState } from 'react';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { TipologiaEspertoRow } from '../../../SettingsPage/types';

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
    control?:any;
    fn?:any;
    unregister?:UseFormUnregister<any>;
    setState?:React.Dispatch<React.SetStateAction<any>>;
    data?:any
}

type SelectOptions = {
    name:string,
    options:Option[]
}[]


export const FormStep1 = (props: FormStepProps) => {
    const { register, errors, className, control, setState } = props;
    //requisiti di validazione per campo
  
const handleChange = (selectedOption:any) => {
  console.log('handleChange',selectedOption);
}
//valori per select Tipologia Esperto select
const [TEspOptions, setTEspOptions] = useState<TipologiaEspertoRow[] | []>([])
const [TEspMenuItems, setTEspMenuItems] = useState<Option[] | []>([])

    useEffect(() => {
       retrieveTEspOptions()
    }, [])

    useEffect(() => {
       console.log('menu items per tipologia esperto: ', TEspMenuItems)
     }, [TEspMenuItems])

    const retrieveTEspOptions = async () => {
        await AXIOS_HTTP.Retrieve({ sService: 'READ_TIPOLOGIA_ESPERTO', sModule: 'IMPOSTAZIONI_GET_ALL_TIPOLOGIE_ESPERTO', url: '/api/launch/retrieve', body: null })
            .then((res) => {
                let optionsArr: any = []
                const TEspArr: TipologiaEspertoRow[] = res.response;
                const onlyVisTEsp = TEspArr.filter((tipologia) => tipologia.TEspVis === true);
                onlyVisTEsp.forEach(element => optionsArr.push({value:element.TEspBr, label:element.TEspBr, id:element.TEspId}));
                setTEspMenuItems(optionsArr)
            })
            .catch((err) => console.log(err))

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
                          defaultValue={options.select1[0]}
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
                          name={'TEsp'} 
                          control={control} 
                          error={!!errors.TEsp} 
                          errorMessage={errors.TEsp?.message as string} 
                          options={TEspMenuItems}
                          validations={{required:'il campo è obbligatorio'}}
                          onChangeSelect={(newValue) => setState!(newValue?.id)}
                          isRequired
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
                          defaultValue={options.select3[0]}
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
                            defaultValue={options.aoo[0]}
                            isClearable
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            placeholder='Seleziona Archivio di Collocazione...'
                            control={control}
                            name='archivio-di-collocazione'
                            options={options.adc}
                            label='Archivio di Collocazione'
                            defaultValue={options.adc[0]}
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            control={control}
                            name='classe-addizionale'
                            options={options.ca}
                            label='Classe Addizionale'
                            defaultValue={options.adc[0]}
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
