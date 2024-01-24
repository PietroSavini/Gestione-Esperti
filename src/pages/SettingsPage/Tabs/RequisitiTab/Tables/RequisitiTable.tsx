import { useState } from 'react'
import { Table } from '../RequisitiTab'
import { Box, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';
import {v4 as uuidv4} from 'uuid'
import { DataGrid,  GridColDef, GridEditInputCell, GridEventListener, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { RequisitiList } from '../../TipologiaEspertoTab/Tables/Table_tipologieDiSistema';


type Rows = Row[] | [];

type Row = {
  id: string | number;
  title: string;
  sistema: boolean;
  isNew:boolean;
}


//dataTable -------------------------------------------------------------------------------------------------------------------------

export default function RequisitiTable ({data}:{data:Table}) {
  const [rows, setRows] = useState<RequisitiList>(data.requisitiList);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(true)
  const {sectionTitle} = data
  
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
    
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
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
    setRows(rows.filter((row) => row.id !== id));
  };
  //update
  const processRowUpdate = (newRow: GridRowModel) => {
    //chiamata ed attesa risposta server
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? { ...row, ...newRow, isNew: false } : row)));
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

  //componente casella editabile con messaggio di errore
  function TitleEditInputCell(props: GridRenderEditCellParams, key:any) {
    const { error } = props;
    return (
      <StyledTooltip key={key} open={!!error} title={error}>
        <GridEditInputCell key={key} placeholder={!!error ? null : 'Aggiungi Titolo Requisito'} className={!!error ? 'table-input-error' : ''} {...props} />
      </StyledTooltip>
    );
  }
  //funzione da passare a oggetto colums di Datagrid
  const preProcessEditCellProps = async (params: GridPreProcessEditCellProps) => {
    const errorMessage = await validateTitle(params.props.value!.toString());
    return { ...params.props, error: errorMessage };
  };
  
  
  //funzione di validazione per field title (oggetto colums)
  function validateTitle(title: string): Promise<boolean> {
    
    return new Promise<any>((resolve) => {
        const valid = title.length > 0;
        if (!valid) setHasError(true);
        resolve(valid ? setHasError(false) : 'il titolo del requisito è obbligatorio');
       
    })
  }
  //componente che gestisce il rendering "si"/"no" della colonna "sistema"
  const Sistema = ({params}:{params:Row}) => {
    if(params.sistema) return(<>Si</>)
    return (<>No</>)
  }

  //impostazione delle colonne DataGrid MUI
  const columns: GridColDef[] = [
    {field: 'title', flex:0.4, minWidth:220, headerName: 'requisito' , preProcessEditCellProps, headerClassName:'customHeader', editable:true, renderEditCell:(params) => (<TitleEditInputCell key={params.id} {...params}/>) },
    {field: 'sistema',flex:0.3,minWidth:80, headerName: 'sistema', renderCell:(params:any) =>( <Sistema params={params.row} />), headerClassName:'customHeader' },
    {field: 'actions' , type:'actions',minWidth: 200, align:'right', headerName:'', flex:.3, width: 200,sortable:false, filterable:false, headerClassName:'customHeader',
      renderCell: (params:any) => {
        const {id} = params;
        const {sistema} = params.row;
        let error = hasError;
        const row = params.row 
        //se sono di sistema non permetto modifica
        if(sistema){
          return <></>
        }

        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [   
            <ActionButton key={id} sx={{marginRight:'5px'}} icon='save' disabled={error} color='primary' onClick={handleSaveClick(id)} />,
            <ActionButton key={`${id}-1`} icon='cancel'color='error' onClick={handleCancelClick(id)} />,
          ];
        }
        return [
          <ActionButton key={id} sx={{marginRight:'5px'}} icon='edit' color='warning' onClick={handleEditClick(id)}/>,
          <ActionButton key={`${id}-1`} icon='delete' onClick={handleDeleteClick(id)} color='error'/>,
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
