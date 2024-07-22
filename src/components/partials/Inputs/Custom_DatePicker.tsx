
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react'
import dayjs from 'dayjs';
import { TextField, TextFieldProps, Typography } from '@mui/material';


export const Custom_DatePicker = (props:DatePickerProps<any>) => {

    const today = dayjs();
    
    const Label = () => {
        return (
            <Typography sx={{backgroundColor:'green'}} fontSize={'1.3rem'}>{props.label}</Typography>
        )
    }

    const DatePickerTextfield =  React.forwardRef(
        (props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => (
          <TextField label={null} {...props} ref={ref}  />
        ),
      );
    
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
        <DatePicker
            label={null}
            className='datePicker'
            slots={{textField: DatePickerTextfield}}
            defaultValue={today}
            {...props}
            
        />

    </LocalizationProvider>
  )
}
