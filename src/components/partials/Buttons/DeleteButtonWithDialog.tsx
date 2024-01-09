import { useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"



export const DeleteButtonWithDialog = ({row ,successFn, type} : {row:any, successFn:Function, type?: 'requisiti' | 'tipologie'}) => {
    let innerText : string = '';
    const [ open, setOpen ] = useState<boolean>(false);
    const { title, id } = row 
    const handleSuccess = (id:string | number) => {
        successFn(id);
    }

    if(type === 'requisiti') {
        innerText = `cliccando su "Si" cancellerai definitivamente l'elemento dalla lista `
    }

    if(type === 'tipologie'){
        innerText = `cliccando su "Si" cancellerai definitivamente l'elemento dalla lista "Tipologie Personalizzate", potrai ricrearlo successivamente duplicando un modello personalizzato dalle Tipologie di Sistema.'`
    }

    

    return (
        <>
            <ActionButton color='error' onClick={() => setOpen(true) } text='Elimina' icon='delete' direction='row-reverse' /> 
            <Dialog
                open={open} 
                keepMounted
                onClose={handleSuccess}
                aria-describedby="alert-dialog-slide-description"
                
            >
                <DialogTitle>{`Vuoi Cancellare definitivamente : "${title}"?` }</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                       {innerText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> setOpen(false)}>Annulla</Button>
                    <Button onClick={()=>handleSuccess(id)}>Si</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
