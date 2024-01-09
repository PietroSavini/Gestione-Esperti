import { useRef, useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material"

import { useForm } from "react-hook-form"


export const EditRequisito = ({successFn, requisitoTitle}:{successFn :Function, requisitoTitle:string}) => {
        
    const [ open, setOpen ] = useState<boolean>(false); 
    //nuovo titolo della Tabella
    const [title, setNewTitle] = useState<string>(requisitoTitle)
    //react-hook-form initializzation
    const form = useForm<any>();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const ref = useRef<HTMLFormElement>(null)
    const submit = () => {
        successFn(title);
    }

    return (
        <>
            <ActionButton color='primary' onClick={() => setOpen(true)} text='Modifica' icon='edit' direction='row-reverse' />  
            <Dialog
                open={open} 
                keepMounted
                onClose={()=>setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Modifica requisito " {requisitoTitle} "</DialogTitle>
                <form ref={ref} onSubmit={handleSubmit(submit)} noValidate>
                    <DialogContent>
                        <DialogContentText sx={{marginBottom:'1rem'}} id="alert-dialog-slide-description">
                        {`Modifica requisito:`}
                        </DialogContentText>
                        <Stack>

                        <TextField 
                            {...register('requisitoTitle', {required:'il Titolo del Requisito è obbligatorio'})} 
                            error={!!errors.requisitoTitle}
                            helperText={errors.requisitoTitle?.message as string}
                            label='Titolo Requisito *' 
                            value={title} 
                            id="requisitoTitle"
                            onChange={(e) => setNewTitle(e.target.value)} 
                            sx={{marginBottom:'1.5rem'}}
                            variant="standard"
                        />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Annulla</Button>
                        <Button type='submit'>Applica Modifiche</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
