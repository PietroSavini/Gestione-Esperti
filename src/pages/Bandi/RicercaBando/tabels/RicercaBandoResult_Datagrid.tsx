import { Box, Divider, Icon, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import React, { forwardRef, useState } from 'react'
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';


const columns: GridColDef[] = [
    { field: 'dataCreazione', headerName: 'Creato il', width:150 },
    { field: 'TEsp', headerName: 'Tipologia Esperto Esterno', width:200 },
    { field: 'numeroProcedimento', headerName: 'N.ro Procedimento',width:150},
    { field: 'statoProcedimento', headerName: 'Stato Procedimento',width:450},
    { field: 'utenteFirmatario', headerName: 'Caricato da', width:160 },
    { field: 'stato', headerName: 'Stato del Bando', width:160 },
    { field: 'actions', type: 'actions', headerName: ''},


]

export type Props = {
    rows: any[],
    setRows: React.Dispatch<React.SetStateAction<any[]>>,
}



const CustomRow = ({ params }: { params: GridRowParams }) => {

    return (
        <Box role='row' data-id={params.row.id} sx={{ overflow:'hidden', transition:'200ms', backgroundColor: 'transparent', borderTopLeftRadius:'10px', borderTopRightRadius:'10px',  ":hover>div.headerRow":{
            backgroundColor:'aliceblue',
            
        } }}>
            <Box display={'flex'} position={'relative'} className={'headerRow'}  zIndex={1} sx={{boxShadow:'0px 1px 5px rgba(0,0,0,0.3)', border:'1px solid rgba(0,0,0, .1)', borderTopLeftRadius:'10px', borderTopRightRadius:'10px' }} >

                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'150px'  }}>
                    <Typography variant="body1" fontSize={14}>{params.row.dataCreazione}</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'200px'}}>
                    <Typography variant="body1" fontSize={14}>{params.row.TEsp}</Typography>
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
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px', width:'160px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.stato}</Typography>
                </Box>
                <Box sx={{minHeight:'48px',alignItems:'center',display:'flex', p:'0px 10px',flexGrow:1 , justifyContent:'flex-end' }}>
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
const {rows, setRows} = props;

    return (
        <>
            <DataGrid

                columns={columns}
                rows={rows ? rows : []}
                rowSpacingType='margin'
                autoHeight
                disableColumnMenu
                disableRowSelectionOnClick
                getRowHeight={() => 150} // Imposta altezza fissa per visualizzare i dettagli
                slots={{
                    row: (params: GridRowParams<any>) => <CustomRow params={params} /> // Usa il componente CustomRow per ogni riga
                }}
                sx={{
                    margin:'0 1rem',
                    border:'none', 
                    maxWidth:'1800px',
                    "& .MuiDataGrid-virtualScrollerRenderZone ":{
                        minWidth:'100%',
                        overflowY:'auto'
                    }
                }}
            />
        </>
    );
};