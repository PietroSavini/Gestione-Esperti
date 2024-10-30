import { createContext, useContext, useEffect, useState } from "react";
import { useWizardBandoContext } from "../../WizardBandoContext";

type RicercaBandoContext = {
    dialog:{
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }
    filtriRicerca: {
        filters: any
        setFilters: React.Dispatch<React.SetStateAction<any>>;
    },
    dataGrid: {
        rows: any[];
        setRows: React.Dispatch<React.SetStateAction<any[]>>;
    }
    advancedResearchSteps: {
        currentStep: number;
        setStep: React.Dispatch<React.SetStateAction<number>>;
    },
    connectedDocuments:{
        selectedDocuments:any[];
        setSelectedDocuments: React.Dispatch<React.SetStateAction<any[]>>
    }
};


type RicercaBandoContextProvider = {
    children: React.ReactNode;
};

export const CollegaAltriDocumentiContext = createContext<RicercaBandoContext | null>(null);

export default function CollegaAltriDocumentiContextProvider({ children }: RicercaBandoContextProvider) {
    //filteri impostati di default
    const defaultFilters: any = {
        searchYear: 2024,
    };
    //states
    //state del dialog
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>(defaultFilters);
    //rows per la datagrid dei risultati
    const [rows, setRows] = useState<any[]>([])
    //state degli step della ricerca avanzata 
    const [currentStep, setStep] = useState<number>(0);
    //state dei documenti selezionati da collegare
    const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);

    const resetStateAndClose = () => {
        setSelectedDocuments([]);
        setRows([]);
        setFilters(defaultFilters);
    };

    useEffect(() => {
        if(!isOpen){
            resetStateAndClose();
        }
    }, [isOpen]);

    useEffect(() => {
        console.log('filtri ricerca avanzata: ', filters)
    }, [filters]);

    useEffect(() => {
        console.log('DOCUMENTI DA COLLEGARE: ',selectedDocuments)
    },[selectedDocuments])

    //aggiungere altri useState necessari per altre liste come i punteggi del bando etc..
    return (
        <CollegaAltriDocumentiContext.Provider
            value={{
                dialog:{
                    isOpen: isOpen,
                    setIsOpen: setIsOpen
                },
                filtriRicerca: {
                    filters: filters,
                    setFilters: setFilters
                },
                dataGrid: {
                    rows: rows,
                   setRows: setRows
                },
                advancedResearchSteps: {
                    currentStep: currentStep,
                    setStep: setStep
                },
                connectedDocuments:{
                    selectedDocuments:selectedDocuments,
                    setSelectedDocuments:setSelectedDocuments
                }
            }}
        >
            {children}
        </CollegaAltriDocumentiContext.Provider>
    )
};

//custom hook -> creato per evitare di ripetere codice e sopratutto per evitare di definire ogni volta il comportamento nel caso in cui WizardBandoContext è null
export function useCollegaAltriDocumentiContext() {
    const context = useContext(CollegaAltriDocumentiContext);
    if (!context) {
        throw new Error(" useCollegaAltriDocumentiContext() deve essere usato all'interno di CollegaAltriDocumentiContextProvider")
    };
    return context;
};