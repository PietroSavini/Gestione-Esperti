import { useRef, useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material"

import { useForm } from "react-hook-form"


export const AddSectionButtonWithDialog = ({successFn}:{successFn :Function}) => {
        
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
            <ActionButton sx={{marginBottom:'2rem'}} color='secondary' onClick={() => setOpen(true)} text='Aggiungi Nuova Sezione' icon='add' direction='row-reverse' />  
            <Dialog
                open={open} 
                keepMounted
                onClose={()=>setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Crea una nuova sezione</DialogTitle>
                <form ref={ref} onSubmit={handleSubmit(submit)} noValidate>
                    <DialogContent>
                        <DialogContentText sx={{marginBottom:'1rem'}} id="alert-dialog-slide-description">
                        {`Inserisci il titolo:`}
                        </DialogContentText>
                        <Stack>

                        <TextField 
                            {...register('TableTitle', {required:'il Titolo della Sezione è obbligatorio'})} 
                            error={!!errors.TableTitle}
                            helperText={errors.TableTitle?.message as string}
                            label='Titolo Sezione *' 
                            value={title} 
                            id="TableTitle"
                            onChange={(e) => setNewTitle(e.target.value)} 
                            sx={{marginBottom:'1.5rem'}}
                            variant="standard"
                        />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Annulla</Button>
                        <Button type='submit'>Crea Sezione</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
