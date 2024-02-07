import { AxiosHTTP } from "./AxiosHTTP";

class AXIOS_HTTP {

    public static Execute(url:string, body:Object, module:string){
        //genero il nuovo JSON
        const newJson = this.generateJSON('WRITE', module, body);
        //faccio la chiamata al WebService con il nuovo body
        const result = AxiosHTTP({url:url, body:newJson});
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
    private static generateJSON(service:Service, module:string, body:Object){
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

type Service = 'WRITE' | 'READ';
type NewJson = {
    sApplicationId: number;
    sService: 'WRITE' | 'READ';
    sModule: string;
    sData: Object | null;
};