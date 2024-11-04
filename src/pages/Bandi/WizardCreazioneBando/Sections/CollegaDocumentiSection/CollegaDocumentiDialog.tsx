import { Box, Dialog, Icon, IconButton, Typography } from '@mui/material'
import { CollegaDocumentiResult_Datagrid } from './CollegaDocumentiResult_Datagrid'
import { CollegaDocumento_RicercaAvanzata } from './CollegaDocumento_RicercaAvanzata'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useCollegaAltriDocumentiContext } from './CollegaAltriDocumentiContext'
import { useWizardBandoContext } from '../../WizardBandoContext'
import { CollegaDocumentiDatagridCustomRow } from './CollegaDocumentiDatagridCustomRow'

export const CollegaDocumentiDialog = () => {

    const collegaAltriDocumentiContext = useCollegaAltriDocumentiContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { selectedDocuments } = collegaAltriDocumentiContext.connectedDocuments;
    const { isOpen, setIsOpen } = collegaAltriDocumentiContext.dialog;
    const { setDocumentiCollegatiList } = useWizardBandoContext().documentiCollegati
    const {rows, setRows} = collegaAltriDocumentiContext.dataGrid
    //variabili per la paginazione
    const [rowCount, setRowCount] = useState<number>(0);

    //colonne tabella
    const columns: GridColDef[] = [
        { field: 'storageName', headerName: 'Tipo', width: 150, sortable: true },
        { field: 'className', headerName: 'Classe documentale', width: 200, sortable: true },
        { field: 'fileName', headerName: 'Nome file', width: 500, sortable: true },
        { field: 'user', headerName: 'Caricato da', width: 150, sortable: true },
        { field: 'uploadDate', type: 'dateTime', headerName: 'Caricato il', width: 450, sortable: true, valueGetter: (params) => { return new Date(params.value) } },
        { field: 'idDocumento', headerName: 'ID', width: 160, sortable: true },
    ]

    const connectDocumentsToBando = () => {
        setDocumentiCollegatiList((prev) => [...prev, ...selectedDocuments]);
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(!isOpen)}
                fullScreen
                sx={{
                    margin: '2rem 2rem',
                    "& .MuiPaper-root": {
                        borderRadius: '10px',
                    },
                    
                }}
                
            >


                <Box display={'flex'} height={'100%'} flexDirection={'column'}  >

                    <Box >
                        <Box  marginBottom={2} padding={'1rem 1rem'} display={'flex'} justifyContent={'space-between'}>
                            <Typography variant='h5' fontWeight={600}>
                                Collega Documento
                            </Typography>

                            <IconButton 
                                title='chiudi'
                                sx={{  ":hover": {
                                            color: 'red',
                                        }
                                    }} 
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <Icon sx={{
                                    transition: '100ms',
                                }}
                                >
                                    close
                                </Icon>

                            </IconButton>
                        </Box>
                        <CollegaDocumento_RicercaAvanzata setIsLoading={setIsLoading} setRows={setRows} />
                    </Box>

                    <Box flexGrow={1} height={'100%'} sx={{border:'3px solid green'}}>
                        <CollegaDocumentiResult_Datagrid
                            rowId='idDocumento'
                            columns={columns}
                            isLoading={isLoading}
                            rows={rows}
                            setRows={setRows}
                            customRow={
                                {
                                    row: CollegaDocumentiDatagridCustomRow,
                                    rowHeight: 102
                                }
                            }
                            sx={{height:'100%'}}
                        />
                    </Box>

                    <Box sx={{border:'1px solid red'}} display={'flex'} justifyContent={'end'} padding={1}>

                        {selectedDocuments.length > 0 && rows.length > 0 &&
                            <ActionButton
                                title='Collega elementi selezionati'
                                color='secondary'
                                text='collega selezionati'
                                endIcon={<Icon>account_tree</Icon>}
                                sx={{ marginRight: '10px' }}
                                onClick={() => connectDocumentsToBando()}
                            />
                        }
                        <ActionButton
                            color='error'
                            text='Annulla'
                            title='annulla e chiudi'
                            endIcon={<Icon>close</Icon>}
                            onClick={() => setIsOpen(!isOpen)}
                        />
                    </Box>
                </Box>

            </Dialog>

        </>
    )
}

