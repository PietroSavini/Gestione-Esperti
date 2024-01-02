import { Box, Grid, Switch } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import './DataTable.scss'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import {v4 as uuidv4} from 'uuid'
import { useAppDispatch } from '../../../../../app/ReduxTSHooks'
import { toggleVisible } from '../../../../../app/store/Slices/TipologieSlice'

type Props ={ 
    fn? :  Function
    data: Row[]
    loader:boolean;
}

export type Row = {
    id:number;
    title:string,
    description:string;
    visible:boolean;
}

type RowParam ={
    id:number;
    value:boolean
}

export const Table_tipologieDiSistema = ({data, fn, loader} : Props ) => {
    const dispatch = useAppDispatch()
    const tableData = data
    const addCustomModelRow = fn
    //InitialState
    // utilizzo useMemo per memorizzare le Rows derivanti da Data, questo metodo offre una migliore ottimizzazione
    const initialRows = React.useMemo(() => {
        if (tableData) {
            return tableData.map(item => ({
                id: item.id,
				title: item.title,
                description: item.description,
                visible: item.visible ,
                row:item
			}));
		}
		return [];
	}, [data]);

    const [rows, setRows] = useState<Row[]>(initialRows)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSwitchChange = (id: number) => {
        // aggiorno l'evento in UI facendo cambiare lo switch
        const updatedRows = rows.map(row => 
          row.id === id ? { ...row, visible: !row.visible } : row
        );
        setIsLoading(true)
        //faccio chiamata ad endpoint per il salavataggio dei dati in DB
            //se la risposta è positiva
                // Aggiorna lo stato con il nuovo valore dello switch
                setRows(updatedRows)
                dispatch(toggleVisible(id))
                setIsLoading(false)
            //se la risposta è negativa
                //faccio uscire un messaggio di errore
    };

    const handleAddClick = (id:number ) => {
        const rowObj = rows[id]
        const newId = uuidv4()
        const newRow = {...rowObj, id:newId}
        if(addCustomModelRow){
            addCustomModelRow(newRow)
        }   
       
    }
 
    const VisibleSwitch = ({id, value} : RowParam) => {
        return <Switch onChange={() => handleSwitchChange(id)} checked={value} />;
    };

    //dichiaro un array di oggetti "columns" per semplificare la creazione degli Headers delle colonne
    const columns = [
        {field: 'title', headerName: 'Tipologia', minWidth:150, flex:0.5, sortable:false, filterable:false ,  },
        {field: 'description', headerName: 'Descrizione', flex:1, minWidth:350 ,sortable:false, filterable:false },
        {field: 'visible', renderCell: (params:any) => (<VisibleSwitch value={params.value} id={params.id}/>), headerName: 'Visibile', width: 200,sortable:false, filterable:false },
        {field:'actions',  headerName:'azioni',width: 200, renderCell: (params:any) => (<ActionButton onClick={() => handleAddClick(params.id)} text='Duplica' icon='content_copy' direction='row-reverse'/>), sortable:false, filterable:false }
    ]; 

  return (
    <Box className="dataTable" >
        <Grid container mb={10} ml={15} spacing={2}>
            <Grid item width={'100%'} padding={'0 !important'}>
                <DataGrid
                    loading={isLoading}
                    autoHeight
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    
                    pageSizeOptions={[5, 10]}
                    sx={{
                        padding:'0',
                        fontSize: 14,
                        
                    }}
                />
            </Grid>
        </Grid>
    </Box>
  )
}
