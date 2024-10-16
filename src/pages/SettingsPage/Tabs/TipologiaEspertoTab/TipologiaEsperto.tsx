import { Accordion, AccordionDetails, AccordionSummary, Box, Dialog, Divider, Icon, Typography } from '@mui/material'
import { Table_tipologieDiSistema } from './Tables/Table_tipologieDiSistema'
import { useEffect, useState } from 'react'
import { Table_tipologiePersonalizzate } from './Tables/Table_tipologiePersonalizzate'
import { useAppDispatch } from '../../../../app/ReduxTSHooks'
import { closeLoader, openLoader } from '../../../../app/store/Slices/loaderSlice'
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton'
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { TipologiaEspertoRow } from '../../types'
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField'
import { useForm } from 'react-hook-form'

export const TipologiaEsperto = () => {

  const dispatch = useAppDispatch();


  const GET_ALL_TIPOLOGIE = async () => {

    await AXIOS_HTTP.Retrieve({ sService: 'READ_TIPOLOGIA_ESPERTO', sModule: 'IMPOSTAZIONI_GET_ALL_TIPOLOGIE_ESPERTO', url: '/api/launch/retrieve', body: null })
      .then((response) => {
        console.log(response)
        if (response.errorCode && response.errorCode !== 0) {
          console.log('errore durante la ricezione dei dati', response)
        }
        const data: TipologiaEspertoRow[] = response.response
        const TipologiePersonalizzate = data.filter((tipologia) => tipologia.TEspSys === false)
        const TipologieDiSistema = data.filter((tipologia) => tipologia.TEspSys === true)
        setTipologieDiSistema(TipologieDiSistema)
        setTipologiePersonalizzate(TipologiePersonalizzate)

      })
      .catch((err) => {
        console.log('errore nella chiamata per la ricezione dei dati', err);
        dispatch(closeLoader())
      })
  }



  const [tipologieDiSistema, setTipologieDiSistema] = useState<TipologiaEspertoRow[] | []>([]);
  const [tipologiePersonalizzate, setTipologiePersonalizzate] = useState<TipologiaEspertoRow[] | []>([])
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // React hook form
  const form = useForm<any>();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    dispatch(openLoader())
    GET_ALL_TIPOLOGIE();
  }, [])

  useEffect(() => {
    if(tipologieDiSistema.length > 0 || tipologiePersonalizzate.length > 0){
      dispatch(closeLoader())
    }
  }, [tipologieDiSistema, tipologiePersonalizzate])

  // hook per gestire espansione degli accordion
  const [expanded, setExpanded] = useState<boolean[]>([true, true]);

  //funzione che gestisce apertura e chiusura degli accordion
  const handleChange = (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    const newExpanded = [...expanded];
    newExpanded[panel] = isExpanded;
    setExpanded(newExpanded);
  };

  const CREATE_NEW_TIPOLOGIA_ESPERTO = async (data:any) => {
    const {TEspDesc, TEspBr} = data;

    const jsonParams = {
      TEspBr: TEspBr,
      TEspDesc: TEspDesc,
      TEspVis: false,
    }

    await AXIOS_HTTP.Execute({ url:'/api/launch/execute', body:jsonParams, sModule:'IMPOSTAZIONI_INSERT_TIPOLOGIA_ESPERTO', sService:'WRITE_TIPOLOGIE_ESPERTO'})
      .then((res) => {
        const id = res.response.TEspId;
        const newTipologia: TipologiaEspertoRow = {
          TEspId: id,
          TEspBr: TEspBr,
          TEspDesc: TEspDesc,
          TEspVis: false,
          TEspSys: false,
        };

        setTipologiePersonalizzate((prev) => [...prev, newTipologia])
        setIsOpen(false)
      })
      .catch((err) => 
        console.log(err)
      )
  }

  //onSubmit() per Creazione nuova Tipologia esperto
  const onSubmit =  (data:any) => {
     CREATE_NEW_TIPOLOGIA_ESPERTO(data)
  }
  return (
    <>
      <Accordion expanded={expanded[0]} onChange={handleChange(0)}>
        <AccordionSummary expandIcon={<Icon sx={{ rotate: '90deg' }}>chevron_right</Icon>}>
          <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie di Sistema </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table_tipologieDiSistema rows={tipologieDiSistema} addToTipologiePersonalizzateFn={setTipologiePersonalizzate} />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded[1]} onChange={handleChange(1)}>
        <AccordionSummary expandIcon={<Icon sx={{ rotate: '90deg' }}>chevron_right</Icon>}>
          <Typography variant='body1' fontWeight={600} color={'#42648aff'}> Tipologie Personalizzate </Typography>

        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} sx={{ justifyContent: 'flex-end' }}>

            <ActionButton onClick={() => setIsOpen(true)} sx={{ marginBottom: '1rem' }} color='primary' text='Crea Nuova Tipologia' icon='add' />
          </Box>
          <Table_tipologiePersonalizzate rows={tipologiePersonalizzate} setRows={setTipologiePersonalizzate} />
        </AccordionDetails>
      </Accordion>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Box padding={2} component={'form'} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Typography textAlign={'center'} fontWeight={600} fontSize={20} color={'#177da6'}>Crea nuova tipologia esperto</Typography>
          <Custom_TextField 
            placeholder='Inserisci una descrizione breve...' 
            label={'Descrizione'} 
            isRequired 
            error={!!errors.TEspBr}
            errorMessage={errors.TEspBr?.message as string}
            {...register('TEspBr', {required:'La Descrizione breve è obbligatoria'})} 
          />
          <Custom_TextField 
            multiline 
            minRows={2} 
            placeholder='Inserisci una descrizione estesa...' 
            label={'Descrizione Estesa'} 
            isRequired 
            errorMessage={errors.TEspDesc?.message as string}
            error={!!errors.TEspDesc}
            {...register('TEspDesc', {required:'La Descrizione estesa è obbligatoria'})} 
          />
          <Divider sx={{marginTop:1}}/>
          <Box padding={'1rem 0'} textAlign={'right'}>
            <ActionButton sx={{marginRight:'10px'}} text='Annulla' endIcon={<Icon>cancel</Icon>} color='error' onClick={() => setIsOpen(false)} />
            <ActionButton text='Crea Tipologia' color='secondary' type='submit'/>
          </Box>
        </Box>
      </Dialog>

    </>
  )

}
