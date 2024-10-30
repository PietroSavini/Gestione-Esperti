import { Box, Typography } from "@mui/material";
import noContent from '../../../components/partials/svg/no-content.svg'

//componente che si visualizza quando non ci sono attività selezionate
export const NoResultComponent = ({message}:{message:string}) => {
    return (
        <>
            <Box className='selectDisable'  display={'flex'} alignItems={'center'} flexDirection={'column'} sx={{ position:'relative' ,zIndex: 2 }} >
                <img className='selectDisable' style={{width:'200px', height:'200px'}} src={noContent}/>
                <Typography sx={{ marginTop: '2rem', color: '#525354' }} fontSize={28} fontStyle={'bold'} textAlign={'center'}>{message ? message : 'Nessun Risultato'}</Typography>
            </Box>
        </>
    )
};

