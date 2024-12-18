import './login.scss';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
import useThrottled from '../../app/Hooks/useThrottledHook';
import { useAppDispatch } from '../../app/ReduxTSHooks';
import { AxiosHTTP } from '../../app/AXIOS_ENGINE/AxiosHTTP';
import { selectToken, setCredentials } from '../../app/store/Slices/authSlice';
import Serializer from '../../app/AXIOS_ENGINE/AxiosSERIALIZER';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, Chip, Icon, Paper, TextField } from '@mui/material'

export const Login = () => {

    const form = useForm<any>();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const ref = useRef<HTMLFormElement>(null)
    //const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [genErr, setGenErr] = useState('');
    //const [isLogged, setIsLogged] = useState<boolean>(false)
    const token = useSelector(selectToken)

    const onSubmit = useThrottled(
        async (data: any) => {
            setGenErr('')
            //ogetto con IloginMethod
            const newDataStructure = { ...data, iLoginMethod: 0 }
            //body completo del JSON ma fatto stringified
            try {
                const result: any = await AxiosHTTP({ url: '/api/oauth2/authorize', auth: false, body: newDataStructure, contentType: 'application/json', isResponseEncoded: false, isAxiosJsonResponse: false, encode: false, responseType: 'json' });
                if (result.errorCode === 0) {
                    const accessToken = result.response.token;
                    const user = result.response.iCustomerType
                    dispatch(setCredentials({ accessToken: accessToken, user: user }));
                    console.log('user ed accessToken salvati');
                } else {
                    setGenErr(result.errorMessage)
                }
            } catch (err: any) {
                console.error('ERRORE: ', err);
            }
        },
        1000
    );

    return (
        !token ?
            <>
                <Paper className='login-form-container' sx={{ maxWidth: '500px' }} elevation={8} >
                    <Box component={'form'} onSubmit={handleSubmit(onSubmit)} ref={ref} noValidate display={'flex'} alignItems={'center'} flexDirection={'column'}>

                        <Chip sx={{ width: '150px', height: '60px', marginBottom: '2rem' }} icon={<Icon sx={{ color: 'black' }}>face</Icon>} label="Log In" variant="outlined" />
                        {/* Log in form */}
                        <Box className='login-form-group' display={'flex'} flexDirection={'column'} maxWidth={'200px'} gap={5}>
                            <TextField

                                id="fsCF"
                                label="codice fiscale *"
                                variant="standard"
                                error={!!errors.fsCF}
                                helperText={errors.fsCF?.message as string}
                                {...register('fsCF', { required: 'username obbligatorio' })}
                                value={"00000000001"}
                            />
                            {/* username */}
                            <TextField
                                id="fsUser"
                                label="username *"
                                variant="standard"
                                error={!!errors.fsUser}
                                helperText={errors.fsUser?.message as string}
                                {...register('fsUser', { required: 'username obbligatorio' })}
                                value={"0001"}
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
                                value={"3D1234axios"}
                            />

                            {/* //messaggio di errore generico */}
                            {genErr && <div className='gen-error'>{genErr}</div>}

                        </Box>
                        {/*  END log in form */}
                        <Button type='submit' onClick={() => Serializer.serialize('.login-form-group', 0)} sx={{ marginTop: '20px' }} color='primary' variant='contained'>accedi</Button>

                    </Box>
                </Paper>
            </>

            : <Navigate to={'/Dashboard'} />
    )
}