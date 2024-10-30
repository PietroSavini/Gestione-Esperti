import { Paper, Box, Typography, Dialog, Icon } from '@mui/material'
import React, { useState } from 'react'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { CollegaDocumentiDialog } from './CollegaDocumentiDialog'
import CollegaAltriDocumentiContextProvider, { useCollegaAltriDocumentiContext } from './CollegaAltriDocumentiContext'
import { useWizardBandoContext } from '../../WizardBandoContext'
import { DocumentoCollegatoRow } from './DocumentoCollegatoRow'

type Props = {
    className: string
}

export const CollegaAltriDocumentiSection = (props: Props) => {
  
    const { documentiCollegatiList, setDocumentiCollegatiList } = useWizardBandoContext().documentiCollegati;
    const {setIsOpen, isOpen} = useCollegaAltriDocumentiContext().dialog


    return (
        <>
            <Paper className={props.className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>{documentiCollegatiList.length > 0 ? 'Documenti collegati' : ' Collega altri documenti'}</Typography>
                    <ActionButton color='secondary' text='Collega' endIcon={<Icon>account_tree</Icon>} onClick={() => setIsOpen(true)} />
                </Box>
                {documentiCollegatiList.length > 0 &&
                    <Box padding={'1rem .5rem'} marginTop={1} maxHeight={'400px'} overflow={'auto'} sx={{ backgroundColor: 'aliceblue' }} >

                        {documentiCollegatiList.map((item, index) => {
                            return (
                                <DocumentoCollegatoRow key={index} document={item} setDocumentiCollegatiList={setDocumentiCollegatiList} />
                            )
                        })}
                    </Box>
                }
            </Paper>

            <CollegaDocumentiDialog />
        </>
    )
}
