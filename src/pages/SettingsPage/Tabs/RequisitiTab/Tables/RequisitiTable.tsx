import { useEffect, useState } from 'react'
import { RequisitiTable_list, Requisito_RequisitoTab, Requisito_Table } from '../RequisitiTab'
import { Box, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';
import {v4 as uuidv4} from 'uuid'
import { DataGrid,  GridColDef, GridEditInputCell, GridEventListener, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { Requisito } from '../../TipologiaEspertoTab/Tables/Table_tipologieDiSistema';

//dataTable -------------------------------------------------------------------------------------------------------------------------

export default function RequisitiTable ({data}:{data:Requisito_Table}) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(true)
  const [editingRows, setEditingRows] = useState<GridRowId[]>([]);
  const {descrizione_breve} = data
  const [rows, setRows] = useState<RequisitiTable_list>(
    data.requisiti_list.map((row, index) => ({ ...row, id: index.toString() }))
  );

  useEffect(() => {
    console.log(rows)
  }, [rows])
  
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
      const isAnyRowInEdit = editingRows.length > 0 ? true : false
      //se si, non faccio nulla evitando la creazione di altre righe
      console.log(isAnyRowInEdit)
      if (isAnyRowInEdit) return 
      const id: GridRowId = uuidv4();
      // creo la nuova row nell'array di display
      setRows((oldRows) => [{ id:id, fi_ee_req_id:'', fs_ee_req_desc:'',fi_ee_req_customerid:1 }, ...oldRows ]);
      // aggiungo la row in editMode in rowsModel 
      setRowModesModel((oldModel) => ({
        [id] : { mode: GridRowModes.Edit, fieldToFocus: 'fs_ee_req_desc', },
        ...oldModel
      }));
      // aggiungo la row all'array di id delle rows che sono in editing
      
    };
  
    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{backgroundColor:'#ebeeffff',padding:'.5rem .5rem 0rem .5rem', justifyContent:'space-between'}}>
        <Typography component={'h3'} variant='body1' fontWeight={400} textTransform={'uppercase'}>{descrizione_breve}</Typography>
        <ActionButton direction={'row-reverse'} text='Aggiungi Requisito' icon='add' color="secondary" onClick={handleClick} />
      </GridToolbarContainer>
    );
  }
  //----------------------------------------------------------------------------------------------------------------------------------
  
  //Funzioni per pulsanti CRUD -----------------------------------------------------------------------------------------------------
  //edit mode della row
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setEditingRows((prevEditingRows) => [...prevEditingRows, id])
  };
  //cancella creazione nuova row
  const handleCancelClick = (id: GridRowId) => () => {
    console.log(id)
    setHasError(true)
    //tolgo la row da modalità editing 
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    //rimuovo la row dal' array editingRows
    setEditingRows((prev) => prev.filter((rowId)=> rowId !== id))
    
    
  };
  //create
  const handleSaveClick = (id: GridRowId) => () => {
    //chiamata ed attesa risposta server
    
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setEditingRows((prevEditingRows) => prevEditingRows.filter((rowId) => rowId !== id));

    // invio dati a DB
      //risposta 200
        //aggiungo dati a store redux
      //risposta negativa
        
  };
  
  //delete
  const handleDeleteClick = (id: GridRowId) => () => {
    //rimuovo la row dall'array che serve per il display delle rows
    setRows(rows.filter((row) => row.fi_ee_req_id !== id));
    //rimuovo la row dall'elenco delle row in editing 

    //chiamata ed attesa risposta server
  };

  //update
  const processRowUpdate = (newRow: GridRowModel) => {
    //chiamata ed attesa risposta server
    setRows((prevRows) => prevRows.map((row) => (row.fi_ee_req_id === newRow.id ? { ...row, ...newRow } : row)));
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
  function DescriptionInputCell(props: GridRenderEditCellParams, key:any) {
    const { error } = props;
    return (
      <StyledTooltip key={key} open={!!error} title={error}>
        <GridEditInputCell  placeholder={!!error ? null : 'Aggiungi Titolo Requisito'} className={!!error ? 'table-input-error' : ''} {...props} />
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
  const Sistema = ({params}:{params:Requisito_RequisitoTab}) => {
    if(params.fi_ee_req_customerid === null) return(<>Si</>)
    return (<>No</>)
  }

  //impostazione delle colonne DataGrid MUI
  const columns: GridColDef[] = [
    {field: 'fs_ee_req_desc', flex:0.4, minWidth:220, headerName: 'requisito' , preProcessEditCellProps, headerClassName:'customHeader', renderEditCell:(params) => (<DescriptionInputCell key={params.id} {...params}/>) },
    {field: 'fi_ee_req_customerid', flex:0.3,minWidth:80, headerName: 'sistema', renderCell:(params:any) =>( <Sistema params={params.row} />), headerClassName:'customHeader' },
    {field: 'actions', type:'actions',minWidth: 200, align:'right', headerName:'', flex:.3, width: 200,sortable:false, filterable:false, headerClassName:'customHeader',
      renderCell: (params:any) => {
        const requisito:Requisito_RequisitoTab = params.row
        const {fi_ee_req_id, fi_ee_req_customerid} = requisito
        let error = hasError;
        //se sono di sistema non permetto modifica
        if(fi_ee_req_customerid === null){
          return <></>
        }

        const isInEditMode = editingRows.includes(fi_ee_req_id);
        if (isInEditMode){
          return [   
            <ActionButton key={fi_ee_req_id} sx={{marginRight:'5px'}} icon='save' disabled={error} color='primary' onClick={handleSaveClick(fi_ee_req_id)} />,
            <ActionButton key={`${fi_ee_req_id}-1`} icon='cancel'color='error' onClick={handleCancelClick(fi_ee_req_id)} />,
          ];
        }
        return [
          <ActionButton key={fi_ee_req_id} sx={{marginRight:'5px'}} icon='edit' color='warning' onClick={handleEditClick(fi_ee_req_id)}/>,
          <ActionButton key={`${fi_ee_req_id}-1`} icon='delete' onClick={handleDeleteClick(fi_ee_req_id)} color='error'/>,
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
