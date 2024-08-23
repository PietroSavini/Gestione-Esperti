
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react'
import dayjs from 'dayjs';
import { Box, InputLabel, TextField, TextFieldProps, Typography } from '@mui/material';

type CustomProps = {
  disabled?: boolean;
  label?: string;
  error?: boolean
  errorMessage?: string;
  isRequired?: boolean;
  backgroundColor?:string;
}

export const Custom_DatePicker = (props: DatePickerProps<any> & CustomProps) => {


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
      <DatePicker
        className='datePicker'
        slots={{ textField: DatePickerTextfield }}
        disablePast
        {...props}
        sx={{
          "& .MuiInputBase-root": {
            maxHeight: '40px',
            outline: '0px',
            boxShadow: "0px 0px 2px grey",
            backgroundColor:`${props.disabled ?"#e0e0e0" : "#fff" }`,
            
          },
          "& fieldset": {
            border: 'none'
          },
          ...props.sx
          
          
          
        }}
        label={<LabelComponent label={props.label}  isRequired={props.isRequired ? props.isRequired : false}/>}
        />
    </LocalizationProvider>
  )
}

const DatePickerTextfield = React.forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => {
    return(
    <>
      
      <InputLabel 
        sx={{  color: '#127aa3ff', fontWeight: 600, fontSize: 14, marginBottom: .5 }}
      >
        {props.label}
      </InputLabel>
   
      <TextField
        {...props}
        label={null}
        ref={ref} 
      />
    </>
    )
  },
);

const LabelComponent = ({isRequired, label}: {isRequired:boolean, label:any}) => {
  console.log('label component')
  if(isRequired && label){
    console.log(' IL DATEPICKER è REQUIRED')
    return(
      <>
        {label}
        <Typography marginLeft={'.3rem'} component={'span'} color={'error'} fontWeight={600} fontSize={16}>*</Typography>
      </>
    )
  }else if(!isRequired && label){
    return(
      <>
        {label}
      </>
    )
  }else if(!label){
    return(
      <Box height={'20px'} ></Box>
    )
  }
}