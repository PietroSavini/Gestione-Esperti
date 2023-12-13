import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Skeleton,  Divider } from '@mui/material'
import './Section.scss'
import { AxiosHTTP, Options } from '../../app/AXIOS_ENGINE/AxiosHTTP';
import { RowBando } from '../SectionRows/Bandi/RowBando';
import { RowCandidatura } from '../SectionRows/Candidature/RowCandidatura';
import { Settings } from '../SectionRows/settingsType';
import { ActionButton } from '../SectionRows/actionButton';


type Props = {
    type: 'bandi' | 'candidature'
    title?: string;
    data?: Object[];
    handleCall?: Options
    settings?:Settings
}

export const Section = (props: Props) => {

    const { title, handleCall, data , type} = props;
    const [isLoading, setLoader] = useState<boolean>(true)
    const [showAll, setShowAll] = useState<boolean>(false)
    const [outputData,setOutputData] = useState<Object[]>([])

    
    //fetch fn per i dati nel caso in cui handleCall !== undefined
    const fetchData = async (dataForCall: Options) => {
        //if che controlla se data è salvato nello state redux, se si lo prende da li e returna se no fa la chiamata
        try {
            setLoader(true)
            const result = await AxiosHTTP({ ...dataForCall });
            setOutputData(result.data)
            //salva i dati dela section nello state di redux
            setLoader(false)
        } catch (err) {
            //azioni legate agli errori
            setOutputData([])
            setLoader(false)
            
        }
    }

    useEffect(() => {
        
        if(data && data.length > 10){
            const newData:Object[] = data.slice(0,10)
            setOutputData(newData)
            setShowAll(true)
            setLoader(false)
        }else{
            data && setOutputData(data) 
            setLoader(false)
        }
        
        if (handleCall) {
            fetchData(handleCall)
        }
     

    }, [])

    return (
        <>
            {isLoading ? (
                <>
                    <Paper elevation={6} sx={{ padding: '1rem 2rem' }}>
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                        <Skeleton sx={{ marginBottom: '.8rem' }} />
                    </Paper>
                </>
            ) : (
                <Box component='div'>
                    {title &&
                        <Typography sx={{paddingLeft:'2rem'}} variant='h6' component={'h3'} fontWeight={600}>{title}</Typography>
                    }

                    <Paper sx={{minWidth:'100%', }} elevation={6}>
                        {outputData && outputData.map((element: any, index: number) => {
                            {switch (type) {
                                case 'bandi':
                               
                                    return(
                                        <RowBando key={index} data={element} settings={{}} />
                                    )
                                    
                                default:
                                    return(
                                        <>
                                        </>
                                    )
                                    
                            }}
                        })}
                        {showAll && 
                            <>
                                <Divider  />
                                <Box sx={{padding:'1rem 1rem'}}>
                                    <ActionButton to={'/Bandi'} text='Vedi tutto' icon='chevron_right'/>
                                </Box>
                            </>
                        }
                    </Paper>
                </Box >
            )}
        </>
    )
}
