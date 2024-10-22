import { Box, Typography, Grid, Paper } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import AXIOS_HTTP from "../../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import { ActionButton } from "../../../../components/partials/Buttons/ActionButton";
import { Custom_AsyncSelect } from "../../../../components/partials/Inputs/Custom_AsyncSelect";
import { Custom_Select2 } from "../../../../components/partials/Inputs/Custom_Select2";
import { FascicoloSvg } from "../../../../components/partials/svg/FascicoloSvg";
import { convertData } from "../../../SettingsPage/functions";
import { useWizardBandoContext } from "../WizardBandoContext";

export type FascicoloElettronico = {
    id: string;
    fascicolo_nr: number;
    fascicolo_id: number;
    title: string;
    date: string;
    value: string;
    label: string;
    fiEFNumberSottofascicolo?: number;
    fiEFNumberInserto?: number;
    childrens?: FascicoloElettronico[] | [];
    level?: number;
    isSottofascicolo?: boolean;
}

type FascicoloSelezionatoRowTypes = {
    item: FascicoloElettronico;
    displayFascicoliSelezionati: FascicoloElettronico[];
    setDisplayFascicoliSelezionati: React.Dispatch<React.SetStateAction<FascicoloElettronico[]>>;
    fascicoliSelezionati: number[];
    setFascicoliSelezionati: React.Dispatch<React.SetStateAction<number[]>>;
    defaultOptionsSottoFascicoli: FascicoloElettronico[] | [];
    fascicoloElettronicoSelezionato: FascicoloElettronico | null;
}

//funzione che chiama il webservice per fare la ricerca dei fascicoli in base alla stringa passata
async function GET_FASCICOLI(inputValue: string) {
    return await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_LISTA_FASCICOLI', sService: 'READ_DOCUMENTI', body: { search: inputValue } })
        .then((res) => {
            const response: FascicoloElettronico[] = res.response.lista_fascicoli.map((item: any, index: number) => ({
                id: index,
                fascicolo_id: item.fiId,
                fascicolo_nr: item.fiEFNumber,
                date: item.fdEFDate,
                title: item.fsEFSubject,
                value: item.fiId,
                label: `n. ${item.fiEFNumber} del ${dayjs(item.fdEFDate).format('DD/MM/YYYY')} - ${item.fsEFSubject}`
            }));
            return response;
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
}
//funzione triggerata dalla select che ritorna un oggetto type = FascicoloElettronico
async function loadOptions(inputValue: string, callback: any) {
    if (!inputValue || inputValue.length < 3) {
        callback([]);
        return;
    };
    const data = await GET_FASCICOLI(inputValue);
    callback(data);
}

const FascicoloSelezionatoRow = (props: FascicoloSelezionatoRowTypes) => {
    const { displayFascicoliSelezionati, setDisplayFascicoliSelezionati, item, fascicoliSelezionati, setFascicoliSelezionati, defaultOptionsSottoFascicoli, fascicoloElettronicoSelezionato } = props;
    const fascicoloElettronicoInitialState = fascicoloElettronicoSelezionato; // in ogni caso prendo il fascicolo elettronico selezionato in quanto servirà sia in caso l'item è un fascicolo elettronico che se un sottofascicolo o inserto
    const sottofascicoloInitialState = item.isSottofascicolo ? item : null;
    const fascicoloNr = item.fascicolo_id;
    const fascicoloDate = item.date;
    const [editMode, setEditMode] = useState<boolean>(false);
    const [fascicoloSelezionato, setFascicoloSelezionato] = useState<FascicoloElettronico | null>(fascicoloElettronicoInitialState);
    const [sottoFascicoloSelezionato, setSottoFascicoloSelezionato] = useState<FascicoloElettronico | null>(sottofascicoloInitialState);
    const [error, setError] = useState<string | undefined>(undefined);
    const [sottofascicoli, setSottofascicoli] = useState<FascicoloElettronico[]>(defaultOptionsSottoFascicoli);

    const onFascicoloChange = async (newValue: SingleValue<any>) => {
        setError(undefined);
        const fascicolo: FascicoloElettronico = newValue;
        setFascicoloSelezionato(fascicolo);
        //faccio chiamata per vedere se ci sono sottofascicoli/inserti per il fascicolo selezionato
        const tempSottofascicoli = await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_SOTTOFASCICOLI_INSERTI', sService: 'READ_DOCUMENTI', body: { idFascicolo: newValue.value } })
            .then((res) => {
                //array temporaneo di sottofascicoli ed inserti che poi vanno processati dalla funzione che crea la struttura ad albero
                const tempSottofascicoliAndInserti = res.response.lista_sottofascicoli_inserti;
                const convertedData = convertData(tempSottofascicoliAndInserti);
                return convertedData;
            })
            .catch((err) => {
                console.error(err);
                return []
            }
            );

        setSottofascicoli(tempSottofascicoli);
    };

    const onSottoFascicoloChange = (newValue: SingleValue<any>) => {
        setError(undefined);
        const fascicolo: FascicoloElettronico = newValue;
        setSottoFascicoloSelezionato(fascicolo);

    };

    //funzione che gestisce la logica completa dell' aggiunta dell'archivio
    const replaceFascicoloSelezionato = (newFascicolo: FascicoloElettronico) => {
        const oldId = fascicoloNr;
        const data = fascicoliSelezionati
        // Verifica se il nuovo fascicolo non è già presente nell'array
        const isNewFascicoloUnique = !data.includes(newFascicolo.fascicolo_id);
        if (isNewFascicoloUnique) {
            const index = data.indexOf(oldId);
            if (index !== -1) {
                replaceFascicoloSelezionatoDisplay(newFascicolo)
                setEditMode(false)
                return data[index] = newFascicolo.fascicolo_id;
            }
        } else {
            setError('il Fascicolo è già selezionato');
        };
    };
    //funzione che sostituisce  il fascicolo nuovo a quello precedente in UI
    const replaceFascicoloSelezionatoDisplay = (newFascicolo: FascicoloElettronico) => {
        const data = displayFascicoliSelezionati;
        const oldFascicolo = item;
        //trovo l'index dell'oggetto vecchio oggetto
        const index = data.findIndex(existingItem => existingItem.fascicolo_id === oldFascicolo.fascicolo_id);
        if (index !== -1) {
            // Sostituisci l'oggetto vecchio con il nuovo oggetto
            const newData = [...data];
            newData[index] = newFascicolo;
            setDisplayFascicoliSelezionati(newData);
        };
    };
    // funzione di delete delle Rows
    const deleteFascicoloSelezionato = () => {
        const fascicolo = item
        // Filtro l'array per rimuovere l'elemento corrente
        const updatedFascicoliSelezionati = fascicoliSelezionati.filter(item => item !== fascicolo.fascicolo_id);
        setFascicoliSelezionati(updatedFascicoliSelezionati);
        // Rimuovo l'elemento dall'array di UI 
        const updatedDisplayFascicoliSelezionati = displayFascicoliSelezionati.filter(item => item.fascicolo_id !== fascicolo.fascicolo_id);
        setDisplayFascicoliSelezionati(updatedDisplayFascicoliSelezionati);
    };

    //funzione di salvataggio
    const save = () => {
        //se non è selezionato nulla, non fare nulla
        if (sottoFascicoloSelezionato === null && fascicoloSelezionato === null) return;
        //nel caso in cui sottofascicolo è selezionato, sostituisci il fascicolo corrente con quello selezionato, sia dall'array che consente il display e sia l'id fascicolo dall array dei fascicoli selezionati
        if (sottoFascicoloSelezionato !== null) {
            //sostituisco  il fascicolo_id  precedente con quello nuovo 
            replaceFascicoloSelezionato(sottoFascicoloSelezionato);
            return;
        };
        if (fascicoloSelezionato !== null) {
            replaceFascicoloSelezionato(fascicoloSelezionato);
            return;
        };
    };

    if (!editMode) {
        return (
            <>
                <Box sx={{ borderBottom: '1px solid #eeeeee' }} padding={'1.5rem 1rem'} gap={2} display={'flex'} alignItems={'center'}>
                    <FascicoloSvg />
                    <Box display={'flex'} alignItems={'center'} gap={'.3rem'}>
                        <Typography fontWeight={600} component={'span'}>{fascicoloNr}</Typography>
                        <Typography component={'span'}>del</Typography>
                        <Typography component={'span'} fontWeight={600}>{dayjs(fascicoloDate).format('DD/MM/YYYY')}</Typography>
                        <Typography component={'span'}>- {item.title}</Typography>
                    </Box>
                    <Box flexGrow={1} textAlign={'end'}>
                        <ActionButton sx={{ marginRight: '.5rem' }} text='Modifica' icon='edit' color='warning' onClick={() => { setEditMode(true); setError(undefined) }} />
                        <ActionButton text='Elimina' icon='delete' color='error' onClick={deleteFascicoloSelezionato} />
                    </Box>
                </Box>
            </>
        )
    };
    return (
        <>
            <Box sx={{ borderBottom: '1px solid #eeeeee', backgroundColor: `${error ? 'rgba(237, 81, 81, .2)' : '#fff'}` }} boxShadow={'0 0 10px #efefef'} padding={'1.5rem 1rem'} gap={2} display={'flex'} alignItems={'center'}>

                <Grid container>
                    <Grid paddingRight={'1rem'} item xs={12} md={5}>
                        <Custom_AsyncSelect
                            placeholder='Cerca Fascicolo (min 3 caratteri)'
                            label='Fascicolo elettronico'
                            loadOptions={loadOptions}
                            onChange={onFascicoloChange}
                            defaultValue={fascicoloSelezionato ? fascicoloSelezionato : undefined}
                        />
                    </Grid>
                    <Grid paddingRight={'1rem'} item xs={12} md={5} >
                        <Custom_Select2
                            isClearable
                            disabled={sottofascicoli.length === 0}
                            label='sottofascicolo/inserto'
                            placeholder={`${sottofascicoli.length > 0 ? 'seleziona un sottofascicolo' : 'nessun sottofascicolo/inserto presente nel fascicolo'}`}
                            onChangeSelect={(newValue) => onSottoFascicoloChange(newValue)}
                            options={sottofascicoli}
                            value={sottoFascicoloSelezionato}
                        />
                    </Grid>
                    <Grid item xs={12} md={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                        <ActionButton sx={{ marginRight: '.5rem' }} icon='save' color='warning' onClick={save} />
                        <ActionButton icon='cancel' color='error' onClick={() => { setEditMode(false); setError(undefined) }} />
                    </Grid>
                </Grid>

            </Box>
            {error && <Typography color={'error'}>{error}</Typography>}
        </>
    )
};


export const FascicoliElettroniciSection = ({className}: {className:string,}) => {
     // variabili di stato per Fascicoli elettronici collegati
     const {fascicoliSelezionati, setFascicoliSelezionati} = useWizardBandoContext().fascicoli;
     const [fascicoloSelezionato, setFascicoloSelezionato] = useState<FascicoloElettronico | null>(null);
     const [sottoFascicoloSelezionato, setSottoFascicoloSelezionato] = useState<FascicoloElettronico | null>(null);
     const [displayFascicoliSelezionati, setDisplayFascicoliSelezionati] = useState<FascicoloElettronico[]>([]);
     const [errorFascicolo, setErrorFascicolo] = useState<string | undefined>(undefined);
     const [sottofascicoli, setSottofascicoli] = useState<FascicoloElettronico[]>([]);

    //controllo l'array per pulire gli errori al cambio
    useEffect(() => {
        setErrorFascicolo(undefined);
    }, [fascicoliSelezionati]);

    //funzione passata al'async select per selezionare l'oggetto da salvare sulla variabile di state
    const onFascicoloChange = async (newValue: SingleValue<any>) => {
        //cleanup sottofascicoli necessario se no potrebbe rimanere il value del sottofascicolo incastrato nella select in disabled quando dopo aver inserito un sottofascicolo si cerca un fascicolo senza sottofascicoli
        setSottofascicoli([]);
        setErrorFascicolo(undefined);
        const fascicolo: FascicoloElettronico = newValue;
        setFascicoloSelezionato(fascicolo);
        //faccio chiamata per vedere se ci sono sottofascicoli/inserti per il fascicolo selezionato
        const tempSottofascicoli = await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_SOTTOFASCICOLI_INSERTI', sService: 'READ_DOCUMENTI', body: { idFascicolo: newValue.value } })
            .then((res) => {
                //array temporaneo di sottofascicoli ed inserti che poi vanno processati dalla funzione che crea la struttura ad albero
                const tempSottofascicoliAndInserti = res.response.lista_sottofascicoli_inserti;
                const convertedData = convertData(tempSottofascicoliAndInserti);
                return convertedData;
            })
            .catch((err) => {
                console.error(err);
                return [];
            });
        setSottofascicoli(tempSottofascicoli);
    }
    //funzione per selezione di sottofascicolo 
    const onSottoFascicoloChange = (newValue: SingleValue<any>) => {
        if (newValue) {
            setErrorFascicolo(undefined);
            const sottoFascicolo: FascicoloElettronico = { ...newValue, isSottofascicolo: true };
            setSottoFascicoloSelezionato(sottoFascicolo);
        } else {
            setSottoFascicoloSelezionato(newValue);
        };
    }
    // funzione che gestisce logica di aggiunta del fascicolo selezionato, aggiunge fascicolo_id del fascicoloselezionato/sottoFascicoloSelezionato all'array fascicoliSelezionati[] 
    // e l'intero oggetto all' array displayFascicoliCollegati[] per il display in UI delle rows FascicoliSelezionatiRows
    const addToFascicoliSelezionati = () => {

        if (sottoFascicoloSelezionato === null && fascicoloSelezionato === null) {
            setErrorFascicolo('selezionare il fascicolo da collegare');
            return;
        };
        if (sottoFascicoloSelezionato !== null) {
            if (!fascicoliSelezionati.includes(sottoFascicoloSelezionato.fascicolo_id)) {
                setFascicoliSelezionati((prev) => [...prev, sottoFascicoloSelezionato.fascicolo_id]);
                setDisplayFascicoliSelezionati((prev) => [...prev, sottoFascicoloSelezionato]);
                setErrorFascicolo(undefined);
                return;
            } else {
                setErrorFascicolo('Fascicolo già Collegato');
                return;
            }
        };
        if (fascicoloSelezionato !== null) {
            if (!fascicoliSelezionati.includes(fascicoloSelezionato.fascicolo_id)) {
                setFascicoliSelezionati((prev) => [...prev, fascicoloSelezionato.fascicolo_id]);
                setDisplayFascicoliSelezionati((prev) => [...prev, fascicoloSelezionato]);
                setErrorFascicolo(undefined);
                return;
            } else {
                setErrorFascicolo('Fascicolo già Collegato');
                return;
            }
        };
    };
 
  return (
    
    <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
        <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Fascicoli elettronici collegati</Typography>
        <Box sx={{ backgroundColor: `${errorFascicolo ? 'rgba(237, 81, 81, .2)' : 'transparent'}`, padding: '0.5rem 1rem' }}>
            <Grid container>
                <Grid paddingRight={'1rem'} item xs={12} md={5}>
                    <Custom_AsyncSelect
                        placeholder='Cerca Fascicolo (min 3 caratteri)'
                        label='Fascicolo elettronico'
                        onChange={onFascicoloChange}
                        loadOptions={loadOptions}

                    />
                </Grid>
                <Grid paddingRight={'1rem'} item xs={12} md={5} >

                    <Custom_Select2
                        isClearable
                        disabled={sottofascicoli.length === 0}
                        label='sottofascicolo/inserto'
                        placeholder={`${sottofascicoli.length > 0 ? 'seleziona un sottofascicolo' : 'nessun sottofascicolo/inserto presente nel fascicolo'}`}
                        onChangeSelect={(newValue) => onSottoFascicoloChange(newValue)}
                        options={sottofascicoli}
                        value={sottoFascicoloSelezionato}

                    />
                </Grid>
                <Grid item xs={12} md={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} >
                    <ActionButton onClick={addToFascicoliSelezionati} sx={{ marginTop: '10px' }} text='Aggiungi' icon='add' color='secondary' />
                </Grid>
            </Grid>
            {errorFascicolo && <Typography color={'error'}>{errorFascicolo}</Typography>}
        </Box>
        {displayFascicoliSelezionati.map((fascicolo, index) => (
            <FascicoloSelezionatoRow
                fascicoloElettronicoSelezionato={fascicoloSelezionato}
                defaultOptionsSottoFascicoli={sottofascicoli}
                fascicoliSelezionati={fascicoliSelezionati}
                setFascicoliSelezionati={setFascicoliSelezionati}
                displayFascicoliSelezionati={displayFascicoliSelezionati}
                setDisplayFascicoliSelezionati={setDisplayFascicoliSelezionati}
                key={index}
                item={fascicolo}
            />))}
    </Paper>
  )
}
