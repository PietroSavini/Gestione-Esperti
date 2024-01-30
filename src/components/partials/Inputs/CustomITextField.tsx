import { FormControl, FormHelperText, InputBase, InputBaseProps, InputLabel } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
    disabled?:boolean;
    label:string;
    error?:boolean
    errorMessage?:string;
} & InputBaseProps & { register?: UseFormRegisterReturn };

export const Custom_TextField = (props:Props)=> {

    const {disabled,label,error,errorMessage, ...rest} = props;
    return(  
        <FormControl error={error} disabled={disabled} fullWidth sx={{marginBottom:'.5rem', paddingTop:'2rem'}}>
         <InputLabel 
            shrink 
            sx={{ top:'15px', left:'-15px', color:'#127aa3ff', fontWeight:600, fontSize:'1.2rem'}}  
            htmlFor="my-input">
                {label}
            </InputLabel>

         <InputBase 
            className={`${disabled ? 'ms_input-disabled':''}`} 
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
}