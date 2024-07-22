import { Divider, Grid, Paper, Typography } from '@mui/material'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { FieldErrors, UseFormRegister, UseFormUnregister } from 'react-hook-form';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { useEffect, useState } from 'react';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { TipologiaEspertoRow } from '../../../SettingsPage/types';
import { selectOrganizzaDocumentoSelect } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { useSelector } from 'react-redux';





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




export const FormStep1 = (props: FormStepProps) => {
    const { register, errors, className, control, setState} = props;
    //requisiti di validazione per campo
  

//valori per select Tipologia Esperto select
const [TEspMenuItems, setTEspMenuItems] = useState<Option[] | []>([])

    useEffect(() => {
        if(TEspMenuItems.length === 0){
            retrieveTEspOptions()
        }
    }, [])

    const retrieveTEspOptions = async () => {
        await AXIOS_HTTP.Retrieve({ sService: 'READ_TIPOLOGIA_ESPERTO', sModule: 'IMPOSTAZIONI_GET_ALL_TIPOLOGIE_ESPERTO', url: '/api/launch/retrieve', body: null })
            .then((res) => {
                let optionsArr: any = []
                const TEspArr: TipologiaEspertoRow[] = res.response;
                const onlyVisTEsp = TEspArr.filter((tipologia) => tipologia.TEspVis === true);
                onlyVisTEsp.forEach(element => optionsArr.push({value:element.TEspId, label:element.TEspBr, id:element.TEspId}));
                setTEspMenuItems(optionsArr)
            })
            .catch((err) => console.log(err))

    }
    const options = useSelector(selectOrganizzaDocumentoSelect);

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Nuovo Bando</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>
                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        <Custom_Select2
                          options={[{value:0, label:'Bandi di gara'}]}
                          disabled
                          defaultValue={{value:0, label:'Bandi di gara'}}
                          control={control}
                          name='classeDocumentale'
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
                          onChangeSelect={(newValue) => { 
                            console.log(newValue)
                            setState!(newValue ? newValue.id : null)}}
                          isRequired
                        />
                    </Grid>

                </Grid>

                <Divider />

                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Informazioni Generali</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                    <Custom_Select2
                          options={[{value:'2024', label:'2024'}]}
                          disabled
                          control={control}
                          defaultValue={{value:'2024', label:'2024'}}
                          name='anno'
                          label='Anno di riferimento'
                        />
                     
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            placeholder='Seleziona A.O.O...'
                            control={control}
                            name='aoo'
                            options={options!.aoo}
                            label='A.O.O'
                            isClearable
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            placeholder='Seleziona Archivio di Collocazione...'
                            control={control}
                            name='archivioCollocazione'
                            options={options!.archivi}
                            defaultValue={options!.archivi[0]}
                            label='Archivio di Collocazione'
                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={3}>
                        <Custom_Select2
                            control={control}
                            name='classeAddizionale'
                            options={options!.classi_documentali}
                            label='Classe Addizionale'
                            placeholder='Seleziona classe Addizionale...'

                        />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12}>
                        <Custom_TextField
                            {...register('descrizioneEstesa')}
                            multiline
                            minRows={4}
                            label='Descrizione estesa/oggetto'
                            placeholder='Scrivi un eventuale descrizione estesa...'
                            backgroundColor='#fff'
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
