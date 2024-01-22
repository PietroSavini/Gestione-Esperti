import { Box, Grid, Switch } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { useAppDispatch } from '../../../../../app/ReduxTSHooks'
import { copyTipologiaPersonalizzata, removeTipologiaPersonalizzata, selectTipologie, toggleVisiblePersonalizzate } from '../../../../../app/store/Slices/TipologieSlice'
import { DeleteButtonWithDialog } from '../../../../../components/partials/Buttons/DeleteButtonWithDialog'
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination'
import { DuplicateButtonWithDialog } from '../../../../../components/partials/Buttons/DuplicateButtonWithDialog'
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from 'react-router-dom'
import { Row } from './Table_tipologieDiSistema'
import { useSelector } from 'react-redux'
type Props ={ 
    fn? :  Function
    data: Row[]
}


type RowParam ={
    id:string;
    value:boolean
}

export const Table_tipologiePersonalizzate = ({data} : Props ) => {
    const tableData = data
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const tipologie = useSelector(selectTipologie)
    const rows = tipologie.tipologiePersonalizzate
    const [isLoading, setIsLoading] = useState<boolean>(false)

    /*Fn che gestisce il click dello switch in UI e su DB*/
    const handleSwitchChange = (id: string) => {
        
        //apro loader tabella
        setIsLoading(true)
        //faccio chiamata ad endpoint per il salavataggio dei dati in DB
            //se la risposta è positiva
                // aggiorno UI tabella
                
                // Aggiorno lo state con il nuovo valore dello switch
                dispatch(toggleVisiblePersonalizzate(id))
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
                // Rimozione dalla tabella e dal Redux state
                dispatch(removeTipologiaPersonalizzata(id));
                setIsLoading(false)
            //else
                //faccio display di messaggio di errore
                //non cambio la UI
      
    };

    const handleCopyClick = (row:Row) => {
        const rowObj = row
        const newId = uuidv4()
        const newRow = {...rowObj, id:newId}
        dispatch(copyTipologiaPersonalizzata(newRow))
       
    }
    /* componente che renderizza i pulsanti azione all'interno della tabella */
    const DataGridActions = ({params}:any) => {
        //estraggo i valori della ROW
        const { row , id} = params;
        return(
            <div className='dataGrid-actions'>
                <DuplicateButtonWithDialog row={ row } successFn={handleCopyClick}/>
                <ActionButton color='warning' onClick={() => navigate('/impostazioni/modifica-tipologia',{state:{...row, rowId: id}})} text='Modifica' icon='edit' direction='row-reverse'/>
                <DeleteButtonWithDialog row={row as Row} successFn={handleDeleteClick}/>
            </div>
        )
    }
    
    /* componente che renderizza lo switch MUI nella tabella */
    const VisibleSwitch = ({id, value} : RowParam) => {
        return <Switch id={id} onChange={() => handleSwitchChange(id)} checked={value} />;
    };


    // array di oggetti "columns" per semplificare la creazione delle colonne
    const columns: GridColDef[] = [
        {field: 'title', flex:0.3, minWidth:150, headerName: 'Tipologia', width: 200  },
        {field: 'description',flex:1,minWidth:350, headerName: 'Descrizione', width: 350},
        {field: 'visible', renderCell: (params:any) => (<VisibleSwitch value={params.value} id={params.id}/>),minWidth: 70, align:'center', headerAlign:'center', flex:.3, headerName:'Visibile', width: 200,sortable:false, filterable:false },
        {field:'actions', headerAlign:'center', align:'center', headerName:'azioni', width: 320, renderCell: (params:any) => (<DataGridActions params={params} />), sortable:false, filterable:false }
    ];

 
    

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
