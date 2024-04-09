import { useLocation, useNavigate } from "react-router-dom";
import { TipologiaEspertoRow } from "../Tables/Table_tipologieDiSistema";
import { Box, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import AXIOS_HTTP from "../../../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import { useEffect, useState } from "react";
import { Requisiti_List, Requisito_Table, mergeRequisitiArrays} from "../../RequisitiTab/RequisitiTab";
import { useAppDispatch } from "../../../../../app/ReduxTSHooks";
import { closeLoader, loaderSelector, openLoader } from "../../../../../app/store/Slices/loaderSlice";
import Requisiti_table from "../../RequisitiTab/Tables/Table_requisiti";
import Table_RequisitiPunteggiShow from "../../RequisitiTab/Tables/Table_RequisitiPunteggiShow";

type RawData = {
    fi_ee_req_id: string | number, 
    fs_ee_req_desc: string, 
    fi_ee_req_punteggio: number,
    fi_ee_req_master_id: number | null
    fi_ee_punt_id?: number
}[] | []


export const convertData = (rawData:RawData, type: 0 | 1) :Requisito_Table[] | [] => {
   
    let requisitiMaster:Requisito_Table[] | [] = []
    let requisitiMasterWithotherRequisiti: Requisito_Table[] | [] = []
    let requisitiTables: Requisito_Table[] | [] = []
    
    //controllo se rawData è vuoto
    if(rawData.length === 0){
        return requisitiTables
    }
    //preparo requisiti master -- caso in cui non cè bisogno dei punteggi
    if(type === 0){
        rawData.forEach((requisito)  => {
            if(requisito.fi_ee_req_master_id === null ){
                const requisitoToInsert :Requisito_Table = {
                    fi_ee_req_id: requisito.fi_ee_req_id,
                    fs_ee_req_desc: requisito.fs_ee_req_desc,
                    requisiti_list: [] as Requisiti_List
                } 
                requisitiMaster = [...requisitiMaster, requisitoToInsert];
            }
        })
    
        rawData.forEach(requisito => {
            if (requisito.fi_ee_req_punteggio !== 0) {
                let requisitoPadre = requisitiMaster.find(master => master.fi_ee_req_id === requisito.fi_ee_req_master_id);
                
                if (requisitoPadre) {
                    const requisitoFiglio = {
                        fi_ee_req_id: requisito.fi_ee_req_id,
                        fs_ee_req_desc: requisito.fs_ee_req_desc,
                        fi_ee_req_punteggio: requisito.fi_ee_req_punteggio
                    }
                    requisitoPadre.requisiti_list = [...requisitoPadre.requisiti_list, requisitoFiglio]
                    requisitiMasterWithotherRequisiti = [...requisitiMasterWithotherRequisiti, requisitoPadre]
                }
            }
        }); 
    
        requisitiTables = mergeRequisitiArrays(requisitiMaster,requisitiMasterWithotherRequisiti)

    }else{
        rawData.forEach((requisito)  => {
            if(requisito.fi_ee_req_master_id === null ){
                const requisitoToInsert :Requisito_Table = {
                    fi_ee_req_id: requisito.fi_ee_req_id,
                    fs_ee_req_desc: requisito.fs_ee_req_desc,
                    fi_ee_punt_id: requisito.fi_ee_punt_id,
                    requisiti_list: [] as Requisiti_List
                } 
                requisitiMaster = [...requisitiMaster, requisitoToInsert];
            }
        });

        rawData.forEach(requisito => {
            if (requisito.fi_ee_req_punteggio !== 0) {
                let requisitoPadre = requisitiMaster.find(master => master.fi_ee_req_id === requisito.fi_ee_req_master_id);
                
               
                if (requisitoPadre) {
                    const requisitoFiglio = {
                        fi_ee_req_id: requisito.fi_ee_req_id,
                        fs_ee_req_desc: requisito.fs_ee_req_desc,
                        fi_ee_req_punteggio: requisito.fi_ee_req_punteggio,
                        fi_ee_punt_id: requisito.fi_ee_punt_id
                    }
                    requisitoPadre.requisiti_list = [...requisitoPadre.requisiti_list, requisitoFiglio]
                    requisitiMasterWithotherRequisiti = [...requisitiMasterWithotherRequisiti, requisitoPadre]
                }
            }
        }); 

        requisitiTables = mergeRequisitiArrays(requisitiMaster,requisitiMasterWithotherRequisiti)
    }
    console.log('requisiti formattati: ',requisitiTables)
    return requisitiTables 
}


export const TipologiaShow = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const { state } = useLocation();
    const tipologia = state as TipologiaEspertoRow;
    const descriptionBr = tipologia.TEspBr;
    const description = tipologia.TEspDesc;
    const id = tipologia.TEspId;
    
    const [formattedData, setFormattedData] = useState<[] | Requisito_Table[]>()

    useEffect(() => {
      console.log('dati formattati: ', formattedData)
      if(formattedData){
        dispatch(closeLoader())
      }
    }, [formattedData])

    const GET_ALL_REQUISITI_COLLEGATI = async () => {
        dispatch(openLoader())
        await AXIOS_HTTP.Retrieve({ sModule:'IMPOSTAZIONI_GET_ALL_PUNTEGGI', sService:'READ_PUNTEGGI', url:'/api/launch/retrieve', body:{idTesp:id} })
            .then((resp)=> {
                setFormattedData(convertData(resp.response, 0))
                
            })
            .catch((err)=>{
                console.error(err)
            })
    }

    useEffect(() => {
        GET_ALL_REQUISITI_COLLEGATI()
    }, [])
    
    return (
        <>
            <Box marginBottom='1rem'>
                <Typography className='link' onClick={() => navigate(-1)} fontSize='.7rem'  variant='body2' component={'span'} >Tipologie</Typography>
                <Typography fontWeight={600} variant='body2' component={'span'} > / Visualizza tipologia Tipologia </Typography>
            </Box>

            <Box marginBottom={'1.5rem'} display='flex' alignItems='center'>
                <Icon onClick={() => navigate(-1)} className='link' sx={{marginRight:'1rem', fontSize:'2rem'}}>keyboard_backspace</Icon>
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
                <Divider/>
                <Box padding={2}>
                    <Typography marginBottom={2} fontSize={20} fontWeight={600}>Requisiti collegati:</Typography>
                    {formattedData && formattedData.length > 0 && formattedData.map((requisiti, index) => <Table_RequisitiPunteggiShow key={index} data={requisiti}/> )}
                    {!formattedData || formattedData.length === 0 && <Typography>Nessun Requisito Collegato</Typography>}
                </Box>
            </Paper>
        </>
    )
}
