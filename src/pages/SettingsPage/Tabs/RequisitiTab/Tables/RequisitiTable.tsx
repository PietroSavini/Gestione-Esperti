import { useState } from 'react'
import { Table } from '../RequisitiTab'
import { Box, Typography } from '@mui/material';
import {v4 as uuidv4} from 'uuid'

import { DataGrid,  GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';


type Rows = Row[] | [];

type Row = {
  id: string | number;
  title: string;
  sistema: boolean;
  isNew:boolean
}


//dataTable -------------------------------------------------------------------------------------------------------------------------

export default function RequisitiTable ({data}:{data:Table}) {
  const [rows, setRows] = useState<Rows>(data.rows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {title} = data
  //custom toolBar -------------------------------------------------------------------------------------------------------------------
  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
  
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
  
    const handleClick = () => {
      const id = uuidv4();
      setRows((oldRows) => [...oldRows, { id, title: 'Aggiungi Titolo Requisito', sistema: false, isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
      }));
    };
  
    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{backgroundColor:'#ebeeffff',padding:'.5rem .5rem 0rem .5rem', justifyContent:'space-between'}}>
        <Typography component={'h3'} variant='body1' fontWeight={400} textTransform={'uppercase'}>{title}</Typography>
        <ActionButton direction={'row-reverse'} text='Aggiungi Requisito' icon='add' color="secondary" onClick={handleClick} />
      </GridToolbarContainer>
    );
  }
  //custom toolBar -------------------------------------------------------------------------------------------------------------------

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
  
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? { ...row, ...newRow, isNew: false } : row)));
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {field: 'title', flex:0.4, minWidth:220, headerName: 'requisito' , headerClassName:'customHeader', editable:true },
    {field: 'sistema',flex:0.3,minWidth:80, headerName: 'sistema', renderCell:(params:any) =>( <Sistema params={params.row} />), headerClassName:'customHeader' },
    {field: 'actions' , type:'actions',minWidth: 200, align:'right', headerName:'', flex:.3, width: 200,sortable:false, filterable:false, headerClassName:'customHeader',
        renderCell: (params:any) => {
          const {id} = params;
          const {sistema} =params.row;
          console.log(id)
          if(sistema){
            return <></>
          }

          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [   
              <ActionButton sx={{marginRight:'5px'}} icon='save' color='primary' onClick={handleSaveClick(id)} />,
              <ActionButton icon='cancel'color='error' onClick={handleCancelClick(id)} />,
            ];
          }
          return [
            <ActionButton sx={{marginRight:'5px'}} icon='edit' text='Modifica' color='warning' onClick={handleEditClick(id)}/>,
            <ActionButton icon='delete' text='Elimina' onClick={handleDeleteClick(id)} color='error'/>,
          ];
        }
      }
    ];

  return (
    <>
      

      <Box className='requisiti-table'  sx={{backgroundColor:'#fff'}} >
        <DataGrid
          
          
          slots={{
            pagination: CustomPagination,
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          isCellEditable={(params)=> !params.row.sistema }
          loading={isLoading}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          rows={rows}
          columns={columns}
          hideFooterSelectedRowCount
          autoHeight
          initialState={{           
            pagination: {    
                paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          sx={{
            borderTopRightRadius:'10px',
            borderTopLeftRadius:'10px',
            fontSize: 14,
          }}
          localeText={{
            noRowsLabel:'Nessun Requisito',
            MuiTablePagination: {
                labelRowsPerPage: 'Righe per sezione:',
            },
          }}
        />
      </Box>
    </>
  )
}
