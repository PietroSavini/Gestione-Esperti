import { Box, Grid, Switch } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import './DataTable.scss'
import { Data, Row } from './TipologiaEsperto'

type TableData = Data


//1) il Componente DataTable accetta un array di oggetti TableData come data
export const DataTable = (data : TableData) => {
    const tableData = data.data
    // utilizzo useMemo per memorizzare le Rows derivanti da Data, questo metodo previene ricalcoli non necessari quando il componente renderizza di nuovo
    const initialRows = React.useMemo(() => {
        if (tableData) {
            return tableData.map(item => ({
                id: item.id,
				title: item.title,
                description: item.description,
                visible: item.visible ,
			}));
		}
		return [];
	}, [data]);

    const [rows, setRows] = useState<Row[]>(initialRows)

    const handleSwitchChange = (id: number) => {
        // Crea una nuova array di righe, modificando solo quella specifica
        const updatedRows = rows.map(row => 
          row.id === id ? { ...row, visible: !row.visible } : row
        );
    
        // Aggiorna lo stato con la nuova array di righe
        setRows(updatedRows);
    };
    type RowParam ={
        id:number;
        value:boolean
    }
    const VisibleSwitch = ({id, value} : RowParam) => {
        return <Switch onChange={() => handleSwitchChange(id)} checked={value} />;
    };

    //dichiaro un array di oggetti "columns" per semplificare la creazione degli Headers delle colonne
    const columns = [
        {field: 'title', headerName: 'Tipologia', width: 200, sortable:false, filterable:false ,  },
        {field: 'description', headerName: 'Descrizione', width: 350,sortable:false, filterable:false },
        {field: 'visible', type:'boolean', renderCell: (params:any) => (<VisibleSwitch value={params.value} id={params.id}/>), headerName: 'Visibile', width: 100,sortable:false, filterable:false },
    ];

    useEffect(() => {
        //salvare dati su redux state, e inviare salvataggio a DB impostando loading della tabella su true fino alla fine della risposta
      console.log(rows)
    }, [rows])
    

  return (
    <Box className="dataTable" >
        <Grid container mb={10} ml={15} spacing={2}>
            <Grid item width={'100%'} padding={'0 !important'}>
                <DataGrid
                    
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
