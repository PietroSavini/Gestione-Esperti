import { forwardRef } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";

type Option = {
    value: string | number;
    label: string;
};

type Props = {
    disabled?: boolean;
    id?: string;
    label: string;
    error?: boolean;
    errorMessage?: string;
    options: Option[];
    defaultValue?: string | number;
} & SelectProps & { register?: UseFormRegisterReturn };

const Custom_Select = forwardRef((props: Props,ref) => {
    const { disabled, label, id, error, errorMessage, options, register, ...rest } = props;

    return (
        <FormControl error={error} disabled={disabled} fullWidth sx={{ marginBottom:'.5rem', paddingTop:'2rem' }}>
            <InputLabel
                shrink
                sx={{ zIndex:0,top: '15px', left: '-15px', color: '#127aa3ff', fontWeight: 600, fontSize: '1.2rem' }}
                htmlFor={id}
            >
                {label}
            </InputLabel>

            <Select 
                ref={ref}
                className={`${disabled ? 'ms_input-disabled' : ''} ms_select`}
                sx={{ height:'48px', borderRadius: '15px', boxShadow: '0px 0px 3px grey' }}
                label={label}
                id={id}
                aria-describedby={`my-helper-text-${register?.name ? register.name : label}`}
                {...rest}
            >
                {options && options.length > 0 ? 
                
                    options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    )) 
                    :
                    (<MenuItem disabled> nessun elemento selezionabile</MenuItem>)
                }

            </Select>

            {error && (
                <FormHelperText
                    id={`my-helper-text-${register?.name ? register.name : label}`}
                >
                    {errorMessage}
                </FormHelperText>
            )}
        </FormControl>
    );
});

export default Custom_Select;