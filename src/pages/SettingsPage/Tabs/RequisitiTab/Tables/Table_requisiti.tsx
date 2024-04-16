import { Box, Icon, IconButton, InputBase, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowEditStopReasons, GridRowId, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, GridTreeNodeWithRender, useGridApiContext } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { useEffect, useState } from 'react';
import './Table_requisiti.scss';
import AXIOS_HTTP from '../../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import React from 'react';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { RequisitoType_RequisitoTab, Requisito_Table } from '../../../types';

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

  useEffect(()=>{
    console.log('ROWS IN ERRORE: ',rowsInError)
  },[rowsInError])

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

    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{ backgroundColor: '#ebeeffff', display: 'flex', width: '100%' }}>
        <Box display={'flex'} alignItems={'center'} width={'45%'} >
          <Typography component={'h3'} variant='body1' fontWeight={400} textTransform={'uppercase'}>{masterRequisitoTitle}</Typography>
          <Box className='req-master-actions'>
            <IconButton><Icon sx={{ fontSize: '20px' }} color='warning'>edit</Icon></IconButton>
            <IconButton onClick={() => handleDeleteClick({id:masterRequisitoId, isReqMst:true})}><Icon color='error' sx={{ fontSize: '20px' }}>delete</Icon></IconButton>
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
    console.log('handleCancel click')
    //reset per eliminare l'errore
    if (rowsInError.some((rowInError) => rowInError.id === id)) {
      setRowsInError((prev) => prev.filter((rowInError) => rowInError.id !== id))
    }
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const thisRow = rows!.find((row) => row.fi_ee_req_id === id);
    if (thisRow && thisRow.fi_ee_req_id === 'newRow') {
    
      setRows(rows?.filter((row) => row.fi_ee_req_id !== id));
    }
  };

  //------------------------------------------------CREATE/UPDATE--------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------

  //Questa funzione è triggerata dalla dataGrid (grazie al parametro "processRowUpdate") quando la row passa da edit a view (e NON viceversa), di fatto gestisce l'update in UI ed il salvataggio sul WS
  const handleRowSave = async (oldRow: RequisitoType_RequisitoTab, newRow: RequisitoType_RequisitoTab) => {

    let outputRow = {};
    setIsLoading(true);

    //INSERT REQUISITO
    if (newRow.fi_ee_req_id === 'newRow') {
      await AXIOS_HTTP.Execute({ sService: 'WRITE_REQUISITI', sModule: 'IMPOSTAZIONI_INSERT_REQUISITO', body: { masterId:masterRequisitoId, descrizione: newRow.fs_ee_req_desc }, url: '/api/launch/execute' })
        .then((response) => {
          //caso in cui cè un errore nella response dal WEBSERVICE
          if (response.errorCode && response.errorCode !== 0) {
            console.log('errore durante l inserimento del requisito: ', response.errorMessage)
         
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
  const handleDeleteClick = async ({id, isReqMst}:{id: GridRowId, isReqMst:boolean})  => {

    await AXIOS_HTTP.Execute({ sService: 'WRITE_REQUISITI', sModule: 'IMPOSTAZIONI_DELETE_REQUISITO', body: { reqId: id }, url: '/api/launch/execute' })
      .then((response) => {
        console.log(id, 'requisito cancellato', response)
        if(isReqMst){
          setData((prev)=> prev.filter((MasterReq) => MasterReq.fi_ee_req_id !== id))
        }
        setRows(rows?.filter((row) => row.fi_ee_req_id !== id));
      })
      .catch((error) => {
        console.log('errore nella cancellazione del requisito', error)
      })
  };
  //-----------------------------------------------------------------------------------------------------------------------------------
  //funzione triggerata al click del pulsante 'salva'
  const switchRowMode = (id: GridRowId) => {
    //controllo in cui un utente malintenzionato sorpassa il disabled del bottone 
    if (rowsInError.some((rowInError) => rowInError.id === id)) return;
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // listener di eventi 'row edit stop' della Datagrid (enterKeyDown, escapeKeyDown, rowfocusOut ...etc)
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    console.log('handleRowEditStop click')
    const id = params.id as string
    const rowInError = rowsInError.some(row => row.id === id);
    
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
      case GridRowEditStopReasons.escapeKeyDown:
        if(rowInError){
          event.defaultMuiPrevented = true
        }else{
          event.defaultMuiPrevented = false
        }
        break;
      case GridRowEditStopReasons.rowFocusOut:
        event.defaultMuiPrevented = true;
        break;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //funzione triggerata all' onChange del campo di input che includevalidazione
  const preProcessRequisitoEditCellProps = async (params: GridPreProcessEditCellProps) => {
    const row: RequisitoType_RequisitoTab = params.row;
    const value = params.props.value;
    const rowId = row.fi_ee_req_id as string;
    const isValid = await validateRequisito({ id: rowId, requisitoDescription: value });
    return { ...params.props, error: isValid };
  };

  // funzione che valida la cella della colonna "requisito" aggiunge l'id della row all'array di stringhe "rowsInError" in base alla logica di validazione
  function isRequisitoFieldValid(description: string, rowId: string) {
    const isRowAlreadyInError = rowsInError.some((rowInError) => rowInError.id === rowId);
    const isEmptyDescription = description.trim() === '';
    const isDuplicateDescription = rows.some((row) =>
      description.trim().toLowerCase() === row.fs_ee_req_desc.toLowerCase()
    );

    if (isEmptyDescription || isDuplicateDescription) {
      let errorMessage = '';
      if (isEmptyDescription) {
        errorMessage = 'Il nome del requisito è obbligatorio';
      } else if (isDuplicateDescription) {
        errorMessage = `${description} è già presente nella sezione`;
      }

      if (isRowAlreadyInError) {
        // Modifica il messaggio di errore per la riga esistente
        setRowsInError((prev) =>
          prev.map((rowInError) =>
            rowInError.id === rowId ? { ...rowInError, errorMessage } : rowInError
          )
        );
      } else {
        // Aggiungi la riga in errore all'array
        setRowsInError((prev) => [...prev, { id: rowId, errorMessage }]);
      }
      return true;
    } else {
      // Se la riga era in errore e ora è corretta, rimuovila dagli errori
      if (isRowAlreadyInError) {
        setRowsInError((prev) => prev.filter((rowInError) => rowInError.id !== rowId));
      }
      return false;
    }
  };

  function validateRequisito({ id, requisitoDescription }: { id: string | number, requisitoDescription: string }): Promise<boolean> {
    const isRowInError = isRequisitoFieldValid(requisitoDescription, id as string)
    return new Promise<any>((resolve) => {
      resolve(isRowInError);
    });
  }
  // campi di input------------------------------------------------------------------------------------------------------------
  const CustomEditCell = (props: GridRenderEditCellParams) => {
    const { id, value, hasFocus, field, error } = props;
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const apiRef = useGridApiContext();
    let errorMessage: any = '';

    useEnhancedEffect(() => {
      if (hasFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [hasFocus]);

    if (error) {
      const errorObj = rowsInError.find((row) => row.id = id);
      errorMessage = errorObj?.errorMessage as string
    }


    const CustomErrorTooltip = ({ errorMessage }: { errorMessage: string  }) => {
      return (
        <Box position={'absolute'} className='custom-tooltip-error' right={'5px'} bottom={'10px'} zIndex={2} padding={'.2rem .5rem'} sx={{ backgroundColor: 'rgba(255, 20, 20, .8)', borderRadius: '10px' }}>
          <Typography fontSize={'.9rem'}>{errorMessage}</Typography>
        </Box>
      )
    }

    return (
      <>
        <Box width={'100%'} height={'100%'} position={'relative'} zIndex={1}>
          <InputBase
            sx={{ paddingLeft: '.5rem', fontSize: '.9rem', backgroundColor: `${error ? 'rgba(255, 107, 107, .5);' : 'inherit'}`, height: '100%' }}
            inputRef={inputRef}
            value={value}
            onChange={(e) => { apiRef.current.setEditCellValue({ id, field, value: e.target.value }); }}
            fullWidth
          />
          {error && <CustomErrorTooltip errorMessage={errorMessage} />}
        </Box>
      </>
    );
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
      <ActionButton key={`${rowId}-1`} icon='delete' onClick={() => handleDeleteClick({isReqMst:false, id:rowId})} color='error' />,
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