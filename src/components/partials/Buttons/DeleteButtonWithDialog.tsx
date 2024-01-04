import { useState } from "react"
import { ActionButton } from "./ActionButton"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { Row } from "../../../pages/SettingsPage/Tabs/TipologiaEspertoTab/Tables/Table_tipologieDiSistema"


export const DeleteButtonWithDialog = ({row ,successFn} : {row:Row, successFn:Function}) => {
        
    const [ open, setOpen ] = useState<boolean>(false);
    const { title, id } = row as Row;
    const handleSuccess = (id:string) => {
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
                <DialogTitle>{`Vuoi Cancellare definitivamente la riga selezionata: "${title}"?` }</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                       {`cliccando su "Si" cancellerai definitivamente l'elemento dalla lista "Tipologie Personalizzate", 
                       potrai ricrearlo successivamente duplicando un modello personalizzato dalle Tipologie di Sistema.`}
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
