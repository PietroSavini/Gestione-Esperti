import { FormControl, FormHelperText, InputBase, InputBaseProps, InputLabel } from "@mui/material";
import { forwardRef, } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
    disabled?:boolean;
    label:string;
    error?:boolean
    errorMessage?:string;
} & InputBaseProps & { register?: UseFormRegisterReturn };

export const Custom_TextField =  forwardRef<HTMLInputElement, Props>((props,ref)=> {

    const {disabled,label,error,errorMessage,value, readOnly ,...rest } = props;
   

    return(  

        <FormControl  className={`${disabled || readOnly ? 'ms_input-disabled':''}`}  error={error} disabled={disabled} fullWidth sx={{marginBottom:'.5rem', paddingTop:'2rem'}}>
         <InputLabel 
            shrink 
            sx={{ top:'15px', left:'-15px', color:'#127aa3ff', fontWeight:600, fontSize:'1.2rem'}}  
            htmlFor="my-input">
                {label}
            </InputLabel>

         <InputBase 
            ref={ref}
           
            sx={{ padding:'.5rem 1rem', borderRadius:'15px', boxShadow:'0px 0px 3px grey'}} 
            aria-describedby={`my-helper-text-${props.register ? props.register.name : label}`}
            {...rest}
        />

        {   error &&
            <FormHelperText 
                id={`my-helper-text-${props.register ? props.register.name : label}`}
            >
                {errorMessage}
            </FormHelperText>
        }

        </FormControl>
    )
});