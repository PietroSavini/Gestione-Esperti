import { Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAppDispatch} from "../../app/ReduxTSHooks";
import { useSelector } from 'react-redux'
import { selectToken, setCredentials } from "../../app/store/Slices/authSlice";
import { AxiosHTTP } from "../../app/AXIOS_ENGINE/AxiosHTTP";
import { closeLoader, openLoader } from "../../app/store/Slices/loaderSlice";
import Loader from "../partials/Loader/Loader";


export const PersistentLogin = () => {

    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const token = useSelector(selectToken)
    const isAuth = ( token !== null);

    const verifyRefreshToken = async () => {
       try{
        dispatch(openLoader())
        const result: any = await AxiosHTTP({url:'/api/oauth2/Refresh', auth:true, body:{}});
        const newCredentials = {
          user: result.iCustomerType, //da sostituire con lo user giusto
          accessToken: result.token
        };
        dispatch(setCredentials(newCredentials));
       }catch(err){
        console.error(err);
       }finally{
        dispatch(closeLoader());
        setIsLoading(false);
       }
    };

    useEffect(()=>{
        !isAuth ? verifyRefreshToken() : setIsLoading(false);
    },[])

  
  return (
    <>
        {
            isLoading 
                ? <Loader />
                : <Outlet />
        }
    </>
  )
}
