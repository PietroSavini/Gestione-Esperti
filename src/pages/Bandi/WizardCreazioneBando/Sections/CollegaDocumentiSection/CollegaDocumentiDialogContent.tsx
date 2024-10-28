import { Box, Checkbox, Icon, IconButton, Typography } from '@mui/material'
import { CollegaDocumentiResult_Datagrid } from './CollegaDocumentiResult_Datagrid'
import { CollegaDocumento_RicercaAvanzata } from './CollegaDocumento_RicercaAvanzata'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { useState } from 'react'
import { GridColDef, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { CheckBox } from '@mui/icons-material'
import { useCollegaAltriDocumentiContext } from './CollegaAltriDocumentiContext'
import { useWizardBandoContext } from '../../WizardBandoContext'

type Props = {
    closeDialog: () => void
}
export const CollegaDocumentiContent = (props: Props) => {
    const { closeDialog } = props;
    const [rowCount, setRowCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {selectedDocuments, setSelectedDocuments} = useCollegaAltriDocumentiContext().connectedDocuments;
    const {documentiCollegatiList, setDocumentiCollegatiList} = useWizardBandoContext().documentiCollegati
    const [rows, setRows] = useState<any[]>([]);
    //variabili per la paginazione

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
        closeDialog();
    }

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
                        customRow={
                            {
                                row: CustomRow,
                                rowHeight: 122
                            }
                        }

                    />
                </Box>

                <Box display={'flex'} justifyContent={'end'} padding={1}>

                    {selectedDocuments.length > 0 && rows.length > 0 &&
                        <ActionButton 
                            color='secondary'
                            text='collega'
                            endIcon={<Icon>account_tree</Icon>}
                            sx={{marginRight:'10px'}}
                            onClick={() => connectDocumentsToBando()}
                         />    
                    }
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

const CustomRow = (params: GridRowParams) => {

    const { setSelectedDocuments, selectedDocuments } = useCollegaAltriDocumentiContext().connectedDocuments;
    const [selected, isSelected] = useState<boolean>(selectedDocuments.some(document => document.idDocumento === params.row.idDocumento));
    //funzione che condizionalmente aggiunge o rimuove il documento alla lista dei documenti selezionati
    const addToSelectedDocuments = (row: any) => {
        //controllo se il documento è gia stato aggiunta alla lista dei documenti selezionati
        if(selectedDocuments.some(document => document.idDocumento === row.idDocumento)){ 
            setSelectedDocuments((prev) => prev.filter(document => document.idDocumento !== row.idDocumento )) // se trova corrispondenza lo elimino
        }else{
            setSelectedDocuments((prev) => [...prev, row]) //se no lo aggiungo
        }

        isSelected(!selected)
    }

    return (
        <Box role='row' data-id={params.row.id} sx={{
            overflow: 'hidden', padding: '10px 10px 10px 0px', transition: '200ms', backgroundColor: 'transparent', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', ":hover>div.headerRow": {
                backgroundColor: 'aliceblue',

            }
        }}>
            <Box display={'flex'} position={'relative'} className={'headerRow'} zIndex={1} sx={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0, .1)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} >

                <Box display={'flex'} sx={{ minHeight: '48px', display: 'flex', p: '0px 10px', width: '150px' }}>
                    <Box width={'60%'} display={'flex'} alignItems={'start'} flexDirection={'column'} justifyContent={'center'}>
                        <Checkbox checked={selected} onClick={() => addToSelectedDocuments(params.row)} />

                    </Box>
                    <Box width={'40%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Box position={'relative'} sx={{ cursor: 'pointer' }} display={'flex'} alignItems={'center'} justifyContent={'center'} onClick={() => { }}>

                        </Box>
                    </Box>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '200px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.descrizioneTEsp}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '150px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.numeroProcedimento}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '450px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.statoProcedimento}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '160px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.utenteFirmatario}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '220px' }}>
                    <Typography variant="body1" fontSize={14}>{params.row.stato}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', flexGrow: 1, justifyContent: 'flex-end', minWidth: '220px' }}>
                    <ActionButton color='secondary' text='Modifica' endIcon={<Icon sx={{ marginRight: '.5rem' }}>plagiarism</Icon>} direction={'row-reverse'} />
                </Box>
            </Box>

            <Box display={'flex'} sx={{ p: '0px 10px', backgroundColor: '#ebeeff', borderBottomRightRadius: '15px', borderBottomLeftRadius: '15px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '50px', maxHeight: '68' }}>
                <Box sx={{ width: '50%', minHeight: '50px', maxHeight: '68px', overflowY: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Box>
                        <Typography component={'span'} fontSize={14} sx={{ marginRight: '10px' }} fontWeight={600}> Descrizione:</Typography>
                    </Box>
                    <Box>
                        <Box sx={{ overflowY: 'auto', maxHeight: '40px' }}>

                            <Typography fontSize={12}> {params.row.description}</Typography>
                        </Box>
                    </Box>

                </Box>
                <Box sx={{ width: '50%', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <ActionButton color='warning' text='Visualizza' endIcon={<Icon sx={{ marginRight: '.5rem' }}>document_scanner</Icon>} direction={'row-reverse'} onClick={() => console.log(params)} />
                </Box>
            </Box>
        </Box>
    );
};