import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Option } from '../../../components/partials/Inputs/Custom_Select2';
import { Tview } from '../../../components/partials/TreeView/Treeview';

export type lista_aoo = {
    fiId:number;
    fsDescrizione:string;
    fsCognomeResponsabile:string;
    fsNomeResponsabile:string;
}

export type lista_archivi ={
    fiDossierId:number;
    fiDossierIdRef:number;
    fsDossierName:string;
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
    fiTypeId:number;
    fsTypeName:string;
    fsCSClass:string;
    fjAttributi: string;
}

export type lista_gruppo_utenti = {
    fiGroupId:number;
    fsGroupName:string;
    fsGroupExtDescription:string;
}

export type lista_modelli_procedimento = {
    iTotalRow:number;
    fiProcessModelId:number;
    fsProcessModelSubject:string;
    fsProcessModelDescription:string;
}

export type lista_tipi_attivita = {
    fiActionId:number;
    fsActionName:string;
    fsActionDescription:string;
    fsAction:string;
}

export type lista_titolari = {
    fiMasterId:number;
    fiDetailId:number;
    rif:string;
    fiRifDetailId:number;
    fsDescrizione:string;
    Codice:string;
    CodiceTitolo:string;
    Codicec:string;
    DesConCodice: string;
}

export type lista_utenti = {
    fiUserId:number;
    fsUtente:string;
}

export type lista_utenti_firmatari = {
    fiUserId:number;
    fsUtente:string;
}

export type Liste = {
    lista_aoo: lista_aoo[]|[];
    lista_archivi: lista_archivi[]|[];
    lista_assegnatari:lista_assegnatari[]|[];
    lista_classi_documentali: lista_classi_documentali[]|[];
    lista_gruppo_utenti: lista_gruppo_utenti[]|[];
    lista_modelli_procedimento: lista_modelli_procedimento[]|[];
    lista_tipi_attivita: lista_tipi_attivita[]|[];
    lista_titolari:lista_titolari[]|[];
    lista_utenti:lista_utenti[]|[];
    lista_utenti_firmatari:lista_utenti_firmatari[]|[];
}

export type OrganizzaDocumentoSelect= {
    aoo: Option[]|[];
    archivi: Option[]|[];
    assegnatari: Option[]|[];
    classi_documentali: Option[]|[];
    gruppo_utenti: Option[]|[];
    modelli_procedimento: Option[]|[];
    tipi_attivita: Option[]|[];
    titolari: Option[]|[];
    utenti: Option[]|[];
    utenti_firmatari: Option[]|[];
}

type OrganizzaDocumentoSlice = {
    liste: Liste | undefined;
    selectOptions: OrganizzaDocumentoSelect | undefined
    treeViewData: Tview[] | []
}

//initialState
const initialState: OrganizzaDocumentoSlice = {
    liste:undefined,
    selectOptions:undefined,
    treeViewData:[],
}

const organizzaDocumentoSlice = createSlice({
    name:'organizzaDocumento',
    initialState,
    reducers:{
        //action/reducer per settaggio delle liste
        setOrganizzaDocumentoData :(state, action: PayloadAction<Liste>) => {
            state.liste = action.payload;
        },
        //action/reducer per il settaggio dei valori delle select
        setOrganizzaDocumentoSelect: (state, action: PayloadAction<OrganizzaDocumentoSelect>) =>{
            state.selectOptions = action.payload;
        },
         //action/reducer per il settaggio dei valori dei dati ad albero
        setOrganizzaDocumentoTreeViewData: (state, action: PayloadAction<Tview[]>) => {
            state.treeViewData = action.payload;
        },
   
    },
})

//esporto le azioni
export const { setOrganizzaDocumentoData, setOrganizzaDocumentoSelect, setOrganizzaDocumentoTreeViewData } = organizzaDocumentoSlice.actions;
//esporto il reducer
export default organizzaDocumentoSlice.reducer;
// esporto le funzioni per l'hook UseSelector
export const selectOrganizzaDocumentoData = (state: RootState) => state.organizzaDocumento.liste;
export const selectOrganizzaDocumentoSelect = (state: RootState) => state.organizzaDocumento.selectOptions;
export const selectOrganizzaDocumentoTreeViewData = (state:RootState) => state.organizzaDocumento.treeViewData;
