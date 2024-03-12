import { Box, FormHelperText, Grid, Icon, InputBase, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectTipologie } from '../../../../../app/store/Slices/TipologieSlice';
import { useAppSelector } from '../../../../../app/ReduxTSHooks';
import { useForm } from 'react-hook-form';
import { RequisitoTable } from '../Tables/Table_tipologieDiSistema';
import Table_editTipologiaEsperto from '../Tables/Table_editTipologiaEsperto';
import { AddSectionButtonWithDialog } from '../../../../../components/partials/Buttons/AddSectionButtonWithDialog';


export const TipologiaEdit = () => {
    const navigate = useNavigate()
    const { state } = useLocation();
    const { title, id, description, requisitiTables } = state
    //prelevo tipologie personalizzate dallo state redux per effettuare controllo al refresh della pagina
    const localState = useAppSelector(selectTipologie);
    const { tipologiePersonalizzate } = localState;
    //variabili di stato per modifica descrizioni della tipologia da modificare
    const [ newTitle, setNewTitle ] = useState<string>(title)
    const [ newDescription, setNewDescription ] = useState<string>(description)
    //elenco delle table da generare per ogni sezione contenuta all interno della tipologia esperto es: sezione titolo di studio (con i suoi requisiti etc..)
    //ci serve anche per "aggiungi sezione"
    const [tables, setTables] = useState<RequisitoTable>(requisitiTables)

    //react hook form
    const form = useForm<any>();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    //console.log(vari)
    useEffect(() => {
        console.log('quello che arriva alla pagina dopo il click modifica',state)
        console.log('tabelle',tables)
    }, [])
    
    useEffect(() => {
        //codice sotto forse inutile, da constatare se va effettuata chiamata a DB per popolare pagina(probabilmente si)
        //elemento di controllo nell ipotesi venga effettuato un refresh della pagina o se per qualche motivo la row non è presente nella tabella
        if(!tipologiePersonalizzate.some((tipologia) => tipologia.id === id)){
            navigate('/impostazioni')
        }
    }, [])
    
    //funzione di submit del bottone per modifica descrizioni
    const submit = () => {
        console.log('hello')
    }

    const handleAddSection = (sectionTitle:string) => {
        const newTable ={
          id:`table-${sectionTitle}-requisiti-${title}`, //sicuro va assegnato id diverso ma questo è provvisorio
          sectionTitle: sectionTitle,
          requisitiList:[]
        }
        //Salvo la Tabella appena Creata nel DB
         //response:200 , ricevo id Table
 
        setTables((prevTables) => [...prevTables, newTable] )
        console.log(tables)
    }

    const updateValue= ({value, url }:{value:string, url?:string}) => {
        setNewDescription(value)
        //funzione con debounce per salvataggio dati su db
        //se uno dei 2 values è vuoto, non eseguire chiamata nella funzione di debounce ma settare variabile formError su true e return

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
        <Grid container sx={{marginBottom:'1rem'}}  component={'form'} noValidate onSubmit={handleSubmit(submit)} >
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
            <AddSectionButtonWithDialog successFn={handleAddSection} />
        </Box>

        {/* Rendering tabelle con map in base ad array: Tables */}
        {tables && tables.map((table, index)=>(
            <>
                <Table_editTipologiaEsperto key={index} sectionTitle={table.sectionTitle} requisiti={table.requisitiList}/>
            </>
        ))}
            
       
    </>
  )
}
