import './BandiPage.scss'
import AXIOS_HTTP from '../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { WizardCreazioneBando } from './WizardCreazioneBando/WizardCreazioneBando'
import WizardBandoContextProvider from './WizardCreazioneBando/WizardBandoContext'
import { openLoader } from '../../app/store/Slices/loaderSlice';

export const WizardBando = () => {
 
  
  //funzione per prendere tutti i bandi -- da spostare in sezione apposita
  const GET_ALL_BANDI = async () => {
    AXIOS_HTTP.Retrieve({ sModule: 'GET_ALL_BANDI', sService: 'READ_BANDI', url: '/api/launch/retrieve', body: {} })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  };


  openLoader()
  return (
    <> 
      <WizardBandoContextProvider>
        <WizardCreazioneBando  />
      </WizardBandoContextProvider>
    </>

  )
};


