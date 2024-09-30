import { createContext, useContext, useEffect, useState } from "react";
import { Option } from '../../../components/partials/Inputs/Custom_Select2';
import AXIOS_HTTP from "../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import { TipologiaEspertoRow } from "../../SettingsPage/types";
import { lista_utenti } from "../../../app/store/Slices/organizzaDocumentoSlice";
import { createOptionArray } from "../../../app/AXIOS_ENGINE/functions/handlers";


type RicercaBandoContext = {
    filtriRicerca:{
        filters: Filters
        setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    },

    selectValues : {
        tipologiaEsperto: Option[];
        users: Option[];
    }

};

export type Filters = {
    anno: number | null;
    TEsp: number | null;
    searchPattern: string | null;
    numeroProtocollo: string | number | null;
    numeroProcedimento : string | number | null;
    stato: string | number | null;
    utenteFirmatario: string | number | null;
    dataCreazione: string | null;
}


type RicercaBandoContextProvider = {
    children: React.ReactNode;
};

export const RicercaBandoContext = createContext<RicercaBandoContext | null>(null);

export default function RicercaBandoContextProvider({ children }: RicercaBandoContextProvider) {

    const defaultFilters: Filters = {
        anno: 2024,
        TEsp: null,
        searchPattern: null,
        numeroProtocollo: null,
        numeroProcedimento: null,
        stato: null,
        utenteFirmatario: null,
        dataCreazione: null,
    };

    //states
    //default per i filtri
    const [ filters, setFilters] = useState<Filters>(defaultFilters);
    //valori per select Tipologia Esperto 
    const [TEspMenuItems, setTEspMenuItems] = useState<Option[] | []>([]);
    const [users, setUsers] = useState<Option[] | []>([])

    useEffect(() => {
        if(TEspMenuItems.length === 0 || users.length === 0){
            Promise.all([
                retrieveTEspOptions(),
                retrieveUsers()
            ]).catch(err =>console.error(err))
        }
    }, []);

    useEffect(() => {
        console.log(filters)
    },[filters])

    const retrieveTEspOptions = async () => {
        await AXIOS_HTTP.Retrieve({ sService: 'READ_TIPOLOGIA_ESPERTO', sModule: 'IMPOSTAZIONI_GET_ALL_TIPOLOGIE_ESPERTO', url: '/api/launch/retrieve', body: null })
            .then((res) => {
                let optionsArr: any = []
                const TEspArr: TipologiaEspertoRow[] = res.response;
                const onlyVisTEsp = TEspArr.filter((tipologia) => tipologia.TEspVis === true);
                onlyVisTEsp.forEach(element => optionsArr.push({value:element.TEspId, label:element.TEspBr}));
                setTEspMenuItems(optionsArr)
            })
            .catch((err) => console.log(err))

    }

    const retrieveUsers = async () => {
        await AXIOS_HTTP.Retrieve({ sService: 'READ_DOCUMENTI', sModule: 'GET_UTENTI_FIRMA_DIGITALE2', url: '/api/launch/organizzaDocumento', body: null })
        .then((res) => {
            const usersArr:  lista_utenti[] = res.response;
            const optionsArr = createOptionArray({arr: usersArr, value:'user_id', label:'utente'});
            setUsers(optionsArr)
        })
        .catch((err) => console.log(err))
    } 
    //aggiungere altri useState necessari per altre liste come i punteggi del bando etc..
    return (
        <RicercaBandoContext.Provider
            value={{
               filtriRicerca:{
                    filters: filters,
                    setFilters: setFilters
               },
               selectValues:{
                    tipologiaEsperto: TEspMenuItems,
                    users: users,
               }
               
            }}
        >
            {children}
        </RicercaBandoContext.Provider>
    )
};

//custom hook -> creato per evitare di ripetere codice e sopratutto per evitare di definire ogni volta il comportamento nel caso in cui WizardBandoContext è null
export function useRicercaBandoContext() {
    const context = useContext(RicercaBandoContext);
    if (!context) {
        throw new Error(" useRicercaBandoContext() deve essere usato all'interno di RicercaBandoContextProvider")
    };
    return context;
};