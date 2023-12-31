import Utility from './app/AXIOS_ENGINE/AxiosUTILS';
import { useEffect } from 'react';
//React Router e componenti
import { Routes, Route, Navigate } from 'react-router-dom'
import { NotFound } from './pages/404Page/NotFound'
import { PersistentLogin } from './components/App_Components/PersistentLogin';
import  RequireAuth  from './components/App_Components/RequireAuth'
import { useAppDispatch } from './app/ReduxTSHooks';
import { Dashboard } from './pages/Dashboard/Dashboard';
import ResponsiveDrawer from './components/partials/Drawer/Drawer';
import { DrawerData } from './components/partials/Drawer/DrawerTypes';
import { sidebar } from './components/partials/Drawer/sidebarProps';
import Loader from './components/partials/Loader/Loader';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';


function App() {  
  const theme = createTheme({
    components:{
      MuiButton:{
        styleOverrides:{
          root:{
            textTransform:'none'
          }

        }
      },
      // @ts-ignore
      MuiDataGrid: {
        styleOverrides: {
          footerContainer: {
            justifyContent: 'initial',
          },
        },
      },
      MuiTablePagination:{
        styleOverrides:{
          root:{
            width:'100%',
            overflow:'initial'
            
          },
          spacer:{
            display:'none'
          },
          toolbar:{
            width:'100%',
            justifyContent:'flex-end',
            alignItems:'center',
            minHeight:'50px',
            flexWrap:'wrap',
            padding:'.5rem .5rem'
          }
        }
      }
    }
  })
  useEffect(() => {
    //appena renderizza il componente dobbiamo salvare accessToken e RefreshToken nello state di redux prendendolo dall app di lancio che ce li passa all'inizializzazione
    //controllo se i dati che devo fetchare sono nello State di Redux
      //se ci sono =>
       //non faccio nulla

      //se non ci sono =>
        //apro il loader
        //fetching dei dati per sidebar 
        //salvo i dati nella catche e nello state di redux
        //chiudo il loader






    //Utility.Logger.disable()
    //abilito / disabilito console.log()
    /*
      //per farlo funzionare si deve sviluppare EndPoint
      //faccio chiamata al server su endpoint che risponde in base alla decisione di loggare o non
      //se ritorna 0 non loggo se ritorna 1 loggo
      const result = await AxiosHTTP('/api/Test/logger', method:'GET' ...etc)
      if (result.data !== 0){
        Utility.Logger.enable()
        console.log('console log abilitato')
    */
    
  }, [])
  const data:DrawerData = sidebar
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="APP">
          

          <ResponsiveDrawer data={data}/>
          <main>
            <Routes>
                {/* 
                  persistent login ed auth dovrebbero avvolegere tutte le routes ma a scopo di test e sviluppo ancora non possiamo farlo
                  <Route element={<PersistentLogin />}>
                    <Route element={<RequireAuth />}>
                
                    </Route>
                  </Route>
              */}
                <Route index element={<Dashboard />}/>
                <Route path='/impostazioni' element={<SettingsPage />}/>
              
                {/* Catch All */}
                <Route path='*' element={<NotFound/>}/>
            </Routes>
            <Loader/>
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
