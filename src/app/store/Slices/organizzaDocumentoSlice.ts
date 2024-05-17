import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'


type lista_aoo = {
    fiId:number;
    fsDescrizione:string;
    fsCognomeResponsabile:string;
    fsNomeResponsabile:string;
}

type lista_archivi ={
    fiDossierId:number;
    fiDossierIdRef:number;
    fsDossierName:string;
}

type lista_assegnatari = {
    fgId:number;
    fiFileId:number;
    fiAssigneeUserId:number;
    fsAssigneeUser:string;
    fsAllocatorUser:string;
    fiAllocatorUseId:number;
    fdAssigneeDate: Date;
    fsAnnotation:string;
}

type lista_classi_documentali = {
    fiTypeId:number;
    fsTypeName:string;
    fsCSClass:string;
    fjAttributi: string;
}

type lista_gruppo_utenti = {
    fiGroupId:number;
    fsGroupName:string;
    fsGroupExtDescription:string;
}

type lista_modelli_procedimento = {
    iTotalRow:number;
    fiProcessModelId:number;
    fsProcessModelSubject:string;
    fsProcessModelDescription:string;
}

type lista_tipi_attivita = {
    fiActionId:number;
    fsActionName:string;
    fsActionDescription:string;
}

type lista_titolari = {
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

type lista_utenti = {
    fiUserId:number;
    fsUtente:string;
}

type lista_utenti_firmatari = {
    fiUserId:number;
    fsUtente:string;
}

type OrganizzaDocumentoSlice = {
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

//initialState
const initialState: OrganizzaDocumentoSlice = {
    lista_aoo: [],
    lista_archivi: [],
    lista_assegnatari: [],
    lista_classi_documentali: [],
    lista_gruppo_utenti: [],
    lista_modelli_procedimento: [],
    lista_tipi_attivita: [],
    lista_titolari: [],
    lista_utenti: [],
    lista_utenti_firmatari: [],
}

const organizzaDocumentoSlice = createSlice({
    name:'organizzaDocumento',
    initialState,
    reducers:{
        //action/reducer per settaggio delle liste
        setOrganizzaDocumentoData: (state, action: PayloadAction<OrganizzaDocumentoSlice>) =>{
            state.lista_aoo = action.payload.lista_aoo;
            state.lista_archivi = action.payload.lista_archivi;
            state.lista_assegnatari = action.payload.lista_assegnatari;
            state.lista_classi_documentali = action.payload.lista_classi_documentali;
            state.lista_gruppo_utenti = action.payload.lista_gruppo_utenti;
            state.lista_modelli_procedimento = action.payload.lista_modelli_procedimento;
            state.lista_tipi_attivita = action.payload.lista_tipi_attivita;
            state.lista_titolari = action.payload.lista_titolari;
            state.lista_utenti = action.payload.lista_utenti;
            state.lista_utenti_firmatari = action.payload.lista_utenti_firmatari; 
        },
   
    },
})

//esporto le azioni
export const { setOrganizzaDocumentoData } = organizzaDocumentoSlice.actions
//esporto il reducer
export default organizzaDocumentoSlice.reducer
// esporto le funzioni per l'hook UseSelector
export const selectOrganizzaDocumentoData = (state: RootState) => state.organizzaDocumento
