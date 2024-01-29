import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import  { store }  from './app/store/store'
import { Provider } from 'react-redux'
import { Login } from './pages/LoginPage/Login.tsx'




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    {/* provider di redux per passare lo state al resto dell'app */}
    <Provider store={store}>
      {/* rotte di reactRouter */}
      <BrowserRouter> 
        <Routes>
          <Route path='/' element={<Login/>}>
            <Route path='/*' element={<App />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
