import { AxiosHTTP } from "./AxiosHTTP";

class AXIOS_HTTP {
    // le funzioni non sono async in quanto l'asincronicità è gestita dalla funzione AxiosHTTP() che è il cuore del sistema chiamate

    public static Execute (url:string, body:Object, module:string){
        //genero il nuovo JSON
        const newJson = this.generateJSON('WRITE', module, body);
        //faccio la chiamata al WebService con il nuovo body
        const result = AxiosHTTP({url:url, body:newJson});
        console.log('AXIOS_HTTP.Execute() -> json Inviato (prima di codifica in Base64 UTF-8) :',newJson)
        console.log('Risposta dal server: ',result)
        return result;
    };

    public static Retrieve(url:string, body:Object, module:string){
        //genero il nuovo JSON
        const newJson = this.generateJSON('READ', module, body);
        //faccio la chiamata al WebService con il nuovo body
        const result = AxiosHTTP({url:url, body:newJson});
        return result;
    };
    
    //funzione che prepara il JSON da inviare al WebService
    private static generateJSON(service:string, module:string, body:Object){
        //preparo nuovo JSON da includere nella chiamata
        const Json: NewJson = {
            "sApplicationId":65,
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