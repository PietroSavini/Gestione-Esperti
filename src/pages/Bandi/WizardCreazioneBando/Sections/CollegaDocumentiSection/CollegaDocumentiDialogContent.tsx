import { Box, Icon, Typography } from '@mui/material'
import { CollegaDocumentiResult_Datagrid } from './CollegaDocumentiResult_Datagrid'
import { CollegaDocumento_RicercaAvanzata } from './CollegaDocumento_RicercaAvanzata'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'

type Props = {
    closeDialog: () => void
    setDocumentiCollegati: React.Dispatch<React.SetStateAction<any[]>>
}
export const CollegaDocumentiContent = (props:Props) => {
    const {closeDialog} = props;

    return (
        <>
            <Box display={'flex'} flexDirection={'column'} height={'100%'} padding={'1rem 0rem 0rem 0rem'} >
                <Box >
                    <Box marginBottom={2} padding={'0 1rem'} display={'flex'}  justifyContent={'space-between'}>
                        <Typography variant='h5' fontWeight={600}>
                            Collega Documento
                        </Typography>
                        <Icon sx={{
                            transition:'100ms',
                            cursor:'pointer',
                            ":hover":{
                                color:'red',
                                
                            }
                        }}
                        onClick={() => closeDialog() }
                        >close</Icon>
                    </Box>
                    <CollegaDocumento_RicercaAvanzata setRows={() => {}} />
                </Box>
                <Box height={'65%'} flexGrow={1}>
                    <CollegaDocumentiResult_Datagrid rows={[]} setRows={() => {}}/>
                </Box>
                <Box display={'flex'} justifyContent={'end'} padding={1}>
                    <ActionButton 
                        color='error' 
                        text='Annulla' 
                        endIcon={<Icon>close</Icon>}
                        onClick={() => closeDialog()}
                    />
                </Box>
            </Box>

        </>
    )
}
