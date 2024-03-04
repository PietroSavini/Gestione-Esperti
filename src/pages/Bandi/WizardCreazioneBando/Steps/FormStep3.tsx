import { Box, Dialog, Grid, Icon, Paper, Typography } from '@mui/material'
import { FormStepProps } from './FormStep1';
import { useEffect, useState } from 'react';
import { CustomTreeview, Tview } from '../../../../components/partials/TreeView/Treeview';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { OpenFolderSvg } from '../../../../components/partials/svg/OpenFolderSvg';
import AsyncSelect from 'react-select/async';
import { Custom_AsyncSelect, Option } from '../../../../components/partials/Inputs/Custom_AsyncSelect';
import { GroupBase, OptionsOrGroups, SingleValue } from 'react-select';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { FascicoloSvg } from '../../../../components/partials/svg/FascicoloSvg';
import { AutoFixHigh } from '@mui/icons-material';
//data del treeView 
const data: Tview[] = [
    {
        value: '0',
        label: 'elemento 1',
        children: [
            {
                value: '0.2',
                label: 'elemento 1.2',
                children: [
                    {
                        value: '0.2.1',
                        label: 'elemento 1.2.1',
                        children: [
                            {
                                value: '0.2.1.1',
                                label: 'elemento 1.2.1.1'
                            }
                        ]
                    }
                ]
            },
            {
                value: '0.1',
                label: 'elemento 1.1',

            },

        ]
    },

    {
        value: '1',
        label: 'elemento 2',
    }
]
type SetArchivio = {
    setArchivio: React.Dispatch<React.SetStateAction<string | null>>
}

type FascicoloElettronico = {
    id: string;
    fascicolo_nr: string;
    fascicolo_id: string;
    title: string;
    date: string;
    value: string;
    label: string;
    fascicoliInterni?: FascicoloElettronico[] | [];
}

const FascicoliData: FascicoloElettronico[] = [
    {
        id: '0',
        fascicolo_nr: '34',
        fascicolo_id: '10121',
        title: 'AAA Prova',
        date: '29/02/2024 11:00:00',
        value: '1',
        label: '34 del 29/02/2024 AAA Prova',
        fascicoliInterni: [
            {
                id: '0.1',
                fascicolo_nr: '34.1',
                fascicolo_id: '10126',
                title: 'Fascicolo Interno Prova',
                date: '29/02/2024 11:00:00',
                value: '1.1',
                label: 'Fascicolo Interno del fascicolo n. 34',
            },
        ]
    },
    {
        id: '1',
        fascicolo_nr: '35',
        fascicolo_id: '10122',
        title: 'BBB Prova',
        date: '29/02/2024 11:01:00',
        value: '2',
        label: '35 del 29/02/2024 BBB Prova',
    },
    {
        id: '2',
        fascicolo_nr: '36',
        fascicolo_id: '10123',
        title: 'CCC Prova',
        date: '29/02/2024 11:02:00',
        value: '3',
        label: '36 del 29/02/2024 CCC Prova',
    },
]

type FascicoloSelezionatoRowTypes = {
    item: FascicoloElettronico;
    data: FascicoloElettronico[];
    displayFascicoliSelezionati: FascicoloElettronico[];
    setDisplayFascicoliSelezionati: React.Dispatch<React.SetStateAction<FascicoloElettronico[]>>;
    fascicoliSelezionati: string[];
    setFascicoliSelezionati: React.Dispatch<React.SetStateAction<string[]>>;
}

const FascicoloSelezionatoRow = (props: FascicoloSelezionatoRowTypes) => {
    //riceverò in ingresso il data che passo per popolare le select async oppure la funzione che chiama per ricevere il data
    const { data, displayFascicoliSelezionati, setDisplayFascicoliSelezionati, item, fascicoliSelezionati, setFascicoliSelezionati } = props
    const fascicoloNr = item.fascicolo_id
    const fascicoloDate = item.date
    const [editMode, setEditMode] = useState<boolean>(false)
    const [fascicoloSelezionato, setFascicoloSelezionato] = useState<FascicoloElettronico | null>(item)
    const [sottoFascicoloSelezionato, setSottoFascicoloSelezionato] = useState<FascicoloElettronico | null>(null)
    const [error, setError] = useState<string | undefined>(undefined)

    const loadOptions = (searchValue: string, callBack: (options: FascicoloElettronico[]) => void) => {
        setTimeout(() => {
            const filteredOptions = data.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
            callBack(filteredOptions)
        }, 2000)
    }

    const onFascicoloChange = (newValue: SingleValue<any>) => {
        setError(undefined)
        const fascicolo: FascicoloElettronico = newValue
        setSottoFascicoloSelezionato(null)
        setFascicoloSelezionato(fascicolo)
    }

    const onSottoFascicoloChange = (newValue: SingleValue<any>) => {
        setError(undefined)
        const fascicolo: FascicoloElettronico = newValue
        setSottoFascicoloSelezionato(fascicolo)
    }

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
                        <Typography component={'span'} fontWeight={600}>{fascicoloDate}</Typography>
                    </Box>
                    <Box flexGrow={1} textAlign={'end'}>
                        <ActionButton sx={{ marginRight: '.5rem' }} text='Modifica' icon='edit' color='warning' onClick={() => { setEditMode(true); setError(undefined) }} />
                        <ActionButton text='Elimina' icon='delete' color='error' onClick={ deleteFascicoloSelezionato } />
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
                        {fascicoloSelezionato !== null && fascicoloSelezionato.fascicoliInterni ? (
                            <Custom_Select2
                                isClearable
                                label='sottofascicolo/inserto'
                                placeholder='Seleziona un sottofascicolo'
                                onChange={onSottoFascicoloChange}
                                options={fascicoloSelezionato.fascicoliInterni}
                                defaultValue={sottoFascicoloSelezionato ? sottoFascicoloSelezionato : undefined}

                            />
                        ) : (
                            <Custom_Select2
                                label='sottofascicolo/inserto'
                                placeholder='Nessun sottofascicolo/inserto selezionabile'
                                disabled
                                options={[]}
                                value={'.'}
                            />
                        )}
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
    const [fascicoliSelezionati, setFascicoliSelezionati] = useState<string[]>([])
    const [displayFascicoliSelezionati, setDisplayFascicoliSelezionati] = useState<FascicoloElettronico[]>([]);
    const [errorFascicolo, setErrorFascicolo] = useState<string | undefined>(undefined);

    //controllo l'array per pulire gli errori al cambio
    useEffect(() => {
      setErrorFascicolo(undefined)
      console.log('fascicoli Selezionati: ',fascicoliSelezionati)
    }, [fascicoliSelezionati])

    
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
    //funzione per caricare options di asyncSelect
    const loadOptions = (searchValue: string, callBack: (options: FascicoloElettronico[]) => void) => {
        setTimeout(() => {
            const filteredOptions = FascicoliData.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
            callBack(filteredOptions);
        }, 2000);
    };
    //funzione passata al'async select per selezionare l'oggetto da salvare sulla variabile di state
    const onFascicoloChange = (newValue: SingleValue<any>) => {
        setErrorFascicolo(undefined);
        const fascicolo: FascicoloElettronico = newValue;
        setFascicoloSelezionato(fascicolo);
    }
    //funzione per selezione di sottofascicolo 
    const onSottoFascicoloChange = (newValue: SingleValue<any>) => {
        setErrorFascicolo(undefined);
        const sottoFascicolo = newValue;
        setSottoFascicoloSelezionato(sottoFascicolo);
    }
    // funzione che gestisce logica di aggiunta del fascicolo selezionato, aggiunge fascicolo_id del fascicoloselezionato/sottoFascicoloSelezionato all'array fascicoliSelezionati[] 
    // e l'intero oggetto all' array displayFascicoliCollegati[] per il display in UI delle rows FascicoliSelezionatiRows
    const addToFascicoliSelezionati = () => {
   
        if (sottoFascicoloSelezionato === null && fascicoloSelezionato === null) {
            setErrorFascicolo('selezionare il fascicolo da collegare')
            return
        }
        if (sottoFascicoloSelezionato !== null) {
            if (!fascicoliSelezionati.includes(sottoFascicoloSelezionato.fascicolo_id)) {
                setFascicoliSelezionati((prev) => [...prev, sottoFascicoloSelezionato.fascicolo_id]);
                setDisplayFascicoliSelezionati((prev) => [...prev, sottoFascicoloSelezionato])
                setErrorFascicolo(undefined)

                return
            }else{
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
            }else{
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

                {/* da scorporare in componente esterno da fare dinamico ed a <Dialog/> */}
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
                            <CustomTreeview data={data} setTreeItem={setSelectedTreeViewItem} selectedTreeItem={selectedTreeViewItem} />
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
                            {fascicoloSelezionato !== null && fascicoloSelezionato.fascicoliInterni ? (
                                <Custom_Select2
                                    isClearable
                                    label='sottofascicolo/inserto'
                                    placeholder='Seleziona un sottofascicolo'
                                    onChange={onSottoFascicoloChange}
                                    options={fascicoloSelezionato.fascicoliInterni}
                                    value={sottoFascicoloSelezionato}

                                />
                            ) : (
                                <Custom_Select2
                                    label='sottofascicolo/inserto'
                                    placeholder='Nessun sottofascicolo/inserto selezionabile'
                                    disabled
                                    options={[]}
                                    value={'.'}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} >
                            <ActionButton onClick={addToFascicoliSelezionati} sx={{ marginTop: '10px' }} text='Aggiungi' icon='add' color='secondary' />
                        </Grid>
                    </Grid>
                    {errorFascicolo && <Typography color={'error'}>{errorFascicolo}</Typography>}
                </Box>
                {displayFascicoliSelezionati.map((fascicolo, index) => (
                    <FascicoloSelezionatoRow
                        fascicoliSelezionati={fascicoliSelezionati}
                        setFascicoliSelezionati={setFascicoliSelezionati}
                        displayFascicoliSelezionati={displayFascicoliSelezionati}
                        setDisplayFascicoliSelezionati={setDisplayFascicoliSelezionati}
                        data={FascicoliData}
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
