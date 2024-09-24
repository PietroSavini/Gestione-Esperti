import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { RicercaBandoComponent } from './Components/RicercaBandoComponent'
import RicercaBandoContextProvider from './RicercaBandoContext'
import { RicercaBandoResult_Datagrid } from './tabels/RicercaBandoResult_Datagrid'

export const RicercaBando = () => {
    const [dataGridData, setDataGridData] = useState<any[]>([])

    return (
        <>
            {/* Ricerca bandi Header */}
            {/* END Ricerca bandi header */}

            {/* Ricerca Bandi Body */}
            <RicercaBandoContextProvider>

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

            </RicercaBandoContextProvider>
            {/* END RicercaBandi Body */}

        </>
    )
}
