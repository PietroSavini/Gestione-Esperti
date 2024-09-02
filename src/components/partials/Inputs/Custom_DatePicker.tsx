
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react'
import { Box, InputLabel, TextField, TextFieldProps, Typography } from '@mui/material';
import './inputs.scss'

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

        slots={{ textField: DatePickerTextfield }}
        disablePast
        label={<LabelComponent label={props.label}  isRequired={props.isRequired ? props.isRequired : false}/>}
        {...props}
        
        sx={{
          width:'100%',
          marginBottom:'1rem',
          "& .MuiInputBase-root": {
            borderRadius:'10px',
            height: '38px',
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
            borderColor:'rgba(0,0,0,.2)',
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
      <InputLabel 
        sx={{  color: '#127aa3ff', fontWeight: 600, fontSize: 14, marginBottom: .7 }}
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
  }else if(!label){
    return(
      <Box height={'20px'} ></Box>
    )
  }
}