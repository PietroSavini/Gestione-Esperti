import { Box, Icon, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { AttList, AttivitaObj, ModelloProcedimento, User, UserGroup } from '../WizardCreazioneBando';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
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
    const [isDragging, setIsDragging] = useState<number | undefined>(undefined);

    //lista delle attività selezionabili
    const activityListSelect: Option[] = attList.map((att) => ({value:att.actionId  , label:att.actionDesc}));
    const modelliProcedimentoSelect: Option[] = modelliProcedimento.map((modello) => ({value:modello.pm_id, label:modello.pm_subject}));

    //ref per stabilire l'elemento da draggare
    const containerRef = useRef<HTMLDivElement>(null)

    //watchers
    useEffect(() => {
        console.log('elemento in dragging: ', isDragging)
    }, [isDragging])



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

        const [style, setStyle] = useState<any>(undefined)

        //funzione per verificare che il pulsante del mouse cliccato sia quello sinistro
        function detectLeftMouseClick(e:any){
            if ("buttons" in e){
                return e.buttons === 1;
            }
            let button = e.which || e.button;
            return button === 1;
        }

        async function dragStart(e:React.PointerEvent<HTMLDivElement>, index:number) {
            //controllo che sia un click con il pulsante sinistro del mouse
            if(!detectLeftMouseClick(e)) return;
            
            /* (HACK FIX) => sviluippo una funzione asincrona che mi permette di aspettare che l'index venga effettivamente messo sulla variabile di state di useState, 
            * in quanto se fosse sincrono andrei ad applicare lo syle inline, 
            * poi l'index si setta sull indice dell elemento selezionato applicando la classe "dragging" che sovrascriverebbe lo style inline in quanto stimolerebbe un nuovo rendering.
            */
            async function addIndexToisDragging(index:number){
               setIsDragging(index);
            }
            //definisco la funzione di dragEnd che si esegue al rilascio del pulsante sinistro del mouse
            function dragEnd () {
                setIsDragging(undefined)
                //reset dello style
                setStyle(undefined)
                itemToDrag.style.position = "";
                itemToDrag.style.zIndex = "";
                itemToDrag.style.top = "";
                itemToDrag.style.left = "";
                itemToDrag.style.cursor = "";
            };

            //assegno l'index ad 'isDragging' in modo da assegnare la classe "dragging" all elemento che sto draggando
            await addIndexToisDragging(index);
                //definisco il container attuale sfruttando il ref
                const container = containerRef.current;
    
                //utilizzo Array.From per ritornare un array di eHTMLElement  in modo da utilizzare la funzione getBoundingClientRect() sull item che ho selezionato.
                const items = Array.from(container!.childNodes).filter(
                    (node): node is HTMLElement => node instanceof HTMLElement
                );
    
                //seleziono l'HTMLElement sul quale eseguire il dragging
                const itemToDrag = items[index];
                
                //ottengo l'oggetto comprendente i valori della posizione dell' elemento selezionato
                const dragBoundingClientRect = itemToDrag.getBoundingClientRect();
                //setto lo style inline dell' elemento in dragging
                itemToDrag.style.position = 'fixed',
                itemToDrag.style.zIndex = '5000',
                itemToDrag.style.top = `${e.clientY - dragBoundingClientRect.height / 2}px`;
                itemToDrag.style.left = `${e.clientX - dragBoundingClientRect.width / 2}px`;
                itemToDrag.style.cursor = "grabbing";
                console.log('HTMLDiv in dragging: ', itemToDrag);

            
                


   
            

            //eseguo dragEnd
            document.onpointerup = dragEnd;
        }


        return(
            <>
                <div  className={`draggable-container ${isDragging === index ? 'dragging' : ''}`} >
                    <Box component={'div'} className='grab-icon' minHeight={'80px'} onPointerDown={(e) => dragStart(e, index)} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'10%'}>
                        <Icon  >
                            drag_indicator
                        </Icon>
                    </Box>
                    <Box  minHeight={'80px'} flexGrow={1} sx={{border:'1px solid green', cursor:'default'}}>
                        {activity.actionDett}
                    </Box>
                    <Box minHeight={'80px'} width={'10%'} sx={{border:'1px solid purple', cursor:'default'}} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Icon sx={{cursor:'pointer'}} color='error'>
                            delete
                        </Icon>
                    </Box>
                </div>
            </>
        )
    }

  return (
    <>
        <Box className={'attivita-container'}  sx={{minHeight:'250px'}}>
            <Box component={'div'} ref={containerRef} border={'1px solid red'} position={'relative'} minHeight={'300px'} padding={'.5rem 0rem'} display={'flex'} flexDirection={'column'}  gap={1}>
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
