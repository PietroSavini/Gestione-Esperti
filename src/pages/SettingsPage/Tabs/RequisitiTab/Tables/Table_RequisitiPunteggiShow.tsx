import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import './Table_requisiti.scss';
import { Requisito_Table } from '../../../types';


//dataTable -------------------------------------------------------------------------------------------------------------------------
export default function Table_RequisitiPunteggiShow({ data }: { data: Requisito_Table }) {
  const requisiti = data.requisiti_list;
  const masterRequisitoTitle = data.fs_ee_req_desc;

  //componente personalizzato toolbar
  function EditToolbar() {
    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{ backgroundColor: '#ebeeffff', display: 'flex', width: '100%' }}>
        <Box display={'flex'} alignItems={'center'} width={'45%'} >
          <Typography component={'h3'} variant='body1' fontWeight={400}>{masterRequisitoTitle}</Typography>
        </Box>
      </GridToolbarContainer>
    );
  };

  //impostazione delle colonne DataGrid MUI
  const columns: GridColDef[] = [
    //colonna descrizione requisito
    {
      field: 'fs_ee_req_desc',
      type: 'text',
      flex: 0.7,
      minWidth: 220,
      headerName: 'requisito',
      headerClassName: 'customHeader',
    },
    //colonna punteggio
    {
      field: 'fi_ee_req_punteggio',
      headerName: 'Punteggio',
      headerClassName: 'customHeader',
      minWidth: 80,
      flex: 0.3,
    }
  ];

  return (
    <>
      <Box className='requisiti-table' sx={{ backgroundColor: '#fff' }} >
        <DataGrid
          slots={{
            pagination: CustomPagination,
            toolbar: EditToolbar,
          }}
          getRowId={(row) => {
            return row.fi_ee_req_id
          }}
          rows={requisiti}
          columns={columns}
          hideFooterSelectedRowCount
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          sx={{
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
            fontSize: 14,
          }}
          localeText={{
            noRowsLabel: 'Nessun Requisito inserito',
            MuiTablePagination: {
              labelRowsPerPage: 'Righe per sezione:',
            },
          }}
        />
      </Box>
    </>
  )
}