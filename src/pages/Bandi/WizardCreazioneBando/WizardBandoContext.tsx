import { createContext, useContext, useEffect, useState } from "react";

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
    scadenza?: string | number | null;
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
    fdDataAffissioneInizio?:string;
    fdDataAffissioneFine?:string
}

type WizardBandoContextProvider = {
    children: React.ReactNode;
};

export const WizardBandoContext = createContext<WizardBandoContext | null>(null);

export default function WizardBandoContextProvider({ children }: WizardBandoContextProvider) {
    const [listaAttivita, setListaAttivita] = useState<AttivitaObj[] | []>([]);
    const [fascicoliSelezionati, setFascicoliSelezionati] = useState<number[] | []>([]);
    const [archivioCollegato, setArchivioCollegato] = useState<number | null>(null);

    useEffect(() => {
        console.log("Procedimento: ", listaAttivita)
    }, [listaAttivita])
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