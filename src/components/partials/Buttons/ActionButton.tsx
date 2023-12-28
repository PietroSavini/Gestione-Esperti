import { Box, Typography, Icon, Stack } from '@mui/material'
import { Link } from 'react-router-dom'

type Props ={ 
    to?:string;
    text?:string;
    icon?:string;
    direction?:any
    onClick? : React.MouseEventHandler<HTMLDivElement>
}



export const ActionButton = (props:Props) => {
    const {to,text,icon,direction,onClick} = props

  return (
    <>
      <Box maxWidth={'400px'}  >
        {to ? (
          <Link to={to}>
            <Box flexDirection={direction ? direction : 'row'} className='ms_button' display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <Typography className='button-text' variant='caption' >{text}</Typography>
                  <Icon fontSize='small' className='button-icon'>{icon}</Icon>
            </Box>
          </Link>
        ) : (
          <Box onClick={onClick} flexDirection={direction ? direction : 'row'} className='ms_button' display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography className='button-text' variant='caption' >{text}</Typography>
            <Icon fontSize='small' className='button-icon'>{icon}</Icon>
          </Box>
        )}
      </Box>
    </>
  )
}
