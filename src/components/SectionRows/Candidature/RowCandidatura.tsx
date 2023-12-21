import { Box, Stack, Icon, Typography } from '@mui/material'
import { ActionButton } from '../../partials/Buttons/ActionButton'
import './RowCandidatura.scss'
import { Settings } from '../settingsType'

type Props ={
  data:{
    id: number;
    role:string;
    name:string;
    points: string | number
    icon?:string;
    img?:string ;

  }
  settings?:Settings
}

export const RowCandidatura = (props:Props) => {
  const {id,name,role,points} = props.data;
  const settings = props.settings;

  return (
    <Box className='section-row' display='flex' >
    <Stack alignItems={'center'} direction={'row'} width={'70%'} >
      <Box display={'flex'} alignItems={'center'} className='Bando-img' sx={{marginRight:'.5rem'}}>
        {props.data.img && <img /> }
        {!props.data.img  && <Icon>{props.data?.icon}</Icon>}
      </Box>
      <Typography variant='body2' fontSize={settings?.fontSize} color={settings?.fontColor}>{`${role} - ${name}`}</Typography>
    </Stack>
    <Stack alignItems={'center'} direction={'row'} width={'30%'} justifyContent={'flex-end'}>
        <Typography fontWeight={600} fontSize={'1.4rem'} className='points'>{points}</Typography>
        <ActionButton to={`/Candidature/Candidatura-${id}`} text='vai' icon='chevron_right'/>
    </Stack>
  </Box>
  )
}
