import { Paper, Box, Typography, Dialog, Icon } from '@mui/material'
import React, { useState } from 'react'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { CollegaDocumentiContent } from './CollegaDocumentiDialogContent'
import CollegaAltriDocumentiContextProvider from './CollegaAltriDocumentiContext'
import { useWizardBandoContext } from '../../WizardBandoContext'


type Props = {
    className: string
}

export const CollegaAltriDocumentiSection = (props: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {documentiCollegatiList, setDocumentiCollegatiList} = useWizardBandoContext().documentiCollegati;

    function onClose() {
        setIsOpen(false)
    }
    

    const deleteDocumentoCollegato = (item:any) => {
        setDocumentiCollegatiList((prev) => prev.filter((documento) => documento.idDocumento !==  item.idDocumento))
    }
    return (
        <>
            <Paper className={props.className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Collega altri documenti</Typography>
                    <ActionButton color='secondary' text='Collega' endIcon={<Icon>account_tree</Icon>} onClick={() => setIsOpen(true)} />
                </Box>
                { documentiCollegatiList &&
                    <Box>
                        {documentiCollegatiList.map((item) => {
                            return(
                                <>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Box>
                                            {item.idDocumento}
                                        </Box>
                                        <Icon color='error' onClick={() => deleteDocumentoCollegato(item)}>cancel</Icon>
                                    </Box>
                                </>
                            )
                        }
                        )}
                    </Box>
                }
            </Paper>

            <Dialog
                open={isOpen}
                onClose={() => onClose()}
                fullScreen
                sx={{
                    padding: '2rem 2rem',
                    "& .MuiPaper-root": {
                        borderRadius: '10px'
                    }
                }} >
                    
                <CollegaAltriDocumentiContextProvider>
                    <CollegaDocumentiContent closeDialog={onClose} />
                </CollegaAltriDocumentiContextProvider>
                
            </Dialog>
        </>
    )
}
