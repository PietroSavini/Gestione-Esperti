import { Box, Dialog, Icon, Paper, Typography } from '@mui/material'
import { FormStepProps } from './FormStep1';
import { useEffect, useState } from 'react';
import { CustomTreeview, Tview } from '../../../../components/partials/TreeView/Treeview';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { OpenFolderSvg } from '../../../../components/partials/svg/OpenFolderSvg';

const data: Tview[] = [
    {
        value:'0',
        label:'elemento 1',
        children:[
            {
                value:'0.2',
                label:'elemento 1.2',
                children:[
                    {
                        value:'0.2.1',
                        label:'elemento 1.2.1',
                        children:[
                            {
                                value:'0.2.1.1',
                                label:'elemento 1.2.1.1'
                            }
                        ]
                    }
                ]
            },
            {
                value:'0.1',
                label:'elemento 1.1',
                
            },

        ]
    },

    {
        value:'1',
        label:'elemento 2',
    }
]


export const FormStep3 = (props: FormStepProps) => {
    const { register, errors, className } = props;
    const [selectedTreeViewItem, setSelectedTreeViewItem] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [archivio, setArchivio] = useState<string | null>(null);

    useEffect(() => {
        console.log('elelemnto selezionato: ',selectedTreeViewItem);
    },[selectedTreeViewItem]);
    
    function FraseArchivio (param: string | null){
        return(
            <>
                <Box display={'flex'}>
                    {param}
                    <OpenFolderSvg/>
                </Box>
            </>
        )
    }
    //TODO: far arrivare a questa funzione tutto il Tview selezionato, scorporare lable(da visualizzare in UI) e value(da inviare a form => proveniente da wizardCrazioneBando.tsx)
    function saveArchivio(param: string | null){
        setArchivio(param)
        setIsOpen(false)
    }

    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Collega ad un archivio</Typography>
                    <ActionButton color='secondary' onClick={() => setIsOpen(true)} text='Collega ad un Archivio' iconComponent={<Icon sx={{marginLeft:'10px'}}>folder_copy</Icon>}/>
                </Box>
                <Typography fontSize={'.8rem'}>{!archivio ? 'Nessun archivio collegato': FraseArchivio(archivio)}</Typography>

                {/* da scorporare in componente esterno da fare dinamico ed a <Dialog/> */}
                {/* treeView component */}
                <Dialog open={isOpen} fullScreen className='collega-ad-un-archivio-modal' onClose={()=>setIsOpen(false)}  > 
                    <Paper elevation={0} sx={{width:'100%',  height:'100%', display:'flex', flexDirection:'column', paddingTop:'1rem'}}>
                        <Box className={'dialog-header'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                <Typography  fontWeight={600} component={'h6'} variant='h6'>Collega ad un archivio </Typography>
                                
                            <Box marginTop={'-25px'} >
                                <Custom_TextField endAdornment={<Icon >search</Icon>} placeholder='Filtra per parola chiave' />
                            </Box>
                        </Box>
                        <Box flexGrow={1} sx={{overflowY:'auto'}}>
                         <CustomTreeview data={data} setTreeItem={setSelectedTreeViewItem} selectedTreeItem={selectedTreeViewItem} />
                        </Box>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'.5rem 1rem'}>
                            <ActionButton onClick={() => setIsOpen(false)} color='error' text='annulla' iconComponent={<Icon>cancel</Icon>}/>
                            <ActionButton onClick={()=> saveArchivio(selectedTreeViewItem)} color='secondary' text='Salva' iconComponent={<Icon>save</Icon>}/>
                        </Box>
                    </Paper>
                </Dialog>
                
              
            </Paper>
        
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Fascicoli elettronici collegati</Typography>
            </Paper>

            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem', }} elevation={2}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography sx={{}} component={'h6'} variant='h6'>Collega altri documenti</Typography>
                </Box>
            </Paper>
        </>
    )
}
