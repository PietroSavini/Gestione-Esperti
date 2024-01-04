import { useRef, useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material"
import { Row } from "../../../pages/SettingsPage/Tabs/TipologiaEspertoTab/Tables/Table_tipologieDiSistema"
import { useForm } from "react-hook-form"


export const DuplicateButtonWithDialog = ({row ,successFn} : {row:Row, successFn:Function}) => {
        
    const { title, description } = row as Row;
    const [ open, setOpen ] = useState<boolean>(false);
    const newTitleString = `${title} (Copia)`;
    const [newTitle, setNewTitle] = useState<string>(newTitleString)
    const [newDescription, setNewDescription] = useState<string>(description)
    
    //react-hook-form
    const form = useForm<any>();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const ref = useRef<HTMLFormElement>(null)


    const submit = () => {
        const newRow = { ...row, title: newTitle, description: newDescription }
        successFn(newRow);
    }

    return (
        <>
            <ActionButton color='primary' onClick={() => setOpen(true)} text='Duplica' icon='content_copy' direction='row-reverse' />  
            <Dialog
                open={open} 
                keepMounted
                onClose={()=>setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
                
            >
                <DialogTitle>{`Vuoi duplicare il modello: "${title}"?` }</DialogTitle>
                <form ref={ref} onSubmit={handleSubmit(submit)} noValidate>
                    <DialogContent>
                        <DialogContentText sx={{marginBottom:'1rem'}} id="alert-dialog-slide-description">
                        {`modifica modello:`}
                        </DialogContentText>
                        <Stack>

                        <TextField 
                            {...register('tipologiaTitle', {required:'il Titolo della Tipologia è obbligatorio'})} 
                            error={!!errors.tipologiaTitle}
                            helperText={errors.tipologiaTitle?.message as string}
                            label='Titolo Tipologia *' 
                            value={newTitle} 
                            id="tipologiaTitle"
                            onChange={(e) => setNewTitle(e.target.value)} 
                            sx={{marginBottom:'1.5rem'}}
                            variant="standard"
                        />
                        
                        <TextField multiline variant="standard" minRows={4} label='Descrizione:' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Annulla</Button>
                        <Button type='submit'>Duplica</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
