
import { useEffect } from 'react';
//React Router e componenti
import { Routes, Route } from 'react-router-dom'
import { NotFound } from './pages/404Page/NotFound'
import { PersistentLogin } from './components/App_Components/PersistentLogin';
import  RequireAuth  from './components/App_Components/RequireAuth'
import { Dashboard } from './pages/Dashboard/Dashboard';
import ResponsiveDrawer from './components/partials/Drawer/Drawer';
import { DrawerData } from './components/partials/Drawer/DrawerTypes';
import { sidebar } from './components/partials/Drawer/sidebarProps';
import Loader from './components/partials/Loader/Loader';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { ThemeProvider } from '@mui/material/styles';
import { TipologiaEdit } from './pages/SettingsPage/Tabs/TipologiaEspertoTab/TipologiaEdit/TipologiaEdit';
import {theme} from './ms_theme'
import { BandiPage } from './pages/Bandi/BandiPage';
import { TipologiaShow } from './pages/SettingsPage/Tabs/TipologiaEspertoTab/TipologiaShow/TipologiaShow';
import AXIOS_HTTP from './app/AXIOS_ENGINE/AXIOS_HTTP';
import { selectOrganizzaDocumentoData, setOrganizzaDocumentoData } from './app/store/Slices/organizzaDocumentoSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './app/ReduxTSHooks';

function App() {  
  const dispatch = useAppDispatch()
  const organizzaDocumentoData = useSelector(selectOrganizzaDocumentoData)
  //CHIAMATEPER INIZIALIZZARE L'APPLICAZIONE

  //CHIAMATA PER INIZIALIZZARE I DATI CHE VERRANNO DATI ALLE SELECT PER L APPLICAZIONE
  async function GET_ORGANIZZA_DOCUMENTO_SELECT_DATA () {
    await AXIOS_HTTP.Retrieve({url:'/api/launch/organizzaDocumento', sModule:'GET_ORGANIZZA_DOCUMENTO', sService:'READ_DOCUMENTI', body:{}})
        .then((res) =>{
            dispatch(setOrganizzaDocumentoData(res.response))
        })
        .catch((err) => console.error(err))
  }

  useEffect(()=>{
      console.log('CHIAMATA PER PRENDERE I DATI DALLE SELECT PER WIZARD CREAZIONE BANDO')
      GET_ORGANIZZA_DOCUMENTO_SELECT_DATA()
  },[])
  useEffect(()=>{
   console.log('STATE REDUX organizza documento: ', organizzaDocumentoData)
},[organizzaDocumentoData])
  //altre chiamate di inizializzazione...


  const data:DrawerData = sidebar
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="APP">
          <ResponsiveDrawer data={data}/>
          <main>
            <Routes>
                  persistent login ed auth dovrebbero avvolegere tutte le routes ma a scopo di test e sviluppo ancora non possiamo farlo
                  <Route element={<PersistentLogin />}>
                    <Route element={<RequireAuth />}>
                      <Route index path='/Dashboard' element={<Dashboard />}/>
                      <Route path='/impostazioni' element={<SettingsPage />}/>
                      <Route path='/impostazioni/modifica-tipologia' element={<TipologiaEdit/>}  />
                      <Route path='/impostazioni/visualizza-tipologia' element={<TipologiaShow/>}/>
                      <Route path='/Bandi' element={<BandiPage/>}/>
                      {/* Catch All */}
                      <Route path='*' element={<NotFound/>} /> 
                    </Route>
                  </Route>
            </Routes>
            <Loader/>
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
