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
    isAxiosJsonResponse?:boolean;
    isResponseEncoded?:boolean;
    contentType?:string;
    responseType?: 'content-type' | 'text' | 'json'
    handleRes?: {
        sFn: Function;
        eFn: Function;
    }
};

type AxiosResponse = { 
    errorMessage: string;
    errorCode: number
    response : string | Object;
}

export const AxiosHTTP = (options: Options) => {

    //impostazione di base della chiamata
    const defaultOptions: Options = {
        baseUrl: 'https://provaoauth.axioscloud.it',
        url: '',
        method: 'POST',
        loader: false,
        loadingText: '',
        encode: true,
        auth: true,
        body: undefined,
        handleRes: undefined,
        isAxiosJsonResponse:true,
        isResponseEncoded:true,
        contentType:'text/plain; charset=UTF-8',
        responseType:'json',
    };  
    

    //merging dei parametri di base con quelli passati alla funzione AxiosHTTP
    const newOptions = { ...defaultOptions, ...options };
    console.log(newOptions)

    //Impostazione chiamata di base -> poi utilizzata in baseQueryWithReauth (chiamata con refresh automatico del token)
    const baseQuery = fetchBaseQuery({
        baseUrl: newOptions.baseUrl,
        credentials: 'include',
        //responseHandler:'content-type'(default) -> decifra il payload della risposta in base al tipo di content-type contenuto negli headers della risposta: application/json --> return json response // text/plain --> return text response 
        responseHandler: newOptions.responseType,
        //preparo gli headers (chiamata) a seconda del contentType (default: 'text/plain')
        prepareHeaders: (headers) => {
            headers.set('Content-Type', `${newOptions?.contentType}`);
            //Aggiungo header Authorizzation con token se la chiamata ha bisogno di autenticazione (comunico con nostro webService)
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
        let finalResult ; 
        let newArgs;
        switch (true) {
            case newOptions.encode:
                //preparo il body request codificato per la chimata
                newArgs = { ...args, body: AxiosUtils.Strings.Encode(args.body)};
            break;

            default:

            break;
        };

        const result = await baseQuery(newArgs, api, extraOptions);
        console.log('result: ',result)
        //controllo se la risposta contiene l'errore 401, se contiene l'errore l'accessToken è scaduto e va eseguito il refresh.
        if (result?.error?.status === 401) {
            console.log('accessToken scaduto, Tentativo di Refresh del token...')
            if (await refreshAccessToken(baseQuery, api, extraOptions)) {
                //eseguo chiamata dopo successo di refresh del token
                const result = await baseQuery(newArgs, api, extraOptions);
                //controllo se la risposta avviene dal nostro webService
                if(newOptions.isAxiosJsonResponse){
                    const axiosResult = result.data as AxiosResponse;
                    //se cè l'errore lo faccio vedere in console
                    if(axiosResult.errorCode !== 0){
                        console.error('AXIOS WEB SERVICE: ',axiosResult.errorMessage);
                        finalResult= undefined;
                    }
                    finalResult = axiosResult.response;
                }else{
                    finalResult = result.data;
                }
                
            } else {
                alert('sessione scaduta, eseguire nuovamente il Login');
            };
        };

        //caso in cui non cè errore 401 ma la chiamata va liscia
        if(newOptions.isAxiosJsonResponse){
            const axiosResult = result.data as AxiosResponse;
            if(axiosResult.errorCode !== 0){
                console.error('AXIOS WEB SERVICE: ',axiosResult.errorMessage);
                finalResult= undefined;
            }
            finalResult = axiosResult.response;
        }else{
            finalResult = result.data;
        }

        //controllo per decodificare il Base64 se necessario
        if(newOptions.isResponseEncoded){
            const decodedResult = AxiosUtils.Strings.Decode(finalResult)
            finalResult = decodedResult
        }

        //esporto risultato finale
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
        api.dispatch(logOut())
        return false;

    } else if(refreshResult?.error) {
        console.error('ERRORE: ', refreshResult.error)
        api.dispatch(logOut())
    };
};


