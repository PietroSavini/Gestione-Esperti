import { Box, Grid, Typography, Icon } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { Pdf_Svg } from '../../../../../components/partials/svg/icon-pdf'
import { useWizardBandoContext } from '../../WizardBandoContext'


type Props = {
    document:any,
    setDocumentiCollegatiList: React.Dispatch<React.SetStateAction<any[]>>
}
export const DocumentoCollegatoRow = ({document, setDocumentiCollegatiList}: Props) => {

    

    const deleteDocumentoCollegato = (item: any) => {
        setDocumentiCollegatiList((prev) => prev.filter((documento) => documento.idDocumento !== item.idDocumento))
    };

    return (
        <Box sx={{ transition: '100ms', borderRadius: '10px', boxShadow: '0px 0.320697px 3.34117px rgba(66, 99, 137, 0.3)', padding: '.5rem .5rem', backgroundColor: '#fff', ':hover': { backgroundColor: '#efefef' }, marginBottom: '1rem' }} display={'flex'} alignItems={'center'}>
            <Grid width={'95%'} container >
                <Grid padding={'.5rem .5rem'} display={'flex'} alignItems={'center'} item xs={12} md={12} lg={3}>
                    <Pdf_Svg sx={{ width: '40px', height: '40px', marginRight: '5px' }} width='60' height='60' viewBox='0 0 40 40' />
                    <Typography fontWeight={600} >{document.className}</Typography>
                </Grid>
                <Grid padding={'.5rem .5rem'} display={'flex'} alignItems={'center'} item xs={12} md={6} lg={3}>
                    <Typography maxWidth={'100%'} sx={{ wordWrap: 'break-word' }}>{document.fileName}</Typography>
                </Grid>
                <Grid padding={'.5rem .5rem'} display={'flex'} alignItems={'center'} item xs={12} md={6} lg={2}>
                    <Typography>{document.user}</Typography>
                </Grid>
                <Grid padding={'.5rem .5rem'} display={'flex'} alignItems={'center'} item xs={12} md={6} lg={2}>
                    <Typography >{dayjs(document.uploadDate).format('DD/MM/YYYY')}</Typography>
                </Grid>
                <Grid padding={'.5rem .5rem'} display={'flex'} item xs={12} md={6} lg={2} alignItems={'center'}>
                    <Typography fontSize={'1.5rem'} fontWeight={600}>{document.idDocumento}</Typography>
                </Grid>
            </Grid>
            <Icon sx={{ width: '5%', transition: '100ms', cursor: 'pointer', ':hover': { color: 'red' } }} onClick={() => deleteDocumentoCollegato(document)}>close</Icon>
        </Box>
    )
}
