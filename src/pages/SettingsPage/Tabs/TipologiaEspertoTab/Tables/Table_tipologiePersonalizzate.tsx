import { Box, CircularProgress, Grid, Switch } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Dispatch, SetStateAction, useState } from 'react'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination'
import AXIOS_HTTP from '../../../../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { DeleteButtonWithDialog } from '../../../../../components/partials/Buttons/DeleteButtonWithDialog'
import { useNavigate } from 'react-router-dom'
import { TipologiaEspertoRow } from '../../../types'


type Props = {
    fn?: Function
    rows: TipologiaEspertoRow[] | []
    setRows: Dispatch<SetStateAction<TipologiaEspertoRow[] | []>>
}

export const Table_tipologiePersonalizzate = ({ rows, setRows }: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate();

    const handleAddClick = async (row: TipologiaEspertoRow) => {
        let rowObj = {
            TEspId: row.TEspId,
            TEspDesc: `${row.TEspDesc}-(COPIA)`,
            TEspBr: `${row.TEspBr}-(COPIA)`,
            TEspVis: false,
            EspSys: false,
        }

        //faccio chiamata a webService x l'id
        await AXIOS_HTTP.Execute({ sService: 'WRITE_TIPOLOGIE_ESPERTO', sModule: 'IMPOSTAZIONI_DUPLICA_TIPOLOGIA_ESPERTO', body: rowObj, url: '/api/launch/execute' })
            .then((response) => {
                const id = response.response.TEspId;
                const newTipologia: TipologiaEspertoRow = {
                    TEspId: id,
                    TEspBr: rowObj.TEspBr,
                    TEspDesc: rowObj.TEspDesc,
                    TEspVis: rowObj.TEspVis,
                    TEspSys: rowObj.EspSys
                };

                console.log('aggiungo a tablella personalizzate');
                setRows((prev) => [...prev, newTipologia]);
            })
            .catch((err) => { console.log(err) });
    }

    const handleDeleteTipologia = (id: string | number) => {
        AXIOS_HTTP.Execute({ sModule: 'IMPOSTAZIONI_DELETE_TIPOLOGIA_ESPERTO', sService: 'WRITE_TIPOLOGIE_ESPERTO', body: { TEspId: id }, url: '/api/launch/execute' })
            .then((result) => {
                console.log('tipologia cancellata con successo', result)
                setRows((prev) => prev.filter((row) => row.TEspId !== id));
            }
            ).catch((err) => console.log(err));
    };

    const VisibleSwitch = (TErow: TipologiaEspertoRow) => {
        const value = TErow.TEspVis;
        const id = `${TErow.TEspId}` 
        const [switchValue, setValue] = useState<boolean>(value);
        const [loading, isLoading] = useState<boolean>(false)
        const handleSwitchChange = async (value: boolean) => {
            const newValue: boolean = !value;
            isLoading(true);
            await AXIOS_HTTP.Execute({
                sService: 'WRITE_TIPOLOGIE_ESPERTO', url: '/api/launch/execute', sModule: 'IMPOSTAZIONI_UPDATE_TIPOLOGIA_ESPERTO',
                body: {
                    TEspId: TErow.TEspId,
                    TEspDesc: TErow.TEspDesc,
                    TEspBr: TErow.TEspBr,
                    TEspVis: newValue,
                },
            }).then((res) => {
                const addNewValue: boolean = res.response.TEspVis
                setValue(addNewValue);
                isLoading(false)
            }).catch((err) => {
                console.log(err)
                isLoading(false)
            })

        };

        return (
            <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Switch id={id} onChange={() => handleSwitchChange(switchValue)} checked={switchValue} />
                <CircularProgress size={loading ? 15 : 0} />
            </Box>
        )
    };

    /* componente che renderizza i pulsanti azione all'interno della tabella */
    const DataGridActions = ({ params }: any) => {
        //estraggo i valori della ROW
        const { row } = params;
        return (
            <div className='dataGrid-actions'>
                <ActionButton color='primary' onClick={() => handleAddClick(row)} text='Duplica' icon='content_copy' direction='row-reverse' />
                <ActionButton color='warning' onClick={() => navigate('/impostazioni/modifica-tipologia', { state: { ...row } })} text='Modifica' icon='edit' direction='row-reverse' />
                <DeleteButtonWithDialog row={row as TipologiaEspertoRow} successFn={handleDeleteTipologia} />
            </div>
        )
    }

    //dichiaro un array di oggetti "columns" per semplificare la creazione degli Headers delle colonne
    const columns: GridColDef[] = [
        { field: 'TEspBr', headerName: 'Descrizione', minWidth: 150, flex: 0.3, sortable: false, filterable: false, },
        { field: 'TEspDesc', headerName: 'Descrizione Lunga', flex: 1, minWidth: 350, sortable: false, filterable: false },
        { field: 'TEspVis',headerName: 'Visibile', minWidth: 70, align: 'center', headerAlign: 'center', flex: .3, sortable: false, filterable: false,
            renderCell(params) {
                return (
                    <VisibleSwitch {...params.row} />
                )
            }
        },
        { field: 'actions', type: 'actions', headerAlign: 'center', align: 'center', headerName: 'azioni', width: 320, sortable: false, filterable: false, renderCell: (params: any) => (<DataGridActions params={params} />) }
    ];

    return (
        <Box className="dataTable" >
            <Grid container mb={10} ml={15} spacing={2}>
                <Grid item width={'100%'} padding={'0 !important'}>
                    <DataGrid
                        getRowId={(row) => row.TEspId}
                        slots={{
                            pagination: CustomPagination,
                        }}
                        hideFooterSelectedRowCount
                        loading={isLoading}
                        autoHeight
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 }
                            },
                        }}
                        pageSizeOptions={[5, 10, 20, 50]}
                        sx={{
                            padding: '0',
                            fontSize: 14,
                        }}
                        localeText={{
                            noRowsLabel: 'Nessun elemento trovato',
                            MuiTablePagination: {
                                labelRowsPerPage: 'Righe per pagina:',
                            },
                        }}

                    />
                </Grid>
            </Grid>
        </Box>
    )
}