import {configureStore} from '@reduxjs/toolkit'
//import { apiSlice } from '../api/apiSlice'
import authSlice from './Slices/authSlice'
import loaderSlice from './Slices/loaderSlice'
import TipologieSlice from './Slices/TipologieSlice'

export const store = configureStore({
    reducer:{
        loader: loaderSlice,
        auth: authSlice,
        tipologie: TipologieSlice,
    },
   
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch