import { Box } from '@mui/material';
import { useEffect, useState } from 'react'
import { AddSectionButtonWithDialog } from '../../../../components/partials/Buttons/AddSectionButtonWithDialog';
import  RequisitiTable  from './Tables/RequisitiTable';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';

export type Requisito_Table = {
    fi_ee_req_id: string | number;
    descrizione_breve: string;
    requisiti_list: RequisitiTable_list
}

export type RequisitiTable_list = Requisito_RequisitoTab[] | []

export type Requisito_RequisitoTab = {
    fi_ee_req_id:number | string // id requisito
    fs_ee_req_desc: string   //descrizione del requisito
    fi_ee_req_customerid: null | number  // true if null
}



export const RequisitiTab = () => {
    //simulazione dati in ingresso
    const data = [
        //Ogni ogetto è un Requisito Master
        {
            
            fi_ee_req_id: 1,
            descrizione_breve:'Titolo Di Studio',
            //array di ogetti sottorequisito del req master
            requisiti_list:[ 
                //ogni Ogetto è un sottorequisito
                {
                    fi_ee_req_id: 2,
                    fs_ee_req_desc:'Laurea triennale',
                    fi_ee_req_customerid:null // null se sono di sistema 
                },
             
            ]
        },
       
    ];

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
                <RequisitiTable key={index} data={table}/>
            ))}

            {tables.length === 0 && <Box>nessun requisito da mostrare </Box>}
        </Box>

    </>
  )
}
