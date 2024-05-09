
import { FormStepProps } from './FormStep1'
import Table_RequisitiPunteggiShow from '../../../SettingsPage/Tabs/RequisitiTab/Tables/Table_RequisitiPunteggiShow';
import { Requisito_Table } from '../../../SettingsPage/types';
import { Box, Dialog, Icon, Paper, Typography } from '@mui/material';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { useEffect, useState } from 'react';
import { InboundSelectData, Options } from '../../../SettingsPage/Tabs/TipologiaEspertoTab/TipologiaEdit/TipologiaEdit';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { v4 as uuid } from 'uuid';
import Table_PunteggiBando from '../Tables/Table_PunteggiBando';

type FormStep4Props = FormStepProps & {
  TEspId: string | number | undefined;
}

export const FormStep4 = (props: FormStep4Props) => {
  const setData = props.setState as React.Dispatch<React.SetStateAction<Requisito_Table[] | []>>
  const { className, TEspId, data } = props
  //variabile di state per dialog
  const [isAddSectionOpen, setOpenSectionDialog] = useState<boolean>(false)
  const [selectableItems, setSelectableItems] = useState<Options[] | []>([])
  const [selectedItem, setSelectedItem] = useState<any>();
  const [error, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  

  const GET_REQUISITI_FOR_SELECT = async () => {
    await AXIOS_HTTP.Retrieve({ sService: 'READ_REQUISITI', sModule: 'IMPOSTAZIONI_GET_REQUISITI_MASTER', body: { TEspId: TEspId }, url: '/api/launch/retrieve' })
        .then((resp) => {
            const arrOfItems = resp.response as InboundSelectData;
            let finalArray: Options[] = [];
            arrOfItems.forEach(element => {
                const newFormat: Options = {
                    value: element.fs_ee_req_desc,
                    label: element.fs_ee_req_desc,
                    id: element.fi_ee_req_id,
                };
                finalArray.push(newFormat);
            });
            setSelectableItems(finalArray)
            console.log('MENUITEM PER SELECT: ', selectableItems);
        })
  };

  useEffect(() => {
    if(TEspId !== undefined){
      GET_REQUISITI_FOR_SELECT();
    }


  }, [TEspId])

  useEffect(()=>{
   
  },[])



  const addNewSection = () => {
    if (!selectedItem) {
      console.log('form in errore')
      setIsError(true)
      setErrorMessage('Seleziona almeno un requisito da associare alla tipologia esperto')
      return
    }
    setIsError(false)
    console.log('REQUISITO DA AGGIUNGERE',selectedItem)
    //processo che aggiunge il master all array di oggetti per i requisiti
    const newSection: Requisito_Table = {
      fi_ee_req_id: selectedItem.id,
      fs_ee_req_desc: selectedItem.value,
      requisiti_list: []
    }
    setData!((prev: Requisito_Table[]) => [...prev, newSection])
    //setto selectedItem ad undefined se no si creano errori
    setSelectedItem(undefined)
  }





  return (
    <>
      <Paper className={className} sx={{ padding: ' 1rem 1rem' }}>

        <Box sx={{ marginBottom: '1rem' }} display={'flex'} width={'100%'} justifyContent={'flex-start'}>
          <ActionButton text='Collega requisito' onClick={() => setOpenSectionDialog(true)} endIcon={<Icon>add</Icon>} color='secondary' />
          <Dialog open={isAddSectionOpen} onClose={() => setOpenSectionDialog(false)}>
            <Box display={'flex'} flexDirection={'column'} minHeight={'300px'} minWidth={'600px'} padding={'1rem 2rem'}  >

              <Box flexGrow={1} marginBottom={'3rem'}>
                <Custom_Select2 placeholder='Scegli un Requisito...' isRequired label='Seleziona Requisito da aggiungere' error={error} onChangeSelect={(newValue) => setSelectedItem(newValue)} options={selectableItems} />
                {error && <Typography color={'error'}>{errorMessage}</Typography>}
              </Box>
              <Box display={'flex'} justifyContent={'flex-end'}>
                <ActionButton onClick={() => setOpenSectionDialog(false)} color='error' icon='cancel' sx={{ marginRight: '.5rem' }} />
                <ActionButton text='Aggiungi' color='secondary' onClick={addNewSection} />
              </Box>
            </Box>

          </Dialog>
        </Box>
        <Box textAlign={'center'} padding={2}>
          <Typography fontWeight={600} fontSize={20}>Requisiti da collegare al Bando</Typography>
        </Box>
        {data && data.length > 0 && data.map((item: Requisito_Table, index:any) =>
          <Table_PunteggiBando data={item} key={index} setData={setData!} tespId={TEspId!}/>
        )}

        {!data || data.length === 0 &&
          <Typography>NESSUN PUNTEGGIO COLLEGATO ALLA TIPOLOGIA ESPERTO</Typography>
        }

      </Paper>
    </>
  )
}
