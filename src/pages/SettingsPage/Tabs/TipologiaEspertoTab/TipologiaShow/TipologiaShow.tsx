import { useLocation, useNavigate } from "react-router-dom";
import { Box, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import AXIOS_HTTP from "../../../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../../app/ReduxTSHooks";
import { closeLoader, openLoader } from "../../../../../app/store/Slices/loaderSlice";
import Table_RequisitiPunteggiShow from "../../RequisitiTab/Tables/Table_RequisitiPunteggiShow";
import { Requisito_Table, TipologiaEspertoRow } from "../../../types";
import { convertData } from "../../../functions";

export const TipologiaShow = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const { state } = useLocation();
    const tipologia = state as TipologiaEspertoRow;
    const descriptionBr = tipologia.TEspBr;
    const description = tipologia.TEspDesc;
    const id = tipologia.TEspId;
    const [formattedData, setFormattedData] = useState<[] | Requisito_Table[] | undefined>(undefined)

    
    const GET_ALL_REQUISITI_COLLEGATI = async () => {
        dispatch(openLoader())
        await AXIOS_HTTP.Retrieve({ sModule: 'IMPOSTAZIONI_GET_ALL_PUNTEGGI', sService: 'READ_PUNTEGGI', url: '/api/launch/retrieve', body: { TEspId: id } })
            .then((resp) => {
                const newData = convertData(resp.response);
                setFormattedData(newData)
            })
            .catch((err) => {
                console.error(err)
            })
            
        }
        
        useEffect(() => {
            GET_ALL_REQUISITI_COLLEGATI()
        }, [])

        useEffect(() => {
            if (formattedData ) {
                dispatch(closeLoader())
                console.log('dati formattati: ', formattedData)
            }
        }, [formattedData])
        
    return (
        <>
            <Box marginBottom='1rem'>
                <Typography className='link' onClick={() => navigate(-1)} fontSize='.7rem' variant='body2' component={'span'} >Tipologie</Typography>
                <Typography fontWeight={600} variant='body2' component={'span'} > / Visualizza tipologia Tipologia </Typography>
            </Box>

            <Box marginBottom={'1.5rem'} display='flex' alignItems='center'>
                <Icon onClick={() => navigate(-1)} className='link' sx={{ marginRight: '1rem', fontSize: '2rem' }}>keyboard_backspace</Icon>
                <Typography variant='h5'>Visualizza Tipologia: {descriptionBr}</Typography>
            </Box>
            <Paper elevation={2}>
                <Box padding={2}>
                    <Grid container >
                        <Grid item md={6} xs={12} marginBottom={2} >
                            <Typography fontSize={20} fontWeight={600}>Decrizione Breve: </Typography>
                            <Typography>{descriptionBr}</Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Typography fontSize={20} fontWeight={600}>Decrizione Lunga: </Typography>
                            <Typography>{description}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
                <Box padding={2}>
                    <Typography marginBottom={2} fontSize={20} fontWeight={600}>Requisiti collegati:</Typography>
                    {formattedData && formattedData.length > 0 && formattedData.map((requisiti, index) => <Table_RequisitiPunteggiShow key={index} data={requisiti} />)}
                    {!formattedData || formattedData.length === 0 && <Typography>Nessun Requisito Collegato</Typography>}
                </Box>
            </Paper>
        </>
    )
}
