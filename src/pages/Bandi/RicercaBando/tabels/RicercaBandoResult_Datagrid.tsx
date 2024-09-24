import { Box, Icon, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import React from 'react'
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { CustomPagination } from '../../../../components/partials/CustomPagination/CustomPagination';
import { NoResultComponent } from '../../../../components/partials/placeholders/NoResultComponent';
import dayjs from 'dayjs';


const columns: GridColDef[] = [
    { field: 'dataCreazione', headerName: 'Creato il', width:150 },
    { field: 'TEsp', headerName: 'Tipologia Esperto Esterno', width:200 },
    { field: 'numeroProcedimento', headerName: 'N.ro Procedimento',width:150},
    { field: 'statoProcedimento', headerName: 'Stato Procedimento',width:450},
    { field: 'utenteFirmatario', headerName: 'Caricato da', width:160 },
    { field: 'stato', headerName: 'Stato del Bando', width:220 },
    { field: 'actions', type: 'actions', headerName: '', minWidth:220},
]

export type Props = {
    rows: any[],
    setRows: React.Dispatch<React.SetStateAction<any[]>>,
}



const CustomRow = ({ params }: { params: GridRowParams }) => {

    return (
        <Box role='row' data-id={params.row.id} sx={{ overflow:'hidden',padding:'10px 10px 10px 0px', transition:'200ms', backgroundColor: 'transparent', borderTopLeftRadius:'10px', borderTopRightRadius:'10px',  ":hover>div.headerRow":{
            backgroundColor:'aliceblue',
            
        } }}>
            <Box display={'flex'} position={'relative'} className={'headerRow'}  zIndex={1} sx={{backgroundColor:'#fff', border:'1px solid rgba(0,0,0, .1)', borderTopLeftRadius:'10px', borderTopRightRadius:'10px' }} >

                <Box sx={{minHeight:'48px',alignItems:'flex-start',display:'flex', p:'0px 10px', width:'150px', flexDirection:'column', justifyContent:'center' }}>
                    <Typography variant="body1" fontSize={14}>{ dayjs(params.row.dataCreazione).format('DD/MM/YYYY') }</Typography>
                    <Typography variant="body1" fontSize={14}>{ dayjs(params.row.dataCreazione).format(' HH:mm') }</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'200px'}}>
                    <Typography variant="body1" fontSize={14}>{params.row.descrizioneTEsp}</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'150px'}}>
                    <Typography variant="body1" fontSize={14}>{params.row.numeroProcedimento}</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'450px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.statoProcedimento}</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'160px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.utenteFirmatario}</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'220px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.stato}</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px',flexGrow:1 , justifyContent:'flex-end', minWidth:'220px' }}>
                    <ActionButton color='secondary' text='Modifica' endIcon={<Icon sx={{marginRight:'.5rem'}}>plagiarism</Icon>} direction={'row-reverse'} />
                </Box>
            </Box>

            <Box display={'flex'} sx={{ p:'0px 10px', backgroundColor: '#ebeeff', borderBottomRightRadius:'15px', borderBottomLeftRadius:'15px', border:'1px solid rgba(0,0,0,0.1)', minHeight:'50px', maxHeight:'68'}}>
                <Box sx={{width:'50%', minHeight:'50px', maxHeight:'68px', overflowY:'auto', display:'flex', alignItems:'center'}}>
                    <Box>
                        <Typography component={'span'} fontSize={14} sx={{marginRight:'10px'}} fontWeight={600}> Descrizione:</Typography>
                    </Box>
                    <Box>
                        <Box sx={{overflowY:'auto',maxHeight:'40px'}}>

                        <Typography  fontSize={12}> {params.row.descrizioneEstesa}</Typography>
                        </Box>
                        <Typography 
                            color={'green'}
                            fontSize={12}
                            fontWeight={600}> Prot: 0000012/E del 18/01/2024 15:40 Classificazione: V.2 - Ammissioni e iscrizioni</Typography>
                    </Box>
                    
                </Box>
                <Box sx={{width:'50%', minHeight:'50px', display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
                    <ActionButton color='warning' text='Visualizza' endIcon={<Icon sx={{marginRight:'.5rem'}}>document_scanner</Icon>} direction={'row-reverse'} />
                </Box>
            </Box>
        </Box>
    );
};

export const RicercaBandoResult_Datagrid = (props:Props) => {
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
                    row: (params: GridRowParams<any>) => <CustomRow params={params} />,// Usa il componente CustomRow per ogni riga
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