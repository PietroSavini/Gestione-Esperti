import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

type AuthState = {
    user: string | null;
    token: string | null;
}

//initialState
const initialState: AuthState = {
    user: null,
    token: null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        //action/reducer per il logIn
        setCredentials: (state, action: PayloadAction<{user: string, accessToken: string}>) =>{
            //questo reducer riceve user ed un payload dal dispatch della action
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
        },
        //action/reducer per il logOut
        logOut: (state) =>{
            state.user = null
            state.token = null
        }
    },
})

//esporto le azioni
export const { setCredentials, logOut} = authSlice.actions
//esporto il reducer
export default authSlice.reducer
// esporto le funzioni per l'hook UseSelector
export const selectUser = (state: RootState) => state.auth.user
export const selectToken = (state : RootState) => state.auth.token