import { Box, Dialog, Grid, Icon, Paper, Typography } from '@mui/material'
import { FormStepProps } from './FormStep1';
import { useEffect, useMemo, useState } from 'react';
import { CustomTreeview, Tview } from '../../../../components/partials/TreeView/Treeview';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { OpenFolderSvg } from '../../../../components/partials/svg/OpenFolderSvg';
import { Custom_AsyncSelect } from '../../../../components/partials/Inputs/Custom_AsyncSelect';
import { SingleValue } from 'react-select';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { FascicoloSvg } from '../../../../components/partials/svg/FascicoloSvg';
import { useSelector } from 'react-redux';
import { selectOrganizzaDocumentoData } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { convertTreeViewData } from '../../handlers';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { convertData } from '../../../SettingsPage/functions';
import dayjs from 'dayjs';
import { useWizardBandoContext } from '../WizardBandoContext';



type SetArchivio = {
    setArchivio: React.Dispatch<React.SetStateAction<string | null>>
}

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

//funzione che chiama il webservice per fare la ricerca dei fascicoli fatti sulla stringa passata
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
            console.log(err)
            return []
        })
}
//funzione triggerata dalla select che ritorna un oggetto type = FascicoloElettronico
async function loadOptions(inputValue: string, callback: any) {
    if (!inputValue || inputValue.length < 3) {
        callback([])
        return
    }
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
        console.log('FASCICOLO IN SELEZIONE', newValue)
        setError(undefined);
        const fascicolo: FascicoloElettronico = newValue;
        setFascicoloSelezionato(fascicolo);

        //faccio chiamata per vedere se ci sono sottofascicoli/inserti per il fascicolo selezionato
        const tempSottofascicoli = await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_SOTTOFASCICOLI_INSERTI', sService: 'READ_DOCUMENTI', body: { idFascicolo: newValue.value } })
            .then((res) => {
                console.log(res)
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
            setError('il Fascicolo è già selezionato')
        }
    }
    //funzione che sostituisce  il fascicolo nuovo a quello precedente in UI
    const replaceFascicoloSelezionatoDisplay = (newFascicolo: FascicoloElettronico) => {
        const data = displayFascicoliSelezionati
        const oldFascicolo = item
        //trovo l'index dell'oggetto vecchio oggetto
        const index = data.findIndex(existingItem => existingItem.fascicolo_id === oldFascicolo.fascicolo_id);
        if (index !== -1) {
            // Sostituisci l'oggetto vecchio con il nuovo oggetto
            const newData = [...data];
            newData[index] = newFascicolo;
            setDisplayFascicoliSelezionati(newData);
        }
    }
    // funzione di delete delle Rows
    const deleteFascicoloSelezionato = () => {
        const fascicolo = item
        // Filtro l'array per rimuovere l'elemento corrente
        const updatedFascicoliSelezionati = fascicoliSelezionati.filter(item => item !== fascicolo.fascicolo_id);
        setFascicoliSelezionati(updatedFascicoliSelezionati);
        // Rimuovo l'elemento dall'array di UI 
        const updatedDisplayFascicoliSelezionati = displayFascicoliSelezionati.filter(item => item.fascicolo_id !== fascicolo.fascicolo_id);
        setDisplayFascicoliSelezionati(updatedDisplayFascicoliSelezionati);

    }

    //funzione di salvataggio
    const save = () => {
        //se non è selezionato nulla, non fare nulla
        if (sottoFascicoloSelezionato === null && fascicoloSelezionato === null) return;
        //nel caso in cui sottofascicolo è selezionato, sostituisci il fascicolo corrente con quello selezionato, sia dall'array che consente il display e sia l'id fascicolo dall array dei fascicoli selezionati
        if (sottoFascicoloSelezionato !== null) {
            //sostituisco  il fascicolo_id  precedente con quello nuovo 
            replaceFascicoloSelezionato(sottoFascicoloSelezionato)
            console.log('Fascicoli Selezionati: ', fascicoliSelezionati)
            return
        }
        if (fascicoloSelezionato !== null) {
            replaceFascicoloSelezionato(fascicoloSelezionato)
            console.log('Fascicoli Selezionati: ', fascicoliSelezionati)
            return
        }
    }

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
    }
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
}

export const FormStep3 = (props: FormStepProps & SetArchivio) => {
    const { register, errors, className, setArchivio } = props;
    //variabili di stato per treeView
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedTreeViewItem, setSelectedTreeViewItem] = useState<Tview | null>(null);
    const [archivioLabel, setArchivioLabel] = useState<string | undefined>(undefined);

    // variabili di stato per Fascicoli elettronici collegati
    const [fascicoloSelezionato, setFascicoloSelezionato] = useState<FascicoloElettronico | null>(null);
    const [sottoFascicoloSelezionato, setSottoFascicoloSelezionato] = useState<FascicoloElettronico | null>(null);
    const {fascicoliSelezionati, setFascicoliSelezionati} = useWizardBandoContext().fascicoli
    const [displayFascicoliSelezionati, setDisplayFascicoliSelezionati] = useState<FascicoloElettronico[]>([]);
    const [errorFascicolo, setErrorFascicolo] = useState<string | undefined>(undefined);
    const [sottofascicoli, setSottofascicoli] = useState<FascicoloElettronico[]>([]);

    //treeViewData
    const treeview = useSelector(selectOrganizzaDocumentoData)!.lista_archivi;
    // uso useMomo per memorizzare i dati della treview che non dovrebbero cambiare ad ogni rerendering
    const treeViewData = useMemo(() => convertTreeViewData(treeview), [treeview]);
    //funzione avviata al tasto 'Salva' contenuto nel modal della treeView
    function saveArchivio(param: Tview | null) {
        setArchivio(() => param ? param.value : null);
        setArchivioLabel(() => param ? param.label : undefined);
        setIsOpen(false);
    }
    //funzione che renderizza la lable dell' archivio collegato
    function displayArchivioLabel(str: string) {
        return (
            <>
                <Box marginTop={'1.5rem'} display={'flex'} alignItems={'center'} gap={1} paddingLeft={1}>
                    <OpenFolderSvg />
                    <Typography component={'span'} fontWeight={600} fontSize={'0.9rem'}>{str}</Typography>
                </Box>
            </>
        )
    }

    //controllo l'array per pulire gli errori al cambio
    useEffect(() => {
        setErrorFascicolo(undefined)
        console.log('fascicoli Selezionati: ', fascicoliSelezionati)
    }, [fascicoliSelezionati])

    //funzione passata al'async select per selezionare l'oggetto da salvare sulla variabile di state
    const onFascicoloChange = async (newValue: SingleValue<any>) => {
        console.log('FASCICOLO IN SELEZIONE', newValue)
        //cleanup sottofascicoli necessario se no potrebbe rimanere il value del sottofascicolo incastrato nella select in disabled quando dopo aver inserito un sottofascicolo si cerca un fascicolo senza sottofascicoli
        setSottofascicoli([])
        setErrorFascicolo(undefined);
        const fascicolo: FascicoloElettronico = newValue;
        setFascicoloSelezionato(fascicolo);
        //faccio chiamata per vedere se ci sono sottofascicoli/inserti per il fascicolo selezionato
        const tempSottofascicoli = await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_SOTTOFASCICOLI_INSERTI', sService: 'READ_DOCUMENTI', body: { idFascicolo: newValue.value } })
            .then((res) => {
                console.log(res)
                //array temporaneo di sottofascicoli ed inserti che poi vanno processati dalla funzione che crea la struttura ad albero
                const tempSottofascicoliAndInserti = res.response.lista_sottofascicoli_inserti;
                const convertedData = convertData(tempSottofascicoliAndInserti);
                return convertedData;
            })
            .catch((err) => {
                console.error(err);
                return []
            });
        setSottofascicoli(tempSottofascicoli)
    }
    //funzione per selezione di sottofascicolo 
    const onSottoFascicoloChange = (newValue: SingleValue<any>) => {
        if (newValue) {
            setErrorFascicolo(undefined);
            const sottoFascicolo: FascicoloElettronico = { ...newValue, isSottofascicolo: true };
            setSottoFascicoloSelezionato(sottoFascicolo);
            console.log('sottofascicolo selezionato: ', sottoFascicolo)
        } else {
            setSottoFascicoloSelezionato(newValue)
        };
    }
    // funzione che gestisce logica di aggiunta del fascicolo selezionato, aggiunge fascicolo_id del fascicoloselezionato/sottoFascicoloSelezionato all'array fascicoliSelezionati[] 
    // e l'intero oggetto all' array displayFascicoliCollegati[] per il display in UI delle rows FascicoliSelezionatiRows
    const addToFascicoliSelezionati = () => {

        if (sottoFascicoloSelezionato === null && fascicoloSelezionato === null) {
            setErrorFascicolo('selezionare il fascicolo da collegare')
            return
        }
        if (sottoFascicoloSelezionato !== null) {
            console.log('AGGIUNGO SOTTOFASCICOLO')
            if (!fascicoliSelezionati.includes(sottoFascicoloSelezionato.fascicolo_id)) {
                setFascicoliSelezionati((prev) => [...prev, sottoFascicoloSelezionato.fascicolo_id]);
                setDisplayFascicoliSelezionati((prev) => [...prev, sottoFascicoloSelezionato])
                setErrorFascicolo(undefined)
                return
            } else {
                setErrorFascicolo('Fascicolo già Collegato')
                return
            }
        }
        if (fascicoloSelezionato !== null) {
            if (!fascicoliSelezionati.includes(fascicoloSelezionato.fascicolo_id)) {
                setFascicoliSelezionati((prev) => [...prev, fascicoloSelezionato.fascicolo_id])
                setDisplayFascicoliSelezionati((prev) => [...prev, fascicoloSelezionato])
                setErrorFascicolo(undefined)
                return
            } else {
                setErrorFascicolo('Fascicolo già Collegato')
                return
            }
        }
    }


    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                    <Typography component={'h6'} variant='h6'>Collega ad un archivio</Typography>
                    <ActionButton color='secondary' onClick={() => setIsOpen(true)} text='Collega Archivio' iconComponent={<Icon sx={{ marginLeft: '10px' }}>folder_copy</Icon>} />
                </Box>
                {!archivioLabel ? <Typography marginTop={2} fontSize={'0.9rem'}>Nessun archivio collegato</Typography> : displayArchivioLabel(archivioLabel)}

                {/* treeView component */}
                <Dialog open={isOpen} fullScreen className='collega-ad-un-archivio-modal' onClose={() => setIsOpen(false)}  >
                    <Paper elevation={0} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '1rem' }}>
                        <Box className={'dialog-header'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography fontWeight={600} component={'h6'} variant='h6'>Collega ad un archivio </Typography>
                            <Box marginTop={'-25px'} >
                                <Custom_TextField endAdornment={<Icon >search</Icon>} placeholder='Filtra per parola chiave' />
                            </Box>
                        </Box>
                        <Box flexGrow={1} sx={{ overflowY: 'auto' }}>
                            <CustomTreeview data={treeViewData} setTreeItem={setSelectedTreeViewItem} selectedTreeItem={selectedTreeViewItem} />
                        </Box>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'.5rem 1rem'}>
                            <ActionButton onClick={() => setIsOpen(false)} color='error' text='annulla' iconComponent={<Icon>cancel</Icon>} />
                            <ActionButton onClick={() => saveArchivio(selectedTreeViewItem)} color='secondary' text='Salva' iconComponent={<Icon>save</Icon>} />
                        </Box>
                    </Paper>
                </Dialog>
            </Paper>
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

            {/* fASCICOLI ELETTRONICI COLLEGATI */}
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

            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Collega altri documenti</Typography>
                </Box>
            </Paper>
        </>
    )
}
