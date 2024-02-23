import { Box,  Grid, Icon, Paper, Typography } from '@mui/material'
import { FormStepProps } from './FormStep1';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useEffect, useState } from 'react';
import { Rotate90DegreesCcw } from '@mui/icons-material';


type Tview = {
    value: string | number;
    label: string;
    children?: Tview[];
}

const data: Tview[] = [
    {
        value:'0',
        label:'elemento 1',
        children:[
            {
                value:'0.1',
                label:'elemento 1.1',
                
            },

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
                                label:'elemento 0.2.1.1'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    {
        value:'1',
        label:'elemento 2',
    }
]



export const FormStep3 = (props: FormStepProps) => {
    const { register, errors, className } = props;
    
    const [selectedTreeViewItem, setSelectedTreeViewItem] = useState<Tview | null>(null)
    const selctTreeViewItem = (selectedItem:any) => {
        setSelectedTreeViewItem(selectedItem)
    }
    
    //Componente che renderizza la struttura ad albero
        const renderTreeItems = (nodes: Tview):JSX.Element => {
            const isSelected = selectedTreeViewItem?.value === nodes.value;
            if(nodes.children &&  Array.isArray(nodes.children) && nodes.children.length > 0){
                return(
                    <TreeItem 
                    key={nodes.value} 
                    onClick={() => setSelectedTreeViewItem(nodes)} 
                    nodeId={`element-${nodes.value}`} 
                    label={ 
                    <Typography variant="body1" style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                        {isSelected && <Icon style={{ marginLeft: '4px' }}>check</Icon>}
                        {nodes.label}
                    </Typography>
                    }> 
                        { nodes.children.map((node) => renderTreeItems(node))} 
                    </TreeItem>
                )
            }else{
                return(
                    <TreeItem  
                        onClick={()=>setSelectedTreeViewItem(nodes)} 
                        nodeId={`element-${nodes.value}`} 
                        label={
                            <Typography variant="body1" style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                                {isSelected && <Icon style={{ marginLeft: '4px' }}>check</Icon>}
                                {nodes.label}
                            </Typography>
                    }>

                    </TreeItem>       
                )
            }
        }

    useEffect(() => {
        console.log('elelemnto selezionato: ',selectedTreeViewItem)
    },[selectedTreeViewItem]);
    
    return (
        <>
            <Paper className={className} sx={{ padding: '1rem 1rem', marginBottom: '1rem' }} elevation={2}>
                <Typography sx={{ paddingBottom: '1rem' }} component={'h6'} variant='h6'>Collega ad un archivio</Typography>
                {/* da scorporare in componente esterno da fare dinamico ed a <Dialog/> */}
                {/* treeView folders */}
                <Box sx={{backgroundColor:'aliceblue', border:'1px solid black'}}>

                    {data.map((item:Tview)=> (
                        <TreeView 
                            aria-labelledby='treeView-title'
                            defaultCollapseIcon={<Icon sx={{}}>expand_more</Icon>}
                            defaultExpandIcon={<Icon>chevron_right</Icon>}
                        >
                            {renderTreeItems(item)}
                        </TreeView>
                    ))}            
                </Box>
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
