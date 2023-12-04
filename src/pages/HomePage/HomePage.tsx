import { Outlet } from 'react-router-dom';
import Loader from '../../components/partials/Loader/Loader';
import ResponsiveDrawer from '../../components/partials/Drawer/Drawer';
import { sidebarItems } from '../../components/partials/Drawer/sidebarProps';


export const HomePage = () => {
    const props:any = sidebarItems

  return (
    <div className='APP'>
        <ResponsiveDrawer props={props}/>
        <Outlet/>
        <Loader />
    </div>
  )
}
