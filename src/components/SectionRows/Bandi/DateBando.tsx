import { Typography } from '@mui/material'
import React from 'react'

type Props = {
    date: string
}

export const DateBando = (props:Props) => {
    const {date} = props
    


// Funzione di parsing personalizzata
  const parseCustomDate = (inputDate: string) => {
    const parts = inputDate.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map((part) => parseInt(part, 10));
      return new Date(year, month - 1, day); // Sottraggo 1 dal mese perché JavaScript conta i mesi da 0 a 11
    }
    return null; // Restituisce null in caso di formato non valido
  };

  const parsedDate = parseCustomDate(date);

  // Verifica se la data è valida
  if (parsedDate === null || isNaN(parsedDate.getTime())) {
    // situazione in cui la data non è nel formato corretto
    return <Typography style={{ color: 'red' }}>Data non valida</Typography>;
  }

  const currentDate = new Date();

  // Calcolo la data tra un mese
  const oneMonthLater = new Date(currentDate);
  oneMonthLater.setMonth(currentDate.getMonth() + 1);

  // Verifico se la data è superata
  const isExpired = parsedDate < currentDate;

  // Verifico se la data è futura e a meno di un mese
  const isExpiringSoon = parsedDate > currentDate && parsedDate <= oneMonthLater;

  // Applico i colori in base alle condizioni
  const colorStyle = isExpired ? 'red' : isExpiringSoon ? 'orange' : 'inherit';

  return <Typography fontWeight={600} fontSize={'1.2rem'} style={{ color: colorStyle }}>{date}</Typography>;
    
}
