import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import React from 'react'
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { NoResultComponent } from '../../../../../components/partials/placeholders/NoResultComponent';

type Props ={
    rows: any[];
    setRows: React.Dispatch<React.SetStateAction<any[]>>;
}

const columns: GridColDef[] = [
    { field: 'stato', headerName: 'Tipo', width:220 },
    { field: 'dataCreazione', headerName: 'Classe documentale', width:150 },
    { field: 'TEsp', headerName: 'Nome file', width:200 },
    { field: 'numeroProcedimento', headerName: 'Caricato da',width:150},
    { field: 'statoProcedimento', headerName: 'Caricato il',width:450},
    { field: 'utenteFirmatario', headerName: 'ID', width:160 },
    { field: 'actions', type: 'actions', headerName: '', minWidth:220},
]

export const CollegaDocumentiResult_Datagrid = (props:Props) => {
    const {rows} = props;

    return (
        <>
            <DataGrid
                disableVirtualization
                rowBuffer={2}
                columns={columns}
                rows={rows ? rows : []}
                getRowHeight={() => 121}
                disableColumnMenu
                disableRowSelectionOnClick
                slots={{
                    //row: (params: GridRowParams<any>) => <CustomRow params={params} />,// Usa il componente CustomRow per ogni riga
                    pagination: CustomPagination, //uso paginazione personalizzata
                    noRowsOverlay: NoResultOverlay
                }}
                sx={{
                    margin:'0 1rem',
                    border:'none', 
                    height:'100%',
                    
                    "& .MuiDataGrid-virtualScroller":{
                      marginTop: "0!important",
                      backgroundColor:'aliceblue'
                    },
                    "& .MuiDataGrid-virtualScrollerRenderZone ":{
                        minWidth:'100%',
                        transform: 'translate3d(0px,0px,0px) !important',
                    },
                    "& .MuiDataGrid-columnHeaders": {
                       // position: "sticky",
                        //top:'-16px',
                        //zIndex:2,
                        //backgroundColor: '#f8f9ff',
                        
                    },
                    "& .MuiDataGrid-footerContainer":{
                        //position: "sticky",
                        //bottom:'-16px',
                        //zIndex:2,
                        //backgroundColor: '#f8f9ff',
                    },
                    "& .MuiDataGrid-overlayWrapperInner":{
                        transition:'200ms'
                    }
                   
            
                    
                }}

                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 }
                    },
                }}
                pageSizeOptions={[5, 10, 20, 50]}
            />
        </>
    );
};

const NoResultOverlay = () => {
    return(
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}  height={'100%'} sx={{backgroundColor:'aliceblue'}} >
            <NoResultComponent message='Nessun Risultato'/>
        </Box>
    )
}

