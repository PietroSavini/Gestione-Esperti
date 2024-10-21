
//React Router e componenti
import { Routes, Route } from 'react-router-dom'
import { NotFound } from './pages/404Page/NotFound'
import { PersistentLogin } from './components/App_Components/PersistentLogin';
import RequireAuth from './components/App_Components/RequireAuth'
import { Dashboard } from './pages/Dashboard/Dashboard';
import ResponsiveDrawer from './components/partials/Drawer/Drawer';
import { DrawerData } from './components/partials/Drawer/DrawerTypes';
import { sidebar } from './components/partials/Drawer/sidebarProps';
import Loader from './components/partials/Loader/Loader';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { ThemeProvider } from '@mui/material/styles';
import { TipologiaEdit } from './pages/SettingsPage/Tabs/TipologiaEspertoTab/TipologiaEdit/TipologiaEdit';
import { theme } from './ms_theme'
import { WizardBando } from './pages/Bandi/WizardBando';
import { TipologiaShow } from './pages/SettingsPage/Tabs/TipologiaEspertoTab/TipologiaShow/TipologiaShow';
import { RicercaBando } from './pages/Bandi/RicercaBando/RicercaBando';
import { Login } from './pages/LoginPage/Login';


function App() {

  const sidebarData: DrawerData = sidebar;


  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="APP">
          <ResponsiveDrawer data={sidebarData} />
          <main>
            <Routes>
            <Route path='/' element={<Login />} />
              <Route element={<PersistentLogin />}>
                <Route element={<RequireAuth />}>
                  <Route index path='/Dashboard' element={<Dashboard />} />
                  <Route path='/impostazioni' element={<SettingsPage />} />
                  <Route path='/impostazioni/modifica-tipologia' element={<TipologiaEdit />} />
                  <Route path='/impostazioni/visualizza-tipologia' element={<TipologiaShow />} />
                  <Route path='/Bandi' element={<WizardBando />} />
                  <Route path='/Ricerca-bandi' element={<RicercaBando />} />
                </Route>
              </Route>
              {/* Catch All */}
              <Route path='*' element={<NotFound />} />
            </Routes>
            <Loader />
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
