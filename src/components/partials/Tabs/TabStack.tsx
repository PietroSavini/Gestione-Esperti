
import { Box, Divider, Stack, Typography } from "@mui/material";
import './TabStack.scss'

/*
* il componente va utilizzato in relazione con una variabile di stato che fa da controllo sulla tabella attiva 
* es: useState<number>(0)  => la tab all'indice 0 dell'array di oggetti di tipo Tab è attiva
*/

type Tab = {
    text: string;
}

export const TabStack = ({ tabs, setTab, activeTab }: { tabs: Tab[], setTab: React.Dispatch<React.SetStateAction<number>>, activeTab: number }) => {

    const handleTabClick = (tabKey: number) => {
        setTab(tabKey)
    }

    return (
        <Box position={'relative'} sx={{overflowX:'auto'}}>
            <Stack flexDirection={'row'} sx={{ padding: '0 1.5rem' }} className='tab-labels-container'>
                {tabs && tabs.map((tab, index) => (
                    <Box
                        key={index}
                        className={`tab-label ${activeTab === index ? 'active' : ''}`}
                        onClick={() => handleTabClick(index)} >
                        <Typography variant='body2' fontWeight={600}>{tab.text}</Typography>
                    </Box>
                ))}
            </Stack>
            <Divider absolute sx={{ bottom: '0', backgroundColor: '#52A5CF', height: '2px' }} />
        </Box>
    )
}

