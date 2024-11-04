import { Box, Checkbox, Typography, Icon } from "@mui/material";
import { GridRowParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";
import { ActionButton } from "../../../../../components/partials/Buttons/ActionButton";
import { useCollegaAltriDocumentiContext } from "./CollegaAltriDocumentiContext";
import pdfIcon from '../../../../../components/partials/svg/pdfIcon.svg'
import { useWizardBandoContext } from "../../WizardBandoContext";

export const CollegaDocumentiDatagridCustomRow = (params: GridRowParams) => {
    const document = params.row;
    const collegaDocumentiContext = useCollegaAltriDocumentiContext();
    const { setSelectedDocuments, selectedDocuments } = collegaDocumentiContext.connectedDocuments;
    const {isOpen, setIsOpen} = collegaDocumentiContext.dialog;
    const {documentiCollegatiList, setDocumentiCollegatiList} = useWizardBandoContext().documentiCollegati
    const [selected, isSelected] = useState<boolean>(selectedDocuments.some(document => document.idDocumento === params.row.idDocumento));

    //funzione che condizionalmente aggiunge o rimuove il documento alla lista dei documenti selezionati
    const addToSelectedDocuments = (row: any) => {
        //controllo se il documento è gia stato aggiunta alla lista dei documenti selezionati
        if (selectedDocuments.some(document => document.idDocumento === row.idDocumento)) {
            setSelectedDocuments((prev) => prev.filter(document => document.idDocumento !== row.idDocumento)) // se trova corrispondenza lo elimino
        } else {
            setSelectedDocuments((prev) => [...prev, row]) //se no lo aggiungo
        }

        isSelected(!selected)
    }

    const connectDocument = (document: any) => {
        setDocumentiCollegatiList((prev) => [...prev, document]);
        setIsOpen(!isOpen);
    };

    return (
        <Box role='row' data-id={params.row.id} sx={{
            overflow: 'hidden',marginBottom:'10px', transition: '200ms', backgroundColor: 'transparent', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', 
            ":hover>div.headerRow": {
                backgroundColor: '#efefef',

            }
        }}>
            <Box display={'flex'} position={'relative'} className={'headerRow'} zIndex={1} sx={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0, .1)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} >

                <Box display={'flex'} alignItems={'center'} sx={{ minHeight: '48px', display: 'flex', padding: '0px 10px', width: '150px' }}>
                    <Box width={'60%'} display={'flex'} alignItems={'start'} flexDirection={'column'} justifyContent={'center'}>
                        <Checkbox checked={selected} onClick={() => addToSelectedDocuments(document)} />
                        
                    </Box>
                    <img style={{width:'35px'}} src={pdfIcon}></img>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '200px' }}>
                    <Typography variant="body1" fontSize={12}>{document.className}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '500px', wordWrap: 'break-word' }}>
                    <Typography maxWidth={'100%'} variant="body1" fontSize={12} fontWeight={600}>{document.fileName}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '150px' }}>
                    <Typography variant="body1" fontSize={12}>{document.user}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '450px' }}>
                    <Typography variant="body1" fontSize={12}>{dayjs(document.uploadDate).format('DD/MM/YYYY HH:mm')}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', width: '160px' }}>
                    <Typography variant="body1" fontSize={18} fontWeight={600}>{document.idDocumento}</Typography>
                </Box>
                <Box sx={{ minHeight: '48px', alignItems: 'center', display: 'flex', p: '0px 10px', flexGrow: 1, justifyContent: 'flex-end', minWidth: '220px' }}>
                    <ActionButton
                        color='secondary'
                        text='collega'
                        endIcon={<Icon>account_tree</Icon>}
                        sx={{ marginRight: '10px' }}
                        onClick={() => connectDocument(document)}
                    />
                </Box>
            </Box>

            <Box display={'flex'} sx={{ p: '0px 10px', backgroundColor: '#ebeeff', borderBottomRightRadius: '15px', borderBottomLeftRadius: '15px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '50px', maxHeight: '68' }}>
                <Box sx={{ width: '50%', minHeight: '50px', maxHeight: '68px', overflowY: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Box>
                        <Typography component={'span'} fontSize={14} sx={{ marginRight: '10px' }} fontWeight={600}> Descrizione:</Typography>
                    </Box>
                    <Box>
                        <Box sx={{ overflowY: 'auto', maxHeight: '40px' }}>

                            <Typography fontSize={12}> {document.description}</Typography>
                        </Box>
                    </Box>

                </Box>
                <Box sx={{ width: '50%', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>

                </Box>
            </Box>
        </Box>
    );
};

