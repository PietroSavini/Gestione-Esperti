import { Accordion, AccordionDetails, AccordionSummary, Icon, Typography } from '@mui/material'

import{ DataTable }from './DataTable'
import { useEffect, useState } from 'react'

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
    const [expanded,setExpanded] = useState<boolean[]>([true,false])

    const handleChange = (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      const newExpanded = [...expanded];
      newExpanded[panel] = isExpanded;
      setExpanded(newExpanded);
    };
  
  return (
    <>
      <Accordion expanded={expanded[0]} onChange={handleChange(0)}>
        <AccordionSummary expandIcon={<Icon>chevron_right</Icon>}>
          <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie di Sistema </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataTable data={data} />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded[1]} onChange={handleChange(1)}>
        <AccordionSummary expandIcon={<Icon>chevron_right</Icon>}>
          <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie di Sistema </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>ma piac a fess</div>
        </AccordionDetails>
      </Accordion>
     
    </>
  )
}
