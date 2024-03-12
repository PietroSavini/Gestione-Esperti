//Libreria di gestione chiamate
import { FetchBaseQueryError, FetchBaseQueryMeta, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../store/Slices/authSlice';
import AxiosUtils from './AxiosUTILS';
import { store } from '../store/store';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';


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


//FUNZIONE PRINCIPALE => wrapper di baseQuerywithReauth() 
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
        contentType:'application/json; charset=UTF-8',
        responseType:'text',
    };  
    

    //merging dei parametri di base con quelli passati alla funzione AxiosHTTP
    const newOptions = { ...defaultOptions, ...options };

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

    //funzione wrapper di baseQuery => controlla se la chiamata ha bisogno di encoding in Base64 e che automatizza il processo di refresh dell' Access Token nel caso in cui esso sia scaduto
    const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
        let finalResult ; 
        let newArgs;

        //switch che controlla se la chiamata deve essere codificata o no, e prepara la struttura dati di conseguenza.
        switch (true) {
            case newOptions.encode:
                //preparo il body request codificato per la chimata
                newArgs = { ...args, body:{"JsonRequest":AxiosUtils.Strings.Encode(JSON.stringify(args.body))}};
            break;

            default:
              newArgs = { ...args, body: args.body }
            break;
        };
        console.log('CHIAMATA EFFETTUATA CON PARAMETRI: ', newArgs)

        //eseguo la chiamata ed associo il risultato a result
        const result = await baseQuery(newArgs, api, extraOptions);

        // -------------------------------------------------------BLOCCO DI CASISTICA DI REFRESH DEL TOKEN ----------------------------------------------------------------- //
        //controllo se la risposta contiene l'errore 401 ( oppure qualsiasi errore decidiamo), se contiene l'errore l'accessToken è scaduto e va eseguito il refresh.
        if (result?.error?.status === 401) {
            console.log('accessToken scaduto, Tentativo di Refresh del token...')
            //eseguo processo di refresh del token

            //se la fn refreshAccessToken() ritorna true 
            if (await refreshAccessToken(baseQuery, api, extraOptions)) {

                //eseguo nuovamente la chiamata precedente con il nuovo accesstoken
                const result = await baseQuery(newArgs, api, extraOptions);
                finalResult = processResponse(newOptions.isAxiosJsonResponse, result)
                // la refreshAccessToken ha ritornato false => REFRESHTOKEN SCADUTO
            } else {
                alert('sessione scaduta, eseguire nuovamente il Login');
            };
            // ---------------------------------------------------- FINE BLOCCO CASISTICA DI REFRESH DEL TOKEN ----------------------------------------------------------------- //
        }else{
            //caso in cui l'accessToken è ancora valido (procedimento normale) 
            finalResult = processResponse(newOptions.isAxiosJsonResponse, result)
        }
        
        //controllo per decodificare il result codificato in Base64 (se necessario)
        if(newOptions.isResponseEncoded){
            const decodedResult = AxiosUtils.Strings.Decode(finalResult as string)
            finalResult = decodedResult
        }

        //esporto risultato finale
        console.log('result: ',finalResult)
        return finalResult;
    };

    //argomenti ripreparati che verrano passati alla baseQueryWithReauth per eseguire le chiamate
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

/*------------------------------------------------------------------------------------------------------------------------------------------------------------/
/                                                                                                                                                             /
/                                                                                                                                                             /
/                                                                                                                                                             /
/                                                                                                                                                             /                                                                                                                                                  /
//-------------------------------------------------------------FUNZIONI UTILIZZATE---------------------------------------------------------------------------*/

/*FUNZIONE CHE PROCESSA IL RISULTATO DELLA CHIAMATA (in base ai parametri di newOptions)
/param => isAxiosJsonResponse => bool
/ param queryResult => any *oggetto result della chiamata con RTKQuery*
/ return => risultato esatto della chiamata
*/
function processResponse (isAxiosJsonResponse:boolean | undefined, queryResult:any){
    //controllo se la risposta ha il formato del nostro webService
    if(isAxiosJsonResponse){
        //se la chiamata è andata a buon fine 
        if('data' in queryResult){
            const axiosResult = queryResult.data as AxiosResponse;
            //se la chiamamta è andata a buon fine ma cè l'errore dal webService lo faccio vedere in console e ritrono il Json di risposta axios
            if(axiosResult.errorCode !== 0){
                console.error('AXIOS WEB SERVICE ERROR: ',axiosResult.errorMessage);
                return axiosResult;
            }
            return axiosResult.response
        }else{
            console.error('AXIOS_HTTP ERROR: ', queryResult.error)
            return queryResult.error
        }
    }
    // se la risposta non viene dal nostro webService ed ha un formato diverso, prendo i dati direttamente da result.data
    //se la chiamata è andata a buon fine 
    if('data' in queryResult){
        return queryResult.data
    }else{
        console.error('AXIOS_HTTP ERROR: ', queryResult.error)
        return queryResult.error
    }
}


/*FUNZIONE DI REFRESH DELL ACCESTOKEN
/ fn : baseQueryFn di RTKQuery
/ api: oggetto comprendente le funzioni per interagire con lo store redux
/ extraOptions : oggetto comprendente opzioni extra
/ return => bool => true | false
*/
async function refreshAccessToken(fn: Function, api: any, extraOptions: any) {
    type RefreshData = {
        accessToken: string;
    };

    //faccio la chiamata all'endpoint di refresh
    const refreshResult = await fn({
        url: '/api/Test/Refresh',
        method: 'POST',
    }, api, extraOptions);

    //chiamata all'endpoint di refresh andata a buon fine
    if (refreshResult?.data) {
        //prendo lo user dallo state in qunato è già presente
        const user = api.getState().auth.user;
        //prendo il nuovo Access Token
        const accessToken = (refreshResult.data as RefreshData).accessToken;
        //Salvo il nuovo Token nello state
        api.dispatch(setCredentials({ user, accessToken }));
        return true;
        
    //se risponde con 401 il refreshtoken è scaduto
    } else if (refreshResult?.error.originalStatus === 401) {
        console.error('Refresh Token Scaduto');
        api.dispatch(logOut())
        return false;

    //se avviene qualsiasi errore non ritorna nulla, viene eseguito il LogOut e stampato in console il messaggio di errore
    } else if(refreshResult?.error) {
        console.error('ERRORE NEL PROCESSO DI REFRESH: ', refreshResult.error)
        api.dispatch(logOut()); 
    };
};


