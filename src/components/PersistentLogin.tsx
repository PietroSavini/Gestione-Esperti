import { Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAppDispatch} from "../app/ReduxTSHooks";
import { useSelector } from 'react-redux'
import { selectToken, setCredentials } from "../app/store/Slices/authSlice";
import { AxiosHTTP } from "../app/AXIOS_ENGINE/AxiosHTTP";

export const PersistentLogin = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const token = useSelector(selectToken)
    const isAuth = ( token !== null);
    useEffect(()=>{
        const verifyRefreshToken = async () => {
           try{
            const result = await AxiosHTTP({url:'/api/Test/Refresh',auth:true})
            const newCredentials = result.data;
            dispatch(setCredentials(newCredentials))
           }catch(err){
            console.error(err)
           }finally{
            setIsLoading(false)
           }
        }
        !isAuth ? verifyRefreshToken() : setIsLoading(false);
    },[])

  
  return (
    <>
        {
            isLoading 
                ? <p>caricamento...</p>
                : <Outlet />
        }
    </>
  )
}
