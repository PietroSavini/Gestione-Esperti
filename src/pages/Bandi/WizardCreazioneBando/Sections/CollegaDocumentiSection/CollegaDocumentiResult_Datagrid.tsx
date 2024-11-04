import React from 'react'
import { DataGrid, GridColDef, GridRowParams, GridSlotsComponent } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ServerSideCustomPagination } from '../../../../../components/partials/CustomPagination/ServerSideCustomPagination';
import { NoResultComponent } from '../../../../../components/partials/placeholders/NoResultComponent';
import { UncapitalizeObjectKeys } from '@mui/x-data-grid/internals';
import { Box, SxProps, Theme } from '@mui/material';

/*
----------------------------------------------------------------------

Datagrid generale che potrà  essere utilizzata da ogni parte e a cui si passano tutti i parametri necessari - resa totalmente dinamica e smart

----------------------------------------------------------------------
*/

type Props = {
    sx?: SxProps<Theme>; //stile da applicare alla tabella oltre lo stile di base
    columns: GridColDef[]; // oggetti delle colonne della tabella
    rows: any[]; //array sdi oggetti (righe) della tabella
    setRows: React.Dispatch<React.SetStateAction<any[]>>; //funzione per settaggio delle righe della tabella
    noRowsOverlay?: () => JSX.Element; //funzione che ritorna componente placeholder per quando non ci sono risultati
    customToolbar?: (params:any) => JSX.Element; //funzione che ritorna componente custom della toolbar
    rowId: string //parametro dell'oggetto riga da utilizzare come ID univoco
    customRow?:{
        row: (params: GridRowParams<any>) => JSX.Element; //funzione che ritorna una row personalizzata
        rowHeight:number | 'auto'// altezza in px della customRow da specificare per creare correttamente righe personalizzate
    } 
    isLoading?: boolean; // stato del loader della tabella
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>; // funzione per settare il loading della tabella
    //oggetto che se presente triggera la pagination server side
    serverSidePagination?: {
        rowCount: number; 
        setRowCount: React.Dispatch<React.SetStateAction<number>>;
    };

    //obsoleti ??
    setPaginationModel?: React.Dispatch<React.SetStateAction<any[]>>; // funzione che cambia il paginationModel
    paginationModel?: {
        rowsPage: number; // le righe per pagina chieste al backend 
        pageNumber: number; // pagina corrente
        orderPage: string; // l'ordine in cui vengono mandati i dati ??  mui dovrebbe gestire questa casistica da sola 
        pageSizeOptions: number[];
    };
}

export const CollegaDocumentiResult_Datagrid = (props: Props) => {
    const {
        rows,
        setRows,
        setPaginationModel,
        paginationModel,
        serverSidePagination,
        sx,
        isLoading,
        setIsLoading,
        columns,
        noRowsOverlay,
        customToolbar,
        customRow,
        rowId
    } = props;

    //creazione condizionale degli slot in base ai prop ricevuti
    const slots: UncapitalizeObjectKeys<Partial<GridSlotsComponent>> = {
        pagination: (paginationProps: any) => {
            if (rows.length <= 0) {
                return null;
            }
            return serverSidePagination ? (
                <ServerSideCustomPagination {...paginationProps} />
            ) : (
                <CustomPagination {...paginationProps} />
            );
        },
        noRowsOverlay: noRowsOverlay || NoResultOverlay,
    } 

    // aggiungo all oggetto slots i vari parametri in base ai prop ricevuti
    if(customRow) {
        slots.row = (params: GridRowParams<any>) => customRow.row(params);
    }
    if(customToolbar) {
        slots.toolbar = (params:any) => customToolbar(params);
    }


    return (
        <>
            <DataGrid
                disableVirtualization={customRow ? true : false}//virtualizzazione disabilitata quando le rows sono custom => da problemi se attiva
                loading={isLoading} 
                
                //parametri delle rows
                rows={rows}
                getRowId={(params: any) => params[rowId]}
                rowSelection={false}
                rowBuffer={2}
                getRowHeight={() => customRow ? customRow.rowHeight : undefined}

                //parametri per le colonne
                columns={columns}
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableRowSelectionOnClick
                
                //parametri per paginazione dinamici 
                paginationMode={serverSidePagination ? 'server' : 'client'}
                rowCount={serverSidePagination?.rowCount}
                initialState={{
                    pagination: {
                        paginationModel: { page: paginationModel ? paginationModel.pageNumber : 0, pageSize: paginationModel ? paginationModel.rowsPage : 10 },
                    },
                }}
                pageSizeOptions={paginationModel ? paginationModel.pageSizeOptions : [5, 10, 25, 50]}
                slots={slots}

                //style
                sx={{
                    margin: '0 1rem',
                    border: 'none',
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: 'aliceblue',
                        
                    },
                    "& .MuiDataGrid-virtualScrollerRenderZone ": {
                        minWidth: '100%',
                        
                    },
                    "& .MuiDataGrid-overlayWrapperInner": {
                        transition: '200ms'
                    },
                    ...sx
                }}
            />
        </>
    );
};

const NoResultOverlay = () => {
    return (
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'} sx={{ backgroundColor: 'aliceblue' }} >
            <NoResultComponent message='Nessun Risultato' />
        </Box>
    )
}

