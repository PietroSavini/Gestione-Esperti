import { Box, FormControl, FormHelperText, InputBase, InputBaseProps, InputLabel, TextFieldProps, Typography } from "@mui/material";
import { forwardRef, } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

type Props = {
    disabled?: boolean;
    label?: string;
    error?: boolean
    errorMessage?: string;
    isRequired?: boolean;
    backgroundColor?:string;
} & InputBaseProps & { register?: UseFormRegisterReturn } & TextFieldProps;

export const Custom_TextField = forwardRef<HTMLInputElement, Props>((props, ref) => {

    const { disabled, label, error, errorMessage, value, readOnly, id, isRequired, sx, backgroundColor, ...rest } = props;
    const finalId = id ? id : uuidv4();

    return (

        <FormControl className={`${disabled || readOnly ? 'ms_input-disabled' : ''}`} error={error} disabled={disabled} fullWidth sx={{ marginBottom: '1rem', paddingTop:`${label ? '1.7rem' : 0}`, position: 'relative', ...sx }}>
            {/* messo per prevenire la selezione dell'input in caso in cui disabilitato o in readOnly */}
            {disabled || readOnly && <Box position={'absolute'} sx={{ top: '25px', right: '-5px', left: '-5px', bottom: '-5px', zIndex: '2' }}></Box>}
            {label && 
                <InputLabel
                    shrink
                    sx={{ zIndex: 0, top: '12px', left: '-15px', color: '#127aa3ff', fontWeight: 600, fontSize: '1.2rem' }}
                    htmlFor={finalId}
                >
                    {label}
                    {isRequired && <Typography marginLeft={'.1rem'} component={'span'} color={'error'} fontWeight={600} fontSize={16}>*</Typography>}
                </InputLabel>
            
            }

            <InputBase
                id={finalId}
                ref={ref}
                value={value}
                sx={{ padding: '0.1rem 0.5rem', borderRadius: '10px', boxShadow: '0px 0px 2px grey', border: `${error? '1px solid red': '1px solid #ccccccff'}`, backgroundColor:`${backgroundColor ? backgroundColor : 'inherit'}` }}
                aria-describedby={`my-helper-text-${props.register ? props.register.name : label}`}
                className="ms_custom-input"
                
                {...rest}

            />

            {error &&
                <FormHelperText
                    id={`my-helper-text-${props.register ? props.register.name : label}`}
                >
                    {errorMessage}
                </FormHelperText>
            }

        </FormControl>
    )
});