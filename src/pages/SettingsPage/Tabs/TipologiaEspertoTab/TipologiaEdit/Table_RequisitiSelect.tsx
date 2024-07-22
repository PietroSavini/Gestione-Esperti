import { Box, Icon, IconButton, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowEditStopReasons, GridRowId, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, GridTreeNodeWithRender, useGridApiRef } from '@mui/x-data-grid';
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { useEffect, useState } from 'react';
import AXIOS_HTTP from '../../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import '../../RequisitiTab/Tables/Table_requisiti.scss';
import { InboundSelectData } from './TipologiaEdit';
import React from 'react';
import { Requisiti_List, RequisitoType_RequisitoTab, Requisito_Table } from '../../../types';

type Error = {
  id: string | number;
  errorMessage: string | null;
}

type SelectOption = {
  value: string,
  label: string,
  id: string | number
}

//dataTable -------------------------------------------------------------------------------------------------------------------------
export default function Table_RequisitiSelect({ data, setData, tespId, }: { data: Requisito_Table, setData: React.Dispatch<React.SetStateAction<Requisito_Table[] | []>>, tespId: string | number }) {

  const requisiti = data.requisiti_list;
  // variabili del requisito master
  const masterRequisitoTitle = data.fs_ee_req_desc;
  const masterRequisitoId = data.fi_ee_req_id;
  const masterPunteggio = data.fi_ee_punt_id;
  // variabili di stato per la tabella
  //const [rows, setRows] = useState<RequisitoType_RequisitoTab[]>([]);
  const [rows, setRows] = useState<RequisitoType_RequisitoTab[]>(requisiti);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowsInError, setRowsInError] = useState<Error[] | []>([]);
  //variabili per le select
  const [selectValues, setSelectValues] = useState<SelectOption[] | []>([])

  useEffect(() => {
    setIsLoading(true)
    if (data && data.requisiti_list) {
      setRows(data.requisiti_list)
      GET_SELECTABLE_ITEMS();
    }

    setIsLoading(false)
  }, [data])

  useEffect(() => {
    GET_SELECTABLE_ITEMS();
  }, [])

  //appena renderizza la table esegue la chiamata per popolare i campi della select
  async function GET_SELECTABLE_ITEMS() {
    await AXIOS_HTTP.Retrieve({ body: { masterId: masterRequisitoId }, url: '/api/launch/retrieve', sModule: 'IMPOSTAZIONI_GET_SOTTOREQUISITI', sService: 'READ_REQUISITI' })
      .then((resp) => {
        const rawArr: InboundSelectData = resp.response;
        const outputArr: any = []
        rawArr.forEach(element => {
          const newObject = {
            value: element.fs_ee_req_desc,
            label: element.fs_ee_req_desc,
            id: element.fi_ee_req_id
          }
          outputArr.push(newObject)
        });

        setSelectValues(outputArr)

      })
      .catch(err => console.log(err))
  }
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
    let addReqButtonDisabled: boolean = false
    //funzione click pulsante aggiungi requisito
    //si occupa di aggiungere una riga vuota alle rows, non del salvataggio della row in DB
    const handleClick = () => {
      //booleani che controllano la logica di aggiunta di una nuova Row
      const isAnyRowInEdit: boolean = Object.values(rowModesModel).some((rowMode) => rowMode.mode === GridRowModes.Edit);
      //se si, non faccio nulla evitando la creazione di altre righe (comportamento scelto)
      if (isAnyRowInEdit) {
        addReqButtonDisabled = true
        return;
      }
      //creo id provvisorio (per evitare errori da DataGridMUI in quanto ogni riga vuole il suo id)
      const id = 'newRow';
      //aggiungo la Row subito all'array delle rows in errore in modo da evitare il salvataggio
      setRowsInError((prev) => [...prev, { id: id, errorMessage: null }])
      //aggiunga la riga vergine in cima all' array di righe
      setRows((oldRows) => [{ fi_ee_req_id: id, fs_ee_req_desc: '', fi_ee_req_customerid: 0, fi_ee_req_punteggio: undefined }, ...oldRows]);
      // aggiungo la Row anche nell'array di oggetti rowModesModel (useState MUI), per creare la nuova row in Edit e focusare il campo descrizione
      setRowModesModel((oldModel) => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fs_ee_req_desc', },
        ...oldModel
      }));

    };

    const deleteMasterPunteggio = (masterId: string | number, punteggioId: number | undefined) => {

      setIsLoading(true)
      AXIOS_HTTP.Execute({ sService: 'WRITE_PUNTEGGI', sModule: 'IMPOSTAZIONI_DELETE_PUNTEGGIO', body: { puntId: punteggioId }, url: '/api/launch/execute' })
        .then((response) => {
          if (response.errorCode !== 0) {
            console.error(response);
            return
          };
          console.log('PUNTEGGIO Cancellato con successo')
          setRows((prevData) => [])
          setData((prevData) => [...prevData.filter((data) => data.fi_ee_req_id !== masterId)])
        })
        .catch((err) => console.log('errore durante la cancellazione del PUNTEGGIO', masterRequisitoId, ':', err))

      setIsLoading(false)
    }

    return (
      <GridToolbarContainer className='requisiti-section-title' sx={{ backgroundColor: '#ebeeffff', display: 'flex', width: '100%' }}>
        <Box display={'flex'} alignItems={'center'} width={'45%'} >
          <Typography component={'h3'} variant='body1' fontWeight={400}>{masterRequisitoTitle} -- {masterRequisitoId}</Typography>
          <Box className='req-master-actions'>
            <IconButton onClick={() => deleteMasterPunteggio(masterRequisitoId, masterPunteggio)}><Icon color='error' sx={{ fontSize: '20px' }}>delete</Icon></IconButton>
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
    setIsLoading(true)
    let updatedRequisiti_list: Requisiti_List = rows
    let outputRow: RequisitoType_RequisitoTab = {
      fi_ee_req_id: 0,
      fs_ee_req_desc: '',
      fi_ee_punt_id: 0,
      fi_ee_req_punteggio: undefined,
      //fi_ee_mst_id: masterRequisitoId,
    };
    const reqId = selectValues.find((req) => newRow.fs_ee_req_desc === req.label)!.id;
    const punteggio = newRow.fi_ee_req_punteggio;

    if (oldRow.fi_ee_req_id === 'newRow') {
      //INSERT PUNTEGGIO
      await AXIOS_HTTP.Execute({ sService: 'WRITE_PUNTEGGI', sModule: 'IMPOSTAZIONI_INSERT_PUNTEGGIO', body: { tespId: tespId, reqId: reqId, punt: punteggio }, url: '/api/launch/execute' })
        .then((resp) => {
          console.log('CREAZIONE PUNTEGGIO')
          const newPuntId = resp.response.fi_ee_punt_id;
          outputRow = {
            fi_ee_req_id: reqId,
            fs_ee_req_desc: newRow.fs_ee_req_desc,
            fi_ee_punt_id: newPuntId,
            fi_ee_req_punteggio: newRow.fi_ee_req_punteggio
          };

          updatedRequisiti_list = [...requisiti, outputRow];
        })

      //UPDATE PUNTEGGIO
    } else {
      const puntId = newRow.fi_ee_punt_id;
      if (oldRow.fs_ee_req_desc === newRow.fs_ee_req_desc && oldRow.fi_ee_req_punteggio === newRow.fi_ee_req_punteggio) {
        outputRow = oldRow;
        console.log('IL REQUISITO-PUNTEGGIO NON SONO STATI MODIFICATI: NON FACCIO CHIAMATA A WS')
      } else {
        await AXIOS_HTTP.Execute({ sService: 'WRITE_PUNTEGGI', sModule: 'IMPOSTAZIONI_UPDATE_PUNTEGGIO', body: { tespId: tespId, reqId: reqId, punt: punteggio, puntId: puntId }, url: '/api/launch/execute' })
          .then((resp) => {
            console.log('UPDATE DEL PUNTEGGIO')
            console.log(resp)
            console.log('newRow', newRow)
            outputRow = {
              fi_ee_req_id: reqId,
              fs_ee_req_desc: newRow.fs_ee_req_desc,
              fi_ee_punt_id: puntId,
              fi_ee_req_punteggio: newRow.fi_ee_req_punteggio
            };

            console.log('outputRow', outputRow)
            updatedRequisiti_list = requisiti.map((requisito) => {
              //con l operatore ternario non funziona, con l' if si..boh
              if (requisito.fi_ee_req_id === newRow.fi_ee_req_id) {
                return newRow
              } else {
                return requisito
              }
            })

          })
          .catch((err) => console.log(err))
      }
    }
    //PROCESSO DI AGGIORNAMENTO DATI DEL GENITORE
    console.log('SOTTOREQUISITO DA AGGIUNGERE: ', outputRow);

    console.log('REQUISITI_LIST AGGIORNATA: ', updatedRequisiti_list);

    const updatedTable: Requisito_Table = {
      fi_ee_req_id: data.fi_ee_req_id,
      fs_ee_req_desc: data.fs_ee_req_desc,
      fi_ee_punt_id: data.fi_ee_punt_id,
      requisiti_list: updatedRequisiti_list,
    };

    console.log('TABLE AGGIORNATA: ', updatedTable)

    setData((prev) => {
      const newTables = prev.map((table) => table.fi_ee_req_id === updatedTable.fi_ee_req_id ? updatedTable : table);
      return [...newTables];
    })

    setRows(prevRows => prevRows.map((row) => (row.fi_ee_req_id === oldRow.fi_ee_req_id ? outputRow as RequisitoType_RequisitoTab : row)));
    setIsLoading(false);
    return outputRow
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------DELETE PUNTEGGIO------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------
  const handleDeletePunteggio = (id: GridRowId, puntId: number | undefined) => () => {
    console.log('handleDeleteCLick')
    AXIOS_HTTP.Execute({ sService: 'WRITE_PUNTEGGI', sModule: 'IMPOSTAZIONI_DELETE_PUNTEGGIO', body: { puntId: puntId }, url: '/api/launch/execute' })
      .then(() => {
        console.log(id, 'PUNTEGGIO-sottorequisito cancellato')
        setRows(rows?.filter((row) => row.fi_ee_req_id !== id));
      })
      .catch((error) => {
        console.log('errore nella cancellazione del PUNTEGGIO-sottorequisito', error)
      })

  };
  //-----------------------------------------------------------------------------------------------------------------------------------
  //funzioni per gestire comportamenti delle rows
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
    // vanno eseguite e controllate le casistiche qunado cè lerrore o non sulle descrizioni delle rows in quanto se no si presentano dei bug sia visivi che exploit.
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
    let isAnyRowInEdit: boolean = false
    const arrRowModesModel = Object.values(rowModesModel);
    isAnyRowInEdit = arrRowModesModel.some((row) => row.mode === 'edit');
    if (isAnyRowInEdit) {
      console.log('ci sono altre row in edit', arrRowModesModel)
      return
    }
    setRowModesModel(newRowModesModel);
  };

  //FUNZIONI TRIGGERATE AL CHANGE DI UNO DEI X CAMPI EDITABILI DELLA ROW
  const preProcessRequisitoEditCellProp = async (params: GridPreProcessEditCellProps) => {
    console.log('preProcessRequisitoEditCellProp');
    console.log(params);
    const row: RequisitoType_RequisitoTab = params.row;
    const value = params.props.value;
    //aggiungo il valore selezionato all'array che esclude i campi selezionabili della select
    const punteggio = params.otherFieldsProps!.fi_ee_req_punteggio.value;
    const rowId = row.fi_ee_req_id as string;
    const isValid = await validateRequisito(rowId, value, punteggio);
    return { ...params.props, error: isValid };

  };

  // funzione che valida la cella della colonna "requisito" aggiunge l'id della row all'array di stringhe "rowsInError" in base alla logica di validazione
  function isRequisitoFieldValid({ description, rowId, punteggio }: { description: string, rowId: string | number, punteggio: number | undefined | null }) {
    let result = false;
    const isRowAlradyInError = rowsInError.some((rowInError) => rowInError.id === rowId);
    //VALIDAZIONI 
    if (description.trim() === '' || !punteggio) {
      console.log(rowId, 'in errore perchè descrizione o punteggio vuoti ');
      result = true;
      //se è già in errore ritorno true e basta
      if (isRowAlradyInError) return result;
      //se non è presente nell'array delle rows in errore la aggiungo.
      setRowsInError((prev) => [...prev, { id: rowId, errorMessage: ' i campi requisito e punteggio son o obbligatori' }]);
    }
    // logica che gestisce la correzzione della row;
    const rowHasBeenCorrected: boolean = isRowAlradyInError && result === false;
    if (rowHasBeenCorrected) {
      setRowsInError((prev) => prev.filter((rowInError) => rowInError.id !== rowId));
    }
    return result;
  };

  function validateRequisito(id: string | number, requisitoDescription: string, requisitoPunteggio: number | undefined): Promise<boolean> {
    const isRowInError = isRequisitoFieldValid({ description: requisitoDescription, punteggio: requisitoPunteggio, rowId: id as string });
    return new Promise<any>((resolve) => {
      resolve(isRowInError);
    });
  }

  // campi di input------------------------------------------------------------------------------------------------------------
  //componente select che prende nome requisito all interno della sezione requisitio (es. titolo di studio: requisiti[])
  function RequisitoSelectEditCell({ props, key }: { props: GridRenderEditCellParams, key: any }) {
    const { id, value, api, field } = props;
    const arrToFilterOptions = rows.map(row => row.fi_ee_req_id);
    const filteredSelectValues = selectValues.filter(item => !arrToFilterOptions.includes(item.id));

    const handleChange = (event: SelectChangeEvent) => {
      const newValue = event.target.value as string;
      api.setEditCellValue({ id, field, value: newValue });
    };

    const Custom_select = React.forwardRef(function Custom_Select(props, ref) {

      return (

        <Select
          id={key}
          fullWidth
          value={value}
          onChange={handleChange}
          defaultValue={''}
          ref={ref}
          {...props}
        >
          {selectValues && selectValues.length > 0 && selectValues.map((option, index) => {
            if (!filteredSelectValues.includes(option)) {

              if (option.value === value) {
                return (
                  <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                )
              };
              return (
                <MenuItem key={index} sx={{ maxHeight: 0, padding: 0 }} disabled></MenuItem>
              )
            };

            return (
              <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
            )
          }

          )}

          {selectValues.length === 0 && <MenuItem disabled sx={{ color: 'black', fontWeight: 600 }} >Non esistono requisiti selezionabili per la sezione: "{masterRequisitoTitle}" ...</MenuItem>}
        </Select>
      )
    });

    //select MUI
    return (
      <Custom_select />
    );
  }


  // componente che renderizza la cella delle Aczioni sulla colonna azioni
  function RenderActionsCell(params: GridRenderEditCellParams<any, any, any, GridTreeNodeWithRender>) {

    const row = params.row as RequisitoType_RequisitoTab;
    const rowId = row.fi_ee_req_id;
    let rowError = rowsInError.some((rowInError) => rowInError.id === rowId)
    const isInEditMode = rowModesModel[rowId]?.mode === GridRowModes.Edit;
    const isAnyRowInEdit: boolean = Object.values(rowModesModel).some((rowMode) => rowMode.mode === GridRowModes.Edit);

    if (isInEditMode) {
      return [
        <ActionButton key={rowId} sx={{ marginRight: '5px' }} icon='save' disabled={rowError} color='primary' onClick={() => switchRowMode(rowId)} />,
        <ActionButton key={`${rowId}-1`} icon='cancel' color='error' onClick={handleCancelClick(rowId)} />,
      ];
    };
    return [
      <ActionButton key={rowId} sx={{ marginRight: '5px' }} icon='edit' disabled={isAnyRowInEdit} color='warning' onClick={handleEditClick(rowId)} />,
      <ActionButton key={`${rowId}-1`} icon='delete' onClick={handleDeletePunteggio(rowId, row.fi_ee_punt_id)} color='error' />,
    ];
  }


  //impostazione delle colonne DataGrid MUI
  const columns: GridColDef[] = [
    //colonna descrizione requisito
    {
      field: 'fs_ee_req_desc',
      type: 'select',
      flex: 0.4,
      minWidth: 220,
      headerName: 'requisito',
      preProcessEditCellProps: preProcessRequisitoEditCellProp,
      headerClassName: 'customHeader',
      editable: true,
      renderEditCell(params) {
        return (
          <RequisitoSelectEditCell props={params} key={params.id} />
        )
      }
    },
    //colonna Punteggio
    {
      field: 'fi_ee_req_punteggio',
      headerName: 'Punteggio',
      headerClassName: 'customHeader',
      type: 'number',
      editable: true,
      minWidth: 80,
      flex: 0.3,
      renderCell: (params) => {
        const row = params.row as RequisitoType_RequisitoTab;
        const punteggio = row.fi_ee_req_punteggio;
        return (
          <>
            {punteggio}
          </>
        )
      },
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
          onProcessRowUpdateError={(error) => console.log(error)}
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