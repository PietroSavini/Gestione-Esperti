import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Option } from '../../../components/partials/Inputs/Custom_Select2';

type Lista_uffici = {
    id: number;
    descrizione: string;
}

type Lista_tipi_anagrafica = {
    id: number;
    descrizione: string;
}

type sezioni_trasparenza_list = {
    id: string;
    idMenuRef: string;
    name: string;
    posizione: string;
}

type tipi_atto_list = {
    id: string;
    tipoAtto: string;
    descrizione: string;
    idAT: string;
}

type lista_tipi_atto_bacheche = {
    Key: string;
    value: string;
}

export type ListePub = {
    sezioni_trasparenza_list: sezioni_trasparenza_list[] | [];
    lista_tipi_anagrafica: Lista_tipi_anagrafica[] | [];
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

type PubblicazioniSlice = {
    liste: ListePub | undefined;
    selectOptions: PubblicazioniSelect | undefined
}

//initialState
const initialState: PubblicazioniSlice = {
    liste: undefined,
    selectOptions: undefined
}

const pubblicazioniSlice = createSlice({
    name: 'pubblicazioni',
    initialState,
    reducers: {
        setPubblicazioni: (state, action: PayloadAction<PubblicazioniSlice>) => {
            state = action.payload;
        },
        //action/reducer per settaggio delle liste
        setPubblicazioniData: (state, action: PayloadAction<ListePub>) => {
            state.liste = action.payload;
        },
        //action/reducer per il settaggio dei valori delle select
        setPubblicazioniSelect: (state, action: PayloadAction<PubblicazioniSelect>) => {
            state.selectOptions = action.payload;
        },

    },
})

//esporto le azioni
export const { setPubblicazioniData, setPubblicazioniSelect, setPubblicazioni } = pubblicazioniSlice.actions
//esporto il reducer
export default pubblicazioniSlice.reducer
// esporto le funzioni per l'hook UseSelector
// export const selectPubblicazioniData = (state: RootState) => state.pubblicazioni.liste
// export const selectPubblicazioniSelect = (state: RootState) => state.pubblicazioni.selectOptions
