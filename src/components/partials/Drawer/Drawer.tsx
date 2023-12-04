import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Icon, ListItemIcon, ListSubheader, SvgIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import './Drawer.scss'

type Items = Item[];
type Props = { props: Section[] };
type Item = {
    text: string;
    method: string;
    baseUrl?: string;
    image?: string;
    icon?: string;
    color?: string;
    subItems?: Items
};
type Section = {
    title?: string;
    items: Items;
    bgColor?: string;
    titleColor?: string;
    color?: string;
};

const drawerWidth = 240;

function ResponsiveDrawer(props: Props) {
    const list = props.props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {

        setMobileOpen(!mobileOpen);
        console.log(mobileOpen)
    };

    const renderSubItem = (subItem: Item) => (
        <Link to={subItem.method} key={subItem.text}>
            <ListItemButton className='nested-element' key={subItem.text} >
                <>
                    <div className='nested'>

                        <ListItemIcon>
                            {subItem.image ? (
                                <SvgIcon>
                                    <path d={subItem.image} />
                                </SvgIcon>
                            ) : (
                                subItem.icon ?
                                    <Icon>{subItem.icon}</Icon> : <Icon></Icon>
                            )}
                        </ListItemIcon>
                    </div>
                    <ListItemText color={subItem.color} primary={subItem.text} />
                </>
            </ListItemButton>
        </Link>
    )

    const renderListItem = (item: Item, index: number) => (
        <>
            <Link to={item.method} key={`${item.text}-${index}`}>
                <ListItemButton key={item.text}>
                    <>
                        <ListItemIcon >
                            {item.image ? (
                                <SvgIcon>
                                    <path d={item.image} />
                                </SvgIcon>
                            ) : (
                                item.icon ?
                                    <Icon>{item.icon}</Icon> : <Icon></Icon>
                            )}
                        </ListItemIcon>

                        <ListItemText color={item.color} primary={item.text} />
                    </>
                </ListItemButton>
            </Link>
            {item.subItems?.length !== 0 && item.subItems?.map(renderSubItem)}
        </>
    )

    const renderSection = (section: Section, index: number) => (
        <List
            key={`${section.title}-${index}`}
            sx={{ backgroundColor: section.bgColor, color: section.color }}
            subheader={<ListSubheader sx={{ color: section.titleColor }}>{section.title}</ListSubheader>}
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
            {!!list && list.map((section, index) => renderSection(section, index))}
        </>
    );

    return (
        <>
            <Box
                className='sidebar-toggler'
            >

            </Box>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="Sidebar"
                onClick={() => handleDrawerToggle()}
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {nav}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {nav}
                </Drawer>
            </Box>
        </>
    );
}

export default ResponsiveDrawer