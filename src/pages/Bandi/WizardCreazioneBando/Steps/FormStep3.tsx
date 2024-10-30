import { Box, Paper, Typography } from '@mui/material'
import { FormStepProps } from './FormStep1';
import { FascicoliElettroniciSection } from '../Sections/FascicoliElettroniciSection';
import { ArchivioSelezionatoSection } from '../Sections/ArchivioSelezionatoSection';
import { CollegaAltriDocumentiSection } from '../Sections/CollegaDocumentiSection/CollegaAltriDocumentiSection';
import CollegaAltriDocumentiContextProvider from '../Sections/CollegaDocumentiSection/CollegaAltriDocumentiContext';

export const FormStep3 = (props: FormStepProps) => {
    const { register, errors, className } = props;


    return (
        <>
            <ArchivioSelezionatoSection className={className} />
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <FascicoliElettroniciSection className={className} />
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <CollegaAltriDocumentiContextProvider>
                <CollegaAltriDocumentiSection className={className} />
            </CollegaAltriDocumentiContextProvider>
        </>
    )
}
