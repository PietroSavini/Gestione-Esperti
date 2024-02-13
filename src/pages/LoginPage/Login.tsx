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
            console.log('dati inviati',data)
            try {
                const result = await AxiosHTTP({ url:'/api/Login/login', auth: false, body: data, isResponseEncoded:false, isAxiosJsonResponse:false });
                if(result.accessToken){
                    const accessToken = result.accessToken;
                    dispatch(setCredentials({ accessToken, user }));
                    console.log('user ed accessToken salvati nello state');
                    navigate('/Dashboard');
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
                <Paper className='login-form-container' elevation={8} >
                    <Box component={'form'} onSubmit={handleSubmit(onSubmit)} ref={ref} noValidate>

                        <Chip sx={{ width: '150px', height: '60px' }} icon={<Icon>avatar</Icon>} label="Log In" variant="outlined" />
                        {/* Log in form */}
                        <Box className='login-form-group'>
                            {/* username */}
                            <TextField
                                id="username"
                                label="Username *"
                                variant="outlined"
                                error={!!errors.username}
                                helperText={errors.username?.message as string}
                                {...register('username', { required: 'username obbligatorio' })}
                            />
                            
                            {/* password */}
                            <TextField
                                id="password"
                                label="Password *"
                                type="password"
                                variant="outlined"
                                error={!!errors.password}
                                helperText={errors.password?.message as string}
                                {...register('password', { required: 'password obbligatoria' })}
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