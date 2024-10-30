import { SetStateAction, useEffect, useState } from "react"
import { Requisito_Table } from "../../../SettingsPage/types"
import { Custom_Select2, Option } from "../../../../components/partials/Inputs/Custom_Select2"
import { Box, Icon, Dialog, Typography } from "@mui/material"
import { ActionButton } from "../../../../components/partials/Buttons/ActionButton"
import { data } from "../../../../components/SectionRows/data"
import Table_PunteggiBando from "../Tables/Table_PunteggiBando"
import AXIOS_HTTP from "../../../../app/AXIOS_ENGINE/AXIOS_HTTP"
import { useWizardBandoContext } from "../WizardBandoContext"


type Props = {
    selectOptions: Option[]
    TEspId: number | null | undefined
}

export const RequisitiPunteggiSection = (props: Props) => {

    const {selectOptions, TEspId } = props
    // lista requisiti estratta dal context del bando
    const {requisitiPunteggi, setRequisitiPunteggi} = useWizardBandoContext().requisitiPunteggiList
    //variabile di state per dialog
    const [isAddSectionOpen, setOpenSectionDialog] = useState<boolean>(false)
    const [selectedRequisito, setSelectedRequisito] = useState<any>();
    const [error, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    //Funzione che aggiunge un requisito master alla lista dei requisiti
    const addNewSection = () => {
        if (!selectedRequisito) {
            setIsError(true)
            setErrorMessage('Seleziona almeno un requisito da associare alla tipologia esperto')
            return
        }
        setIsError(false)
        //processo che aggiunge il master all array di oggetti per i requisiti
        const newSection: Requisito_Table = {
            fi_ee_req_id: selectedRequisito.id,
            fs_ee_req_desc: selectedRequisito.value,
            requisiti_list: []
        }
        setRequisitiPunteggi((prev: Requisito_Table[]) => [...prev, newSection])
        setOpenSectionDialog(false);
        //setto selectedRequisito ad undefined se no si creano errori
        setSelectedRequisito(undefined);
    }

    return (
        <>
            {requisitiPunteggi && TEspId ? (
                <>
                    <Box sx={{ marginBottom: '1rem' }} display={'flex'} width={'100%'} justifyContent={'flex-start'}>

                        <ActionButton text='Collega requisito' onClick={() => setOpenSectionDialog(true)} endIcon={<Icon>add</Icon>} color='secondary' />

                        <Dialog open={isAddSectionOpen} onClose={() => setOpenSectionDialog(false)}>
                            <Box display={'flex'} flexDirection={'column'} minHeight={'300px'} minWidth={'600px'} padding={'1rem 2rem'}  >

                                <Box flexGrow={1} marginBottom={'3rem'}>
                                    <Custom_Select2 placeholder='Scegli un Requisito...' isRequired label='Seleziona Requisito da aggiungere' error={error} onChangeSelect={(newValue) => setSelectedRequisito(newValue)} options={selectOptions} />
                                    {error && <Typography color={'error'}>{errorMessage}</Typography>}
                                </Box>
                                <Box display={'flex'} justifyContent={'flex-end'}>
                                    <ActionButton onClick={() => setOpenSectionDialog(false)} color='error' icon='cancel' sx={{ marginRight: '.5rem' }} />
                                    <ActionButton text='Aggiungi' color='secondary' onClick={addNewSection} />
                                </Box>

                            </Box>
                        </Dialog>

                    </Box>

                    <Box textAlign={'center'} padding={2}>
                        <Typography fontWeight={600} fontSize={20}>{requisitiPunteggi.length > 0 ? 'Punteggi collegati al Bando' : ''}</Typography>
                    </Box>

                    {requisitiPunteggi && requisitiPunteggi.length > 0 && requisitiPunteggi.map((item: Requisito_Table, index: any) =>
                        <Table_PunteggiBando data={item} key={`${item.fi_ee_req_id}-${index}`} setData={setRequisitiPunteggi} />
                    )}

                    {!data || data.length === 0 &&
                        <Typography>NESSUN PUNTEGGIO COLLEGATO ALLA TIPOLOGIA ESPERTO</Typography>
                    }
                </>
            ) : (
                <Typography fontSize={20} padding={5} textAlign={'center'}>Seleziona una tipologia esperto per iniziare</Typography>
            )}



        </>
    )
}
