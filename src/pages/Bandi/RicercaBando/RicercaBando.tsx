import { Box, Dialog, Typography } from '@mui/material'
import { useState } from 'react'
import { RicercaBandoComponent } from './Components/RicercaBandoComponent'
import RicercaBandoContextProvider, { useRicercaBandoContext } from './RicercaBandoContext'
import { RicercaBandoResult_Datagrid } from './tabels/RicercaBandoResult_Datagrid'
import { RicercaBandoResults } from './Components/RicercaBandoResults'

export const RicercaBando = () => {
    
    
    return (
        <>
            {/* Ricerca bandi Header */}
            {/* END Ricerca bandi header */}

            {/* Ricerca Bandi Body */}
            <RicercaBandoContextProvider>

               <RicercaBandoResults />

            </RicercaBandoContextProvider>
            {/* END RicercaBandi Body */}

        </>
    )
}
