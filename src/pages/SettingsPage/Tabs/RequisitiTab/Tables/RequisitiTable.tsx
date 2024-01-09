import { useState } from 'react'
import { Table } from '../RequisitiTab'
import { Box, Typography } from '@mui/material';
import { AddRequisitoWithDialog } from '../../../../../components/partials/Buttons/AddRequisitoWithDialog';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { EditRequisito } from '../../../../../components/partials/Buttons/EditRequisito';
import { DeleteButtonWithDialog } from '../../../../../components/partials/Buttons/DeleteButtonWithDialog';
type Rows = Row[] | [];

type Row = {
  id: string | number;
  title: string;
  sistema: boolean;
}

export const RequisitiTable = ({data}:{data:Table}) => {
  const [rows, setRows] = useState<Rows>(data.rows);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {title} = data

  const handleAddRequisito = (newRequisitoTitle : string) => {
    // Salvataggio su DB dove risponde con id requisito da immettere nel processo di creazione del requisito
    const newRequisito = {
      id: newRequisitoTitle,
      title: newRequisitoTitle,
      sistema: false
    };

    setRows((prevState) => [...prevState, newRequisito])
    console.log(rows)
  }

  const handleDelete = (id: any) => {
    setRows((prevState)=> [...prevState.filter(row => row.id !== id)])
  }

  const TableActions = ({params}:{params:Row}) => {

    const handleEditRequisito = (title:string) => {
      const editedRow : Row = {...params, title};
      setRows((prevState)=> [...prevState.filter(row => row.id !== editedRow.id), editedRow ])
    }

    if(!params.sistema) {
      return (
        <>
          <Box display={'flex'} gap={'0.5rem'} width={'100%'} sx={{paddingRight:'1.5rem'}} justifyContent={'flex-end'}>
            <EditRequisito requisitoTitle={params.title}  successFn={handleEditRequisito} />
            <DeleteButtonWithDialog type='requisiti' row={params} successFn={handleDelete}/>
          </Box>
        </>
      )
      }else{
        return(
          <></>
        ) 
      }
  }

  const Sistema = ({params}:{params:Row}) => {
    if(params.sistema){
      return(
        <>
          Si
        </>
      )
    }

    return (
      <>
       No
      </>
    )
    
  }

  const columns: GridColDef[] = [
    {field: 'title', flex:0.4, minWidth:220, headerName: 'requisito'  },
    {field: 'sistema',flex:0.3,minWidth:70, headerName: 'sistema', renderCell:(params:any) =>( <Sistema params={params.row} />) },
    {field: 'actions', renderCell: (params:any) => (<TableActions params={params.row} />),minWidth: 200, align:'center', headerName:'',headerAlign:'center', flex:.3, width: 200,sortable:false, filterable:false },
    ];

  return (
    <>

        <Box display={'flex'} justifyContent={'space-between'}  sx={{ padding:'1rem 1rem', backgroundColor:'#ebeeffff', borderBottomLeftRadius:'10px', borderBottomRightRadius:'10px', border:'1px solid #e6e6e6'}}>
          <Typography component={'h3'} variant='body1' fontWeight={400} textTransform={'uppercase'}>{title}</Typography>
          <AddRequisitoWithDialog sectionTitle={title} successFn={handleAddRequisito} />
        </Box>
        <Box className='requisiti-table'  sx={{backgroundColor:'#fff'}} >
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
                      paginationModel: { page: 0, pageSize: 5 },
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
                      labelRowsPerPage: 'Righe per sezione:',
                  },
              }}
          />

        </Box>
    </>
  )
}
