import { Box, Icon, IconButton, InputBase, MenuItem, Select, SelectChangeEvent, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';
import { DataGrid, GridColDef, GridEditInputCell, GridEventListener, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowEditStopReasons, GridRowId, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, GridTreeNodeWithRender, useGridApiContext } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { RequisitoType_RequisitoTab, Requisito_Table } from '../RequisitiTab';
import { useEffect, useState } from 'react';

import './Table_requisiti.scss';
import AXIOS_HTTP from '../../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import React from 'react';

type Error = {
  id: string | number;
  errorMessage: string | null;
}
//dataTable -------------------------------------------------------------------------------------------------------------------------
export default function Requisiti_table({ data, setData }: { data: Requisito_Table, setData: React.Dispatch<React.SetStateAction<Requisito_Table[] | []>> }) {
  const requisiti = data.requisiti_list;

  // variabili del requisito master
  const masterRequisitoTitle = data.fs_ee_req_desc;
  const masterRequisitoId = data.fi_ee_req_id;
  // variabili di stato per la tabella
  const [rows, setRows] = useState<RequisitoType_RequisitoTab[]>(requisiti);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowsInError, setRowsInError] = useState<Error[] | []>([]);
  const [newRowValue, setNewRowValue] = useState<string>('')


  //custom toolBar con logica del pulsante "+ Aggiungi requisito"-------------------------------------------------------------------------------------------------------------------
  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  };

  //componente personalizzato toolbar che gestisce la logica del click "aggiungi requisito"
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    //funzione click pulsante aggiungi requisito
    //si occupa di aggiungere una riga vuota alle rows, non del salvataggio della row in DB
    const handleClick = () => {
      //booleani che controllano la logica di aggiuntaa di una nuova Row

      const isAnyNewRowInEditing = Object.values(rowModesModel).length > 0
      //se si, non faccio nulla evitando la creazione di altre righe (comportamento scelto)
      if (isAnyNewRowInEditing) return;
      //creo id provvisorio (per evitare errori da DataGridMUI in quanto ogni riga vuole il suo id)
      const id = 'newRow';
      //aggiunga la riga vergine in cima all' array di righe
      setRowsInError((prev) => [...prev, { id: id, errorMessage: null }])
      setRows((oldRows) => [{ fi_ee_req_id: id, fs_ee_req_desc: '', fi_ee_req_customerid: 0, fi_ee_req_punteggio: undefined }, ...oldRows]);
      // aggiungo la Row anche nell'array di oggetti rowModesModel (useState MUI), per creare la nuova row in Edit e focusare il campo descrizione
      setRowModesModel((oldModel) => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fs_ee_req_desc', },
        ...oldModel
      }));

    };

    const deleteMasterReq = (masterId: string | number) => {
      AXIOS_HTTP.Execute({ sService: 'WRITE_REQUISITI', sModule: 'IMPOSTAZIONI_DELETE_REQUISITO', body: { id: masterId }, url: '/api/launch/execute' })
        .then((response) => {
          if (response.errorCode !== 0) {
            console.log('errore durante la cancellazione del requisito master', masterRequisitoId, ':', response);
            return
          };
          console.log('requisito Master Cancellato con successo')
          setData((prevData) => prevData.filter((data) => data.fi_ee_req_id !== masterId))
        })
        .catch((err) => console.log('errore durante la cancellazione del requisito master', masterRequisitoId, ':', err))
    }

    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{ backgroundColor: '#ebeeffff', display: 'flex', width: '100%' }}>
        <Box display={'flex'} alignItems={'center'} width={'45%'} >
          <Typography component={'h3'} variant='body1' fontWeight={400} textTransform={'uppercase'}>{masterRequisitoTitle}</Typography>
          <Box className='req-master-actions'>
            <IconButton><Icon sx={{ fontSize: '20px' }} color='warning'>edit</Icon></IconButton>
            <IconButton onClick={() => deleteMasterReq(masterRequisitoId)}><Icon color='error' sx={{ fontSize: '20px' }}>delete</Icon></IconButton>
          </Box>
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'} flexGrow={1} >
          <ActionButton direction={'row-reverse'} text='Aggiungi Requisito' icon='add' color="secondary" onClick={handleClick} />
        </Box>
      </GridToolbarContainer>
    );
  };

  //Funzioni per pulsanti CRUD -----------------------------------------------------------------------------------------------------
  //edit mode della row, cambia solo lo stato della row interessata da "view ad Edit"
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fs_ee_req_desc' } });
  };

  //cancella Modifica row
  const handleCancelClick = (id: GridRowId) => () => {

    if (rowsInError.some((rowInError) => rowInError.id === id)) {
      setRowsInError((prev) => prev.filter((rowInError) => rowInError.id !== id))
    }
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows?.find((row) => row.fi_ee_req_id === id);
    if (editedRow!.fi_ee_req_id === 'newRow') {
      setRows(rows?.filter((row) => row.fi_ee_req_id !== id));
    };
  };
  //----------------------------------------||--------LOGICA BOTTONI-------||--------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------CREATE/UPDATE--------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------
  //---ATTENZIONE---
  //Questa funzione è triggerata dalla dataGrid (grazie al parametro "processRowUpdate") quando la row passa da edit a view (e NON viceversa), di fatto gestisce l'update in UI ed il salvataggio sul WS
  const handleRowSave = async (oldRow: RequisitoType_RequisitoTab, newRow: RequisitoType_RequisitoTab) => {

    console.log('handleRowSave')
    setIsLoading(true);
    let outputRow = {};
    //INSERT REQUISITO
    if (newRow.fi_ee_req_id === 'newRow') {
      await AXIOS_HTTP.Execute({ sService: 'WRITE_REQUISITI', sModule: 'IMPOSTAZIONI_INSERT_REQUISITO', body: { masterId: masterRequisitoId, descrizione: newRow.fs_ee_req_desc }, url: '/api/launch/execute' })
        .then((response) => {
          //caso in cui cè un errore nella response dal WEBSERVICE
          if (response.errorCode && response.errorCode !== 0) {
            console.log('errore durante l inserimento del requisito: ', response.errorMessage)
            setIsLoading(false);
            outputRow = oldRow;
          }

          const newId = response.response.fi_ee_req_id;

          outputRow = {
            fi_ee_req_id: newId,
            fs_ee_req_desc: newRow.fs_ee_req_desc,
            fi_ee_req_customerid: newRow.fi_ee_req_customerid,
            fi_ee_req_punteggio: newRow.fi_ee_req_punteggio
          };

        })
        .catch((error) => {
          outputRow = oldRow
          console.log(error)
        })

    } else {//UPDATE REQUISITO
      //se la row è da aggiornare, controllo se è stata effettivamente modificata, se si la salvo se no ignoro l'update.
      const rowNeedUpdate: boolean = newRow.fs_ee_req_desc.trim() !== oldRow.fs_ee_req_desc.trim();
      if (!rowNeedUpdate) {
        //ignoro il processo di salvataggio
        console.log('La row non ha bisogno di aggiornamenti... non eseguo chiamata verso update al WS');
        outputRow = oldRow;
      } else {
        await AXIOS_HTTP.Execute({ sService: 'WRITE_REQUISITI', sModule: 'IMPOSTAZIONI_UPDATE_REQUISITO', body: { reqId: newRow.fi_ee_req_id, descrizione: newRow.fs_ee_req_desc }, url: '/api/launch/execute' })
          .then((response) => {
            outputRow = {
              fi_ee_req_id: newRow.fi_ee_req_id,
              fs_ee_req_desc: response.response.fs_ee_req_desc,
              fi_ee_req_customerid: newRow.fi_ee_req_customerid,
              fi_ee_req_punteggio: newRow.fi_ee_req_punteggio
            };
          })
          .catch((error) => {
            console.log('errore nell update del requisito', error);
            outputRow = oldRow;
          })
      };

    };
    setRows(prevRows => prevRows.map((row) => (row.fi_ee_req_id === oldRow.fi_ee_req_id ? outputRow as RequisitoType_RequisitoTab : row)));
    setIsLoading(false)
    return outputRow
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------DELETE----------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------
  const handleDeleteClick = (id: GridRowId) => () => {
    console.log('handleDeleteCLick')
    AXIOS_HTTP.Execute({ sService: 'WRITE_REQUISITI', sModule: 'IMPOSTAZIONI_DELETE_REQUISITO', body: { id: id }, url: '/api/launch/execute' })
      .then((response) => {
        console.log(id, 'requisito cancellato')
        setRows(rows?.filter((row) => row.fi_ee_req_id !== id));
      })
      .catch((error) => {
        console.log('errore nella cancellazione del requisito', error)
      })
  };
  //-----------------------------------------------------------------------------------------------------------------------------------
  //funzione triggerata al click del pulsante 'salva'
  const switchRowMode = (id: GridRowId) => {
    console.log('switchRowMode')
    //controllo in cui un utente malintenzionato sorpassa il disabled del bottone 
    if (rowsInError.some((rowInError) => rowInError.id === id)) return;
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // listener di eventi 'row edit stop' della Datagrid (enterKeyDown, escapeKeyDown, rowfocusOut ...etc)
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    console.log('roweditStop')
    const id = params.id as string
    const rowInError = rowsInError.some(row => row.id === id)
    // Gestione delle varie casistiche di accessibilità della tabella (enter, esc, focusOut, ...etc)
    // vanno eseguite e controllate le casistiche qunado cè l errore o non sulle descrizioni delle rows in quanto se no si presentano dei bug sia visivi che exploit.
    switch (params.reason) {
      case GridRowEditStopReasons.enterKeyDown:
        if (rowInError) {
          event.defaultMuiPrevented = true;
        } else {
          event.defaultMuiPrevented = false
        }
        break;
      case GridRowEditStopReasons.rowFocusOut:
        event.defaultMuiPrevented = true;
        break;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    const arrRowModesModel = Object.values(rowModesModel);
    const isAnyRowInEdit = arrRowModesModel.some((row) => row.mode === 'edit');
    if (isAnyRowInEdit) {
      console.log('ci sono altre row in edit, non permetto la modalità editMode sulla riga')
      return
    }
    setRowModesModel(newRowModesModel);
  };

  //funzione triggerata all' onChange del campo di input che includevalidazione
  const preProcessRequisitoEditCellProps = async (params: GridPreProcessEditCellProps) => {
    console.log('preProcessRequisitoEditCellProp')
    console.log(params)
    const row: RequisitoType_RequisitoTab = params.row;
    const value = params.props.value;
    const rowId = row.fi_ee_req_id as string;
    const isValid = await validateRequisito({ id: rowId, requisitoDescription: value });
    return { ...params.props, error: isValid };

  };

  // funzione che valida la cella della colonna "requisito" aggiunge l'id della row all'array di stringhe "rowsInError" in base alla logica di validazione
  function isRequisitoFieldValid(description: string, rowId: string) {
    let result = false;
    const isRowAlradyInError = rowsInError.some((rowInError) => rowInError.id === rowId);
    //validazione campo descrizione requisito 
    if (description.trim() === '') {
      console.log(rowId, 'in errore perchè descrizione vuota')
      result = true;
      //se è già in errore ritorno true e basta
      if (isRowAlradyInError) return result;
      //se non è presente nell'array delle rows in errore la aggiungo.
      setRowsInError((prev) => [...prev, { id: rowId, errorMessage: ' il nome del requisito è obbligatorio' }]);
    } else if (rows.some((row) => description.trim().toLowerCase() === row.fs_ee_req_desc.toLowerCase())) {//validazione per non inserire doppioni tra i sottorequisiti
      console.log(rowId, 'in errore perchè esiste un doppione in tabella')
      result = true
      if (isRowAlradyInError) {//se è già in errore ritorno true e basta
        return result;
      } else {//se non è presente nell'array delle rows in errore la aggiungo.
        setRowsInError((prev) => [...prev, { id: rowId, errorMessage: `${description} è già presente nella sezione` }]);;
      }
    }
    // logica che gestisce la correzzione della row;
    const rowHasBeenCorrected: boolean = isRowAlradyInError && result === false;
    if (rowHasBeenCorrected) {
      setRowsInError((prev) => prev.filter((rowInError) => rowInError.id !== rowId));
    }
    return result;
  };

  function validateRequisito({ id, requisitoDescription }: { id: string | number, requisitoDescription: string }): Promise<boolean> {
    const isRowInError = isRequisitoFieldValid(requisitoDescription, id as string)
    return new Promise<any>((resolve) => {
      resolve(isRowInError);
    });
  }
  // campi di input------------------------------------------------------------------------------------------------------------
  const CustomEditCell = (props:GridRenderEditCellParams) => {
    const { error, id, api, field, value} = props;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    React.useEffect(() => {
      // Trova il messaggio di errore corrispondente all'id della riga
      const rowInError = rowsInError.find((row) => row.id === id);
      if (error && rowInError) {
        setErrorMessage(rowInError.errorMessage);
      } else {
        setErrorMessage(null);
      }
    }, [error, id]);
   
    const handleChange = (value:string) => {
      console.log(value)
     
      api.setEditCellValue({ id, field, value: value });
    }
    // Componente interno per la cella di input editabile con tooltip
    const CustomEditCellWithTooltip = React.forwardRef<any, GridRenderEditCellParams>(
      (props, ref) => (
        <Box position={'relative'} width={'100%'}>
          <GridEditInputCell ref={ref} {...props} />
          <Typography display={errorMessage ? 'block' : 'none'} position={'absolute'} left={'30%'}  bottom={0} color={'error'}>{errorMessage}</Typography>
        </Box>
      )
    );


    return (
      <CustomEditCellWithTooltip {...props} />
    )

  }


  // componente che renderizza la cella delle Aczioni sulla colonna azioni
  function RenderActionsCell(params: GridRenderEditCellParams<any, any, any, GridTreeNodeWithRender>) {

    const row = params.row as RequisitoType_RequisitoTab;
    const rowId = row.fi_ee_req_id;
    const isInEditMode = rowModesModel[rowId]?.mode === GridRowModes.Edit;
    const sistema = row.fi_ee_req_customerid;
    let rowError = rowsInError.some((rowInError) => rowInError.id === rowId)
    const isAnyNewRowInEditing = Object.values(rowModesModel).length > 0

    if (sistema === 1) {
      return <></>
    };
    if (isInEditMode) {
      return [
        <ActionButton key={rowId} sx={{ marginRight: '5px' }} icon='save' disabled={rowError} color='primary' onClick={() => switchRowMode(rowId)} />,
        <ActionButton key={`${rowId}-1`} icon='cancel' color='error' onClick={handleCancelClick(rowId)} />,
      ];
    };
    return [
      <ActionButton key={rowId} sx={{ marginRight: '5px' }} icon='edit' disabled={isAnyNewRowInEditing} color='warning' onClick={handleEditClick(rowId)} />,
      <ActionButton key={`${rowId}-1`} icon='delete' onClick={handleDeleteClick(rowId)} color='error' />,
    ];
  }


  //impostazione delle colonne DataGrid MUI
  const columns: GridColDef[] = [
    //colonna descrizione requisito
    {
      field: 'fs_ee_req_desc',
      type: 'text',
      flex: 0.4,
      minWidth: 220,
      headerName: 'requisito',
      preProcessEditCellProps: preProcessRequisitoEditCellProps,
      headerClassName: 'customHeader',
      editable: true,
      renderEditCell: (params) => <CustomEditCell {...params} />
      
    },
    //colonna sistema
    {
      field: 'fi_ee_req_customerid',
      headerName: 'Sistema',
      headerClassName: 'customHeader',
      minWidth: 80,
      flex: 0.3,
      renderCell: (params: any) => {
        const sistema = params.value;
        return (
          <>
            {sistema !== 1 ? <>No</> : <>Si</>}
          </>
        )
      }
    },

    //colonna azioni
    {
      field: 'actions',
      type: 'actions',
      minWidth: 200,
      align: 'right',
      headerName: '',
      flex: .3,
      width: 200,
      sortable: false,
      filterable: false,
      headerClassName: 'customHeader',
      //renderCell che renderizza le azioni in base a stato row ( editmode / view mode ) 
      renderCell: (params: GridRenderEditCellParams<any, any, any, GridTreeNodeWithRender>) => {
        return (
          <RenderActionsCell {...params} />
        )
      }
    }];

  return (
    <>
      <Box className='requisiti-table' sx={{ backgroundColor: '#fff' }} >
        <DataGrid
          slots={{
            pagination: CustomPagination,
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          getRowId={(row) => {
            return row.fi_ee_req_id
          }}
          loading={isLoading}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={(newRow, oldRow) => handleRowSave(oldRow, newRow)}
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