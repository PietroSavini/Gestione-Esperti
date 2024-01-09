import { useRef, useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material"

import { useForm } from "react-hook-form"


export const AddRequisitoWithDialog = ({successFn, sectionTitle}:{successFn :Function, sectionTitle:string}) => {
        
    const [ open, setOpen ] = useState<boolean>(false); 
    //nuovo titolo della Tabella
    const [title, setNewTitle] = useState<string>('')
    //react-hook-form initializzation
    const form = useForm<any>();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const ref = useRef<HTMLFormElement>(null)
    const submit = () => {
        setOpen(false)
        successFn(title);
    }

    return (
        <>
            <ActionButton color='secondary' onClick={() => setOpen(true)} text='Aggiungi requisito' icon='add' direction='row-reverse' />  
            <Dialog
                open={open} 
                keepMounted
                onClose={()=>setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Crea un nuovo requisito per " {sectionTitle} "</DialogTitle>
                <form ref={ref} onSubmit={handleSubmit(submit)} noValidate>
                    <DialogContent>
                        <DialogContentText sx={{marginBottom:'1rem'}} id="alert-dialog-slide-description">
                        {`Descrizione Requisito:`}
                        </DialogContentText>
                        <Stack>

                        <TextField 
                            {...register('requisitoDescription', {required:'il titolo del requisito è obbligatorio'})} 
                            error={!!errors.requisitoDescription}
                            helperText={errors.requisitoDescription?.message as string}
                            label='Titolo Requisito *' 
                            value={title} 
                            id="requisitoDescription"
                            onChange={(e) => setNewTitle(e.target.value)} 
                            sx={{marginBottom:'1.5rem'}}
                            variant="standard"
                        />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Annulla</Button>
                        <Button type='submit'>Crea Requisito</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
