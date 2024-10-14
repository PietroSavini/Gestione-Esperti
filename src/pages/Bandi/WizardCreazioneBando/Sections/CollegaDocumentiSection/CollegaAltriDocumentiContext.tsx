import { createContext, useContext, useEffect, useState } from "react";
import { Option } from "../../../../../components/partials/Inputs/Custom_Select2";
import { useWizardBandoContext } from "../../WizardBandoContext";

type RicercaBandoContext = {
    filtriRicerca:{
        filters: any
        setFilters: React.Dispatch<React.SetStateAction<any>>;
    },
    dataGrid:{
        dataGridData: any[];
        setDataGridData: React.Dispatch<React.SetStateAction<any[]>>;
    }
    advancedResearchSteps:{
        currentStep: number;
        setStep:React.Dispatch<React.SetStateAction<number>>;
    }
};


type RicercaBandoContextProvider = {
    children: React.ReactNode;
};

export const CollegaAltriDocumentiContext = createContext<RicercaBandoContext | null>(null);

export default function CollegaAltriDocumentiContextProvider({ children }: RicercaBandoContextProvider) {
    //Accedo ai dati che mi servono dal WizardBando Context Provider.

    const defaultFilters: any = {
        annoRif: 2024,
    };

    //states
    //filtri
    const [ filters, setFilters] = useState<any>(defaultFilters);
    //rows per la datagrid dei risultati
    const [dataGridData, setDataGridData] = useState<any[]>([])
    //state degli step della ricerca avanzata 
    const [currentStep, setStep] = useState<number>(0);

    useEffect(() => {
      
    }, []);

    useEffect(() => {
        console.log('filtri ricerca avanzata: ',filters)
    },[filters]);
   
    //aggiungere altri useState necessari per altre liste come i punteggi del bando etc..
    return (
        <CollegaAltriDocumentiContext.Provider
            value={{
               filtriRicerca:{
                    filters: filters,
                    setFilters: setFilters
               },
               dataGrid:{
                dataGridData: dataGridData,
                setDataGridData: setDataGridData
               },
               advancedResearchSteps:{
                currentStep: currentStep,
                setStep: setStep
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