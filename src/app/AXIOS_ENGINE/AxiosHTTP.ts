//Libreria di gestione chiamate
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../store/Slices/authSlice';
import AxiosUtils from './AxiosUTILS';
import { store } from '../store/store';

export type Options = {
    baseUrl?: string;
    url: string;
    method?: string;
    body?: Object;
    loader?: boolean;
    loadingText?: string;
    encode?: boolean;
    auth?: boolean;
    handleRes?: {
        sFn: Function;
        eFn: Function;
    }
};

export const AxiosHTTP = (options: Options) => {

    const defaultOptions: Options = {
        baseUrl: 'https://localhost:7029',
        url: '',
        method: 'POST',
        loader: false,
        loadingText: '',
        encode: true,
        auth: true,
        body: undefined,
        handleRes: undefined,
    };
    
    //merging dei parametri di base con quelli passati alla funzione
    const newOptions = { ...defaultOptions, ...options };
    //preparo la baseQuery con headers della request dinamici
    const baseQuery = fetchBaseQuery({
        baseUrl: newOptions.baseUrl,
        credentials: 'include',
        prepareHeaders: (headers) => {
            if (newOptions.encode) {
                headers.set('Content-Type', 'text/plain; charset=UTF-8');
            } else {
                headers.set('Content-Type', 'application/json; charset=UTF-8');
            }

            //includo il token negli headers solo se la chiamata ha bisogno di autenticazione
            if (newOptions.auth) {
                const token = store.getState().auth.token;
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                };
            };

            return headers;
        }
    });

    //funzione wrapper che controlla se la chiamata ha bisogno di encoding in Base64 e che automatizza il processo di refresh dell' Access Token nel caso in cui esso sia scaduto
    const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {

        let newArgs = args;
        switch (true) {
            case newOptions.encode:
                //preparo il body request codificato per la chimata
                newArgs = { ...newArgs, body: AxiosUtils.Strings.Encode(newArgs.body)};
            break;

            default:

            break;
        };

        let result = await baseQuery(newArgs, api, extraOptions);

        //la funzione Decode è programmata per decifrare SOLO se la risposta è in base64, se no, restituisce il body della risposta base
        let finalResult = AxiosUtils.Strings.Decode(result);
        //controllo se la risposta contiene l'errore 401, se contiene l'errore l'accessToken è scaduto e va eseguito il refresh.
        if (finalResult?.error?.status === 401) {
            console.error('accessToken scaduto, Tentativo di Refresh del token...')
            if (await refreshAccessToken(baseQuery, api, extraOptions)) {
                result = await baseQuery(newArgs, api, extraOptions);
                finalResult = AxiosUtils.Strings.Decode(result);
            } else {
                alert('sessione scaduta, eseguire nuovamente il Login');
            };
        };

        return finalResult;
    };

    //argomenti ripreparati che verrano passati alla query per eseguire le chiamate
    const argsForQuery = {
        url: newOptions.url,
        method: newOptions.method,
        body: newOptions.body
    }

    // oggetto che comprende le azioni redux con accesso diretto allo store
    const apiForQuery = {
        dispatch: store.dispatch,
        getState: store.getState
    }

    //eseguo la chiamata
    return baseQueryWithReauth(argsForQuery, apiForQuery, {});
};


//funzione per la chiamata all'endpoint di refresh.
async function refreshAccessToken(fn: Function, api: any, extraOptions: any) {
    type RefreshData = {
        accessToken: string;
    };

    const refreshResult = await fn({
        url: '/api/Test/Refresh',
        method: 'POST',
    }, api, extraOptions);

    if (refreshResult?.data) {
        //prendo lo user dallo state in qunato è già presente
        const user = api.getState().auth.user;
        //prendo il nuovo Access Token
        const accessToken = (refreshResult.data as RefreshData).accessToken;
        //Salvo il nuovo Token nello state
        api.dispatch(setCredentials({ user, accessToken }));
        return true;

    } else if (refreshResult?.error.originalStatus === 401) {
        console.error('Refresh Token Scaduto');
        //eseguo il logOut
        api.dispatch(logOut());
        return false;
    };
};


