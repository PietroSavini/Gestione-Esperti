import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import  { store }  from './app/store/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    {/* provider di redux per passare lo state al resto dell'app */}
    <Provider store={store}>
      {/* rotte di reactRouter */}
      <BrowserRouter> 
        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
