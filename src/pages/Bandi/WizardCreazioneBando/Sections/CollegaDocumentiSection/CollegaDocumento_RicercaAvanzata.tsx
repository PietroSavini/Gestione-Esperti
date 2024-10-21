import { Box, Grid, Icon, Divider, Collapse } from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect, SetStateAction } from "react";
import AXIOS_HTTP from "../../../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import useDebounce from "../../../../../app/Hooks/useDebounceHook";
import { ActionButton } from "../../../../../components/partials/Buttons/ActionButton";
import { Custom_DatePicker } from "../../../../../components/partials/Inputs/Custom_DatePicker";
import { Custom_Select2 } from "../../../../../components/partials/Inputs/Custom_Select2";
import { Custom_TextField } from "../../../../../components/partials/Inputs/CustomITextField";
import { Filters } from "../../../RicercaBando/RicercaBandoContext";
import { TabStack } from "../../../../../components/partials/Tabs/TabStack";
import { useCollegaAltriDocumentiContext } from "./CollegaAltriDocumentiContext";
import { useWizardBandoContext } from "../../WizardBandoContext";
import { Option } from "../../../../../components/partials/Inputs/Custom_Select2";
import { OrganizzaDocumentoSelect, PubblicazioniSelect } from "../../WizardCreazioneBando_types";
import { ActionMeta, SingleValue } from "react-select";
import { Value } from "sass";
import { Label } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
type Props = {
    setRows: React.Dispatch<React.SetStateAction<any[]>>
}

export const CollegaDocumento_RicercaAvanzata = (props: Props) => {
    //oggetto filtri ricerca del context della sezione
    const { filters, setFilters } = useCollegaAltriDocumentiContext().filtriRicerca
    //booleano che determina l'apertura o la chiusura della ricerca avanzata
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // variabile delle tab della ricerca avanzata
    const [activeTab, setActiveTab] = useState<number>(0);
    //variabili per select fuori dalla ricerca avanzata
    const [annoRif, setAnnoRif] = useState<any>({ label: `${filters.annoRif}`, value: filters.annoRif })
    const [searchText, setSearchText] = useState<string>(filters.searchText);

    const tabs = [
        {
            text: 'Tutto il Sistema'
        },
        {
            text: 'Protocolli'
        },
        {
            text: 'Anagrafiche'
        },
        {
            text: 'Archivi'
        },
        {
            text: 'Pubblicazioni'
        },
    ];

    const options = {
        annoRif: [
            {
                value: 2024,
                label: "2024"
            },
            {
                value: 2025,
                label: "2025",
            },
            {
                value: 2026,
                label: "2026"
            },
            {
                value: 2027,
                label: "2027"
            },
            {
                value: 2028,
                label: "2028"
            },
            {
                value: 2029,
                label: "2029"

            },
            {
                value: 2030,
                label: "2030"
            },
        ],

    }

    const handleSearch = async () => {
        // DEVI RIPASSARE GLI OGGETTI DATA IN FORMATO YYYY/MM/DD !!!!
    }
    //funzione che gestisce l'handleChange di tutti gli input 
    //NOTA BENE: se sono input TEXT utilizzare solo newValue come valore in quanto arriverà gia di per se come stringa
    const handleChange = useDebounce((newValue: any, field: string) => {
        let newFilters: any = {
            ...filters
        }

        switch (field) {

            case 'searchText':
                newFilters.searchText = newValue;
            break;

            case 'anno-riferimento':
                newValue ? newFilters.annoRif = parseInt(newValue.value) : delete newFilters['annoRif'];
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


        }

        setFilters(newFilters);

    }, 300)

    const resetFilters = () => {
        const resettedFilters = {
            annoRif: annoRif ? annoRif.value : null,
            searchText: searchText
        }
        // resetta tutti gli state degli input
        setFilters(resettedFilters);
    };

    //watcher per pulire i filtri se si effettua quando isOpen è false
    useEffect(() => {
        if (!isOpen) {
            resetFilters();
        }
    }, [isOpen]);

    return (
        <Box sx={{ margin: '0 1rem' }}>
            <Box>
                <Grid container>
                    <Grid item xs={12} sm={8} lg={6} padding={'0 .5rem'}>
                        <Custom_TextField
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                handleChange(e.target.value, 'searchText')
                            }
                            }
                            backgroundColor='#fff'
                            label={'Parola chiave'}
                            placeholder='Inserisci parola chiave...'
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} lg={3} padding={'0 .5rem'}>
                        <Custom_Select2
                            onChangeSelect={(newValue) => {
                                setAnnoRif(newValue);
                                handleChange(newValue, 'anno-riferimento')
                            }}
                            label='Anno di riferimento'
                            isClearable
                            options={options.annoRif}
                            defaultValue={options.annoRif[0]}
                            value={annoRif}
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
                            color={isOpen ? 'error' : 'warning'} text={isOpen ? 'Annulla' : 'Ricerca Avanzata'}
                            endIcon={<Icon>{isOpen ? 'filter_alt_off' : 'filter_alt'}</Icon>}
                        />
                    </Grid>
                </Grid>
                <Divider />
            </Box>

            <Collapse sx={{ backgroundColor: 'aliceblue', borderTop: '1px efefef', paddingTop: '.5rem' }} in={isOpen} timeout={'auto'} unmountOnExit>
                <TabStack tabs={tabs} setTab={setActiveTab} activeTab={activeTab} />
                <DisplayTabContentComponent filters={filters} activeTab={activeTab} onChangeFunction={handleChange} />
                <Divider /> 
            </Collapse>
        </Box>
    )
}


const DisplayTabContentComponent = ({ activeTab, onChangeFunction, filters }: { activeTab: number, onChangeFunction: (newValue: any, field: string) => void, filters:any }) => {
    //creo un oggetto comprendente tutte le opzioni per le select
    const selectOptionsObj = useWizardBandoContext().selectOptions;
    const selectOptions = {
        ...selectOptionsObj.organizzaDocumentoSelectValues!,
        ...selectOptionsObj.pubblicazioniSelectValues!
    };
    //switch per fare eseguire il display delle sezioni del form

    return (
        <>
            <FirstFormStep className={activeTab !== 0 ? 'd-none' : ''} onChangeFunction={onChangeFunction} selectOptions={selectOptions} filters={filters}/>
        </>
    );


}


const FirstFormStep = ({ onChangeFunction, selectOptions, className, filters }: { onChangeFunction: (newValue: any, field: string) => void, selectOptions: PubblicazioniSelect & OrganizzaDocumentoSelect, className: string, filters?:any }) => {
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
                    <Custom_Select2 label="A.O.O." options={selectOptions.aoo} onChangeSelect={(newValue) => onChangeFunction(newValue, 'aoo')} isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={4} padding={'0 .5rem'}>
                    <Custom_Select2 label="Classe documentale" options={selectOptions.classi_documentali} onChangeSelect={(newValue) => onChangeFunction(newValue, 'classi-doc')} placeholder="Seleziona classe documentale..."  isClearable/>
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
                    <Custom_Select2 label="Caricato da" options={selectOptions.utenti_firmatari} onChangeSelect={(newValue) => onChangeFunction(newValue, 'caricato-da')} placeholder="Seleziona stato del documento..."  isClearable/>

                </Grid>

                <Grid item xs={12} md={6} lg={3} padding={'0 .5rem'}>
                    <Custom_DatePicker maxDate={filters.fdDataFine ? filters.fdDataFine : null} label={'Data inizio'} onChange={(newValue) => onChangeFunction(newValue, 'data-inizio')} isClearable />
                </Grid>

                <Grid item xs={12} md={6} lg={3} padding={'0 .5rem'}>
                    <Custom_DatePicker minDate={filters.fdDataInizio ? filters.fdDataInizio : null} label={'Data fine'} onChange={(newValue) => onChangeFunction(newValue, 'data-fine')} isClearable/>
                </Grid>
            </Grid>
        </Box>
    )
}