import {configureStore} from '@reduxjs/toolkit'
import authSlice from './Slices/authSlice'
import loaderSlice from './Slices/loaderSlice'
import organizzaDocumentoSlice from './Slices/organizzaDocumentoSlice'


export const store = configureStore({
    reducer:{
        loader: loaderSlice,
        auth: authSlice,
        organizzaDocumento: organizzaDocumentoSlice
    },
   
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


