import './Widget.scss'
import { Box, Card, CardContent,  Icon, Skeleton, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { AxiosHTTP, Options } from '../../app/AXIOS_ENGINE/AxiosHTTP';

 type props = {
    handleCall?:Options
    refresh?:{
        timer:number | undefined
    }
    titleColor?:string;
    titleSize?:string;
    bodyColor?:string;
    numberSize?:string | number;
    subtitleSize?:string | number;
    linkColor?:string;
    linkSize?:string;
    data?:Data;
    
};

type Data = {
    to?:string;
    image?:string;
    icon?:string;
    title?:string;
    body?:{
        counter?:number | string;
        text?:string;
    }[];
    linkText?:string;
};


export const Widget = (props:props,) => {
    
    const settings = props;
    const [isLoading, setIsLoading] = useState<boolean>(true)
    let data = props?.data;
    

    const fetchData = async (dataForCall:Options) => {
        //if che controlla se data è salvato nello state redux, se si lo prende da li e returna se no fa la chiamata
        try{
            setIsLoading(true)
            const result = await AxiosHTTP({...dataForCall});
            data = result as Data;   
            //salva i dati del widget nello state di redux
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
            console.error(err)
        }
    }


    
    useEffect(() => {

        if(data){
            setIsLoading(false)
        }

        if(props.handleCall ){
           fetchData({...props.handleCall})
        }
    
    }, [])
    
    

    //da fare un singolo condizionale per variabile isLoading creando un componente widget-skeleton
    return (
        <>
            <Box component='div' minWidth={244} className='widget'>
            
                <Link to={data?.to ? data?.to : '/'}>
                    <Card sx={{minWidth:244}}>
                        <CardContent>
                            <Box component='div' className="widget-header">
                                {isLoading ? (
                                    <>
                                        <Skeleton animation='wave' variant="circular" width={40} height={40} sx={{marginRight:"1rem"}}/>  
                                        <Skeleton animation='wave' width={100} height={20}/>
                                    </>
                                ):(
                                <>
                                        {data?.image ? data?.image : <Icon sx={{fontSize:'4rem'}}>{data?.icon ? data?.icon : 'all_inbox'}</Icon>}
                                        <Typography  component='h6' fontSize={settings?.titleSize ? settings.titleSize : '1rem'} color={settings?.titleColor ? settings?.titleColor : '#877f87ff'} >{data?.title ? data.title : 'Titolo del Widget' }</Typography>
                                </>

                                )}
                            </Box>
                            <Box component='div' className="widget-body">
                                {isLoading ? (
                                    <Skeleton animation='wave' sx={{marginBottom:'.5rem'}} variant='rectangular' width='100%' height={40}/>
                                ):(
                                    <>
                                        {data?.body && data.body.map((item, index)=> (
                                            <Box key={`${item}-${item.text}-${index}`} component='div' className='widget-content'>
                                                <Typography sx={{marginRight:'.3rem'}} component='h3' color={settings?.bodyColor ? settings.bodyColor : 'black'} fontSize={settings?.numberSize ? settings.numberSize : '2rem'} fontWeight={600}> {item.counter } </Typography>
                                                <Typography component={'p'} sx={{marginTop:'.5rem'}} color={settings?.bodyColor ? settings.bodyColor : 'black'} fontSize={settings?.subtitleSize ? settings.subtitleSize : '1rem' } fontWeight={600}> {item.text } </Typography>
                                            </Box>
                                        ))}
                                    </>
                                )}
                            </Box>
                            <Box component='div' className='widget-link'>
                                {isLoading? (
                                    <>
                                        <Skeleton animation='wave' width={100} height={20}/>
                                    </>
                                ):(
                                    <>
                                        <Typography component='p' variant='button' color={settings?.linkColor ? settings.linkColor : '#53a5cfff'} fontSize={settings?.linkSize ? settings.linkSize : '.7rem'}>{data?.linkText ? data.linkText : `vai a gestione ${data?.title}`}</Typography>
                                    </>
                                )}
                            </Box>
                        </CardContent>  
                    </Card>
                </Link> 
            </Box>
        </>

    )
}
