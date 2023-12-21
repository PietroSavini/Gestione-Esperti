import { Typography } from '@mui/material'

import{ DataTable }from './DataTable'
import { useEffect } from 'react'

export type Data = {
    data:Row[]
}

 export type Row = {
    id:number;
    title:string,
    description:string;
    visible:boolean;
}

export const TipologiaEsperto = ({data}:Data) => {
    

    
    
  return (
    <>
        <Typography marginBottom={'1rem'} variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie di Sistema </Typography>
        <DataTable data={data} />
     
    </>
  )
}
