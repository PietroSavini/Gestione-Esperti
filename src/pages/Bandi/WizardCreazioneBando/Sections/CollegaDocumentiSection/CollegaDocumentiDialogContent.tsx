import { Box, Icon, Typography } from '@mui/material'
import { CollegaDocumentiResult_Datagrid } from './CollegaDocumentiResult_Datagrid'
import { CollegaDocumento_RicercaAvanzata } from './CollegaDocumento_RicercaAvanzata'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'

type Props = {
    closeDialog: () => void
    setDocumentiCollegati: React.Dispatch<React.SetStateAction<any[]>>
}
export const CollegaDocumentiContent = (props: Props) => {
    const { closeDialog } = props;
    const [rows, setRows] = useState<any[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    //variabili per la paginazione

    //colonne tabella
    const columns: GridColDef[] = [
        { field: 'storageName', headerName: 'Tipo', width: 150, sortable: false },
        { field: 'className', headerName: 'Classe documentale', width: 200, sortable: false },
        { field: 'fileName', headerName: 'Nome file', width: 500, sortable: false },
        { field: 'user', headerName: 'Caricato da', width: 150, sortable: false },
        { field: 'uploadDate', type: 'dateTime', headerName: 'Caricato il', width: 450, sortable: false, valueGetter: (params) => { return new Date(params.value) } },
        { field: 'idDocumento', headerName: 'ID', width: 160, sortable: false },
    ]

    return (
        <>
            <Box display={'flex'} flexDirection={'column'} height={'100%'} padding={'1rem 0rem 0rem 0rem'} >
                <Box >
                    <Box marginBottom={2} padding={'0 1rem'} display={'flex'} justifyContent={'space-between'}>
                        <Typography variant='h5' fontWeight={600}>
                            Collega Documento
                        </Typography>
                        <Icon sx={{
                            transition: '100ms',
                            cursor: 'pointer',
                            ":hover": {
                                color: 'red',

                            }
                        }}
                            onClick={() => closeDialog()}
                        >close</Icon>
                    </Box>
                    <CollegaDocumento_RicercaAvanzata setIsLoading={setIsLoading} setRows={setRows} />
                </Box>

                <Box height={'65%'} flexGrow={1}>
                    <CollegaDocumentiResult_Datagrid
                        rowId='idDocumento'
                        columns={columns}
                        isLoading={isLoading}
                        rows={rows}
                        setRows={setRows}
                    />
                </Box>

                <Box display={'flex'} justifyContent={'end'} padding={1}>
                    <ActionButton
                        color='error'
                        text='Annulla'
                        endIcon={<Icon>close</Icon>}
                        onClick={() => closeDialog()}
                    />
                </Box>
            </Box>

        </>
    )
}
