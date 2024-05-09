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
} & InputBaseProps & { register?: UseFormRegisterReturn } & TextFieldProps;

export const Custom_TextField = forwardRef<HTMLInputElement, Props>((props, ref) => {

    const { disabled, label, error, errorMessage, value, readOnly, id, isRequired, ...rest } = props;
    const finalId = id ? id : uuidv4();

    return (

        <FormControl className={`${disabled || readOnly ? 'ms_input-disabled' : ''}`} error={error} disabled={disabled} fullWidth sx={{ marginBottom: '.5rem', paddingTop: '2rem', position: 'relative' }}>
            {/* messo per prevenire la selezione dell'input in caso in cui disabilitato o in readOnly */}
            {disabled || readOnly && <Box position={'absolute'} sx={{ top: '25px', right: '-5px', left: '-5px', bottom: '-5px', zIndex: '2' }}></Box>}
            <InputLabel

                shrink
                sx={{ zIndex: 0, top: '15px', left: '-15px', color: '#127aa3ff', fontWeight: 600, fontSize: '1.4rem', paddingLeft: '.5rem' }}
                htmlFor={finalId}
            >
                {label}
                {isRequired && <Typography marginLeft={1} component={'span'} color={'error'} fontWeight={600} fontSize={20}>*</Typography>}
            </InputLabel>

            <InputBase
                id={finalId}
                ref={ref}
                value={value}
                sx={{ padding: '.5rem 1rem', borderRadius: '15px', boxShadow: '0px 0px 2px grey', border: '1px solid #ccccccff' }}
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