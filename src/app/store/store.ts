import {configureStore} from '@reduxjs/toolkit'
import authSlice from './Slices/authSlice'
import loaderSlice from './Slices/loaderSlice'
import organizzaDocumentoSlice from './Slices/organizzaDocumentoSlice'
import pubblicazioniSlice from './Slices/pubblicazioneSlice'
export const store = configureStore({
    reducer:{
        loader: loaderSlice,
        auth: authSlice,
        organizzaDocumento: organizzaDocumentoSlice,
        pubblicazioni: pubblicazioniSlice,
    },
   
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


