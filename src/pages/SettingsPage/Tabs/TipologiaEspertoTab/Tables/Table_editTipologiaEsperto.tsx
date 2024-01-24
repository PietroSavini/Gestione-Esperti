import { useState } from 'react'
import { Box, MenuItem, Select, SelectChangeEvent, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';
import {v4 as uuidv4} from 'uuid'
import { DataGrid,  GridColDef,  GridEventListener, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { RequisitiList } from './Table_tipologieDiSistema';


//dataTable -------------------------------------------------------------------------------------------------------------------------

export default function Table_editTipologiaEsperto ({sectionTitle, requisiti}:{sectionTitle:string; requisiti:RequisitiList}) {
  
  const [rows, setRows] = useState<RequisitiList>(requisiti);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(true)
  
  //custom toolBar -------------------------------------------------------------------------------------------------------------------
  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
  
  //componente della toolbar che gestisce comporamento di Row in edit /show e funzionalità tasto aggiungi
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    //funzione al click pulsante aggiungi
    const handleClick = () => {
      //booleano che controlla se una riga è in edit mode
      const isAnyRowInEdit = Object.values(rowModesModel).some((row) => row.mode === GridRowModes.Edit);
      //se si, non faccio nulla evitando la creazione di altre righe
      if (isAnyRowInEdit) return 
      const id = uuidv4();
      setRows((oldRows) => [{ id, title: '', sistema: false, isNew: true }, ...oldRows ]);
      setRowModesModel((oldModel) => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title', },
        ...oldModel
      }));
    };
  
    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{backgroundColor:'#ebeeffff',padding:'.5rem .5rem 0rem .5rem', justifyContent:'space-between'}}>
        <Typography component={'h3'} variant='body1' fontWeight={400} textTransform={'uppercase'}>{sectionTitle}</Typography>
        <ActionButton direction={'row-reverse'} text='Aggiungi Requisito' icon='add' color="secondary" onClick={handleClick} />
      </GridToolbarContainer>
    );
  }
  //----------------------------------------------------------------------------------------------------------------------------------
  
  //Funzioni per pulsanti CRUD -----------------------------------------------------------------------------------------------------
  //edit mode della row
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  //cancella creazione nuova row
  const handleCancelClick = (id: GridRowId) => () => {
    setHasError(true)
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    
    const editedRow = rows?.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows?.filter((row) => row.id !== id));
    }
  };
  //create
  const handleSaveClick = (id: GridRowId) => () => {
    //chiamata ed attesa risposta server
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // invio dati a DB
      //risposta 200
        //aggiungo dati a store redux
      //risposta negativa
        
  };
  //delete
  const handleDeleteClick = (id: GridRowId) => () => {
    //chiamata ed attesa risposta server
    setRows(rows?.filter((row) => row.id !== id));
  };
  //update
  const processRowUpdate = (newRow: GridRowModel) => {
    //chiamata ed attesa risposta server
    setRows((prevRows) => prevRows?.map((row) => (row.id === newRow.id ? { ...row, ...newRow, isNew: false } : row)));
    return newRow;
  };
  
  //-----------------------------------------------------------------------------------------------------------------------------------
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  
  // casella con messaggio di errore -------------------------------------------------------------------------------------------------

  //componente tooltip MUI personalizzato per mostrare messaggio di errore 
  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

  //componente select che dovrebbe prendere lista nome requisitio da lista requisiti
  function TitleEditSelectCell(props: GridRenderEditCellParams, key:any) {
    const { error, id, value, api, field } = props;

    const handleChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value as string;
        api.setEditCellValue({ id, field, value: newValue });
    };

    return (
        <Select
            key={key}
            fullWidth
            value={value || ''}
            onChange={handleChange}
            className={!!error ? 'table-input-error' : ''}
        >
        {/* Opzioni della select, puoi popolare dinamicamente in base alle tue esigenze */}
            <MenuItem value="opzione1">Opzione 1</MenuItem>
            <MenuItem value="opzione2">Opzione 2</MenuItem>
            <MenuItem value="opzione3">Opzione 3</MenuItem>
      </Select>
    );
  }

  //potrebbe non servirci in qunato select
  const preProcessEditCellProps = async (params: GridPreProcessEditCellProps) => {
    const errorMessage = await validateTitle(params.props.value!.toString());
    return { ...params.props, error: errorMessage };
  };
  
  
  //non dovrebbe servirci in quanto prende i dati da select
  function validateTitle(title: string): Promise<boolean> {
    
    return new Promise<any>((resolve) => {
        const valid = title.length > 0;
        if (!valid) setHasError(true);
        resolve(valid ? setHasError(false) : 'il titolo del requisito è obbligatorio');
    })
  }

  //impostazione delle colonne DataGrid MUI
  const columns: GridColDef[] = [
    {field: 'title', type:'select', flex:0.4, minWidth:220, headerName: 'requisito' , preProcessEditCellProps, headerClassName:'customHeader', editable:true, renderEditCell:(params) => (<TitleEditSelectCell key={params.id} {...params}/>) },
    {field: 'punteggio',type:'select',flex:0.3,minWidth:80, headerName: 'Punteggio', editable:true, headerClassName:'customHeader' },
    {field: 'actions' , type:'actions',minWidth: 200, align:'right', headerName:'', flex:.3, width: 200,sortable:false, filterable:false, headerClassName:'customHeader',
    //renderCell che renderizza le azioni in base a stato row ( editmode / view mode ) 
      renderCell: (params:any) => {
        const {id} = params;
        let error = hasError;
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [   
            <ActionButton key={id} sx={{marginRight:'5px'}} icon='save' disabled={error} color='primary' onClick={handleSaveClick(id)} />,
            <ActionButton key={`${id}-1`} icon='cancel'color='error' onClick={handleCancelClick(id)} />,
          ];
        }
        return [
          <ActionButton key={id} sx={{marginRight:'5px'}} icon='edit' text='Modifica' color='warning' onClick={handleEditClick(id)}/>,
          <ActionButton key={`${id}-1`} icon='delete' text='Elimina' onClick={handleDeleteClick(id)} color='error'/>,
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
