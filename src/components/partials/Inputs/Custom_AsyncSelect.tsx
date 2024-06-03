/*
*Componente Wrapper per la Select della libreria React-select => https://react-select.com/home
*/
import { v4 as uuidv4 } from 'uuid';
import { Box, FormHelperText, Icon, InputLabel, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import  { ActionMeta, CSSObjectWithLabel,  GroupBase,  OptionsOrGroups, SingleValue } from 'react-select';

import AsyncSelect from 'react-select/async';


type SelectProps = {
    id?:string;
    name?:string;
    control?:any;
    label?:string;
    error?:boolean;
    errorMessage?:string;
    defaultValue?: Option
    readOnly?:boolean;
    disabled?:boolean;
    placeholder?:string;
    validations?:Object;
    isMulti?:boolean;
    isClearable?:boolean;
    isRequired?:boolean
    onChange?: ((newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => void) | undefined
    loadOptions: any
    //(inputValue: string, callback: (options: OptionsOrGroups<Option, GroupBase<Option>>) => void) => void | Promise<OptionsOrGroups<Option, GroupBase<any>>>
   
} 
export type Option ={
    value: string;
    label: string;
    icon?: string;
    children?: Option[] | [];
}


export const Custom_AsyncSelect = (props:SelectProps) => {
    const {id, name, control, label, error, errorMessage,  defaultValue, readOnly, disabled,  placeholder, validations, isMulti, isClearable, onChange, isRequired, loadOptions} = props
    const rndId = uuidv4()
  return (
    <>
        {
        /*
            *
            SELECT CON VALIDAZIONE 
            *
        */
        }

        <Box marginBottom={'1rem'} position={'relative'} className={`${readOnly || disabled ? 'ms_react-select-readOnly':'ms_react-select'}`}>
            {readOnly || disabled && <Box sx={{position:'absolute', top:0, left:0, right:0,bottom:0, zIndex:3}} ></Box>}
                {isRequired ? 
                    (
                    <>
                        <Box display={'flex'}>
                            <InputLabel sx={{fontWeight:600,fontSize:'.9rem', color:'#127aa3ff',marginBottom:'.3rem'}} id={`${name}-select-label`} error={error}>{label}</InputLabel>
                            <Typography component={'span'} color={'error'}>*</Typography>
                        </Box>
                    </> 
                    )
                    :
                    (
                        <InputLabel sx={{fontWeight:600,fontSize:'.9rem', color:'#127aa3ff',marginBottom:'.3rem'}} id={`${name}-select-label`} error={error}>{label}</InputLabel>
                    )}
            
            {control && 
                <Controller 
                    control={control}
                    defaultValue={defaultValue?.value}
                    name={name ? name : ''}
                    rules={validations}
                    render={({field:{onChange,value,name,ref}, formState}) => (
                        <AsyncSelect 
                            
                            //implementare isMulti
                            loadOptions={loadOptions}
                            components={{NoOptionsMessage:()=><Typography marginLeft={'1rem'} component={'span'} fontSize={'.8rem'} textAlign={'center'}>Nessun elemento trovato</Typography>}}
                            defaultValue={defaultValue}
                            isDisabled={disabled}
                            isClearable={isClearable}
                            isSearchable
                            classNamePrefix='react-select'
                            ref={ref}
                            onChange={ (selectedOption) => {
                                if (selectedOption) {
                                    onChange(selectedOption.value);
                                } else {
                                    onChange(null); // Imposta il valore a null quando l'opzione "clear" viene selezionata
                                }
                            } }
                            
                            name={name}
                            placeholder={placeholder ? placeholder : 'Seleziona...'}
                            id={id? id : rndId}
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
            }

            {
            /*
                *
                SELECT NORMALE SENZA VALIDAZIONE
                *
            */
            }
            {!control && 
                <AsyncSelect 
                  
                    //implementare isMulti
                    loadingMessage={()=>'Ricerca in corso...'}
                    components={{NoOptionsMessage:()=><Typography marginLeft={'1rem'} component={'span'} fontSize={'.8rem'} textAlign={'center'}>Nessun elemento trovato</Typography>}}
                    isDisabled={disabled}
                    isClearable={isClearable}
                    isSearchable
                    loadOptions={loadOptions}
                    onChange={onChange}
                    classNamePrefix='react-select'
                    defaultValue={defaultValue}
                    name={name}
                    placeholder={placeholder}
                    id={id? id : rndId}
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
                    getOptionLabel={(e:Option )=> (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {e.icon && <Icon fontSize='small' >{e.icon}</Icon> }
                        <span style={{ marginLeft: 5 }}>{e.label}</span>
                        </Box>
                    )}
                />
            }         
           {error && <FormHelperText error>{errorMessage}</FormHelperText>}
        </Box>
    </>
  )
}
