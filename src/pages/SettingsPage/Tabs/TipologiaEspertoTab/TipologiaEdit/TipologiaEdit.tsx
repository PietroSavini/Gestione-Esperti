import { Box, Dialog, FormHelperText, Grid, Icon, InputBase, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../../../../app/ReduxTSHooks';
import { useForm } from 'react-hook-form';

import { TipologiaEspertoRow } from '../Tables/Table_tipologieDiSistema';
import { Requisito_Table } from '../../RequisitiTab/RequisitiTab';
import Table_RequisitiSelect from './Table_RequisitiSelect';
import { closeLoader, openLoader } from '../../../../../app/store/Slices/loaderSlice';
import AXIOS_HTTP from '../../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { convertData } from '../TipologiaShow/TipologiaShow';
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton';
import { Custom_Select2 } from '../../../../../components/partials/Inputs/Custom_Select2';

export type InboundSelectData = {
    fi_ee_req_id: number;
    fs_ee_req_desc:string;
}[] | []

type Options = {
    value:string,
    label:string,
    id: string | number
}

export const TipologiaEdit = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const { state } = useLocation();
    const TEsp = state as TipologiaEspertoRow
    console.log('tipologia esperto:',TEsp)
    const id = TEsp.TEspId
    const title = TEsp.TEspBr;
    const description = TEsp.TEspDesc;
    const [formattedData, setFormattedData] = useState<[] | Requisito_Table[]>([])
    const [selectableItems, setSelectableItems ] = useState<Options[] | []>([])
    //variabili di stato per modifica descrizioni della tipologia da modificare
    const [ newTitle, setNewTitle ] = useState<string>(title)
    const [ newDescription, setNewDescription ] = useState<string>(description)
    //react hook form
    const form = useForm<any>();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    //variabili per modal 'aggiungi sezione'
    const [selectedItem, setSelectedItem] = useState<any>()
    const [isAddSectionOpen, openAddSectionDialog] = useState<boolean>(false)
    const [error, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')


    //Funzioni
    const addNewSection = async () => {
        if(!selectedItem) {
            console.log('form in errore')
            setIsError(true)
            setErrorMessage('Seleziona almeno un requisito da associare alla tipologia esperto')
            return
        }
        setIsError(false)
        //faccio chiamata
        await AXIOS_HTTP.Execute({sModule:'IMPOSTAZIONI_INSERT_PUNTEGGIO', sService:'WRITE_PUNTEGGI', url:'/api/launch/execute', body:{ tespId:id , reqId: selectedItem.id, punt:0}})
            .then((resp) => {
                console.log(resp);
                if(resp.errorCode === 0){
                    const puntId = resp.response.fi_ee_punt_id;
                     
                    const newSection: Requisito_Table = {
                        fi_ee_req_id: selectedItem.id,
                        fi_ee_punt_id: puntId,
                        fs_ee_req_desc: selectedItem.value,
                        requisiti_list: []
                    }
    
                    setFormattedData((prev) => [...prev, newSection])
                    setSelectedItem(undefined)
                    openAddSectionDialog(false)
                }else{
                    const errorMessage = resp.errorMessage
                    setIsError(true)
                    setErrorMessage(errorMessage)
                }
            })
            .catch((err) => console.log(err));


        //id tipologia esperto - id requisito - punteggio 
        //idTesp - idReq- punteggio
    }   

    //funzione che repara la listItem nella select ''aggiungi requisito
    const GET_REQUISITI_FOR_SELECT = async () => {
        await AXIOS_HTTP.Retrieve({sService:'READ_REQUISITI',sModule:'IMPOSTAZIONI_GET_REQUISITI_MASTER',body:{idTesp:id},url:'/api/launch/retrieve'})
            .then((resp)=>{
                const arrOfItems = resp.response as InboundSelectData;
                let finalArray : Options[] = [];
                arrOfItems.forEach(element => {
                    const newFormat: Options = {
                        value: element.fs_ee_req_desc,
                        label: element.fs_ee_req_desc,
                        id:element.fi_ee_req_id,
                    }
                    finalArray.push(newFormat);
                });
                setSelectableItems(finalArray)
            })
    }

    // funzione che mostra i requisiti collegati dai punteggi alla tipologia
    const GET_ALL_PUNTEGGI_COLLEGATI = async () => {
        dispatch(openLoader())
        await AXIOS_HTTP.Retrieve({ sModule:'IMPOSTAZIONI_GET_ALL_PUNTEGGI', sService:'READ_PUNTEGGI', url:'/api/launch/retrieve', body:{idTesp:id} })
            .then((resp)=> {
                console.log('REQUISITI COLLEGATI ALLA TIPOLOGIA ESPERTO: : ',resp)
                setFormattedData(convertData(resp.response, 1))
                dispatch(closeLoader())
            })
            .catch((err)=>{
                console.error(err)
                dispatch(closeLoader())
            })
    }

    //chiamate iniziali al rendering della pagina
    useEffect(() => {
        GET_ALL_PUNTEGGI_COLLEGATI()
        GET_REQUISITI_FOR_SELECT()
    }, [])
    //console.log (vari)
    useEffect(() => {
       console.log('',selectedItem)
    }, [selectedItem])
    
    
    //funzione di submit del bottone per modifica descrizioni

    

    const updateValue= ({value, url }:{value:string, url?:string}) => {
        setNewDescription(value)
        //funzione con debounce per salvataggio dati su db
    }
    
  return (
    <>
        <Box marginBottom='1rem'>
            <Typography className='link' onClick={() => navigate(-1)} fontSize='.7rem'  variant='body2' component={'span'} >Tipologie</Typography>
            <Typography fontWeight={600} variant='body2' component={'span'} > / Modifica Tipologia </Typography>
        </Box>

        <Box marginBottom={'1.5rem'} display='flex' alignItems='center'>
            <Icon onClick={() => navigate(-1)} className='link' sx={{marginRight:'1rem', fontSize:'2rem'}}>keyboard_backspace</Icon>
            <Typography variant='h5'>Modifica Tipologia: {title}</Typography>
        </Box>

        {/* form per modifica descrizioni */}
        <Grid container sx={{marginBottom:'1rem'}}  >
            <Grid item lg={6} xs={12} sx={{padding:'0 .5rem', marginBottom:'1rem'}} >
                <Typography fontWeight={600} color={'#127aa3ff'}>Descrizione Breve</Typography>
                <InputBase 
                    className={`ms_input ${errors.title ? 'error' : ''}`}
                    error = {!!errors.title}
                    fullWidth 
                    placeholder='Inserisci una descrizione breve' 
                    {...register('title',{required:'La descrizione breve è richiesta'})} 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    
                />
                {errors.title && <FormHelperText sx={{paddingLeft:'.5rem'}} error>{errors.title?.message as string}</FormHelperText> }

            </Grid>
            <Grid item lg={6} xs={12} sx={{ padding:'0 .5rem'}} >

                <Typography fontWeight={600} color={'#127aa3ff'}>Descrizione Lunga</Typography>
                <InputBase 
                   sx={{padding:'0 .5rem'}}
                    multiline
                    maxRows={4}
                    className={`ms_input ${errors.description ? 'error' : ''}`}
                    fullWidth 
                    placeholder='Inserisci una descrizione lunga' 
                    {...register('description',{required:'La descrizione lunga è richiesta'})} 
                    value={newDescription} 
                    onChange={(e) => updateValue({value: e.target.value, url:'/ciao'}) } 
                    
                />
                {errors.description && <FormHelperText sx={{paddingLeft:'.5rem'}} error>{errors.description?.message as string}</FormHelperText> }
            </Grid>

        </Grid>
        {/* END form per modifica descrizioni */}
        <Box sx={{marginBottom:'1rem'}}  display={'flex'} width={'100%'} justifyContent={'flex-start'}>
            <ActionButton text='Aggiungi sezione' onClick={() => openAddSectionDialog(true)} endIcon={<Icon>add</Icon>} color='secondary'/>
        
            <Dialog open={isAddSectionOpen} onClose={() => openAddSectionDialog(false)}>
                <Box display={'flex'} flexDirection={'column'} minHeight={'300px'} minWidth={'600px'} padding={'1rem 2rem'}  >
                    
                    <Box  flexGrow={1} marginBottom={'3rem'}>
                       <Custom_Select2 isRequired label='Seleziona Requisito da aggiungere' error={error} onChange={(newValue) => setSelectedItem(newValue)} options={selectableItems} />
                        {error && <Typography color={'error'}>{errorMessage}</Typography>}
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        <ActionButton  onClick={ () => openAddSectionDialog(false) } color='error' icon='cancel' sx={{marginRight:'.5rem'}} />
                        <ActionButton text='Aggiungi' color='secondary' onClick={ addNewSection} /> 
                    </Box>
                </Box>

            </Dialog>
        </Box>

        {/* Rendering tabelle con map in base ad array: Tables */}
        {formattedData && formattedData.map((table, index)=>(     
            <Table_RequisitiSelect key={index} data={table} setData={()=>{}} tespId={id} />
        ))}
    </>
  )
}
