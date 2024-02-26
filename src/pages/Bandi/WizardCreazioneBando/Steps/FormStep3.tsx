import { Box,  Grid, Icon, Paper, SvgIcon, SvgIconProps, Typography } from '@mui/material'
import { FormStepProps } from './FormStep1';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useEffect, useState } from 'react';
import { Rotate90DegreesCcw } from '@mui/icons-material';
import { OpenFolderSvg } from '../../../../components/partials/svg/OpenFolderSvg';
import { CloseFolderSvg } from '../../../../components/partials/svg/CloseFolderSvg';


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
    //Icona cartella 
    function FolderIcon ( ) {
        return(
            <Box sx={{marginLeft:'50px'}}>
                <OpenFolderSvg/>
            </Box>
        )
    }
    //svg segno -
    function CollapseIcon(props: SvgIconProps) {
        return (
            <Box width={'10%'} display={'flex'} gap={'.5rem'} alignItems={'center'}>
                <SvgIcon sx={{marginBottom:'-.4rem'}} fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
                    {/* tslint:disable-next-line: max-line-length */}
                    <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
                </SvgIcon>
                <CloseFolderSvg/>
            </Box>
        );
    }
    //svg segno +
    function ExpandIcon(props: SvgIconProps) {
        return (
            <Box width={'10%'} display={'flex'} gap={'.5rem'} alignItems={'center'}>
                <SvgIcon sx={{marginBottom:'-.4rem'}} fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
                    {/* tslint:disable-next-line: max-line-length */}
                    <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
                </SvgIcon>
                <OpenFolderSvg/>

            </Box>
        );
    }

    //Componente che renderizza la struttura ad albero
        const renderTreeItems = (nodes: Tview, depth:number = 1, bgColor:string = '#ffff', border:string = 'none'):JSX.Element => {
            const isSelected = selectedTreeViewItem?.value === nodes.value;
            if(nodes.children &&  Array.isArray(nodes.children) && nodes.children.length > 0){
                return(
                    <TreeItem 
                      
                        collapseIcon={<CollapseIcon/>}
                        expandIcon={<ExpandIcon/>}
                        className='treeItem'
                        sx={{display:'flex',alignItems:'center',position:'relative',zIndex:depth ,width:'100%',borderLeft:border, backgroundColor:bgColor, borderBottomRightRadius:'10px', borderTopRightRadius:'10px',  }}
                        key={nodes.label} 
                        onClick={() => setSelectedTreeViewItem(nodes)} 
                        nodeId={`element-${nodes.value}`} 
                        label={ 
                            <Typography sx={{marginLeft:'60px'}} alignItems={'center'}  display={'flex'} height={'60px'} variant="body1"  >
                                {isSelected && <Icon style={{ marginLeft: '4px' }}>check</Icon>}
                                {nodes.label}
                            </Typography>
                    }> 
                        { nodes.children.map((node) => renderTreeItems(node, depth + 1, `rgba(${ 180 - depth * 3}, ${160 + depth * 3}, ${255 + depth * 3}, ${0.1 + 0 * depth})`, '3px solid #426389'))} 
                    </TreeItem>
                )
            }else{
                return(
                    <TreeItem  
                        icon={<FolderIcon/>}
                        key={nodes.label}
                        className='treeItem'
                        sx={{display:'flex',alignItems:'center', position:'relative',zIndex:depth ,width:'100%',borderLeft:border, backgroundColor:bgColor, borderBottomRightRadius:'10px', borderTopRightRadius:'10px' }}
                        onClick={()=>setSelectedTreeViewItem(nodes)} 
                        nodeId={`element-${nodes.value}`} 
                        label={
                            <Typography sx={{marginLeft:'40px'}} alignItems={'center'}  display={'flex'} height={'60px'} variant="body1" >
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
            
                    {data.map((item:Tview)=> (
                        <TreeView 
                            sx={{marginBottom:'-px', width:'100%'}}
                            aria-labelledby='treeView-title'
                
                          
                        >
                            {renderTreeItems(item)}
                        </TreeView>
                    ))}            
              
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
