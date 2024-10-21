import { Divider, Grid, Paper, Typography } from '@mui/material'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { FieldErrors, UseFormRegister, UseFormUnregister } from 'react-hook-form';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { useEffect, useState } from 'react';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { TipologiaEspertoRow } from '../../../SettingsPage/types';
import { useWizardBandoContext } from '../WizardBandoContext';
import { RequisitiPunteggiSection } from '../Sections/RequisitiPunteggiSections';

//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione
export type FormStepProps = {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    className: string;
    control?: any;
    fn?: any;
    unregister?: UseFormUnregister<any>;
    setState?: React.Dispatch<React.SetStateAction<any>>;
    data?: any;
    TEspId?: number | null;
}

export const FormStep1 = (props: FormStepProps) => {
    const { register, errors, className, control, setState, TEspId} = props;
    //valori per select Tipologia Esperto select
    const [TEspMenuItems, setTEspMenuItems] = useState<Option[] | []>([])
    //const [TEspId, setTEspId] = useState<number | null>(null)
    const [selectableRequAndPunteggi, setSelectableReqAndPunteggi] = useState<Option[] | []>([])

    //chiamata per prendere i valori della select di TipologiaEsperto
    const GET_ALL_TESP = async () => {
        await AXIOS_HTTP.Retrieve({ sService: 'READ_TIPOLOGIA_ESPERTO', sModule: 'IMPOSTAZIONI_GET_ALL_TIPOLOGIE_ESPERTO', url: '/api/launch/retrieve', body: null })
            .then((res) => {
                let optionsArr: any = []
                const TEspArr: TipologiaEspertoRow[] = res.response;
                const onlyVisTEsp = TEspArr.filter((tipologia) => tipologia.TEspVis === true);
                onlyVisTEsp.forEach(element => optionsArr.push({ value: element.TEspId, label: element.TEspBr, id: element.TEspId }));
                setTEspMenuItems(optionsArr)
            })
            .catch((err) => console.log(err))

    }
    //chiamata per valori della select in "Collega Requisito +" ed aggiunta dei punteggi collegati alla tipologia esperto per farli visualizzare da subito
    const GET_REQUISITI_FOR_DIALOG_SELECT = async () => {
        await AXIOS_HTTP.Retrieve({ sService: 'READ_REQUISITI', sModule: 'IMPOSTAZIONI_GET_REQUISITI_MASTER', body: { TEspId: TEspId }, url: '/api/launch/retrieve' })
            .then((resp) => {
                const arrOfItems = resp.response;
                let finalArray: Option[] = [];
                arrOfItems.forEach((element: any) => {
                    const newFormat: Option = {
                        value: element.fs_ee_req_desc,
                        label: element.fs_ee_req_desc,
                        id: element.fi_ee_req_id,
                    };
                    finalArray.push(newFormat);
                });
                setSelectableReqAndPunteggi(finalArray)
            })
    };

    //all'inizializzazione del componente chiamo GET_ALL_TESP per visualizzare le tipologie esperto selezionabili dalla select
    useEffect(() => {
        if (TEspMenuItems.length === 0) {
            GET_ALL_TESP()
        };
    }, []);

    //watcher per TEspId che al cambio (se non null | undefined) esegue la chiamata per i valori della select del dialog di collega requisiti
    useEffect(() => {
        if (TEspId) {
            GET_REQUISITI_FOR_DIALOG_SELECT()
        }
    }, [TEspId])

    const options = useWizardBandoContext().selectOptions.organizzaDocumentoSelectValues

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Informazioni Generali</Typography>
                <Grid container sx={{ marginBottom: '1rem' }}>
                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        <Custom_Select2
                            placeholder='Seleziona Tipologia Esperto...'
                            label='Tipologia Esperto'
                            name={'TEsp'}
                            control={control}
                            error={!!errors.TEsp}
                            errorMessage={errors.TEsp?.message as string}
                            options={TEspMenuItems}
                            validations={{ required: 'il campo è obbligatorio' }}
                            onChangeSelect={(newValue) => {
                                setState!(newValue ? newValue.id : null)
                            }
                            }
                            isRequired
                        />

                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} md={6}>
                        {/* da implementare select */}
                        <Custom_Select2 options={options?.titolari} label='Titolario' placeholder='seleziona titolario...' />
                    </Grid>

                    <Grid padding={'0 1rem'} item xs={12} lg={6}>
                        <Custom_Select2
                            options={[{ value: 0, label: 'Bandi di gara' }]}
                            disabled
                            defaultValue={{ value: 0, label: 'Bandi di gara' }}
                            control={control}
                            name='classeDocumentale'
                            label='Classe Documentale'
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

                </Grid>

                <Divider />


                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Requisiti e punteggi</Typography>

                <RequisitiPunteggiSection selectOptions={selectableRequAndPunteggi} TEspId={TEspId} />

            </Paper>

        </>
    )
}
