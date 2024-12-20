import { Box, Grid, Icon, Divider, Collapse, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import AXIOS_HTTP from "../../../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import useDebounce from "../../../../../app/Hooks/useDebounceHook";
import { ActionButton } from "../../../../../components/partials/Buttons/ActionButton";
import { Custom_DatePicker } from "../../../../../components/partials/Inputs/Custom_DatePicker";
import { Custom_Select2, Option } from "../../../../../components/partials/Inputs/Custom_Select2";
import { Custom_TextField } from "../../../../../components/partials/Inputs/CustomITextField";
import { TabStack } from "../../../../../components/partials/Tabs/TabStack";
import { useCollegaAltriDocumentiContext } from "./CollegaAltriDocumentiContext";
import { useWizardBandoContext } from "../../WizardBandoContext";
import { OrganizzaDocumentoSelect, PubblicazioniSelect } from "../../WizardCreazioneBando_types";
import { Custom_AsyncSelect } from "../../../../../components/partials/Inputs/Custom_AsyncSelect";
import { convertTreeViewData, createOptionArray } from "../../../../../app/AXIOS_ENGINE/functions/handlers";
import { CustomTreeview, Tview } from "../../../../../components/partials/TreeView/Treeview";

type Props = {
    setRows: React.Dispatch<React.SetStateAction<any[]>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const CollegaDocumento_RicercaAvanzata = (props: Props) => {
    //destrutturo i props
    const { setRows, setIsLoading } = props;
    //oggetto filtri ricerca del context della sezione
    const { filters, setFilters } = useCollegaAltriDocumentiContext().filtriRicerca;
    //booleano che determina l'apertura o la chiusura della ricerca avanzata
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // variabile delle tab della ricerca avanzata
    const [activeTab, setActiveTab] = useState<number>(0);
    //variabili per select anno di riferimento (fuori dalla ricerca avanzata)
    const [searchYear, setsearchYear] = useState<any>({ label: `${filters.searchYear}`, value: filters.searchYear });
    //variabili per counter filtri avanzati selezionati
    const [advancedResearchfilterSelected, setAdvancedResearchFilterSelected] = useState<number>(0);
    // HACKFIX !!! trigger per forzare il rerendering della finestra di ricerca avanzata alla cancellazione dei filtri tramite resetFilters() => imposto il trigger sulla key del componente che esegue il display della tab, al cambio della key React forza il rerendering del componente
    const [trigger, setTrigger] = useState<number>(0);
    // state del wizardBando che utilizzo per darmi un array di Rows gia filtrato dai documenti che ho già collegato al bando
    const { documentiCollegatiList } = useWizardBandoContext().documentiCollegati;

    // funzione per conteggio filtri avanzati che esclude i parametri di ricerca base
    const getAdvancedResearchCounter = () => {
        //parametri da escludere nel reset della ricerca avanzata
        const baseParametersOfFilters = ['searchYear', 'searchText'];
        //creo un oggetto partendo dall'oggetto filters includendo tutti i parametri tranne i due di base
        const counter = Object.keys(filters).filter(key => !baseParametersOfFilters.includes(key)).length;
        setAdvancedResearchFilterSelected(counter);
    };

    //funzione per resettare la ricerca avanzata ed elimina i filtri selezionati
    const resetFilters = () => {
        //creo un oggetto partendo dall'oggetto filters escludendo tutti i parametri tranne i due di base
        const { searchText, searchYear } = filters;
        let resettedFilters = {};

        if (searchText && searchText.trim('')) {
            resettedFilters = {
                ...resettedFilters,
                searchText: searchText,
            };
        };
        if (searchYear) {
            resettedFilters = {
                ...resettedFilters,
                searchYear: searchYear,
            };
        };
        //forzo il rerender del componente di ricerca avanzata
        setIsOpen(false)
        setTrigger(trigger + 1);
        setFilters(resettedFilters);
    };

    //watcher per il counter dei filtri avanzati
    useEffect(() => {
        getAdvancedResearchCounter();
    }, [filters]);

    //array per display delle tab in ricerca avanzata 
    const tabs = [
        { text: 'Tutto il Sistema' },
        { text: 'Protocolli' },
        { text: 'Anagrafiche' },
        { text: 'Archivi' },
        { text: 'Pubblicazioni' },
    ];
    //opzioni select anno di riferimento
    const options = {
        searchYear: [
            { value: 2024, label: "2024" },
            { value: 2025, label: "2025" },
            { value: 2026, label: "2026" },
            { value: 2027, label: "2027" },
            { value: 2028, label: "2028" },
            { value: 2029, label: "2029" },
            { value: 2030, label: "2030" },
        ],
    }
    //funzione che prepara il body della richiesta, e salva la risposta alle rows della tabella 
    const handleSearch = async () => {
        setIsLoading(true)
        //preparo il body
        const body = {
            ...filters,
            rowsPerPage: 25,
        }
        // DEVI RIPASSARE GLI OGGETTI DATA IN FORMATO YYYY/MM/DD !!!!
        const result = await AXIOS_HTTP.Retrieve({ url: "/api/launch/organizzaDocumento", body: body, sModule: 'SEARCH_DOCUMENTI', sService: 'READ_DOCUMENTI' });

        //filtro le righe della tabella in modo che mi appaiano solo i documenti ancora da collegare 
        if (documentiCollegatiList.length > 0) {
            const idsToExclude = new Set(documentiCollegatiList.map(doc => doc.idDocumento));
            const filteredRows = result.response.filter((document: any) => !idsToExclude.has(document.idDocumento));
            setRows(filteredRows);
        } else {
            setRows(result.response);
        }
    
        setIsLoading(false);
        
    };

    //funzione che gestisce l'handleChange di tutti gli input 
    //NOTA BENE: se sono input TEXT utilizzare solo newValue come valore, non newValue.value (passare direttamente e.target.value come valore alla funzione quando la si utiizza)
    const handleChange = useDebounce((newValue: any, field: string) => {

        let newFilters: any = {
            ...filters
        }

        switch (field) {

            case 'searchText':
                newValue.trim('') ? newFilters.searchText = newValue : delete newFilters['searchText'];
                break;

            case 'anno-riferimento':
                newValue ? newFilters.searchYear = parseInt(newValue.value) : delete newFilters['searchYear'];
                break;

            case 'aoo':
                newValue ? newFilters.fiAooId = newValue.value : delete newFilters['fiAooId'];
                break;

            case 'classi-doc':
                newValue ? newFilters.fiTypeId = newValue.value : delete newFilters['fiTypeId'];
                break;

            case 'stato-firma':
                newValue ? newFilters.StatoFirma = newValue.value : delete newFilters['StatoFirma'];
                break;

            case 'caricato-da':
                newValue ? newFilters.fiUserId = newValue.value : delete newFilters['fiUserId'];
                break;

            case 'stato-doc':
                newValue ? newFilters.fiFileStatus = newValue.value : delete newFilters['fiFileStatus'];
                break;

            case 'data-inizio':
                newValue ? newFilters.fdDataInizio = dayjs(newValue) : delete newFilters['fdDataInizio'];
                break;

            case 'data-fine':
                newValue ? newFilters.fdDataFine = dayjs(newValue) : delete newFilters['fdDataFine'];
                break;

            case 'tipo-protocollo':
                newValue ? newFilters.fsProtType = newValue.value : delete newFilters['fsProtType'];
                break;

            case 'protocollo-num':
                newValue.trim('') ? newFilters.fsNumeroPro = newValue : delete newFilters['fsNumeroPro'];
                break;

            case 'titolario':
                newValue ? newFilters.fiFileTitolarioId = newValue.value : delete newFilters['fiFileTitolarioId'];
                break;

            case 'anagrafica':
                newValue ? newFilters.fiAnagraficaId = newValue.value : delete newFilters['fiAnagraficaId'];
                break;

            case 'anagrafica-tipo':
                newValue ? newFilters.fiAnagraficaTypeId = newValue.value : delete newFilters['fiAnagraficaTypeId']; delete newFilters['fiAnagraficaId'];
                break;

            case 'archivi':
                newValue ? newFilters.fiDossierId = newValue.value : delete newFilters['fiDossierId'];
                break;

            case 'pubblicato-albo':
                newValue ? newFilters.fiAPDPubblicationStatus = newValue.value : delete newFilters['fiAPDPubblicationStatus'];
                break;

            case 'pubblicato-am':
                newValue ? newFilters.fiATPubblicationStatus = newValue.value : delete newFilters['fiATPubblicationStatus'];
                break;

            case 'pubblicato-bi':
                newValue ? newFilters.fiBACHPubblicationStatus = newValue.value : delete newFilters['fiBACHPubblicationStatus'];
                break;
        }

        setFilters(newFilters);

    }, 300);

    return (
        <Box sx={{ margin: '0 1rem' }}>
            <Box>
                <Grid container>
                    <Grid item xs={12} sm={8} lg={6} padding={'0 .5rem'}>
                        <Custom_TextField
                            onChange={(e) => {
                                //setSearchText(e.target.value);
                                handleChange(e.target.value, 'searchText')
                            }}
                            backgroundColor='#fff'
                            label={'Parola chiave'}
                            placeholder='Inserisci parola chiave...'
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} lg={3} padding={'0 .5rem'}>
                        <Custom_Select2
                            onChangeSelect={(newValue) => {
                                setsearchYear(newValue);
                                handleChange(newValue, 'anno-riferimento')
                            }}
                            label='Anno di riferimento'
                            isClearable
                            options={options.searchYear}
                            defaultValue={options.searchYear[0]}
                            value={searchYear}
                        />

                    </Grid>
                    <Grid item xs={12} sm={12} lg={3} display={'flex'} justifyContent={'end'} alignItems={'center'} padding={'0 .5rem'} gap={1} marginBottom={1}>
                        <ActionButton
                            onClick={() => handleSearch()}
                            sx={{ minHeight: '40px', maxHeight: '50px', marginTop: '9px' }}
                            color='secondary'
                            text='Cerca'
                            endIcon={<Icon>search</Icon>}
                        />
                        <ActionButton
                            onClick={() => setIsOpen(!isOpen)}
                            sx={{ minHeight: '40px', maxHeight: '50px', marginTop: '10px' }}
                            color={'warning-secondary'} text={isOpen ? 'Chiudi ricerca avanzata' : 'Apri ricerca Avanzata'}
                            endIcon={<Icon sx={{ transition: '200ms', transform: `rotate(${isOpen ? '180deg' : '0deg'})` }}>keyboard_arrow_up</Icon>}
                        />
                    </Grid>
                </Grid>
                <Divider />
            </Box>

            <Collapse sx={{ backgroundColor: 'aliceblue', borderTop: '1px efefef', paddingTop: '.5rem' }} in={isOpen} timeout={'auto'}>
                <TabStack tabs={tabs} setTab={setActiveTab} activeTab={activeTab} />
                <DisplayTabContentComponent key={trigger} filters={filters} activeTab={activeTab} onChangeFunction={handleChange} />
                <Divider />
            </Collapse>

            {advancedResearchfilterSelected > 0 &&
                <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ marginRight: '10px' }} fontSize={18} >Ricerca Avanzata Attiva, filtri selezionati: {advancedResearchfilterSelected}</Typography>
                    <Icon onClick={() => resetFilters()} sx={{ cursor: 'pointer' }} color="error" >cancel</Icon>
                </Box>
            }

        </Box>
    )
}

const DisplayTabContentComponent = ({ activeTab, onChangeFunction, filters }: { activeTab: number, onChangeFunction: (newValue: any, field: string) => void, filters: any }) => {
    //creo un oggetto comprendente tutte le opzioni per le select
    const selectOptionsObj = useWizardBandoContext().selectOptions;
    const selectOptions = {
        ...selectOptionsObj.organizzaDocumentoSelectValues!,
        ...selectOptionsObj.pubblicazioniSelectValues!
    };

    return (
        <>
            <TuttoIlSistemaFormStep className={activeTab !== 0 ? 'd-none' : ''} onChangeFunction={onChangeFunction} selectOptions={selectOptions} filters={filters} />
            <ProtocolliFormStep className={activeTab !== 1 ? 'd-none' : ''} onChangeFunction={onChangeFunction} selectOptions={selectOptions} />
            <AnagraficheFormStep className={activeTab !== 2 ? 'd-none' : ''} onChangeFunction={onChangeFunction} selectOptions={selectOptions} />
            <ArchiviFormStep className={activeTab !== 3 ? 'd-none' : ''} onChangeFunction={onChangeFunction} />
            <PubblicazioniFormStep className={activeTab !== 4 ? 'd-none' : ''} onChangeFunction={onChangeFunction} />
        </>
    );
}

const TuttoIlSistemaFormStep = ({ onChangeFunction, selectOptions, className, filters }: { onChangeFunction: (newValue: any, field: string) => void, selectOptions: PubblicazioniSelect & OrganizzaDocumentoSelect, className: string, filters?: any }) => {
    const statoDocOptions = [
        { value: 0, label: 'Da archiviare' },
        { value: 1, label: 'Archiviato' },
        { value: 2, label: 'In conservazione' },
        { value: 4, label: 'In attesa di conservazione' },
        { value: 3, label: 'In attesa di convalida' },
    ]

    const firmaOptions = [
        { value: 'NaN', label: 'Tutti' },
        { value: 0, label: 'Non firmato' },
        { value: 1, label: 'Da firmare' },
        { value: 2, label: 'Firmato' },
    ]
    return (
        <Box className={className}>
            <Grid container padding={'.3rem 0'}>
                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="A.O.O." options={selectOptions.aoo} onChangeSelect={(newValue) => onChangeFunction(newValue, 'aoo')} defaultValue={filters.fiAooId ? selectOptions.aoo.find((item) => item.value === filters.fiAooId) : null} isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Classe documentale" options={selectOptions.classi_documentali} onChangeSelect={(newValue) => onChangeFunction(newValue, 'classi-doc')} placeholder="Seleziona classe documentale..." isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Stato Documento" options={statoDocOptions} onChangeSelect={(newValue) => onChangeFunction(newValue, 'stato-doc')} placeholder="Seleziona stato del documento..." isClearable />
                </Grid>

            </Grid>
            <Grid container>
                <Grid item xs={12} md={6} lg={3} padding={'0 .5rem'}>
                    <Custom_Select2 label="firmato?" options={firmaOptions} onChangeSelect={(newValue) => onChangeFunction(newValue, 'stato-firma')} placeholder="seleziona..." isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={3} padding={'0 .5rem'}>
                    <Custom_Select2 label="Caricato da" options={selectOptions.utenti_firmatari} onChangeSelect={(newValue) => onChangeFunction(newValue, 'caricato-da')} placeholder="Seleziona utente..." isClearable />

                </Grid>

                <Grid item xs={12} md={6} lg={3} padding={'0 .5rem'}>
                    <Custom_DatePicker maxDate={filters.fdDataFine ? filters.fdDataFine : null} label={'Data inizio'} onChange={(newValue) => onChangeFunction(newValue, 'data-inizio')} isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={3} padding={'0 .5rem'}>
                    <Custom_DatePicker minDate={filters.fdDataInizio ? filters.fdDataInizio : null} label={'Data fine'} onChange={(newValue) => onChangeFunction(newValue, 'data-fine')} isClearable />
                </Grid>
            </Grid>
        </Box>
    )
}

const ProtocolliFormStep = ({ onChangeFunction, selectOptions, className, filters }: { onChangeFunction: (newValue: any, field: string) => void, selectOptions: PubblicazioniSelect & OrganizzaDocumentoSelect, className: string, filters?: any }) => {

    const protocolloTypeOptions = [
        { value: 'E', label: 'In entrata' },
        { value: 'U', label: 'In uscita' }
    ]

    return (
        <Box className={className}>
            <Grid container padding={'.3rem 0'}>
                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Tipo protocollo" options={protocolloTypeOptions} onChangeSelect={(newValue) => onChangeFunction(newValue, 'tipo-protocollo')} isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_TextField label="numero protocollo" onChange={(newValue) => onChangeFunction(newValue.target.value, 'protocollo-num')} placeholder="Digita numero..." backgroundColor="#fff" />
                </Grid>

                <Grid item xs={12} md={12} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Titolari" options={selectOptions.titolari} onChangeSelect={(newValue) => onChangeFunction(newValue, 'titolario')} placeholder="Seleziona titolario..." isClearable />
                </Grid>

            </Grid>

        </Box>
    )
}

const AnagraficheFormStep = ({ onChangeFunction, className, selectOptions }: { onChangeFunction: (newValue: any, field: string) => void, className: string, selectOptions: PubblicazioniSelect & OrganizzaDocumentoSelect }) => {

    const [anagrafichevalue, setAnagraficheValue] = useState<Option | null>(null);

    async function GET_ANAGRAFICA(inputValue: string) {
        return await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', body: { typeId: anagrafichevalue!.value, searchText: inputValue }, sModule: 'GET_DATI_ANAGRAFICA', sService: 'READ_ANAGRAFICA' })
            .then((res) => {
                const optionArr = createOptionArray({ arr: res.response, label: 'text', value: 'Id' });
                return optionArr
            })
            .catch((err) => console.error(err))
    }

    async function loadOptions(inputValue: string, callback: any) {
        if (!inputValue || inputValue.length < 3) {
            callback([]);
            return;
        };
        const selectOptions = await GET_ANAGRAFICA(inputValue);
        callback(selectOptions)

    }

    return (
        <Box className={className}>
            <Grid container padding={'.3rem 0'}>
                <Grid item xs={12} md={!anagrafichevalue ? 12 : 6} padding={'0 .5rem'}>
                    <Custom_Select2
                        label="Tipo Anagrafica"
                        options={selectOptions.anagrafiche}
                        isClearable
                        onChangeSelect={(newValue) => {
                            setAnagraficheValue(newValue)
                            onChangeFunction(newValue, 'anagrafica-tipo');
                        }}
                    />
                </Grid>
                {anagrafichevalue &&
                    <Grid item xs={12} md={6} padding={'0 .5rem'}>
                        <Custom_AsyncSelect label="Anagrafica" onChange={(newValue) => onChangeFunction(newValue, 'anagrafica')} loadOptions={loadOptions} isClearable />
                    </Grid>
                }

            </Grid>

        </Box>
    )
}

const ArchiviFormStep = ({ onChangeFunction, className }: { onChangeFunction: (newValue: any, field: string) => void, className: string }) => {

    const [selectedTreeViewItem, setSelectedTreeViewItem] = useState<Tview | null>(null);
    //treeViewData
    const treeview = useWizardBandoContext().listeOrganizzaDocumento?.lista_archivi;
    // uso useMomo per memorizzare i dati della treview che non dovrebbero cambiare ad ogni rerendering
    const treeViewData = useMemo(() => convertTreeViewData(treeview as any[]), [treeview]);

    useEffect(() => {
        onChangeFunction(selectedTreeViewItem, 'archivi')
    }, [selectedTreeViewItem])

    return (
        <Box className={className} padding={'.0rem .3rem'} sx={{ maxHeight: '250px', overflowY: 'auto' }}>
            <CustomTreeview data={treeViewData} setTreeItem={setSelectedTreeViewItem} selectedTreeItem={selectedTreeViewItem} />
        </Box>
    )
}

const PubblicazioniFormStep = ({ onChangeFunction, className }: { onChangeFunction: (newValue: any, field: string) => void, className: string }) => {

    const albo = [
        { value: 0, label: 'Non Pubblicato' },
        { value: 1, label: 'Da Pubblicare' },
        { value: 2, label: 'Pubblicato' }
    ]

    const amministrazionetrasparente = [
        { value: 0, label: 'Non Pubblicato' },
        { value: 1, label: 'Da Pubblicare' },
        { value: 2, label: 'Pubblicato' }
    ]

    const bachecheIstituzionali = [
        { value: 0, label: 'Non Pubblicato' },
        { value: 1, label: 'Da Pubblicare' },
        { value: 2, label: 'Pubblicato' }
    ]

    return (
        <Box className={className}>
            <Grid container padding={'.3rem 0'}>
                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Pubblicati in albo" options={albo} onChangeSelect={(newValue) => onChangeFunction(newValue, 'pubblicato-albo')} isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Pubblicati in Amministrazione trasparente" options={amministrazionetrasparente} onChangeSelect={(newValue) => onChangeFunction(newValue, 'pubblicato-am')} isClearable />
                </Grid>

                <Grid item xs={12} md={12} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Pubblicati in Bacheche istituzionali" options={bachecheIstituzionali} onChangeSelect={(newValue) => onChangeFunction(newValue, 'pubblicato-bi')} isClearable />
                </Grid>

            </Grid>

        </Box>
    )
}