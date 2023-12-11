import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Collapse, Icon, ListItemIcon, ListSubheader, SvgIcon } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { DrawerData, Item, Section, Variant } from './DrawerTypes';

import './Drawer.scss'



function ResponsiveDrawer({ data }: { data: DrawerData }) {

    const list = data.sections;
    const position = data.settings.position;
    const location = useLocation();
    let sidebarInitialState: boolean = data.settings.isOpen
    let variant: Variant = 'permanent';
    let drawerWidth = data.settings.width;
    let sidebarButtonClass;
    let shrinkedClass = 'shrinked';
    let sidebarClass = 'sidebar';
    if (position === 'top' || position === 'bottom') {
        drawerWidth = 'auto';
        variant = 'temporary';
        sidebarButtonClass = position;
        shrinkedClass= '';
        console.log(sidebarInitialState)
        if (sidebarInitialState) {
            sidebarInitialState = !sidebarInitialState
        }

    } else if (position === 'right') {
        sidebarClass = 'sidebar-right'
        shrinkedClass = 'shrinked-right'
    }

    const [isOpen, setOpen] = React.useState(sidebarInitialState);
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

    const handleDrawerToggle = () => {
        //chiudo tutti i menu a tendina quando chiudo la sidebar
        setExpandedItems({})
        setOpen(!isOpen);
    };

    const handleSubmenuToggle = (item: string) => {
        //questo ci permette di aprire la sidebar se si clicca su un menù a tendina
        if (!isOpen) setOpen(true)
        setExpandedItems((prevExpandedItems) => ({
            ...prevExpandedItems,
            [item]: !prevExpandedItems[item],
        }));
    };

    const listItemToggle = () => {
        const behavior = data.settings.isOpen;
        if (!behavior || variant === 'temporary') {
            setExpandedItems({})
            setOpen(false)
        }
    }

    const renderStandardListItem = (item: Item, index: number) => {
        const to = item.method ? item.method : '';
        const isActive = location.pathname === to;
        return (
            <>
                <Link to={to} key={`${item.text}-${index}`}>
                    <ListItemButton key={item.text} className={isActive ? 'selected' : ''} selected={isActive} onClick={() => listItemToggle()}>
                        <>
                            <ListItemIcon>
                                {item.image ? (
                                    <SvgIcon>
                                        <path d={item.image} />
                                    </SvgIcon>
                                ) : (
                                    item.icon ? <Icon>{item.icon}</Icon> : <Icon></Icon>
                                )}
                            </ListItemIcon>

                            <ListItemText disableTypography sx={{ fontSize: data.settings?.fontSize, color: item.color }} primary={item.text} />
                        </>
                    </ListItemButton>
                </Link>
            </>
        )
    }

    const renderMenuListItem = (item: Item, index: number) => {
        const menuItem = `${item.text}-${index}`;
        return (

            <>
                <ListItemButton key={menuItem} onClick={() => handleSubmenuToggle(menuItem)}>
                    <>
                        <ListItemIcon>
                            {item.image ? (
                                <SvgIcon>
                                    <path d={item.image} />
                                </SvgIcon>
                            ) : (
                                item.icon ? <Icon>{item.icon}</Icon> : <Icon></Icon>
                            )}
                        </ListItemIcon>

                        <ListItemText disableTypography sx={{ fontSize: data.settings?.fontSize, color: item.color }} primary={item.text} />
                        {expandedItems[menuItem] ? <ExpandLess /> : <ExpandMore />}
                    </>
                </ListItemButton>
                <Collapse in={expandedItems[menuItem]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.subItems?.map((subItem, subIndex) => {
                            const to = subItem.method ? subItem.method : '';
                            const isActive = location.pathname === to;
                            return (
                                <Link to={to} key={subIndex}>
                                    <ListItemButton selected={isActive} className={isActive ? 'selected' : ''} sx={{ pl: 4 }} key={subIndex} onClick={() => listItemToggle()}>
                                        <ListItemIcon>
                                            {subItem.image ? (
                                                <SvgIcon>
                                                    <path d={subItem.image} />
                                                </SvgIcon>
                                            ) : (
                                                subItem.icon ? <Icon>{subItem.icon}</Icon> : <Icon></Icon>
                                            )}
                                        </ListItemIcon>
                                        <ListItemText disableTypography sx={{ fontSize: data.settings?.fontSize, color: subItem.color }} primary={subItem.text} />
                                    </ListItemButton>
                                </Link>
                            )
                        })}
                    </List>
                </Collapse>
            </>
        )
    }



    const renderListItem = (item: Item, index: number) => {

        if (item.subItems && item.subItems.length !== 0) {
            return (
                renderMenuListItem(item, index)
            )
        }
        return (
            renderStandardListItem(item, index)
        )
    }

    const renderSection = (section: Section, index: number) => (

        <List
            key={`${section.title}-${index}`}
            sx={{ backgroundColor: section.bgColor, color: section.color }}
            subheader={<ListSubheader sx={{ color: section.titleColor, fontSize: section.fontSize }}>{section.title}</ListSubheader>}
        >
            {section.items.map((item, index) => (
                <React.Fragment key={index}>
                    {renderListItem(item, index)}
                </React.Fragment>
            ))}
            <Divider />
        </List>
    )

    const nav = (
        <>
            <div className="sidebar-button">
                <Box
                    className={`sidebar-toggler ${variant === "temporary" ? 'temporary-sidebar-toggler' : ''} ${variant === 'temporary' && position === 'top' ? 'temporary-sidebar-toggler-top' : ''} ${variant === 'temporary' && position === 'bottom' ? 'temporary-sidebar-toggler-bottom' : ''} `}
                    onClick={() => handleDrawerToggle()}
                >
                    <ArrowForwardIosIcon className={`${position === 'top' ? 'toggler-top' : ''} ${position === 'bottom' ? 'toggler-bottom' : ''}`} />
                </Box>
            </div>
            {!!list && list.map((section: Section, index: number) => renderSection(section, index))}
        </>
    );

    return (
        <>
            {variant === 'temporary' &&
                <Box onClick={() => setOpen(!isOpen)} component='div' className={`sidebar-extender sidebar-extender-${sidebarButtonClass}`}>
                    <Box component='div' className='sidebar-preview'>
                        <Box component='div' className='sidebar-extender-button'><ArrowForwardIosIcon className='sidebar-extender-button-icon' /></Box>
                    </Box>
                </Box>
            }

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, position: 'relative' }}
                aria-label="Sidebar"
                className={`${!isOpen ? shrinkedClass : ''} ${sidebarClass}`}
            >
                {/* da implementare un altro drawer chiamato dinamicamente quando position === top/bottom quello utilizzato per right e left non va bene */}
                <Drawer
                    anchor={position}
                    variant={variant}
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open={isOpen}
                >
                    {nav}
                </Drawer>

            </Box>
        </>
    );
}

export default ResponsiveDrawer