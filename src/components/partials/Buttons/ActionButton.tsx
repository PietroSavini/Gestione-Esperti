import { Box, Typography, Icon, Button, ButtonProps } from '@mui/material'
import { Link } from 'react-router-dom'

type Props = ButtonProps & { 
    to?:string;
    text?:string;
    icon?:string;
    direction?:any;
    iconComponent?: React.ReactElement<any>;
    onClick? : React.MouseEventHandler<HTMLButtonElement>;
 
}

export const ActionButton = (props:Props) => {
    const {to,text,icon,direction,onClick,color, ...buttonProps } = props
    const IconComponent:React.ReactElement<any> | undefined = props.iconComponent

    const sx = buttonProps?.sx;
  return (
    <>
      {to ? (
        <Link to={to}>
          <Box  flexDirection={direction ? direction : 'row'} sx={{borderRadius:'10px', ...sx}} className={`ms_button ms_button-${color}`} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            { text && <Typography  className='button-text' variant='caption'>{text}</Typography>}
            { icon &&  <Icon fontSize='small' className='button-icon'>{icon}</Icon>}
            { IconComponent && IconComponent }
          </Box>
        </Link>
      ) : (
        
        <Button 
          
          {...buttonProps}
          //@ts-ignore
          sx={{ ...buttonProps?.sx, flexDirection:`${direction}`}} 
          onClick={onClick}  
          className={`ms_button ms_button-${color} ${buttonProps.disabled && 'ms_button-disabled'}`}
        >
          { text && <Typography  className='button-text' variant='caption'>{text}</Typography>}
          { icon &&  <Icon fontSize='small' className='button-icon'>{icon}</Icon>}
          { IconComponent && IconComponent }
        </Button>
      )}
  
    </>
  )
}
