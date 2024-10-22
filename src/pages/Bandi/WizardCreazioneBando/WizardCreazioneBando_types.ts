import { Option } from "../../../components/partials/Inputs/Custom_Select2";



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
    fdDataAffissioneInizio?: any;
    fdDataAffissioneFine?: any
}

export type OrganizzaDocumentoSelect = {
    aoo: Option[] | [];
    archivi: Option[] | [];
    assegnatari: Option[] | [];
    classi_documentali: Option[] | [];
    gruppo_utenti: Option[] | [];
    modelli_procedimento: Option[] | [];
    tipi_attivita: Option[] | [];
    titolari: Option[] | [];
    utenti_firmatari: Option[] | [];
};

export type PubblicazioniListe = {
    lista_tipi_anagrafica: lista_tipi_anagrafica[] | [];
    lista_sezioni_trasparenza: sezioni_trasparenza_list[] | [];
    lista_tipi_atto: tipi_atto_list[] | [];
    lista_tipi_atto_bacheche: lista_tipi_atto_bacheche[] | [];
    lista_uffici: Lista_uffici[] | [];
}

export type PubblicazioniSelect = {
    trasparenza: Option[] | [];
    uffici: Option[] | [];
    atti: Option[] | [];
    bacheche: Option[] | [];
    anagrafiche: Option[] | [];

}

export type lista_aoo = {
    id: number;
    descrizione: string;
    cognomeResp: string;
    nomeResp: string;
    default: boolean; //se true è defaultSelected
}

export type lista_archivi = {
    dossier_id: number;
    dossier_ref_id: number;
    dossier_name: string;
}

export type lista_assegnatari = {
    fgId: number;
    fiFileId: number;
    fiAssigneeUserId: number;
    fsAssigneeUser: string;
    fsAllocatorUser: string;
    fiAllocatorUserId: number;
    fdAssigneeDate: Date;
    fsAnnotation: string;
}

export type lista_classi_documentali = {
    type_id: number;
    type_name: string;
    csc: string;
    attributi: string;
}

export type lista_gruppo_utenti = {
    id: number;
    groupName: string;
    groupDescription: string;
}

export type lista_modelli_procedimento = {
    row: number;
    pm_id: number;
    pm_subject: string;
    pm_ext_desc: string;
}

export type lista_tipi_attivita = {
    actionId: number;
    actionName: string;
    actionDesc: string;
    actionDett: string;
}

export type lista_titolari = {
    id: number;
    detailId: number;
    rif: string;
    rifDetailId: number;
    descrizione: string;
    codice: string;
    codTitolo: string;
    codC: string;
    descCodice: string;
};

export type lista_utenti = {
    user_id: number;
    utente: string;
};

export type lista_utenti_firmatari = {
    user_id: number;
    utente: string;
};

export type Lista_uffici = {
    id: number;
    descrizione: string;
}

export type Lista_tipi_anagrafica = {
    id: number;
    descrizione: string;
}

export type sezioni_trasparenza_list = {
    id: string;
    idMenuRef: string;
    name: string;
    posizione: string;
}

export type tipi_atto_list = {
    id: string;
    tipoAtto: string;
    descrizione: string;
    idAT: string;
}

export type lista_tipi_atto_bacheche = {
    Key: string;
    value: string;
}

type lista_tipi_anagrafica = {
    idTipoAnagrafica: number;
    descrizione: string;
}


export type OrganizzaDocumentoListe = {

    lista_aoo: lista_aoo[] | [];
    lista_archivi: lista_archivi[] | [];
    lista_assegnatari: lista_assegnatari[] | [];
    lista_classi_documentali: lista_classi_documentali[] | [];
    lista_gruppo_utenti: lista_gruppo_utenti[] | [];
    lista_modelli_procedimento: lista_modelli_procedimento[] | [];
    lista_tipi_attivita: lista_tipi_attivita[] | [];
    lista_titolari: lista_titolari[] | [];
    lista_utenti_firmatari: lista_utenti_firmatari[] | [];
};

export type DocumentoData = {
    TEsp: number | null;
    anno: string | null;
    aoo: number | null;
    archivioCollocazione: number | null;
    classeAddizionale: number | null;
    classeDocumentale: number | null;
    descrizioneEstesa: string | null;
    responsabile: number | null;
    tagDocumento: string | null
}

export type PunteggiFinali = {
    reqId: number | null;
    puntVal: number | null;
}

export type AttList = {
    actionId: number, // -> id
    actionDesc: string; // descrizione attività
    ActionDett: string; // dettaglio es(UPLOAD_DOC) -> value
    actionName: string; // lable attività -> lable
};