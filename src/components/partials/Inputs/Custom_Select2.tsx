/*
*Componente Wrapper per la Select della libreria React-select => https://react-select.com/home
*/
import { v4 as uuidv4 } from 'uuid';
import { Box, FormHelperText, Icon, InputLabel, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import Select, { ActionMeta, CSSObjectWithLabel, SingleValue } from 'react-select';

type Props = {
    id?:string;
    name?:string;
    control?:any;
    label?:string;
    error?:boolean;
    errorMessage?:string;
    defaultValue?: Option
    readOnly?:boolean;
    disabled?:boolean;
    options:Option[] | [];
    placeholder?:string;
    validations?:Object;
    isMulti?:boolean;
    isClearable?:boolean;
    isRequired?:boolean;
    onChangeSelect?: ((newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => void) | undefined
    value?:any;
    marginBottom?:string;
    
}

export type Option ={
    value: string | number;
    label: string;
    icon?: string;
    id?: string | number;
    childrens?: Option[] | [];
    level?: number;
}


export const Custom_Select2 = (props:Props) => {
    const {id, name, control, label, error, errorMessage,  defaultValue, readOnly, disabled, options, placeholder, validations, isMulti, isClearable, onChangeSelect, isRequired, value, marginBottom} = props;
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

        <Box marginBottom={marginBottom ? marginBottom : '1rem'} position={'relative'} className={`${readOnly || disabled ? 'ms_react-select-readOnly':'ms_react-select'}`}>
            {readOnly || disabled && <Box sx={{position:'absolute', top:0, left:0, right:0,bottom:0, zIndex:0}} ></Box>}
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
                        <Select 
                            //implementare isMulti
                            
                            components={{NoOptionsMessage:()=><Typography marginLeft={'1rem'} component={'span'} fontSize={'.8rem'} textAlign={'center'}>Nessun elemento trovato</Typography>}}
                            defaultValue={defaultValue}
                            isDisabled={disabled}
                            isClearable={isClearable}
                            isSearchable
                            classNamePrefix='react-select'
                            ref={ref}
                            options={options}
                            onChange={ (selectedOption) => {
                                if (selectedOption) {
                                    if(onChangeSelect){
                                        onChange(selectedOption.value)
                                        onChangeSelect(selectedOption, {action:'select-option', option:selectedOption});
                                    }else{
                                        onChange(selectedOption.value)
                                    }
                                } else {
                                    onChange(null); //Imposta il valore a null quando l'opzione "clear" viene selezionata
                                }
                            } }
                            value={options.find(c => c.value === value)}
                            name={name}
                            placeholder={placeholder ? placeholder : 'Seleziona...'}
                            id={id? id : rndId}
                            aria-labelledby={`${name}-select-label`}
                            styles={{ 

                                control:(provided: CSSObjectWithLabel, state) => ({
                                    ...provided,
                                    borderRadius:'10px',
                                    border: `${error ? '1px solid red' : provided.border}`,
                                    boxShadow:'0px 0px 2px grey'
                                }),
                                option:(provided: CSSObjectWithLabel, state) =>({
                                    ...provided,
                                    paddingLeft: state.data.level && state.data.level !== 0 ? `${state.data.level * 40}px` : undefined  // aggiungo 40 * livello indentazione al padding sx in modo da creare la struttura ad albero solo se la proprietà level di Option esiste ed è diversa da 0
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
                <Select 
                    
                    //implementare isMulti
                    value={value? value : undefined}
                    components={{NoOptionsMessage:()=><Typography marginLeft={'1rem'} component={'span'} fontSize={'.8rem'} textAlign={'center'}>Nessun elemento trovato</Typography>}}
                    isDisabled={disabled}
                    isClearable={isClearable}
                    isSearchable
                    onChange={onChangeSelect}
                    classNamePrefix='react-select'
                    options={options}
                    defaultValue={defaultValue}
                    name={name ? name : `${rndId}`}
                    placeholder={placeholder ? placeholder : 'Seleziona...'}
                    id={id? id : rndId}
                    aria-labelledby={`${name ? name : rndId}-select-label`}
                    styles={{ 
                        control:(provided: CSSObjectWithLabel,state) => ({
                            ...provided,
                            borderRadius:'10px',
                            border: `${error ? '1px solid red' : provided.border}`,
                            boxShadow:'0px 0px 2px grey',
                            marginBottom:`${marginBottom ? marginBottom : '1rem'}`
                        }),
                        option:(provided: CSSObjectWithLabel, state) =>({
                            ...provided,
                            paddingLeft: state.data.level && state.data.level !== 0 ? `${state.data.level * 40}px` : undefined  // aggiungo 40 * livello indentazione al padding sx in modo da creare la struttura ad albero solo se la proprietà level di Option esiste ed è diversa da 0
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
