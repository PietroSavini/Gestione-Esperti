import { Box, Icon, Stack, Typography } from '@mui/material';
import './RowBando.scss'
import '../rows.scss'
import { Settings } from '../settingsType';
import { DateBando } from './DateBando';
import { ActionButton } from '../../partials/Buttons/ActionButton';


type Props ={
  data:{
    id: number;
    expirationDate: string;
    role:string;
    icon?:string;
    img?:string ;

  }
  settings?:Settings
}



export const RowBando = (props:Props ) => {
  const {id,expirationDate,role} = props.data;
  const settings = props.settings;

  
  return (
    <Box className='section-row' display='flex' >
      <Stack alignItems={'center'} direction={'row'} width={'50%'} >
        <Box display={'flex'} alignItems={'center'} className='Bando-img' sx={{marginRight:'.5rem'}}>
          {props.data.img && <img /> }
          {!props.data.img  && <Icon>{props.data?.icon}</Icon>}
        </Box>
        <Typography variant='body2' fontSize={settings?.fontSize} color={settings?.fontColor}>{role}</Typography>
      </Stack>
      <Stack alignItems={'center'} direction={'row'} width={'50%'} justifyContent={'flex-end'}>
          <DateBando date={expirationDate}/>
          <ActionButton to={`/Bandi/Bando-${id}`} text='vai' icon='chevron_right'/>
      </Stack>
    </Box>
  )
}