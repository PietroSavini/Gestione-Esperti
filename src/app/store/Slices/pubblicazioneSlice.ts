import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Option } from '../../../components/partials/Inputs/Custom_Select2';

type Lista_uffici = {
    fiUfficiId:number;
    fsDescrizione:string;
}

type Lista_tipi_anagrafica = {
    fiAnagraficaTypeId:number;
    fsName:string;
}

type Liste = {
    lista_sezioni_trasparenza: Lista_uffici[]|[];
    lista_tipi_anagrafica: Lista_tipi_anagrafica[]|[];
    lista_tipi_atto:[];
    lista_tipi_atto_bacheche: [];
    lista_uffici: [];
   
}

export type PubblicazioniSelect= {
    trasparenza: Option[]|[];
    uffici: Option[]|[];
    atti: Option[]|[];
    bacheche: Option[]|[];
    anagrafiche: Option[]|[];
   
}

type PubblicazioniSlice = {
    liste: Liste | undefined;
    selectOptions: PubblicazioniSelect | undefined
}

//initialState
const initialState: PubblicazioniSlice = {
    liste:undefined,
    selectOptions:undefined
}

const pubblicazioniSlice = createSlice({
    name:'pubblicazioni',
    initialState,
    reducers:{
        //action/reducer per settaggio delle liste
        setPubblicazioniData :(state, action: PayloadAction<Liste>) => {
            state.liste = action.payload;
        },
        //action/reducer per il settaggio dei valori delle select
        setPubblicazioniSelect: (state, action: PayloadAction<PubblicazioniSelect>) =>{
            state.selectOptions = action.payload;
        },
   
    },
})

//esporto le azioni
export const { setPubblicazioniData, setPubblicazioniSelect } = pubblicazioniSlice.actions
//esporto il reducer
export default pubblicazioniSlice.reducer
// esporto le funzioni per l'hook UseSelector
export const selectPubblicazioniData = (state: RootState) => state.pubblicazioni.liste
export const selectPubblicazioniSelect = (state: RootState) => state.pubblicazioni.selectOptions
