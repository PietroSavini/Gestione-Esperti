import { Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import './DataTable.scss'

type TableData = {
    id: number,
    name: string,
    surname:string,
    age:number,
    gender:string,
}[];


//1) il Componente DataTable accetta un array di oggetti TableData come data
export const DataTable = ({ data }: { data: TableData }) => {

    // utilizzo useMemo per memorizzare le Rows derivanti da Data, questo metodo previene ricalcoli non necessari quando il componente renderizza di nuovo
    const rows = React.useMemo(() => {
        if (data) {
            return data.map(item => ({
                id: item.id,
				name: item.name,
                surname: item.surname,
                age: item.age,
                gender: item.gender,
			}));
		}
		return [];
	}, [data]);

    //dichiaro un array di oggetti "columns" per semplificare la creazione degli Headers delle colonne
    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field: 'name', headerName: 'NOME', width: 200},
        {field: 'surname', headerName: 'cognome', width: 200},
        {field: 'age', headerName: 'età', width: 50},
        {field: 'gender',headerName:'sesso', width:150}
    ];
  return (
    <div className="dataTable">
        <Grid container mb={10} ml={15} spacing={2}>
            <Grid item sx={{ minWidth: 650 }}>
                <DataGrid
                    //passo i valori come props per la creazione della table
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{
                        minHeight: "400px",
                        fontSize: 14,
                        boxShadow: 2,
                        border: 2,
                        borderColor: 'primary.light',
                        '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                        },
                        '& .MuiDataGrid-columnHeaders ': {
                            backgroundColor: '#f5f5f5',
                        }
                    }}
                />
            </Grid>
        </Grid>
    </div>
  )
}
