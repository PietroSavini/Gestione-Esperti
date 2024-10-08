import { createContext, useContext, useEffect, useState } from "react";
import AXIOS_HTTP from "../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import { PubblicazioniSelect, setPubblicazioniData, setPubblicazioniSelect } from "../../../app/store/Slices/pubblicazioneSlice";
import { OrganizzaDocumentoSelect, setOrganizzaDocumentoData, setOrganizzaDocumentoSelect } from "../../../app/store/Slices/organizzaDocumentoSlice";
import { useAppDispatch } from "../../../app/ReduxTSHooks";
import { createOptionArray, createTitolariOptionArray } from "../../../app/AXIOS_ENGINE/functions/handlers";

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
    }
};

export type AttivitaObj = {
    Id: string | number;
    delete: boolean; //false se è componente che è cancellabile 
    sortableDisabled?: boolean; //true se componente non ha dragNDrop e riallocazione tramite posizione
    posizione: number;
    actionDett?: string;
    actionId?: string | number;
    actionDesc?: string;
    actionName?: string;
    scadenza?: any;
    stima?: number | string | null;
    gruppoUtenti?: string | number | null;
    utente?: number | null; //credo sia lo user che ha creato il procedimento o il documento
    descrizioneAttivitaUtente?: string | null;
    utenteDelProcesso?: string | number | null;
    oggetto?: string | null;
    descrizioneAttivita?: string // campi note libere delle sezioni
    //param x BI - AT - ALBO common
    annotazioni?: string; //annotazioni 
    attoId?: string; // chiedere bene a daniele
    //parametri firma
    //fsAction: -> campo tipo firma
    daFirmare?: boolean;
    tipoFirma?: number;
    //parametri protocollo
    daProtocollare?: boolean;
    //parametri amministrazione trasparente
    //fsAction: AT
    daPubblicare?: boolean; // fi?? // amministrazione trasparente -> 
    //parametri albo online
    //fsAction: ALBO
    ufficio?: number;
    atto?: number | null;
    destinatarioDescrizione?: string;
    alboPubblicazione?: boolean; // fi?? dovrebbe essere fb
    dirittoOblio?: boolean; // trovato per Albo Online
    richiedente?: string; //trovato per albo online // in agd c'e' scritto "Richiedente Albo"
    //parametri Bachece Istituzionali
    //fsAction: BACIST
    pubblicazioneBI?: boolean; //fi??
    //param che servono per creare oggetto pubblicazione  es: pubblicazione_albo/bacheche/trasparenza -> ogetto che viene aggiunto al JSON di invio per ogni sezione pubblicazione aggiunta
    annullato?: boolean;
    tipoId?: number; //da chiedere bene
    fdDataAffissioneInizio?:any;
    fdDataAffissioneFine?:any
}

type WizardBandoContextProvider = {
    children: React.ReactNode;
};

export const WizardBandoContext = createContext<WizardBandoContext | null>(null);

export default function WizardBandoContextProvider({ children }: WizardBandoContextProvider) {
    const [listaAttivita, setListaAttivita] = useState<AttivitaObj[] | []>([]);
    const [fascicoliSelezionati, setFascicoliSelezionati] = useState<number[] | []>([]);
    const [archivioCollegato, setArchivioCollegato] = useState<number | null>(null);
    const dispatch = useAppDispatch();
    //-------------------------------------------------------------- funzioni di salvataggio in state redux ----------------------------------------------------------------------------------------------
    // select options x dati di pubblicazioni
    function saveSelectPubblicazioni(data: any) {
        const listaUffici = data.uffici_list;
        const listaTipiAtto = data.tipi_atto_list;
        const listaTipiAttoBacheche = data.tipo_atto_bacheche_list;
        const listaAnagrafiche = data.tipi_anagraficha_list;
        const listaSezioniTrasparenza = data.sezioni_trasparenza_list;
    
        const newSelectValuesObject: PubblicazioniSelect = {
          trasparenza: createOptionArray({ arr: listaSezioniTrasparenza, value: 'id', label: 'name' }),
          uffici: createOptionArray({ arr: listaUffici, value: 'id', label: 'descrizione' }),
          atti: createOptionArray({ arr: listaTipiAtto, value: 'id', label: 'descrizione' }),
          bacheche: createOptionArray({ arr: listaTipiAttoBacheche, value: 'Key', label: 'Value' }),
          anagrafiche: createOptionArray({ arr: listaAnagrafiche, value: 'id', label: 'descrizione' }),
        };
    
        dispatch(setPubblicazioniSelect(newSelectValuesObject));
      };
    
      function saveOrganizzaDocumento(data: any) {
        //salvo i dati cosi come sono 
        dispatch(setOrganizzaDocumentoData(data));
    
        //step 1 preparo la lista  dei volori delle selct
        const aoo = data.lista_aoo;
        const listaArchivi = data.lista_archivi;
        const assegnatari = data.lista_assegnatari;
        const classiDocumentali = data.lista_classi_documentali;
        const gruppoUtenti = data.lista_gruppo_utenti;
        const modelliProcedimento = data.lista_modelli_procedimento;
        const listaAttivita = data.lista_tipi_attivita;
        const titolari = data.lista_titolari;
        const utentiFirmatari = data.lista_utenti_firmatari;
        
        const newSelectValuesObject: OrganizzaDocumentoSelect = {
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
    
        dispatch(setOrganizzaDocumentoSelect(newSelectValuesObject));
      };
  
      //eseguo chiamate di inizializzazione dati
      useEffect(() => { 
        GET_ORGANIZZA_DOCUMENTO_SELECT_DATA();
        GET_PUBBLICAZIONI_SELECT_DATA();
      }, []);

    //-----------------------------------------------------------------------CHIAMATE PER VALORI DELLE SELECT----------------------------------------------------------------------------------------------------
    //CHIAMATE PER INIZIALIZZARE L'APPLICAZIONE
    //CHIAMATA PER INIZIALIZZARE I DATI CHE VERRANNO DATI ALLE SELECT PER L APPLICAZIONE
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
            dispatch(setPubblicazioniData(res.response));
            saveSelectPubblicazioni(res.response);
           
          })
          .catch((err) => console.error(err));
      };
      
    useEffect(() => {
        console.log("Procedimento: ", listaAttivita)
    }, [listaAttivita]);

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
                }
                //aggiungere anche qui...
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