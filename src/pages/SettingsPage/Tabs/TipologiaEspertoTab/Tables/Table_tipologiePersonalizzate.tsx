import { Box, Grid, Switch } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import './DataTable.scss'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { useAppDispatch } from '../../../../../app/ReduxTSHooks'
import { addTipologiaPersonalizzata, removeTipologiaPersonalizzata, toggleVisible } from '../../../../../app/store/Slices/TipologieSlice'
import { DeleteButtonWithDialog } from '../../../../../components/partials/Buttons/DeleteButtonWithDialog'
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination'
import { DuplicateButtonWithDialog } from '../../../../../components/partials/Buttons/DuplicateButtonWithDialog'
import {v4 as uuidv4} from 'uuid'
type Props ={ 
    fn? :  Function
    data: Row[]
}

export type Row = {
    id:string;
    title:string,
    description:string;
    visible:boolean;
}

type RowParam ={
    id:string;
    value:boolean
}

export const Table_tipologiePersonalizzate = ({data} : Props ) => {
    const tableData = data
    const dispatch = useAppDispatch()
    //InitialState
    // utilizzo useMemo per memorizzare le Rows derivanti da Data, questo metodo offre una migliore ottimizzazione
    const initialRows = React.useMemo(() => {
        if (tableData) {
            return tableData.map(item => ({
                id: item.id,
				title: item.title,
                description: item.description,
                visible: item.visible,
			}));
		}
		return [];
	}, [data]);

    const [rows, setRows] = useState<Row[]>(initialRows)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    /*Fn che gestisce il click dello switch in UI e su DB*/
    const handleSwitchChange = (id: string) => {
        // aggiorno l'evento in UI facendo cambiare lo switch
        const updatedRows = rows.map(row => 
          row.id === id ? { ...row, visible: !row.visible } : row
        );
        //apro loader tabella
        setIsLoading(true)
        //faccio chiamata ad endpoint per il salavataggio dei dati in DB
            //se la risposta è positiva
                // aggiorno UI
                setRows(updatedRows)
                // Aggiorno lo state con il nuovo valore dello switch
                dispatch(toggleVisible(id))
                //loader tabella false
                setIsLoading(false)
            //se la risposta è negativa
                //faccio uscire un messaggio di errore 
    };

    /* Fn per cancellazione Row tabella sia UI che DB*/
    const handleDeleteClick = (id: string) => {
        //apro il loader tabella
        setIsLoading(true)
        //chiamata ad endpoint 'destroy' di DB 
            //se risposta OK
                // Rimozione dalla tabella e dalla Redux state
                const updatedRows = rows.filter(row => row.id !== id);
                setRows(updatedRows);
                dispatch(removeTipologiaPersonalizzata(id));
                setIsLoading(false)
            //else
                //faccio display di messaggio di errore
                //non cambio la UI
      
    };

    const handleAddClick = (row:Row) => {
        const rowObj = row
        const newId = uuidv4()
        const newRow = {...rowObj, id:newId}
        dispatch(addTipologiaPersonalizzata(newRow))
       
    }
    /* componente che renderizza i pulsanti azione all'interno della tabella */
    const DataGridActions = ({params}:any) => {
        //estraggo i valori della ROW
        const { row } = params 

        return(
            <div className='dataGrid-actions'>
                <DuplicateButtonWithDialog row={ row } successFn={handleAddClick}/>
                <ActionButton color='warning' onClick={() => {{/*rendering pagina che accetta id ROW e permette la modifica dell'elemento*/}}} text='Modifica' icon='edit' direction='row-reverse'/>
                <DeleteButtonWithDialog row={row as Row} successFn={handleDeleteClick}/>
            </div>
        )
    }
    
    /* componente che renderizza lo switch MUI nella tabella */
    const VisibleSwitch = ({id, value} : RowParam) => {
        return <Switch id={`${id}`} onChange={() => handleSwitchChange(id)} checked={value} />;
    };


    // array di oggetti "columns" per semplificare la creazione delle colonne
    const columns: GridColDef[] = [
        {field: 'title', flex:0.3, minWidth:150, headerName: 'Tipologia', width: 200  },
        {field: 'description',flex:1,minWidth:350, headerName: 'Descrizione', width: 350},
        {field: 'visible', renderCell: (params:any) => (<VisibleSwitch value={params.value} id={params.id}/>),minWidth: 70, align:'center', headerAlign:'center', flex:.3, headerName:'Visibile', width: 200,sortable:false, filterable:false },
        {field:'actions', headerAlign:'center', align:'center', headerName:'azioni', width: 320, renderCell: (params:any) => (<DataGridActions params={params} />), sortable:false, filterable:false }
    ];

    useEffect(() => {
        setRows(initialRows)

    }, [data])
    

  return (
    <Box className="dataTable" >
        <Grid container mb={10} ml={15} spacing={2}>
            <Grid item width={'100%'} padding={'0 !important'}>
                <DataGrid
                    slots={{
                        pagination: CustomPagination,
                    }}
                    hideFooterSelectedRowCount
                    autoHeight
                    loading={isLoading}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        
                        pagination: {
                        
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20, 50]}
                    sx={{
                        padding:'0',
                        fontSize: 14,
                    }}
                    localeText={{
                        noRowsLabel:'Nessun elemento trovato',
                        MuiTablePagination: {
                            labelRowsPerPage: 'Righe per pagina:',
                        },
                    }}
                />
            </Grid>
        </Grid>
    </Box>
  )
}
