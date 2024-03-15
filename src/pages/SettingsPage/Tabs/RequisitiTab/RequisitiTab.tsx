import { Box } from '@mui/material';
import { useEffect, useState } from 'react'
import { AddSectionButtonWithDialog } from '../../../../components/partials/Buttons/AddSectionButtonWithDialog';
import  Requisiti_Table  from './Tables/Table_requisiti';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';

export type Requisito_Table = {
    fi_ee_req_id: number;
    descrizione_breve: string;
    requisiti_list: RequisitoType_RequisitoTab[] | []
}

export type RequisitoType_RequisitoTab = {
    fi_ee_req_id:number | string // id requisito
    fs_ee_req_desc: string   //descrizione del requisito
    fi_ee_req_customerid?: number    //sistema => true if null
    fi_ee_req_punteggio?: number;
}


//simulazione dati in ingresso
const data:Requisito_Table[] = [
    //Ogni ogetto è un Requisito Master
    {
        
        fi_ee_req_id: 1,
        descrizione_breve:'Titolo Di Studio',
        //array di ogetti sottorequisito del req master
        requisiti_list:[ 
            //ogni Ogetto è un sottorequisito
            {
                fi_ee_req_id: 2,
                fs_ee_req_desc: 'Laurea triennale',
                fi_ee_req_customerid: 1, // 1 se sono di sistema 
                fi_ee_req_punteggio: undefined,
            },
            {
                fi_ee_req_id: 3,
                fs_ee_req_desc: 'Laurea Specialistica',
                fi_ee_req_customerid: 1, // 1 se sono di sistema 
                fi_ee_req_punteggio: undefined,
            },
            {
                fi_ee_req_id: 4,
                fs_ee_req_desc: 'Diploma Scuola Superiore',
                fi_ee_req_customerid: 0, // 1 se sono di sistema 
                fi_ee_req_punteggio: undefined,
            },
            {
                fi_ee_req_id: 5,
                fs_ee_req_desc: 'Diploma di terza media',
                fi_ee_req_customerid: 0, // 1 se sono di sistema 
                fi_ee_req_punteggio: undefined,
            },
        ]
    },
   
];

export const RequisitiTab = () => {

    //al rendering del componente chiamo il webService per generare le Tabelle
    useEffect(() => {
        //faccio la chiamata al DB per prendere data, in situazioni reali la 'const data' non mi servirà piu in quanto farò setTables(rispostaDB)
    }, [])

    //genero la variabile di stato 'tables', mi servirà per pushare eventuali table create dal pulsante 'Aggiungi Nuova Sezione'. la variabile è inizializzata con i dati in ingresso.
    const [tables , setTables] = useState<Requisito_Table[]| []>(data);

    const GET_ALL_REQQUISITI = () => {
        AXIOS_HTTP.Retrieve({url:'/api/Retrieve/retrieve', body:null, sService:'READ_REQUISITI', sModule:'GET_ALL_REQUISITI'})
    }

    const handleAddSection = async (title:string) => {
        const newMasterReq = {
            descrizione: title,
        };
        const createRequisito = await AXIOS_HTTP.Execute({sService:'WRITE_REQUISITO', sModule:'INSERT_REQUISITO', body:newMasterReq, url:'/api/Execute/execute'})


    //    const newTable: Table ={
    //      id:`table-${title}`,
    //      sectionTitle: title,
    //      requisitiList:[]
    //    }
    //    //Salvo la Tabella appena Creata nel DB
    //     //response:200 , ricevo id Table
    //    setTables((prevTables) => [...prevTables, newTable] )
    //    console.log(tables)
    }
    
    
  return (
    <>
        <Box sx={{marginBottom:'1.5rem'}}  display={'flex'} width={'100%'} justifyContent={'flex-start'}>
            <AddSectionButtonWithDialog successFn={handleAddSection} />
        </Box>
        <Box component='section' className='requisiti-section'>
            
            {tables && tables.map((table,index) => (
                <Requisiti_Table key={index} data={table}/>
            ))}

            {tables.length === 0 && <Box>nessun requisito da mostrare </Box>}
        </Box>

    </>
  )
}
