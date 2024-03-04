import { useRef, useState } from 'react';
import { Box, Button, Chip, Icon, Paper, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'


import './login.scss';
import { closeLoader, openLoader } from '../../app/store/Slices/loaderSlice';
import useThrottled from '../../app/Hooks/useThrottledHook';
import { useAppDispatch } from '../../app/ReduxTSHooks';
import { AxiosHTTP } from '../../app/AXIOS_ENGINE/AxiosHTTP';
import { selectToken, setCredentials } from '../../app/store/Slices/authSlice';
import Serializer from '../../app/AXIOS_ENGINE/AxiosSERIALIZER';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PersistentLogin } from '../../components/App_Components/PersistentLogin';
import { Custom_TextField } from '../../components/partials/Inputs/CustomITextField';


export const Login = () => {

    const form = useForm<any>();
    const { register, handleSubmit, getValues, formState } = form;
    const { errors } = formState;
    const ref = useRef<HTMLFormElement>(null)
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [genErr, setGenErr] = useState('');
    const token = useSelector(selectToken)
    const onSubmit = useThrottled(
        
        async (data: any) => {
            setGenErr('')
            const user = getValues('username');
            console.log('dati inviati: ',data)
            dispatch(setCredentials({ accessToken:'123', user }));
            navigate('/dashboard')
            try {
                const result = await AxiosHTTP({ url:'/api/Login/login', auth: false, body: data, isResponseEncoded:false, isAxiosJsonResponse:false });
                console.log('risposta: ', result)
                if( 'accessToken' in result){
                    const accessToken = result.accessToken;
                    dispatch(setCredentials({ accessToken, user }));
                    console.log('user ed accessToken salvati nello state');
                  
                } else{
                    const err = result    
                    if (err.originalStatus === 403) {
                        // credenziali errate
                        setGenErr(err.data);
                    } else if (err.originalStatus === 401) {
                        setGenErr('non autorizzato');
                    } else {
                        setGenErr('logIn Fallito');
                    }
                }
            } catch (err: any) {
                console.error('ERRORE: ', err);
                
            }
        },
        1000
    );

    return (
        !token
            ? <>
                <Paper className='login-form-container' sx={{maxWidth:'500px'}} elevation={8} >
                    <Box component={'form'} onSubmit={handleSubmit(onSubmit)} ref={ref} noValidate display={'flex'} alignItems={'center'} flexDirection={'column'}>

                        <Chip sx={{ width: '150px', height: '60px' , marginBottom:'2rem'}} icon={<Icon sx={{color:'black'}}>face</Icon>} label="Log In" variant="outlined" />
                        {/* Log in form */}
                        <Box className='login-form-group' display={'flex'} flexDirection={'column'} maxWidth={'200px'} gap={5}>
                            <TextField
                                id="fsCF"
                                label="codice fiscale *"
                                variant="standard"
                                error={!!errors.fsCF}
                                helperText={errors.fsCF?.message as string}
                                {...register('fsCF', { required: 'username obbligatorio' })}
                            />
                            {/* username */}
                            <TextField
                                id="fsUser"
                                label="username *"
                                variant="standard"
                                error={!!errors.fsUser}
                                helperText={errors.fsUser?.message as string}
                                {...register('fsUser', { required: 'username obbligatorio' })}
                            />
                            
                            {/* password */}
                            <TextField
                                id="fsPsw"
                                label="password *"
                                type="password"
                                variant="standard"
                                error={!!errors.fsPsw}
                                helperText={errors.fsPsw?.message as string}
                                {...register('fsPsw', { required: 'password obbligatoria' })}
                            />
                        
                            {/* //messaggio di errore generico */}
                            {genErr && <div className='gen-error'>{genErr}</div>}
                        </Box>
                        {/*  END log in form */}
                        <Button type='submit' onClick={() => Serializer.serialize('.login-form-group', 0)}  sx={{ marginTop: '20px' }} color='primary' variant='contained'>accedi</Button>

                        </Box>
                    
                    </Paper>
                </> 
            : 
            <PersistentLogin />
    )
}