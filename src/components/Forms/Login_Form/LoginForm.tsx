import { useRef, useState } from 'react';
import { Box, Button, Chip, Paper, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/ReduxTSHooks';
import { setCredentials } from '../../../app/store/Slices/authSlice';
import { AxiosHTTP } from '../../../app/AXIOS_ENGINE/AxiosHTTP';
import FaceIcon from '@mui/icons-material/Face';
import useThrottled from '../../../app/Hooks/useThrottledHook';
import Serializer from '../../../app/AXIOS_ENGINE/AxiosSERIALIZER';
import './LoginForm.scss';
import { closeLoader, openLoader } from '../../../app/store/Slices/loaderSlice';

export const LoginForm = () => {

    const form = useForm<any>();
    const { register, handleSubmit, getValues, formState } = form;
    const { errors } = formState;
    const ref = useRef<HTMLFormElement>(null)

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [genErr, setGenErr] = useState('')

    const onSubmit = useThrottled(
        
        async (data: any) => {
            setGenErr('')
            dispatch(openLoader());
            const user = getValues('username');
            try {
                const result = await AxiosHTTP({ url: '/api/Test/Login', auth: false, body: data });
                if ('data' in result) {
                    dispatch(closeLoader())
                    const accessToken = result.data.accessToken;
                    dispatch(setCredentials({ accessToken, user }));
                    console.log('user ed accessToken salvati nello state');
                    navigate('/dashboard');
                } else if ('error' in result) {
                    dispatch(closeLoader())
                    const err = result.error;
                    if (!err?.originalStatus) {
                        setGenErr('nessuna risposta dal server');
                    } else if (err.originalStatus === 403) {
                        setGenErr('non autorizzato');
                    } else {
                        setGenErr('logIn Fallito');
                    }
                }
            } catch (err: any) {
                console.error('ERRORE: ', err);
                dispatch(closeLoader())
            }
        },
        1000
    );

    return (

        <Paper className='login-form-container' elevation={8} >
            <form onSubmit={handleSubmit(onSubmit)} ref={ref} noValidate>

                <Chip sx={{ width: '150px', height: '60px' }} icon={<FaceIcon />} label="Log In" variant="outlined" />
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

            </form>
        </Paper>
    )
}