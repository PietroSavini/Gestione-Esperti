import { Box } from '@mui/material';
import { useEffect, useState } from 'react'
import { AddSectionButtonWithDialog } from '../../../../components/partials/Buttons/AddSectionButtonWithDialog';
import  Requisiti_Table  from './Tables/Table_requisiti';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';


type Data = Requisito_Table[] | []

export type Requisito_Table = {
    fi_ee_req_id: string | number;
    fs_ee_req_desc: string;
    fi_ee_punt_id?:number
    requisiti_list: Requisiti_List
}
export type Requisiti_List = RequisitoType_RequisitoTab[] | []


export type RequisitoType_RequisitoTab = {
    fi_ee_req_id:number | string //id requisito
    fs_ee_req_desc: string //descrizione del requisito
    fi_ee_req_customerid?: number | null //sistema => true if null
    fi_ee_req_punteggio?: number;
    fi_ee_punt_id?:number;
}

type RawData = {
    ReqId: number | string;
    ReqDesc: string;
    ReqMstId: number | null;
    ReqSys: number;
}[] | []


 export const mergeRequisitiArrays = (array1: Requisito_Table[], array2: Requisito_Table[]): Requisito_Table[] => {
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

export const convertData = (rawData:RawData) :Data => {
    let requisitiMaster:Requisito_Table[] | [] = []
    let requisitiMasterWithotherRequisiti: Requisito_Table[] | [] = []
    let requisitiTables: Data = []
    
    //controllo se rawData è vuoto
    if(rawData.length === 0){
        return requisitiTables
    }

    rawData.forEach((requisito)  => {
        if(requisito.ReqMstId === null ){
            const requisitoToInsert :Requisito_Table = {
                fi_ee_req_id: requisito.ReqId,
                fs_ee_req_desc: requisito.ReqDesc,
                fi_ee_punt_id: undefined,
                requisiti_list: [] as Requisiti_List
            } 
            requisitiMaster = [...requisitiMaster, requisitoToInsert]

        }
    })

    rawData.forEach(requisito => {
        if (requisito.ReqMstId !== null) {
            let requisitoPadre = requisitiMaster.find(master => master.fi_ee_req_id === requisito.ReqMstId);
           
            if (requisitoPadre) {
                const requisitoFiglio = {
                    fi_ee_punt_id: undefined,
                    fi_ee_req_id: requisito.ReqId,
                    fs_ee_req_desc: requisito.ReqDesc,
                    fi_ee_req_customerid: requisito.ReqSys,
                    fi_ee_req_punteggio: undefined,
                    
                }
                requisitoPadre.requisiti_list = [...requisitoPadre.requisiti_list, requisitoFiglio]
                requisitiMasterWithotherRequisiti = [...requisitiMasterWithotherRequisiti, requisitoPadre]
            }
        }
    }); 

    requisitiTables = mergeRequisitiArrays(requisitiMaster,requisitiMasterWithotherRequisiti)
    console.log('requisiti formattati: ',requisitiTables)
    return requisitiTables 
}

export const RequisitiTab = () => {
    const [tables , setTables] = useState<Requisito_Table[] | []>([]);
    //chiamata iniziale per requisiti gia presenti
    useEffect(() => {

        AXIOS_HTTP.Retrieve({url:'/api/launch/retrieve', body:null , sService:'READ_REQUISITI', sModule:'IMPOSTAZIONI_GET_ALL_REQUISITI'})
            .then(result => { 
                setTables(convertData(result.response))
            } )
            .catch(error => {
                console.log(error)
            });
       

    }, [])    
     

    const handleAddSection = async (title:string) => {
        const newMasterReq = {
            descrizione: title,
            masterId:0
        };

        await AXIOS_HTTP.Execute({sService:'WRITE_REQUISITI', sModule:'IMPOSTAZIONI_INSERT_REQUISITO', body:newMasterReq, url:'/api/launch/execute'})
            .then((resp)=> {
                console.log('INSERIMENTO MASTER ID SU DB E RISPOSTA: ',resp)
                if(resp.errorCode === 1){
                    return
                }
        
                const newRequisitoMaster:Requisito_Table = {
                    fi_ee_req_id: resp.response.fi_ee_req_id,
                    fs_ee_req_desc:title,
                    requisiti_list:[]
                };

                console.log('requisito MAster passato alla tabella :', newRequisitoMaster)
                setTables((prev) => [...prev, newRequisitoMaster])

            })
       
    }


    
    
  return (
    <>
        <Box sx={{marginBottom:'1.5rem'}}  display={'flex'} width={'100%'} justifyContent={'flex-start'}>
            <AddSectionButtonWithDialog successFn={handleAddSection} />
        </Box>
        <Box component='section' className='requisiti-section'>
            
            {tables && tables.map((table,index) => (
                <Requisiti_Table key={index} data={table} setData={setTables}/>
            ))}

            {tables.length === 0 && <Box>nessun requisito da mostrare </Box>}
        </Box>

    </>
  )
}
