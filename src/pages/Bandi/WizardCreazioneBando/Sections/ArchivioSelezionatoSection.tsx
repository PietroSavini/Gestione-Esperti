import React, { useMemo, useState } from 'react'
import { Paper, Box, Typography, Icon, Dialog } from '@mui/material'
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField'
import { CustomTreeview, Tview } from '../../../../components/partials/TreeView/Treeview'
import { OpenFolderSvg } from '../../../../components/partials/svg/OpenFolderSvg'
import { convertTreeViewData } from '../../../../app/AXIOS_ENGINE/functions/handlers'
import { useWizardBandoContext } from '../WizardBandoContext'

export const ArchivioSelezionatoSection = ({ className }: { className: string }) => {

    //variabili di stato per treeView
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedTreeViewItem, setSelectedTreeViewItem] = useState<Tview | null>(null);
    const [archivioLabel, setArchivioLabel] = useState<string | undefined>(undefined);
    const setArchivio = useWizardBandoContext().archivi.setArchivioCollegato;
    //treeViewData
    const treeview = useWizardBandoContext().listeOrganizzaDocumento?.lista_archivi;
    // uso useMomo per memorizzare i dati della treview che non dovrebbero cambiare ad ogni rerendering
    const treeViewData = useMemo(() => convertTreeViewData(treeview as any[]), [treeview]);
    //funzione avviata al tasto 'Salva' contenuto nel modal della treeView
    function saveArchivio(param: Tview | null) {
        if(!param){
            setIsOpen(false);
            return
        }
        const archivioSelezionato = parseInt(param.value)
        console.log(archivioSelezionato)
        setArchivio(() => archivioSelezionato);
        setArchivioLabel(() => param ? param.label : undefined);
        setIsOpen(false);
    };
    //funzione che renderizza la lable dell' archivio collegato
    function displayArchivioLabel(str: string) {
        return (
            <>
                <Box marginTop={'1.5rem'} display={'flex'} alignItems={'center'} gap={1} paddingLeft={1}>
                    <OpenFolderSvg />
                    <Typography component={'span'} fontWeight={600} fontSize={'0.9rem'}>{str}</Typography>
                </Box>
            </>
        )
    };

    return (
        <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                <Typography component={'h6'} variant='h6'>Collega ad un archivio</Typography>
                <ActionButton color='secondary' onClick={() => setIsOpen(true)} text='Collega Archivio' iconComponent={<Icon sx={{ marginLeft: '10px' }}>folder_copy</Icon>} />
            </Box>
            {!archivioLabel ? <Typography marginTop={2} fontSize={'0.9rem'}>Nessun archivio collegato</Typography> : displayArchivioLabel(archivioLabel)}

            {/* treeView component */}
            <Dialog open={isOpen} fullScreen className='collega-ad-un-archivio-modal' onClose={() => setIsOpen(false)}  >
                <Paper elevation={0} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '1rem' }}>
                    <Box className={'dialog-header'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography fontWeight={600} component={'h6'} variant='h6'>Collega ad un archivio </Typography>
                        <Box marginTop={'-25px'} >
                            <Custom_TextField endAdornment={<Icon >search</Icon>} placeholder='Filtra per parola chiave' />
                        </Box>
                    </Box>
                    <Box flexGrow={1} sx={{ overflowY: 'auto' }}>
                        <CustomTreeview data={treeViewData} setTreeItem={setSelectedTreeViewItem} selectedTreeItem={selectedTreeViewItem} />
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'.5rem 1rem'}>
                        <ActionButton onClick={() => setIsOpen(false)} color='error' text='annulla' iconComponent={<Icon>cancel</Icon>} />
                        <ActionButton onClick={() => saveArchivio(selectedTreeViewItem)} color='secondary' text='Salva' iconComponent={<Icon>save</Icon>} />
                    </Box>
                </Paper>
            </Dialog>
        </Paper>
    )
}
