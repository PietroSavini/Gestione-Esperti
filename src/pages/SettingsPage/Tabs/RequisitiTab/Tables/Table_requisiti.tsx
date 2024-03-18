import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { DataGrid,   GridColDef,  GridEventListener, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowEditStopReasons, GridRowId,  GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, GridTreeNodeWithRender  } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { RequisitoType_RequisitoTab, Requisito_Table } from '../RequisitiTab';
import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import './Table_requisiti.scss'
//dataTable -------------------------------------------------------------------------------------------------------------------------
export default function Requisiti_table ({data}:{data:Requisito_Table}) {
  const requisiti = data.requisiti_list;
  //variabili del requisito master
  const masterRequisitoTitle = data.descrizione_breve;
  const masterRequisitoId = data.fi_ee_req_id;

  const [rows, setRows] = useState<RequisitoType_RequisitoTab[]>(requisiti);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rowsInError, setRowsInError] = useState<string[]>([])

  //custom toolBar con logica del pulsante "+ Aggiungi requisito"-------------------------------------------------------------------------------------------------------------------
  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
  
  //componente personalizzato toolbar che gestisce la logica del click "aggiungi requisito"
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    //funzione click pulsante aggiungi requisito
    //si occupa di aggiungere una riga vuota alle rows, non del salvataggio della row in DB
    const handleClick = () => {
      //booleani che controllano la logica di aggiuntaa di una nuova Row
      
      const isAnyNewRowInEditing = rows.some((row)=> row.fi_ee_req_id === 'newRow')
      //se si, non faccio nulla evitando la creazione di altre righe (comportamento scelto)
      if ( isAnyNewRowInEditing) return 
      //creo id provvisorio (per evitare errori da DataGridMUI in quanto ogni riga vuole il suo id)
      const id = 'newRow';
      //aggiunga la riga vergine in cima all' array di righe
      setRows((oldRows) => [{ fi_ee_req_id:id, fs_ee_req_desc:'',fi_ee_req_customerid:0, fi_ee_req_punteggio: undefined }, ...oldRows ]);
      // aggiungo la Row anche nell'array di oggetti rowModesModel (useState MUI), per creare la nuova row in Edit e focusare il campo descrizione
      setRowModesModel((oldModel) => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fs_ee_req_desc', },
        ...oldModel
      }));
    };
  
    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{backgroundColor:'#ebeeffff',padding:'.5rem .5rem 0rem .5rem', justifyContent:'space-between'}}>
        <Typography component={'h3'} variant='body1' fontWeight={400} textTransform={'uppercase'}>{masterRequisitoTitle}</Typography>
        <ActionButton direction={'row-reverse'} text='Aggiungi Requisito' icon='add' color="secondary" onClick={handleClick} />
      </GridToolbarContainer>
    );
  }
  
  //Funzioni per pulsanti CRUD -----------------------------------------------------------------------------------------------------
  //edit mode della row, cambia solo lo stato della row interessata da "view ad Edit"
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  //cancella Modifica row
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    
    const editedRow = rows?.find((row) => row.fi_ee_req_id === id);
    if (editedRow!.fi_ee_req_id === 'newRow') {
      setRows(rows?.filter((row) => row.fi_ee_req_id !== id));
    }
  };
  //----------------------------------------||--------LOGICA BOTTONI-------||--------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------CREATE/UPDATE--------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------
  //---ATTENZIONE---
  //Questa funzione è triggerata dalla dataGrid (grazie al parametro "processRowUpdate") quando la row passa da edit a view (e NON viceversa), di fatto gestisce l'update in UI ed il salvataggio sul WS
  const handleRowSave = (rowToSave:RequisitoType_RequisitoTab) => {
    const previousRow: RequisitoType_RequisitoTab[] = rows.filter((row)=> row.fi_ee_req_id === rowToSave.fi_ee_req_id)
    console.log('row prima della modifica: ', previousRow[0]);
    //oggetto Row che verrà introdotto al posto della row in ingresso (rowtoSave) con il parametro id modificato nel caso in cui sia una newRow
    let outputRow: RequisitoType_RequisitoTab | undefined = undefined;
    // se l'id è "newRow" vuoldire che la row da salvare va creata 
    if(rowToSave.fi_ee_req_id === 'newRow'){
      //CREATE
      console.log('row da creare: ',rowToSave);
      const newId = uuidv4(); // probabilmente verrà da backend come risposta alla Execute(rowCreate)
      //assegno a newRow l' oggeto Row con un id aggiornato ed univoco (l'id proverrà dal backend probabilmente)
      outputRow = {
        fi_ee_req_id:newId, 
        fs_ee_req_desc:rowToSave.fs_ee_req_desc, 
        fi_ee_req_customerid:rowToSave.fi_ee_req_customerid, 
        fi_ee_req_punteggio:rowToSave.fi_ee_req_punteggio
      };
      console.log('ROW CREATE => Row creata: ', outputRow)
    }else{// ELSE => ROW UPDATE
      console.log('row da modificare: ',rowToSave);
      //se la row è solo da aggiornare, controllo se è stata effettivamente modificata, se si la salvo se no ignoro l'update.
      const rowNeedUpdate:boolean = rowToSave.fs_ee_req_desc.trim() !== previousRow[0].fs_ee_req_desc.trim() || previousRow[0].fi_ee_req_punteggio !== rowToSave.fi_ee_req_punteggio;
      if(!rowNeedUpdate){
        //non eseguo il processo di salvataggio
        console.log('La row non ha bisogno di aggiornamenti... non eseguo chiamata verso update al WS')
        return outputRow = rowToSave
      }
      outputRow = rowToSave;
      console.log('ROW UPDATE => Row aggiornata: ', outputRow)
    };
    //---------Logica di aggiornamento UI------------
    //da Aggiornare solo se esito CREATE/UPDATE
    //da rivedere questa logica in qunato l'id della nuova Row andrà aggiornato con risposta di id backend
    //sostituisce la vecchia Row cercandola per id con la Row che esce da questa funzione (se la trova, se no lascia la vecchia row)
    setRows(prevRows => prevRows.map((row) => (row.fi_ee_req_id === rowToSave.fi_ee_req_id ? outputRow as RequisitoType_RequisitoTab : row)));
    return outputRow;
  };
  
  //--------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------DELETE----------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------
  const handleDeleteClick = (id: GridRowId) => () => {
    
    //chiamata ed attesa risposta server
    setRows(rows?.filter((row) => row.fi_ee_req_id !== id));
    //in realtà sarebbe da richiamare il server con la lista agiornata e rifare il display
  };
  //-----------------------------------------------------------------------------------------------------------------------------------
  //funzioni per gestire comportamento di base delle row in editMode
  //standard di MUI
  
  const switchRowMode = (id: GridRowId) => {
    //controllo in cui un utente malintenzionato sorpassa il disabled del bottone 
    if(rowsInError.some((rowId) => id === rowId)) return;
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //onChange del campo di input + validazione
  const preProcessRequisitoEditCellProps = async (params: GridPreProcessEditCellProps) => {
    
    const row:RequisitoType_RequisitoTab = params.row;
    const value = params.props.value;
    const rowId = row.fi_ee_req_id as string;
    const isValid = validateRequisitoField(value, rowId)
    if(isValid){
      return { ...params.props, error: isValid }
    }
    return { ...params.props, error: isValid }

  };

  // funzione che valida la cella della colonna "requisito" aggiunge l'id della row all'array di stringhe "rowsInError" se parametro descrizione è vuoto
  function validateRequisitoField (description: string, rowId:string){
    
    let result = false;
    const isRowAlradyInError = rowsInError.includes(rowId as string);
    //validazione campo descrizione requisito 
    if(description.trim() === ''){
      result = true;
      //se è già in errore ritorno true e basta
      if(isRowAlradyInError) return result;
      //se non è presente nell'array delle rows in errore la aggiungo.
      setRowsInError((prev)=> [...prev, rowId]);
    }
    //validazione per non inserire doppioni tra i sottorequisiti
    if(rows.some((row)=> description.trim().toLowerCase() === row.fs_ee_req_desc.toLowerCase())){
      result = true
      //se è già in errore ritorno true e basta
      if(isRowAlradyInError) return result;
      //se non è presente nell'array delle rows in errore la aggiungo.
      setRowsInError((prev)=> [...prev, rowId]);
    }
    // logica che gestisce la correzzione della row;
    const rowHasBeenCorrected:boolean = isRowAlradyInError && result === false;
    if(rowHasBeenCorrected){
      setRowsInError((prev) => prev.filter((id) => id !== rowId));
    }
    return result;
  }
  // campi di input------------------------------------------------------------------------------------------------------------
  //componente select che prende nome requisito all interno della sezione requisitio (es. titolo di studio: requisiti[])
  function requisitoSelectEditCell(props: GridRenderEditCellParams, key:any) {
    const { id, value, api, field } = props;

    const handleChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value as string;
        api.setEditCellValue({ id, field, value: newValue });
    };

    //select MUI
    return (
        <Select
          key={key}
          fullWidth
          value={value || ''}
          onChange={handleChange}
          defaultValue='1'
          
        >
            {/* Opzioni della select, da gestire con un map() su dati presi da db*/}
            <MenuItem value="Laurea Vecchio ordinamento">Laurea Vecchio ordinamento</MenuItem>
            <MenuItem value="2">Laurea Triennale</MenuItem>
            <MenuItem value="3">Laurea specialistica</MenuItem>
        </Select>
    );
  }


  //impostazione delle colonne DataGrid MUI
  const columns: GridColDef[] = [
    //colonna titolo
    { field: 'fs_ee_req_desc',
      type:'text',
      flex:0.4, 
      minWidth:220, 
      headerName: 'requisito', 
      preProcessEditCellProps: preProcessRequisitoEditCellProps, 
      headerClassName:'customHeader', 
      editable:true,
    },
    //colonna sistema
    { field:'fi_ee_req_customerid', 
      headerName: 'Sistema', 
      headerClassName:'customHeader', 
      minWidth:80, 
      flex:0.3, 
      renderCell:(params:any)=>{
        const sistema = params.value;
        return(
          <>
            {sistema !== 1 ? <>No</> : <>Si</> }
          </>
        )
      } 
    },

    //colonna azioni
    { field: 'actions', 
      type:'actions', 
      minWidth: 200, 
      align:'right', 
      headerName:'', 
      flex:.3, 
      width: 200,
      sortable:false, 
      filterable:false, 
      headerClassName:'customHeader',
      //renderCell che renderizza le azioni in base a stato row ( editmode / view mode ) 
     
      renderCell: (params:GridRenderEditCellParams<any, any, any, GridTreeNodeWithRender>) => {
        const row = params.row as RequisitoType_RequisitoTab;
        const rowId = row.fi_ee_req_id;
        let rowError = rowsInError.includes(rowId as string);
        const isInEditMode = rowModesModel[rowId]?.mode === GridRowModes.Edit;
        const sistema = row.fi_ee_req_customerid;
        if(sistema === 1){
          return <></>
        }
        if (isInEditMode) {
          return [   
            <ActionButton  key={rowId} sx={{marginRight:'5px'}} icon='save' disabled={rowError} color='primary' onClick={()=>switchRowMode(rowId)} />,
            <ActionButton key={`${rowId}-1`} icon='cancel'color='error' onClick={handleCancelClick(rowId)} />,
          ];
        }
        return [
          <ActionButton key={rowId} sx={{marginRight:'5px'}} icon='edit'  color='warning' onClick={handleEditClick(rowId)}/>,
          <ActionButton key={`${rowId}-1`} icon='delete'  onClick={handleDeleteClick(rowId)} color='error'/>,
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
          getRowId={(row) => row.fi_ee_req_id}
          loading={isLoading}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={handleRowSave}
          isCellEditable={(params) => params.row.fi_ee_req_customerid !== 1}
          rows={rows}
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