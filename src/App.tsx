
//React Router e componenti
import { Routes, Route } from 'react-router-dom'
import { NotFound } from './pages/404Page/NotFound'
import { PersistentLogin } from './components/App_Components/PersistentLogin';
import RequireAuth from './components/App_Components/RequireAuth'
import { Dashboard } from './pages/Dashboard/Dashboard';
import Loader from './components/partials/Loader/Loader';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
//import { ThemeProvider } from '@mui/material/styles';
import { TipologiaEdit } from './pages/SettingsPage/Tabs/TipologiaEspertoTab/TipologiaEdit/TipologiaEdit';
import { WizardBando } from './pages/Bandi/WizardBando';
import { TipologiaShow } from './pages/SettingsPage/Tabs/TipologiaEspertoTab/TipologiaShow/TipologiaShow';
import { RicercaBando } from './pages/Bandi/RicercaBando/RicercaBando';
import { Login } from './pages/LoginPage/Login';
import { theme } from './ms_theme'

function App() {

  return (
    <>
      {/* <ThemeProvider theme={theme}>  */}
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
              <Route path='*' element={<NotFound />} />
            </Route>
          </Route>
          {/* Catch All */}
        </Routes>
        <Loader />
      {/* </ThemeProvider>  */}
    </>
  )
}

export default App
