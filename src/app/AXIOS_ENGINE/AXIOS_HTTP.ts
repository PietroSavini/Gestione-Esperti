import { AxiosHTTP } from "./AxiosHTTP";

class AXIOS_HTTP {
    // le funzioni non sono async in quanto l'asincronicità è gestita dalla funzione AxiosHTTP() che è il cuore del sistema chiamate

    public static async Execute ({url, body, sModule, sService}:{url:'/api/launch/execute', sModule:string, sService:string, body:any}){
        
        //genero il nuovo JSON
        const newJson = this.generateJSON(65, sService, sModule, body);
        //faccio la chiamata al WebService con il nuovo body
        const result = await AxiosHTTP({url:url, body:newJson, encode:false});
  
        return result;
    };

    public static async Retrieve({url, body, sModule, sService}:{url:'/api/launch/retrieve' | '/api/launch/organizzaDocumento', sModule:string, sService:string, body:any}){
        let newJson:any;
        if(url === '/api/launch/organizzaDocumento'){
            newJson = this.generateJSON(66,sService, sModule, body);
            
        }else{
            newJson = this.generateJSON(65,sService, sModule, body);
        }
        //genero il nuovo JSON
        //faccio la chiamata al WebService con il nuovo body
        const result = await AxiosHTTP({url:url, body:newJson, encode:false});

        return result;
    };

    
    
    //funzione che prepara il JSON da inviare al WebService
    private static generateJSON(appId:number, service:string, module:string, body:Object){
        //preparo nuovo JSON da includere nella chiamata
        const Json: NewJson = {
            "sApplicationId":appId, 
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