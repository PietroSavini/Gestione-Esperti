import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Option } from '../../../components/partials/Inputs/Custom_Select2';
import { Tview } from '../../../components/partials/TreeView/Treeview';

export type lista_aoo = {
    id:number;
    descrizione:string;
    cognomeResp:string;
    nomeResp:string;
    default: boolean; //se true è defaultSelected
}

export type lista_archivi ={
    dossier_id:number;
    dossier_ref_id:number;
    dossier_name:string;
}

export type lista_assegnatari = {
    fgId:number;
    fiFileId:number;
    fiAssigneeUserId:number;
    fsAssigneeUser:string;
    fsAllocatorUser:string;
    fiAllocatorUserId:number;
    fdAssigneeDate: Date;
    fsAnnotation:string;
}

export type lista_classi_documentali = {
    type_id:number;
    type_name:string;
    csc:string;
    attributi: string;
}

export type lista_gruppo_utenti = {
    id:number;
    groupName:string;
    groupDescription:string;
}

export type lista_modelli_procedimento = {
    row:number;
    pm_id:number;
    pm_subject:string;
    pm_ext_desc:string;
}

export type lista_tipi_attivita = {
    actionId:number;
    actionName:string;
    actionDesc:string;
    actionDett:string;
}

export type lista_titolari = {
    id:number;
    detailId:number;
    rif:string;
    rifDetailId:number;
    descrizione:string;
    codice:string;
    codTitolo:string;
    codC:string;
    descCodice: string;
};

export type lista_utenti = {
    user_id:number;
    utente:string;
};

export type lista_utenti_firmatari = {
    user_id:number;
    utente:string;
};

export type Liste = {
    lista_aoo: lista_aoo[]|[];
    lista_archivi: lista_archivi[]|[];
    lista_assegnatari:lista_assegnatari[]|[];
    lista_classi_documentali: lista_classi_documentali[]|[];
    lista_gruppo_utenti: lista_gruppo_utenti[]|[];
    lista_modelli_procedimento: lista_modelli_procedimento[]|[];
    lista_tipi_attivita: lista_tipi_attivita[]|[];
    lista_titolari: lista_titolari[]|[];
    lista_utenti_firmatari: lista_utenti_firmatari[]|[];
};

export type OrganizzaDocumentoSelect= {
    aoo: Option[]|[];
    archivi: Option[]|[];
    assegnatari: Option[]|[];
    classi_documentali: Option[]|[];
    gruppo_utenti: Option[]|[];
    modelli_procedimento: Option[]|[];
    tipi_attivita: Option[]|[];
    titolari: Option[]|[];
    utenti_firmatari: Option[]|[];
};

type OrganizzaDocumentoSlice = {
    liste: Liste | undefined;
    selectOptions: OrganizzaDocumentoSelect | undefined
    treeViewData: Tview[] | []
};

//initialState
const initialState: OrganizzaDocumentoSlice = {
    liste:undefined,
    selectOptions:undefined,
    treeViewData:[],
};

const organizzaDocumentoSlice = createSlice({
    name:'organizzaDocumento',
    initialState,
    reducers:{
        setOrganizzaDocumento: (state, action: PayloadAction<OrganizzaDocumentoSlice>) => {
            console.log('salvo', action.payload)
            state.liste = action.payload.liste;
            state.selectOptions = action.payload.selectOptions;
            state.treeViewData = action.payload.treeViewData;
        },
        //action/reducer per settaggio delle liste
        setOrganizzaDocumentoData: (state, action: PayloadAction<Liste | undefined>) => {
           state.liste = action.payload
        },
        //action/reducer per il settaggio dei valori delle select
        setOrganizzaDocumentoSelect: (state, action: PayloadAction<OrganizzaDocumentoSelect | undefined>) =>{
            state.selectOptions = action.payload;
        },
         //action/reducer per il settaggio dei valori dei dati ad albero
        setOrganizzaDocumentoTreeViewData: (state, action: PayloadAction<Tview[]>) => {
            state.treeViewData = action.payload;
        },
    },
})

//esporto le azioni
export const { setOrganizzaDocumentoData, setOrganizzaDocumentoSelect, setOrganizzaDocumentoTreeViewData, setOrganizzaDocumento } = organizzaDocumentoSlice.actions;
//esporto il reducer
export default organizzaDocumentoSlice.reducer;
// esporto le funzioni per l'hook UseSelector
export const selectOrganizzaDocumentoData = (state: RootState) => state.organizzaDocumento.liste;
export const selectOrganizzaDocumentoSelect = (state: RootState) => state.organizzaDocumento.selectOptions;
export const selectOrganizzaDocumentoTreeViewData = (state:RootState) => state.organizzaDocumento.treeViewData;
