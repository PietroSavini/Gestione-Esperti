import { createContext, useContext, useEffect, useState } from "react";
import AXIOS_HTTP from "../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import { createOptionArray, createTitolariOptionArray } from "../../../app/AXIOS_ENGINE/functions/handlers";
import { AttivitaObj, OrganizzaDocumentoListe, OrganizzaDocumentoSelect, PubblicazioniListe, PubblicazioniSelect, PunteggiFinali, } from "./WizardCreazioneBando_types";
import { Requisito_Table } from "../../SettingsPage/types";

type WizardBandoContext = {
    attivita: {
        listaAttivita: AttivitaObj[];
        setListaAttivita: React.Dispatch<React.SetStateAction<AttivitaObj[]>>;
    };
    fascicoli: {
        fascicoliSelezionati: number[];
        setFascicoliSelezionati: React.Dispatch<React.SetStateAction<number[]>>;
    };
    archivi: {
        archivioCollegato: number | null;
        setArchivioCollegato: React.Dispatch<React.SetStateAction<number | null>>;
    };
    punteggi: {
        punteggi: [] | PunteggiFinali[];
        setPunteggi: React.Dispatch<React.SetStateAction<[] | PunteggiFinali[]>>;
    }
    requisitiPunteggiList: {
        requisitiPunteggi: Requisito_Table[] | [];
        setRequisitiPunteggi: React.Dispatch<React.SetStateAction<[] | Requisito_Table[]>>;
    }
    listePubblicazioni: PubblicazioniListe | null;
    listeOrganizzaDocumento: OrganizzaDocumentoListe | null;
    selectOptions: {
        pubblicazioniSelectValues: PubblicazioniSelect | null;
        organizzaDocumentoSelectValues: OrganizzaDocumentoSelect | null;
    },
    documentiCollegati:{
        documentiCollegatiList:any[]
        setDocumentiCollegatiList: React.Dispatch<React.SetStateAction<any[]>>
    }
};

type WizardBandoContextProvider = {
    children: React.ReactNode;
};

export const WizardBandoContext = createContext<WizardBandoContext | null>(null);

export default function WizardBandoContextProvider({ children }: WizardBandoContextProvider) {
    //Array da inserire nella funzione finale di submit da inviare a web service con la chiamata di creazione del bando
    //Procedimento
    const [listaAttivita, setListaAttivita] = useState<AttivitaObj[] | []>([]);
    //fascicoli collegati
    const [fascicoliSelezionati, setFascicoliSelezionati] = useState<number[] | []>([]);
    //archivi collegati
    const [archivioCollegato, setArchivioCollegato] = useState<number | null>(null);
    //lista requisiti e punteggi (per le tabelle requisiti e punteggi in formStep1)
    const [requisitiPunteggi, setRequisitiPunteggi] = useState<Requisito_Table[] | []>([]);
    //punteggi da inviare 
    const [punteggi, setPunteggi] = useState<PunteggiFinali[] | []>([]);
    // documenti collegati al bando
    const [documentiCollegatiList, setDocumentiCollegatiList] = useState<any[]>([]);

    //Liste e selectOptions
    //pubblicazioni
    const [pubblicazioniListe, setPubblicazioniListe] = useState<PubblicazioniListe | null>(null);
    const [pubblicazioniSelectValues, setPubblicazioniSelectValues] = useState<PubblicazioniSelect | null>(null);
    //organizza documento
    const [organizzaDocumentoListe, setOrganizzaDocumentoListe] = useState<OrganizzaDocumentoListe | null>(null);
    const [OrganizzaDocumentoSelectValues, setOrganizzaDocumentoSelectValues] = useState<OrganizzaDocumentoSelect | null>(null);
    //-------------------------------------------------------------- funzioni di salvataggio nello state di liste e Select Values provenienti dalle chiamate HTTP----------------------------------------------------------------------------------------------
    function saveSelectPubblicazioni(data: PubblicazioniListe) {
        //salvo i dati all' interno delle liste 
        setPubblicazioniListe(data);
        //separo le liste per elaborare le select
        const listaUffici = data.lista_uffici;
        const listaTipiAtto = data.lista_tipi_atto;
        const listaTipiAttoBacheche = data.lista_tipi_atto_bacheche;
        const anagrafiche = data.lista_tipi_anagrafica;
        const listaSezioniTrasparenza = data.lista_sezioni_trasparenza;

        //preparo l'oggetto contenente gli array di oggetti Option per le select di pubblicazione
        const pubblicazioniSelectObject: PubblicazioniSelect = {
            trasparenza: createOptionArray({ arr: listaSezioniTrasparenza, value: 'id', label: 'name' }),
            uffici: createOptionArray({ arr: listaUffici, value: 'id', label: 'descrizione' }),
            atti: createOptionArray({ arr: listaTipiAtto, value: 'id', label: 'descrizione' }),
            bacheche: createOptionArray({ arr: listaTipiAttoBacheche, value: 'Key', label: 'Value' }),
            anagrafiche: createOptionArray({ arr: anagrafiche, value: 'idTipoAnagrafica', label: 'descrizione' }),
        };
        //salvo l'oggetto 
        setPubblicazioniSelectValues(pubblicazioniSelectObject)
    };

    function saveOrganizzaDocumento(data: OrganizzaDocumentoListe) {
        //salvo i dati all'interno delle liste
        setOrganizzaDocumentoListe(data);
        //separo le liste per elaborare le select

        const aoo = data.lista_aoo;
        const listaArchivi = data.lista_archivi;
        const assegnatari = data.lista_assegnatari;
        const classiDocumentali = data.lista_classi_documentali;
        const gruppoUtenti = data.lista_gruppo_utenti;
        const modelliProcedimento = data.lista_modelli_procedimento;
        const listaAttivita = data.lista_tipi_attivita;
        const titolari = data.lista_titolari;
        const utentiFirmatari = data.lista_utenti_firmatari;

        //preparo l'oggetto contenente gli array di oggetti Option per le select di OrganizzaDocumento
        const organizzaDocumentoSelecObject: OrganizzaDocumentoSelect = {

            aoo: createOptionArray({ arr: aoo, value: 'id', label: 'descrizione' }),
            archivi: createOptionArray({ arr: listaArchivi, value: 'dossier_id', label: 'dossier_name' }),
            assegnatari: createOptionArray({ arr: assegnatari, value: 'fgId', label: 'fsAssigneeUser' }),
            classi_documentali: createOptionArray({ arr: classiDocumentali, value: 'type_id', label: 'type_name' }),
            gruppo_utenti: createOptionArray({ arr: gruppoUtenti, value: 'id', label: 'groupName' }),
            modelli_procedimento: createOptionArray({ arr: modelliProcedimento, value: 'pm_id', label: 'pm_ext_desc' }),
            tipi_attivita: createOptionArray({ arr: listaAttivita, value: 'actionId', label: 'actionName' }),
            titolari: createTitolariOptionArray(titolari),
            utenti_firmatari: createOptionArray({ arr: utentiFirmatari, value: 'user_id', label: 'utente' }),
        };

        //salvo l'oggetto
        setOrganizzaDocumentoSelectValues(organizzaDocumentoSelecObject);
    };

    //CHIAMATE DI INIZIALIZZAZIONE PER PRENDERE VALORI DELLE SELECT E DELLE LISTE CHE SERVONO PER IL CORRETTO FUNZIONAMENTO DEL FORM WIZARDBANDO
    async function GET_ORGANIZZA_DOCUMENTO_SELECT_DATA() {
        await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_ORGANIZZA_DOCUMENTO', sService: 'READ_DOCUMENTI', body: {} })
            .then((res) => {
                saveOrganizzaDocumento(res.response);
            })
            .catch((err) => console.error(err));

    };

    async function GET_PUBBLICAZIONI_SELECT_DATA() {
        await AXIOS_HTTP.Retrieve({ url: '/api/launch/organizzaDocumento', sModule: 'GET_PUBBLICAZIONE', sService: 'READ_DOCUMENTI', body: {} })
            .then((res) => {
                saveSelectPubblicazioni(res.response);
            })
            .catch((err) => console.error(err));
    };
    //eseguo chiamate di inizializzazione dati al rendering del Context
    useEffect(() => {
        Promise.all([
            GET_ORGANIZZA_DOCUMENTO_SELECT_DATA(),
            GET_PUBBLICAZIONI_SELECT_DATA()
        ])
    }, []);

    //Watcher per i console.log
    useEffect(() => {
        console.log("Procedimento: ", listaAttivita);
    }, [listaAttivita]);

    useEffect(() => {
        console.log("Punteggi: ", punteggi);
    }, [punteggi]);

    //watcher che converte la lista dei requisiti e dei punteggi nella lista dei punteggi da inviare a backend
    useEffect(() => {
        let resultArr: any = [];
        requisitiPunteggi.map((item) => {
            const firstItem = {
                reqId: item.fi_ee_req_id,
                puntVal: 0
            };
            resultArr.push(firstItem)
            if (item.requisiti_list.length > 0) {
                item.requisiti_list.map((sottoItem) => {
                    const sottoReq = {
                        reqId: sottoItem.fi_ee_req_id,
                        puntVal: sottoItem.fi_ee_req_punteggio
                    }
                    resultArr.push(sottoReq)
                });
            };
        })
        setPunteggi(resultArr);
    }, [requisitiPunteggi]);



    useEffect(() => {
        console.log('DOCUMENTI COLLEGATI AL BANDO: ', documentiCollegatiList);
    },
    [documentiCollegatiList]);
    
    //aggiungere altri useState necessari per altre liste come i punteggi del bando etc..
    return (
        <WizardBandoContext.Provider
            value={{
                attivita: {
                    listaAttivita,
                    setListaAttivita,
                },
                fascicoli: {
                    fascicoliSelezionati,
                    setFascicoliSelezionati
                },
                archivi: {
                    archivioCollegato,
                    setArchivioCollegato
                },
                punteggi: {
                    setPunteggi: setPunteggi,
                    punteggi: punteggi
                },
                requisitiPunteggiList: {
                    requisitiPunteggi: requisitiPunteggi,
                    setRequisitiPunteggi: setRequisitiPunteggi,
                },
                listeOrganizzaDocumento: organizzaDocumentoListe,
                listePubblicazioni: pubblicazioniListe,
                selectOptions: {
                    organizzaDocumentoSelectValues: OrganizzaDocumentoSelectValues,
                    pubblicazioniSelectValues: pubblicazioniSelectValues,
                },
                documentiCollegati:{
                    documentiCollegatiList:documentiCollegatiList,
                    setDocumentiCollegatiList:setDocumentiCollegatiList,
                }

            }}
        >
            {children}
        </WizardBandoContext.Provider>
    )
};

//custom hook -> creato per evitare di ripetere codice e sopratutto per evitare di definire ogni volta il comportamento nel caso in cui WizardBandoContext è null
export function useWizardBandoContext() {
    const context = useContext(WizardBandoContext);
    if (!context) {
        throw new Error(" useWizardBandoContext() deve essere usato all'interno di WizardBandoContextProvider")
    };
    return context;
};