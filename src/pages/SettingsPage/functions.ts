import { Requisito_Table } from "./types";

type RawData = DataOne[] | DataTwo[] | [];

type DataOne = {
    fi_ee_req_id: number | string;
    fs_ee_req_desc: string;
    fi_ee_req_master_id: number | null ;
    fi_ee_req_punteggio?: number | undefined;
    fi_ee_punt_id?: number | undefined;
}

type DataTwo = {
    ReqId: string | number;
    ReqDesc: string;
    ReqMstId: number | null;
    ReqSys: number;
}

type DataThree ={
    ReqId: string | number;
    ReqDesc: string;
    MasterId: number | null;
    Valore: number;
    fi_ee_punt_id: number;
    progr:number
}

function mergeRequisitiArrays(array1: Requisito_Table[], array2: Requisito_Table[]): Requisito_Table[] {
    const idMap = new Map<string | number, Requisito_Table>();
    // Aggiungi requisiti dal primo array alla mappa
    array1.forEach(item => idMap.set(item.fi_ee_req_id, item));
    // Aggiungi requisiti dal secondo array alla mappa
    array2.forEach(item => {
        const existingItem = idMap.get(item.fi_ee_req_id);
        if (existingItem) {
            // Se l'oggetto esiste già, sostituiscilo con quello del secondo array
            idMap.set(item.fi_ee_req_id, item);
        } else {
            // Altrimenti, aggiungi l'oggetto del secondo array alla mappa
            idMap.set(item.fi_ee_req_id, item);
        }
    });
    // Restituisci i valori della mappa come array
    return Array.from(idMap.values());
};

export const convertData = (rawData: RawData): Requisito_Table[] | [] => {
    console.log('CovertData() -- dati in ingresso: ', rawData);
    let requisitiMaster: Requisito_Table[] = [];
    let requisitiMasterWithotherRequisiti: Requisito_Table[] = [];
    let requisitiTables: Requisito_Table[] = [];
    // Verifica il tipo di dati in base alla struttura di rawData
    if (Array.isArray(rawData) && rawData.length > 0) {
        //prendo il primo item per riconosccere il tipo di Dati in ingresso
        const firstItem = rawData[0];
        
        if ('ReqId' in firstItem && 'ReqDesc' in firstItem && 'ReqMstId' in firstItem && 'ReqSys' in firstItem) {
            console.log('DATI DA CONVERTIRE: REQUISITI');
            // Tipo 1: rawData è di tipo DataTwo
            (rawData as DataTwo[]).forEach(RawDataItem => {
                if (RawDataItem.ReqMstId === null) {
                    const requisitoToInsert: Requisito_Table = {
                        fi_ee_req_id: RawDataItem.ReqId,
                        fs_ee_req_desc: RawDataItem.ReqDesc,
                        fi_ee_punt_id: undefined,
                        requisiti_list: []
                    };
                    requisitiMaster.push(requisitoToInsert);
                }
            });

            (rawData as DataTwo[]).forEach(RawDataItem => {
                if (RawDataItem.ReqMstId !== null) {
                    const parentRequisito = requisitiMaster.find(master => master.fi_ee_req_id === RawDataItem.ReqMstId);
                    if (parentRequisito) {
                        const requisitoFiglio = {
                            fi_ee_req_id: RawDataItem.ReqId,
                            fs_ee_req_desc: RawDataItem.ReqDesc,
                            fi_ee_req_punteggio: undefined,
                            fi_ee_req_customerid: RawDataItem.ReqSys,
                            fi_ee_mst_id: parentRequisito.fi_ee_req_id,
                        };
                        parentRequisito.requisiti_list = [...parentRequisito.requisiti_list, requisitoFiglio];      
                        requisitiMasterWithotherRequisiti = [...requisitiMasterWithotherRequisiti, parentRequisito];
                    }
                }
            });

            requisitiTables = mergeRequisitiArrays(requisitiMaster, requisitiMasterWithotherRequisiti);
            
        } else if ( 'ReqId' in firstItem && 'ReqDesc' in firstItem && 'MasterId' in firstItem && 'Valore' in firstItem && 'TEspId' in firstItem && 'fi_ee_punt_id' in firstItem && 'Progr' in firstItem) {

            console.log('DATI DA CONVERTIRE: PUNTEGGI');
            (rawData as DataThree[]).forEach(RawDataItem => {
                if (RawDataItem.MasterId === null) {
                    const requisitoToInsert: Requisito_Table = {
                        fi_ee_req_id: RawDataItem.ReqId,
                        fs_ee_req_desc: RawDataItem.ReqDesc,
                        fi_ee_punt_id: RawDataItem.fi_ee_punt_id,
                        progr: RawDataItem.progr,
                        requisiti_list: []
                    };
                    requisitiMaster.push(requisitoToInsert);
                }
            });

            (rawData as DataThree[]).forEach(RawDataItem => {
                if (RawDataItem.MasterId !== null) {
                    const parentRequisito = requisitiMaster.find(master => master.fi_ee_req_id === RawDataItem.MasterId);
                    if (parentRequisito) {
                        const requisitoFiglio = {
                            fi_ee_req_id: RawDataItem.ReqId,
                            fs_ee_req_desc: RawDataItem.ReqDesc,
                            fi_ee_req_punteggio: RawDataItem.Valore,
                            fi_ee_punt_id: RawDataItem.fi_ee_punt_id,
                        };
                        parentRequisito.requisiti_list = [...parentRequisito.requisiti_list, requisitoFiglio];      
                        requisitiMasterWithotherRequisiti = [...requisitiMasterWithotherRequisiti, parentRequisito];
                    }
                }
            });
            
            requisitiTables = mergeRequisitiArrays(requisitiMaster, requisitiMasterWithotherRequisiti);
     
        }else {
            console.error('Struttura dati non riconosciuta.');
            return requisitiTables;
        }
    } else {
        console.error('Dati non validi o vuoti.');
        return requisitiTables;
    }

    console.log('requisiti formattati: ', requisitiTables);
    return requisitiTables;
};

export const createOptionArray = ({arr, value, label}: {arr: any[], value:any, label:any}) => {
    const newArr = arr.map((item) => ({value:arr[value] , label:arr[label]}))
    return newArr;
}