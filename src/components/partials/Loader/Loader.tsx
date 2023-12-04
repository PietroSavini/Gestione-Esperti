import React from "react";
import "./loader.scss";
import { useAppSelector } from "../../../app/ReduxTSHooks";
import { loaderSelector } from "../../../app/store/Slices/loaderSlice";

interface LoaderProps {
	style?: any,
}

const Loader: React.FC<LoaderProps> = ({style={}}) => {
    const { isOpen } = useAppSelector(loaderSelector);
    if(isOpen){
        return (
            <div style={style} className="ax-loader">
                <div className="ax-loader-inner">
                    <div className="ax-loader-spinner"></div>
                    {/* <img src="/icon-loader.svg" />  */}
                </div>
            </div>
        )
    }else{
        return null
    }
};

export default Loader;