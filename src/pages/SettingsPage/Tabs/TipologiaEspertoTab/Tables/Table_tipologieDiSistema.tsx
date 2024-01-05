import { Box, Grid, Pagination, PaginationItem, Switch, TablePaginationProps } from '@mui/material'
import { DataGrid, GridColDef, GridPagination, gridPageCountSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid'
import React, {  useState } from 'react'
import './DataTable.scss'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import {v4 as uuidv4} from 'uuid'
import { useAppDispatch } from '../../../../../app/ReduxTSHooks'
import { addTipologiaPersonalizzata, toggleVisible } from '../../../../../app/store/Slices/TipologieSlice'
import { DuplicateButtonWithDialog } from '../../../../../components/partials/Buttons/DuplicateButtonWithDialog'
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination'

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

export const Table_tipologieDiSistema = ({data} : Props ) => {
    const dispatch = useAppDispatch()
    const tableData = data
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

    const handleSwitchChange = (id: string) => {
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

    const handleAddClick = (row:Row) => {
        const rowObj = row
        const newId = uuidv4()
        const newRow = {...rowObj, id:newId}
        dispatch(addTipologiaPersonalizzata(newRow))
       
    }
 
    const VisibleSwitch = ({id, value} : RowParam) => {
        return <Switch id={`${id}`} onChange={() => handleSwitchChange(id)} checked={value} />;
    };

    const DataGridActions = ({params}:{params:any}) => {
        const { row } = params.row

        return(
            <div className='dataGrid-actions'>
                <DuplicateButtonWithDialog row={ row } successFn={handleAddClick} />
                <ActionButton color='warning' onClick={() => {{/*rendering pagina che accetta id ROW e fa lo SHOW della tipologia*/}}} text='Visualizza' icon='preview' direction='row-reverse'/>
            </div>
        )
    }

   
    //dichiaro un array di oggetti "columns" per semplificare la creazione degli Headers delle colonne
    const columns:GridColDef[] = [
        {field: 'title', headerName: 'Tipologia', minWidth:150, flex:0.3, sortable:false, filterable:false ,  },
        {field: 'description', headerName: 'Descrizione', flex:1, minWidth:350 ,sortable:false, filterable:false },
        {field: 'visible', renderCell: (params:any) => (<VisibleSwitch value={params.value} id={params.id}/>), headerName: 'Visibile', minWidth: 70, align:'center', headerAlign:'center', flex:.3, sortable:false, filterable:false },
        {field: 'actions', headerAlign:'center', align:'center',headerName:'azioni',  width: 320 , sortable:false, filterable:false , renderCell: (params:any) => (<DataGridActions params={params}/>)}
    ]; 

    const localText = {
        noRowsLabel: 'Nessuna riga trovata',
        page: 'Pagina',
        of: 'di',
        rowsPerPage: 'righe per pagina',
    }
 

  return (
    <Box className="dataTable" >
        <Grid container mb={10} ml={15} spacing={2}>
            <Grid item width={'100%'} padding={'0 !important'}>
                <DataGrid
                    
                    hideFooterSelectedRowCount
                    loading={isLoading}
                    autoHeight
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
