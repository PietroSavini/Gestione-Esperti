import { createContext, useContext, useEffect, useState } from "react";

type WizardBandoContext = {
    attivita: {
        listaAttivita: AttivitaObj[];
        setListaAttivita: React.Dispatch<React.SetStateAction<AttivitaObj[]>>;
    };
    fascicoli:{
        fascicoliSelezionati: number[];
        setFascicoliSelezionati: React.Dispatch<React.SetStateAction<number[]>>;
    }
};

export type AttivitaObj = {
    Id:string | number;
    delete:boolean; //false se è componente che è cancellabile 
    sortableDisabled?:boolean; //true se componente non ha dragNDrop e riallocazione tramite posizione
    posizione:number;
    actionDett?:string;
    actionId?:string|number;
    actionDesc?:string;
    actionName?:string;
    fdMaxDateExecution?: string | number | null;
    fiExtimatedDuration?: number | string | null;
    fiGruppoId?: string | number | null;
    fiUserId?: number | null; //credo sia lo user che ha creato il procedimento o il documento
    fsDescriptionOfUserActivity?:string | null;
    fiProcessOwnerId?: string |number | null;
    fsOggetto?:string | null;
    //PARAMETRI AZIONI PARTICOLARI
    fiActionId?:number;
    fsAction?:string;
    fsActionName?:string;
    fsActionDesc?:string;
    fsActionDett?:string;
    fsDescrizioneAttivita?:string // campi note libere delle sezioni
    //param x BI - AT - ALBO common
    fsAnnotazioni?:string; //annotazioni 
    fsAttoId?: string; // chiedere bene a daniele
    //parametri firma
    //fsAction: -> campo tipo firma
    fbDaFirmare?:boolean;
    fiTipoFirma?:number;
    //parametri protocollo
    fiDaProtocollare?:boolean;
    //parametri amministrazione trasparente
    //fsAction: AT
    fiDaPubblicare?:boolean; // fi?? // amministrazione trasparente -> 
    //parametri albo online
    //fsAction: ALBO
    fiUfficioId?: number;
    fiTipoAttoId?: number | null;
    fsDestinatarioDescrizione?:string;
    fiPubblicazioneAlbo?:boolean; // fi?? dovrebbe essere fb
    fbDirittoOblio?:boolean; // trovato per Albo Online
    fsRichiedente?:string; //trovato per albo online // in agd c'e' scritto "Richiedente Albo"
    //parametri Bachece Istituzionali
    //fsAction: BACIST
    fiPubblicazioneBI?: boolean; //fi??
    //param che servono per creare oggetto pubblicazione  es: pubblicazione_albo/bacheche/trasparenza -> ogetto che viene aggiunto al JSON di invio per ogni sezione pubblicazione aggiunta
    fbAnnullato?:boolean;
    fiTipoId?:number; //da chiedere bene
}

type WizardBandoContextProvider = {
    children: React.ReactNode;
};

export const WizardBandoContext = createContext<WizardBandoContext | null>(null);

export default function WizardBandoContextProvider ({children}: WizardBandoContextProvider) {
    const [listaAttivita, setListaAttivita] = useState<AttivitaObj[] | []>([]);
    const [fascicoliSelezionati, setFascicoliSelezionati] = useState<number[] | []>([]);
    useEffect(() => {
        console.log("Procedimento: ",listaAttivita)
    }, [listaAttivita])
    //aggiungere altri useState necessari per altre liste come i punteggi del bando etc..
    return (
        <WizardBandoContext.Provider 
            value={{
                attivita:{
                    listaAttivita,
                    setListaAttivita,
                },
                fascicoli:{
                    fascicoliSelezionati,
                    setFascicoliSelezionati
                }
                //aggiungere anche qui...
            }}
        >
            {children}
        </WizardBandoContext.Provider>
    )
};

//custom hook -> creato per evitare di ripetere codice e sopratutto per evitare di definire ogni volta il comportamento nel caso in cui WizardBandoContext è null
export function useWizardBandoContext () {
    const context = useContext(WizardBandoContext);
    if(!context){
        throw new Error(" useWizardBandoContext() deve essere usato all'interno di WizardBandoContextProvider")
    };
    return context;
};