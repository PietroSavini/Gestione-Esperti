import { Box } from '@mui/material';
import { useEffect, useState } from 'react'
import { AddSectionButtonWithDialog } from '../../../../components/partials/Buttons/AddSectionButtonWithDialog';
import  RequisitiTable  from './Tables/RequisitiTable';

export type Table = {
    id:string | number;
    title:string;
    rowsRequisiti:{
        id: string | number;
        title: string;
        sistema: boolean;
        isNew:boolean;
        
    }[] | [];
}

type Tables = Table[]

export const RequisitiTab = () => {
    //simulazione dati in ingresso
    const data = [
        //prima table
        {
            id: 'table1',
            title:'Titolo Di Studio',
            rowsRequisiti:[
                {
                    id:'id878-8787',
                    title:'Laurea vecchio ordinamento',
                    sistema:true,
                    isNew:false,
                },
                {
                    id:'id878-8786',
                    title:'Laurea triennale',
                    sistema:true,
                    isNew:false,
                },
                {
                    id:'id878-8785',
                    title:'Laurea specialistica',
                    sistema:true,
                    isNew:false,    
                }
            ]
        },
        //...altre table
    ];


    //al rendering del componente chiamo il webService per generare le Tabelle
    useEffect(() => {
        //faccio la chiamata al DB per prendere data, in situazioni reali la 'const data' non mi servirà piu in quanto farò setTables(rispostaDB)
    }, [])

    //genero la variabile di stato 'tables', mi servirà per pushare eventuali table create dal pulsante 'Aggiungi Nuova Sezione'. la variabile è inizializzata con i dati in ingresso.
    const [tables , setTables] = useState<Tables>(data);

    const handleAddSection = (title:string) => {
       const newTable: Table ={
         id:`table-${title}`,
         title: title,
         rowsRequisiti:[]
       }
       //Salvo la Tabella appena Creata nel DB
        //response:200 , ricevo id Table

       setTables((prevTables) => [...prevTables, newTable] )
       console.log(tables)
    }
    
    
  return (
    <>
        <Box sx={{marginBottom:'1.5rem'}}  display={'flex'} width={'100%'} justifyContent={'flex-start'}>
            <AddSectionButtonWithDialog successFn={handleAddSection} />
        </Box>
        <Box component='section' className='requisiti-section'>
            {tables?.map((table,index) => (
                <RequisitiTable key={index} data={table}/>
            ))}
        </Box>

    </>
  )
}
