import { Box, Typography, Icon, Button, ButtonProps } from '@mui/material'
import { Link } from 'react-router-dom'

type Props = ButtonProps & { 
    to?:string;
    text?:string;
    icon?:string;
    direction?:any;
    onClick? : React.MouseEventHandler<HTMLButtonElement>
 
}



export const ActionButton = (props:Props) => {
    const {to,text,icon,direction,onClick,color, ...buttonProps} = props
    const sx = buttonProps?.sx;
    console.log(sx)
  return (
    <>
      <Box maxWidth={'400px'}  >
        {to ? (
          <Link to={to}>
            <Box  flexDirection={direction ? direction : 'row'} sx={{borderRadius:'10px', ...sx}} className={`ms_button ms_button-${color}`} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <Typography className='button-text' variant='caption' >{text}</Typography>
                  <Icon fontSize='small' className='button-icon'>{icon}</Icon>
            </Box>
          </Link>
        ) : (
          
          <Button 
            {...buttonProps}
            //@ts-ignore
            sx={{ ...buttonProps?.sx, flexDirection:`${direction}`}} 
            onClick={onClick} color={color}  
            className={`ms_button ms_button-${color} ${buttonProps.disabled && 'ms_button-disabled'}`} >
            <Typography  className='button-text' variant='caption'>{text}</Typography>  
            <Icon fontSize='small' className='button-icon'>{icon}</Icon>
          </Button>
        )}
      </Box>
    </>
  )
}
