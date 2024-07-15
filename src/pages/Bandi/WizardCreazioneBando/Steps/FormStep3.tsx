import { Box, Paper, Typography } from '@mui/material'
import { FormStepProps } from './FormStep1';
import { FascicoliElettroniciSection } from '../Sections/FascicoliElettroniciSection';
import { ArchivioSelezionatoSection } from '../Sections/ArchivioSelezionatoSection';

export const FormStep3 = (props: FormStepProps) => {
    const { register, errors, className } = props;


    return (
        <>
            <ArchivioSelezionatoSection className={className} />
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <FascicoliElettroniciSection className={className} />
            {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Collega altri documenti</Typography>
                </Box>
            </Paper>
        </>
    )
}
