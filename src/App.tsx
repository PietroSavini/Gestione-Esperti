import Utility from './app/AXIOS_ENGINE/AxiosUTILS';
import { useEffect } from 'react';
//React Router e componenti
import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage/HomePage';
import { NotFound } from './pages/404Page/NotFound'
import { PersistentLogin } from './components/PersistentLogin';
import  RequireAuth  from './components/RequireAuth'
import { useAppDispatch } from './app/ReduxTSHooks';



function App() {  
  useEffect(() => {
    //appena renderizza il componente dobbiamo salvare accessToken e RefreshToken nello state di redux prendendolo dall app di lancio che ce li passa all inizializzazione

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
  
  return (
    <>
      <Routes>
            {/*Protected Routes */}
        <Route path='/' element={<HomePage/>}>
          {/* persistent login ed auth dovrebbero avvolegere anche homepage ma a scopo di test e sviluppo ancora non possiamo farlo*/}
            <Route element={<PersistentLogin/>}>
              <Route element={<RequireAuth/>}>
          

           


           
              </Route>
            </Route>
            {/* Catch All */}
            <Route path='*' element={<NotFound/>}/>
            
        </Route>
      </Routes>
    </>
  )
}

export default App
