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
import {  setOrganizzaDocumentoData, setOrganizzaDocumentoSelect, setOrganizzaDocumentoTreeViewData } from './app/store/Slices/organizzaDocumentoSlice';
import { useAppDispatch } from './app/ReduxTSHooks';
import { createOptionArray } from './pages/SettingsPage/functions';
import { setPubblicazioniData, setPubblicazioniSelect } from './app/store/Slices/pubblicazioneSlice';

function App() {  
  const dispatch = useAppDispatch();
  const data:DrawerData = sidebar;
  //-----------------------------------------------------------------------INITIALSTATE APPLICAZIONE----------------------------------------------------------------------------------------------------
  //CHIAMATE PER INIZIALIZZARE L'APPLICAZIONE
  //CHIAMATA PER INIZIALIZZARE I DATI CHE VERRANNO DATI ALLE SELECT PER L APPLICAZIONE
  async function GET_ORGANIZZA_DOCUMENTO_SELECT_DATA () {
    await AXIOS_HTTP.Retrieve({url:'/api/launch/organizzaDocumento', sModule:'GET_ORGANIZZA_DOCUMENTO', sService:'READ_DOCUMENTI', body:{}})
        .then((res) =>{
          saveOrganizzaDocumento(res.response);
        })
        .catch((err) => console.error(err));
  };

  async function GET_PUBBLICAZIONI_SELECT_DATA () {
    await AXIOS_HTTP.Retrieve({url:'/api/launch/organizzaDocumento', sModule:'GET_PUBBLICAZIONE', sService:'READ_DOCUMENTI', body:{}})
        .then((res) =>{
          dispatch(setPubblicazioniData(res.response));
          saveSelectPubblicazioni(res.response);
          
        })
        .catch((err) => console.error(err));
  };
  //-------------------------------------------------------------- funzioni di salvataggio in state redux ----------------------------------------------------------------------------------------------
  // select options x dati di pubblicazioni
  function saveSelectPubblicazioni (data:any) {
    const listaUffici = data.uffici_list;
    const listaTipiAtto = data.tipi_atto_list;
    const listaTipiAttoBacheche = data.tipi_atto_bacheche_list;
    const listaAnagrafiche = data.tipi_anagraficha_list;
    const listaSezioniTrasparenza = data.sezioni_trasparenza_list;

    const newSelectValuesObject = {
      trasparenza: createOptionArray({arr:listaSezioniTrasparenza, value:'', label:''}),
      uffici: createOptionArray({arr:listaUffici, value:'fiUfficiId', label:'fsDescrizione'}),
      atti: createOptionArray({arr:listaTipiAtto, value:'', label:''}),
      bacheche: createOptionArray({arr:listaTipiAttoBacheche, value:'', label:''}),
      anagrafiche: createOptionArray({arr:listaAnagrafiche, value:'fiAnagraficaTypeId', label:'fsName'}),
    };

    dispatch(setPubblicazioniSelect(newSelectValuesObject));
  }
  
  function saveOrganizzaDocumento (data:any) {
    //salvo i dati cosi come sono 
    dispatch(setOrganizzaDocumentoData(data));

    //step 1 preparo la lista  dei volori delle selct
    const aoo = data.lista_aoo;
    const listaArchivi = data.lista_archivi;
    const assegnatari = data.lista_assegnatari;
    const classiDocumentali = data.lista_classi_documentali;
    const gruppoUtenti = data.lista_gruppo_utenti;
    const modelliProcedimento = data.lista_modelli_procedimento;
    const listaAttivita = data.lista_tipi_attivita;
    const titolari = data.lista_titolari;
    const utenti = data.lista_utenti;
    const utentiFirmatari = data.lista_utenti_firmatari;

    const newSelectValuesObject = {
      aoo : createOptionArray({arr:aoo, value:'fiId', label:'fsDescrizione'}),
      archivi : createOptionArray({arr:listaArchivi, value:'fiDossierId', label:'fsDossierName'}),
      assegnatari : createOptionArray({arr:assegnatari, value:'fgId', label:'fsAssigneeUser'}),
      classi_documentali : createOptionArray({arr:classiDocumentali, value:'fiTypeId', label:'fsTypeName'}),
      gruppo_utenti : createOptionArray({arr:gruppoUtenti, value:'fiGroupId', label:'fsGroupName'}),
      modelli_procedimento : createOptionArray({arr:modelliProcedimento, value:'fiProcessModelId', label:'fsProcessModelDescription'}),
      tipi_attivita : createOptionArray({arr:listaAttivita, value:'fiActionId', label:'fsActionName'}),
      titolari : createOptionArray({arr:titolari, value:'fiMasterId', label:'fsDescrizione'}),
      utenti : createOptionArray({arr:utenti , value:'fiUserId', label:'fsUtente'}),
      utenti_firmatari : createOptionArray({arr:utentiFirmatari, value:'fiUserId', label:'fsUtente'}),
    };

    dispatch(setOrganizzaDocumentoSelect(newSelectValuesObject));

    
  }
  //eseguo chiamate di inizializzazione dati
  useEffect(()=>{
      GET_ORGANIZZA_DOCUMENTO_SELECT_DATA();
      GET_PUBBLICAZIONI_SELECT_DATA()
  },[]);

 
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
