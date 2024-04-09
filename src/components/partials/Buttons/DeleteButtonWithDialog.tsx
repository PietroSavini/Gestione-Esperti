import { useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { TipologiaEspertoRow } from "../../../pages/SettingsPage/Tabs/TipologiaEspertoTab/Tables/Table_tipologieDiSistema";



export const DeleteButtonWithDialog = ({row ,successFn, message} : {row:TipologiaEspertoRow, successFn: any, message?: string}) => {
    let innerText : string = "Cliccando su Si cancellerai definitivamente l'elemento dalla lista.";
    const [ open, setOpen ] = useState<boolean>(false);
    const title = row.TEspBr
    const id = row.TEspId 

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        successFn(id);
        setOpen(false);
    };

    return (
        <>
            <ActionButton color='error' onClick={() => setOpen(true) } text='Elimina' icon='delete' direction='row-reverse' /> 
            <Dialog
                open={open} 
                keepMounted
                onClose={handleClose}
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
                    <Button onClick={ handleDelete }>Si</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
