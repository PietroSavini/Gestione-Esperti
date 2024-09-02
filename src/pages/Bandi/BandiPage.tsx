import './BandiPage.scss'
import AXIOS_HTTP from '../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { WizardCreazioneBando } from './WizardCreazioneBando/WizardCreazioneBando'
import WizardBandoContextProvider from './WizardCreazioneBando/WizardBandoContext'
import { useAppDispatch, useAppSelector } from '../../app/ReduxTSHooks';
import { selectOrganizzaDocumentoSelect } from '../../app/store/Slices/organizzaDocumentoSlice';
import { selectPubblicazioniSelect } from '../../app/store/Slices/pubblicazioneSlice';
import Loader from '../../components/partials/Loader/Loader';
import { openLoader } from '../../app/store/Slices/loaderSlice';

export const BandiPage = () => {
  const dispatch = useAppDispatch()
  
  //funzione per prendere tutti i bandi
  const GET_ALL_BANDI = async () => {
    AXIOS_HTTP.Retrieve({ sModule: 'GET_ALL_BANDI', sService: 'READ_BANDI', url: '/api/launch/retrieve', body: {} })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  };

  const selectValuesOrganizzaDoc = useAppSelector(selectOrganizzaDocumentoSelect);
  const selectValuesPubblicazioni = useAppSelector(selectPubblicazioniSelect);
  openLoader()
  return (
    <>  
     
      <WizardBandoContextProvider>
     
        <WizardCreazioneBando  />
        
      

      </WizardBandoContextProvider>
    </>

  )
};


