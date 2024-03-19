import { AxiosHTTP } from "./AxiosHTTP";

class AXIOS_HTTP {
    // le funzioni non sono async in quanto l'asincronicità è gestita dalla funzione AxiosHTTP() che è il cuore del sistema chiamate

    public static async Execute ({url, body, sModule, sService}:{url:string, sModule:string, sService:string, body:any}){
        //genero il nuovo JSON
        const newJson = this.generateJSON(sService, sModule, body);
        //faccio la chiamata al WebService con il nuovo body
        const result = await AxiosHTTP({url:url, body:newJson, encode:false});
        console.log('Risposta dal server: ',result)
        return result;
    };

    public static async Retrieve({url, body, sModule, sService}:{url:string, sModule:string, sService:string, body:any}){
        //genero il nuovo JSON
        const newJson = this.generateJSON(sService, sModule, body);
        //faccio la chiamata al WebService con il nuovo body
        const result = await AxiosHTTP({url:url, body:newJson});
        console.log('Risposta dal server: ',result)
        return result;
    };
    
    //funzione che prepara il JSON da inviare al WebService
    private static generateJSON(service:string, module:string, body:Object){
        //preparo nuovo JSON da includere nella chiamata
        const Json: NewJson = {
            "sApplicationId":65, // questo rimarrà sempre uguale
            "sService":service,
            "sModule":module,
            "sData":body
        };

        return Json;
    };
};


type NewJson = {
    sApplicationId: number;
    sService: string;
    sModule: string;
    sData: Object | null;
};

export default AXIOS_HTTP