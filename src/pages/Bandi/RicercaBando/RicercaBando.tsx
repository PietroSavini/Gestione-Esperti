import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { RicercaBandoComponent } from './Components/RicercaBandoComponent'
import RicercaBandoContextProvider from './RicercaBandoContext'
import { RicercaBandoResult_Datagrid } from './tabels/RicercaBandoResult_Datagrid'

export const RicercaBando = () => {
const [dataGridData, setDataGridData] = useState<any[]>([])

  return (
    <>
        {/* Ricerca bandi Header */}
            <Box marginBottom={2}>
                <Typography variant='h5' fontWeight={600}>
                    Ricerca Bando
                </Typography>
            </Box>
        {/* END Ricerca bandi header */}

        {/* Ricerca Bandi Body */}
            <RicercaBandoContextProvider>
                {/* Ricerca Bandi Component */}
                <RicercaBandoComponent setRows={setDataGridData} />
                {/* END Ricerca bandi Component */}

                {/* Search Results */}
                <RicercaBandoResult_Datagrid rows={dataGridData} setRows={setDataGridData}/>
                {/* END Search Results */}
                
            </RicercaBandoContextProvider>
        {/* END RicercaBandi Body */}

    </>
  )
}
