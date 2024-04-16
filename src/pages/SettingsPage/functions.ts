
import { RawData, Requisiti_List, Requisito_Table } from "./types";

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

export const convertData = (rawData: RawData, type: 0 | 1): Requisito_Table[] | [] => {
    console.log('CovertData() -- dati in ingresso: ', rawData)
    let requisitiMaster: Requisito_Table[] | [] = []
    let requisitiMasterWithotherRequisiti: Requisito_Table[] | [] = []
    let requisitiTables: Requisito_Table[] | [] = []

    //controllo se rawData è vuoto
    if (rawData.length === 0) {
        return requisitiTables
    }
    //preparo requisiti master -- caso in cui non cè bisogno dei punteggi
    if (type === 0) {
        rawData.forEach((requisito) => {
            if (requisito.fi_ee_req_master_id === null) {
                const requisitoToInsert: Requisito_Table = {
                    fi_ee_req_id: requisito.fi_ee_req_id,
                    fs_ee_req_desc: requisito.fs_ee_req_desc,
                    requisiti_list: [] as Requisiti_List
                }
                requisitiMaster = [...requisitiMaster, requisitoToInsert];
            }
        })

        rawData.forEach(requisito => {
            if (requisito.fi_ee_req_punteggio !== 0) {
                let requisitoPadre = requisitiMaster.find(master => master.fi_ee_req_id === requisito.fi_ee_req_master_id);

                if (requisitoPadre) {
                    const requisitoFiglio = {
                        fi_ee_req_id: requisito.fi_ee_req_id,
                        fs_ee_req_desc: requisito.fs_ee_req_desc,
                        fi_ee_req_punteggio: requisito.fi_ee_req_punteggio
                    }
                    requisitoPadre.requisiti_list = [...requisitoPadre.requisiti_list, requisitoFiglio]
                    requisitiMasterWithotherRequisiti = [...requisitiMasterWithotherRequisiti, requisitoPadre]
                }
            }
        });

        requisitiTables = mergeRequisitiArrays(requisitiMaster, requisitiMasterWithotherRequisiti)

    } else {
        rawData.forEach((requisito) => {
            if (requisito.fi_ee_req_master_id === null) {
                const requisitoToInsert: Requisito_Table = {
                    fi_ee_req_id: requisito.fi_ee_req_id,
                    fs_ee_req_desc: requisito.fs_ee_req_desc,
                    fi_ee_punt_id: requisito.fi_ee_punt_id,
                    requisiti_list: [] as Requisiti_List
                }
                requisitiMaster = [...requisitiMaster, requisitoToInsert];
            }
        });

        rawData.forEach(requisito => {
            if (requisito.fi_ee_req_punteggio !== 0) {
                let requisitoPadre = requisitiMaster.find(master => master.fi_ee_req_id === requisito.fi_ee_req_master_id);


                if (requisitoPadre) {
                    const requisitoFiglio = {
                        fi_ee_req_id: requisito.fi_ee_req_id,
                        fs_ee_req_desc: requisito.fs_ee_req_desc,
                        fi_ee_req_punteggio: requisito.fi_ee_req_punteggio,
                        fi_ee_punt_id: requisito.fi_ee_punt_id
                    }
                    requisitoPadre.requisiti_list = [...requisitoPadre.requisiti_list, requisitoFiglio]
                    requisitiMasterWithotherRequisiti = [...requisitiMasterWithotherRequisiti, requisitoPadre]
                }
            }
        });

        requisitiTables = mergeRequisitiArrays(requisitiMaster, requisitiMasterWithotherRequisiti)
    }
    console.log('requisiti formattati: ', requisitiTables)
    return requisitiTables
}