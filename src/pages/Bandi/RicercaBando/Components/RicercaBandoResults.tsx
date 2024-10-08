import { Box, Dialog, Typography } from '@mui/material'
import React from 'react'
import { RicercaBandoResult_Datagrid } from '../tabels/RicercaBandoResult_Datagrid'
import { RicercaBandoComponent } from './RicercaBandoComponent'
import { useRicercaBandoContext } from '../RicercaBandoContext'

export const RicercaBandoResults = () => {
    const { dataGridData, setDataGridData } = useRicercaBandoContext().dataGrid;
    const { isOpen, setIsOpen } = useRicercaBandoContext().dialog
    return (
        <>
            <Box display={'flex'} flexDirection={'column'} height={'100%'} >

                <Box >
                    <Box marginBottom={2} >
                        <Typography variant='h5' fontWeight={600}>
                            Ricerca Bando
                        </Typography>
                    </Box>
                    <RicercaBandoComponent setRows={setDataGridData} />
                </Box>

                <Box height={'65%'} flexGrow={1}>
                    <RicercaBandoResult_Datagrid rows={dataGridData} setRows={setDataGridData} />
                </Box>

            </Box>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                
            </Dialog>

        </>
    )
}
