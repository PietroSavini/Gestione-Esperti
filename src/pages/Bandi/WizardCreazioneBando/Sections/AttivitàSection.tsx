import { Box, Icon, Typography } from '@mui/material'
import React, { useState } from 'react'
import { AttList, AttivitaObj, ModelloProcedimento, User, UserGroup } from '../WizardCreazioneBando';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { Label } from '@mui/icons-material';
import { NoContentSvg } from '../../../../components/partials/svg/NoContentSvg';




type Props = {
    data:AttivitaObj[] | []; 
    setData: React.Dispatch<React.SetStateAction<any>>;
    attList : AttList[] | [];
    userList : User[] | [];
    userGroup : UserGroup[] | []
    modelliProcedimento: ModelloProcedimento[] | []
};

export const AttivitàSection = ({ data, setData, attList, userList, userGroup, modelliProcedimento } : Props) => {
    //states 


    //lista delle attività selezionabili
    const activityListSelect: Option[] = attList.map((att) => ({value:att.actionId  , label:att.actionDesc}));
    const modelliProcedimentoSelect: Option[] = modelliProcedimento.map((modello) => ({value:modello.pm_id, label:modello.pm_subject}));

    function SelectActivityComponent () {
        return(
            <>
                <Box sx={{backgroundColor:'#e9eaf7', borderRadius:'13px'}} display={'flex'} alignItems={'center'} >
                    <Box padding={'.5rem .5rem'} display={'flex'} alignItems={'center'}> 
                        <Typography component={'span'} fontWeight={600} sx={{color:'#42648a'}}> Aggiungi attività </Typography>
                        <Icon sx={{color:'#42648a'}}>chevron_right</Icon>
                    </Box>
                    <Box paddingLeft={'.3rem'} paddingRight={'.3rem'} flexGrow={1} paddingTop={'.5rem'} >
                        <Custom_Select2 placeholder='Seleziona attività...' options={activityListSelect}/>
                    </Box>
                    <Box padding={'.5rem .5rem'} >
                        <ActionButton color='secondary' text='Aggiungi' startIcon={<Icon>add</Icon>}/>
                    </Box>
                </Box>
            </>
        )
    }

    function NoActivityComponent(){
        return(
            <>
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <NoContentSvg width='200px' height='200px'/>
                    <Typography sx={{marginTop:'2rem', color:'#525354'}} fontSize={28} fontStyle={'bold'} textAlign={'center'}>Non ci sono attività da mostrare</Typography>
                </Box>
            </>
        )
    }

    function ActivityComponent ({index, activity}:{index:number, activity: AttivitaObj}){
     
        
        function detectLeftMouseClick(e:any){
            if ("buttons" in e){
                return e.buttons === 1;
            }
            let button = e.which || e.button;
            return button === 1;
        }

        function dragStart(e:React.PointerEvent<HTMLDivElement>, index:number) {
            //controllo che sia un click con il pulsante sinistro del mouse
            if(!detectLeftMouseClick(e)) return;
            console.log('elemento cliccato: ', index, activity);
        }


        return(
            <>
                <Box position={'relative'} zIndex={0} width={'100%'} minHeight={'80px'}  alignItems={'center'} display={'flex'} sx={{backgroundColor:'aliceblue', borderRadius:'10px'}}>
                    <Box component={'div'} className='grab-icon' minHeight={'80px'} onPointerDown={(e) => dragStart(e, index)} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'10%'}>
                        <Icon  >
                            drag_indicator
                        </Icon>
                    </Box>   
                    <Box position={'relative'} zIndex={2}  minHeight={'80px'} flexGrow={1} sx={{border:'1px solid green', cursor:'default'}}>
                        {activity.actionDett}
                    </Box>
                    <Box position={'relative'} zIndex={2} minHeight={'80px'} width={'10%'} sx={{border:'1px solid purple', cursor:'default'}} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Icon sx={{cursor:'pointer'}} color='error'>
                            delete
                        </Icon>
                    </Box>
                </Box>
            </>
        )
    }
    //funzione trigger per inizio trascinamento

  return (
    <>
        <Box className={'attivita-container'} sx={{minHeight:'250px'}}  border={'1px solid black'}>
            <Box border={'1px solid red'} minHeight={'300px'} padding={'.5rem 0rem'} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
                {data && data.length === 0 && 
                    <NoActivityComponent/>
                    
                }
                {
                    data &&  data.length > 0 && 
                    data.map((activity, index) => 
                     
                        <ActivityComponent index={index} activity={activity} />
                  
                    )
                }
            </Box>
            <Box >
                <SelectActivityComponent />
            </Box>
        </Box>
</>
  )
}
