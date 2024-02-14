import { Box, FormHelperText, FormLabel, Icon, InputLabel } from '@mui/material'
import { Controller } from 'react-hook-form'
import Select, { CSSObjectWithLabel } from 'react-select';

type Props = {
    name:string;
    control:any;
    label?:string;
    error?:boolean;
    errorMessage?:string;
    defautValue?:string;
    readOnly?:boolean;
    disabled?:boolean;
    options:Option[]
    placeholder?:string
    validations?:Object
    isMulti?:boolean
}

type Option ={
    value:string;
    label:string;
    icon?:string;
}

export const Custom_Select2 = (props:Props) => {
    const {name, control, label, error, errorMessage,  defautValue, readOnly, disabled, options, placeholder, validations, isMulti} = props

  return (
    <>
        <Box marginBottom={'1rem'} position={'relative'} className={`${readOnly || disabled ? 'ms_react-select-readOnly':'ms_react-select'}`}>
            {readOnly || disabled && <Box sx={{position:'absolute', top:0, left:0, right:0,bottom:0, zIndex:3}} ></Box>}
            <InputLabel sx={{fontWeight:600,fontSize:'.9rem', color:'#127aa3ff',marginBottom:'.3rem'}} id={`${name}-select-label`} error={error}>{label}</InputLabel>
            <Controller 
                control={control}
                defaultValue={defautValue}
                name={name}
                rules={validations}
                render={({field:{onChange,value,name,ref}, formState}) => (
                    <Select 
                        className=''
                        isDisabled={disabled}
                        
                        isClearable
                        isSearchable
                        classNamePrefix='react-select'
                        ref={ref}
                        options={options}
                        onChange={ (selectedOption) => {
                            if (selectedOption) {
                                onChange(selectedOption.value);
                            } else {
                                onChange(null); // Imposta il valore a null quando l'opzione "clear" viene selezionata
                            }
                        } }
                        value={options.find(c => c.value === value)}
                        name={name}
                        placeholder={placeholder}
                        id={`${name}-select`}
                        aria-labelledby={`${name}-select-label`}
                        styles={{ 
                            control:(provided:CSSObjectWithLabel,state) => ({
                                ...provided,
                                borderRadius:'10px',
                                border: `${error ? '1px solid red' : provided.border}`,
                                boxShadow:'0px 0px 2px grey'
                            })

                        }}
                        //@ts-ignore
                        getOptionLabel={e => (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {e.icon && <Icon fontSize='small' >{e.icon}</Icon> }
                              <span style={{ marginLeft: 5 }}>{e.label}</span>
                            </Box>
                        )}
                    />
                )}
            />
           {error && <FormHelperText error>{errorMessage}</FormHelperText>}
        </Box>
    </>
  )
}
