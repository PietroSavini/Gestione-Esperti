import { Box, Typography } from "@mui/material";
import { NoContentSvg } from "../svg/NoContentSvg";

//componente che si visualizza quando non ci sono attività selezionate
export const NoResultComponent = ({message}:{message:string}) => {
    return (
        <>
            <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                <NoContentSvg width='200px' height='200px' />
                <Typography sx={{ marginTop: '2rem', color: '#525354' }} fontSize={28} fontStyle={'bold'} textAlign={'center'}>{message ? message : 'Nessun Risultato'}</Typography>
            </Box>
        </>
    )
};

