
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react'
import { InputLabel, TextField, TextFieldProps, Typography } from '@mui/material';
import './inputs.scss'
import { v4 as uuid } from 'uuid';

type CustomProps = {
  disabled?: boolean;
  label?: string;
  error?: boolean
  errorMessage?: string;
  isRequired?: boolean;
  backgroundColor?:string;
  heigth?:string;
  isClearable?: boolean
}
const id = uuid();

export const Custom_DatePicker = (props: DatePickerProps<any> & CustomProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
      <DatePicker
        slotProps={{ field: { clearable: props.isClearable ? props.isClearable : false } }}
        slots={{ textField: DatePickerTextfield }}
        label={  <LabelComponent label={props.label}  isRequired={props.isRequired ? props.isRequired : false}/>}
        {...props}
        
        sx={{
          width:'100%',
          marginBottom:'14px',
          "& .MuiInputBase-root": {
            borderRadius:'10px',
            height: `${props.heigth ? props.heigth : '38px'}`,
            outline: '0px',
            //boxShadow: "0px 0px 3px grey",
            minWidth:'100%',
            backgroundColor:`${props.disabled ?"#e0e0e0" : "#fff" }`,
            "& :hover":{
              "fieldset":{
                border:'none'
              }
            }
          },

          "& .MuiInputBase-input":{
            padding:0,
            height:'100%',
            paddingLeft:'.5rem',
            color:'black'
          },

          "& fieldset": {
            borderColor: props.error ? 'red':'rgba(0,0,0,.2)',
            borderWidth:'1px',
            borderStyle:'solid',
            boxShadow: "0px 0px 2px grey",
          },
          
          "& .MuiOutlinedInput-notchedOutline":{
            padding:'0'
          },
          ...props.sx
        }}
        
        />
    </LocalizationProvider>
  )
}

const DatePickerTextfield = React.forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => {
    return(
    <>
    {
      props.label && 
      <InputLabel 
        id={id}
        sx={{  color:'#127aa3ff', fontWeight: 600, fontSize: 12.6, marginBottom: '4.2px' }}
      >
        {props.label}
      </InputLabel>
    }
   
      <TextField
        {...props}
        label={null}
        aria-labelledby={props.label ? id : undefined}
        ref={ref}
      />
    </>
    )
  },
);

const LabelComponent = ({isRequired, label}: {isRequired:boolean, label:any}) => {

  if(isRequired && label){
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
  }
}