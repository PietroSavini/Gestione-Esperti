import { Outlet } from 'react-router-dom';
import Loader from '../../components/partials/Loader/Loader';
import ResponsiveDrawer from '../../components/partials/Drawer/Drawer';
import { sidebar } from '../../components/partials/Drawer/sidebarProps';
import { DrawerData } from '../../components/partials/Drawer/Drawer';



export const HomePage = () => {
    const data:DrawerData = sidebar

  return (
    <div className='APP'>
        <ResponsiveDrawer data={data}/>
        <Outlet/>
        <Loader />
    </div>
  )
}
