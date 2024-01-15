import { useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"



export const DeleteButtonWithDialog = ({row ,successFn, message} : {row:any, successFn:Function, message?: string}) => {
    let innerText : string = "Cliccando su Si cancellerai definitivamente lelemento dalla lista.";
    const [ open, setOpen ] = useState<boolean>(false);
    const { title, id } = row 
    const handleSuccess = (id:string | number) => {
        successFn(id);
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
                       {message? message : innerText}
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
