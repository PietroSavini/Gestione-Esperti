import { Box, Typography, Icon } from '@mui/material'
import { Link } from 'react-router-dom'
import './rows.scss'
type Props ={ 
    to:string;
    text?:string;
    icon?:string;
}

export const ActionButton = (props:Props) => {
    const {to,text,icon} = props
  return (
    <>
    <Link to={to}>
        <Box sx={{padding:'5px 10px 5px 15px'}} className='row-action' display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography>{text}</Typography>
            <Icon>{icon}</Icon>
        </Box>
    </Link>
    </>
  )
}
