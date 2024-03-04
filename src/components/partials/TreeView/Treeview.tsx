import { Box, Icon, SvgIcon, SvgIconProps, Typography } from '@mui/material';
import React from 'react'
import { OpenFolderSvg } from '../svg/OpenFolderSvg';
import { CloseFolderSvg } from '../svg/CloseFolderSvg';
import { TreeItem, TreeItemContentProps, TreeItemProps, useTreeItem } from '@mui/x-tree-view/TreeItem';
import clsx from 'clsx';
import { TreeView } from '@mui/x-tree-view/TreeView';
import './treeView.scss'
export type Tview = {
    value: string ;
    label: string;
    children?: Tview[];
}

type Props = {
    data:Tview[];
    setTreeItem:React.Dispatch<React.SetStateAction<Tview| null>>;
    selectedTreeItem:Tview | null;
}

export const CustomTreeview = (props:Props) => {
    const {data, setTreeItem, selectedTreeItem} = props;

    //Icona cartella 
    function FolderIcon ( ) {
        return(
            <Box sx={{marginLeft:'23px'}}>
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
    // componente custom che renderizza il treeItem MUI con comportamento personalizzato
    const CustomContent = React.forwardRef(function CustomContent(
        props: TreeItemContentProps,
        ref,
      ) {
        const {
          classes,
          className,
          label,
          nodeId,
          icon: iconProp,
          expansionIcon,
          displayIcon,
        } = props;
      
        const {
          disabled,
          expanded,
          selected,
          focused,
          handleExpansion,
          handleSelection,
          preventSelection
        } = useTreeItem(nodeId);
      
        const icon = iconProp || expansionIcon || displayIcon;
      
        const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            preventSelection(event);
        };
      
        const handleExpansionClick = (
          event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        ) => {
          handleExpansion(event);
        };
      
        const handleSelectionClick = (
          event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        ) => {
          handleSelection(event);
        };
      
        return (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className={clsx(className, classes.root, {
              [classes.expanded]: expanded,
              [classes.selected]: selected,
              [classes.focused]: focused,
              [classes.disabled]: disabled,
            })}
            onMouseDown={handleMouseDown}
            ref={ref as React.Ref<HTMLDivElement>}
          >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={handleExpansionClick} className={classes.iconContainer}>
              {icon}
            </div>
            <Typography
              onClick={handleSelectionClick}
              component="div"
              className={classes.label}
            >
              {label}
            </Typography>
          </div>
        );
    });

    const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: TreeItemProps,
    ref: React.Ref<HTMLLIElement>,
    ) {
    return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
    });
      
    //funzione ricorsiva che restituisce l'oggetto Tview alla selezione del treeItem
    function findNodeById(nodes: Tview[], id: string | number): Tview | null {
        let foundNode: Tview | null = null;
    
        nodes.forEach(node => {
            if (node.value === id) {
                foundNode = node; // Se l'ID corrisponde, assegna il nodo trovato
            } else if (node.children) {
                const childNode = findNodeById(node.children, id); // Cerca ricorsivamente nei figli
                if (childNode) {
                    foundNode = childNode; // Se trovato nei figli, assegna il nodo trovato
                }
            }
        });

        return foundNode;
    }
    
    //Componente che renderizza la struttura ad albero da cambiare con componente personalizzato per via del comportamento da applicare
        const renderTreeItems = (nodes: Tview, depth:number = 1, bgColor:string = '#ffff', border:string = 'none'):JSX.Element => {
            const nodeId = nodes.value

            const isSelected = selectedTreeItem? selectedTreeItem.value === nodes.value : null;
            if(nodes.children &&  Array.isArray(nodes.children) && nodes.children.length > 0){
                return(
                    <CustomTreeItem 

                        collapseIcon={<CollapseIcon />}
                        expandIcon={<ExpandIcon />}
                        className='treeItem'
                        sx={{display:'flex',alignItems:'center',position:'relative',zIndex:depth ,width:'100%',borderLeft:border, backgroundColor:bgColor  }}
                        key={nodes.label} 
                        nodeId={nodeId} 
                        label={ 
                            <Typography fontWeight={600} fontSize={'.9rem'} sx={{marginLeft:'0px'}} alignItems={'center'}  display={'flex'} height={'60px'} variant="body1"  >
                                {isSelected ? <Icon sx={{ marginRight: '4px', color:'green' }}>check_circle_outline</Icon> : <Icon  sx={{ marginRight: '4px', color:'#a6a6a6ff' }}>radio_button_unchecked</Icon>}
                                {nodes.label}
                                 <Typography component={'span'} fontWeight={600} fontSize={'.9rem'} sx={{marginLeft:'5px'}}>({nodes.children.length})</Typography>
                            </Typography>
                    }> 
                        { nodes.children.map((node) => renderTreeItems(node, depth + 1, `rgba(${ 80 - depth * 3}, ${130 + depth * 3}, ${180 + depth * 3}, ${0.1 + 0 * depth})`, '3px solid #426389'))} 
                    </CustomTreeItem>
                )
            }else{
                return(
                    <CustomTreeItem  
                        icon={<FolderIcon/>}
                        key={nodes.label}
                        className='treeItem'
                        sx={{display:'flex',alignItems:'center', position:'relative',zIndex:depth ,width:'100%',borderLeft:border, backgroundColor:bgColor }}
                        
                        nodeId={nodeId} 
                        label={
                            <Typography fontWeight={600} fontSize={'.9rem'} sx={{marginLeft:'0px'}} alignItems={'center'}  display={'flex'} height={'60px'} variant="body1" >
                                {isSelected ? <Icon sx={{ marginRight: '4px', color:'green' }}>check_circle_outline</Icon> : <Icon sx={{ marginRight: '4px', color:'#a6a6a6ff' }}>radio_button_unchecked</Icon>}
                                {nodes.label}
                            </Typography>}
                    >
                    </CustomTreeItem>       
                )
            }
        }
        return(
            <>
                {data.map((item:Tview)=> (
                    <TreeView 
                        onNodeSelect={(event, nodeIds)=> {
                            const selectedNode = findNodeById(data, nodeIds);
                            setTreeItem(selectedNode);
                           
                        }}
                        sx={{marginBottom:'-px', width:'100%'}}
                        aria-labelledby='treeView-title'
                    >
                        {renderTreeItems(item)}
                    </TreeView>
                ))}            
            </>
        )
}
