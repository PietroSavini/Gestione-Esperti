import { Box, Grid, Icon, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { AttList, AttivitaObj, ModelloProcedimento, User, UserGroup } from '../WizardCreazioneBando';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { NoContentSvg } from '../../../../components/partials/svg/NoContentSvg';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


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
       
        // variabili di reset 
        const resetrOnPointerMove = document.onpointermove;
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
            //evito il comportamento di default dell'evento (selezione del testo o elementi html)
            e.preventDefault();

            /* (HACK FIX) => sviluippo una funzione asincrona che mi permette di aspettare che l'index venga effettivamente messo sulla variabile di state di useState, 
            * in quanto se fosse sincrono andrei ad applicare lo syle inline, 
            * poi l'index si setta sull indice dell elemento selezionato applicando la classe "dragging" che sovrascriverebbe lo style inline in quanto stimolerebbe un nuovo rendering.
            */
            async function addIndexToisDragging(index:number){
               setIsDragging(index);
            }
            async function removeIndexToisDragging(){
                setIsDragging(undefined);
            }

            

            //assegno l'index ad 'isDragging' in modo da assegnare la classe "dragging" all elemento che sto draggando
            await addIndexToisDragging(index);
                //definisco il container attuale sfruttando il ref
                const container = containerRef.current;
    
                //utilizzo Array.From per ritornare un array di HTMLElement in modo da utilizzare la funzione getBoundingClientRect() sull item che ho selezionato.
                const items = Array.from(container!.childNodes).filter(
                    (node): node is HTMLElement => node instanceof HTMLElement
                );
                const itemsBelowDragItem = items.slice(index + 1 );
                const notDragItems = items.filter((_, i) => i !== index)
                const draggedElementData = data[index];
                let newData = data;
    
                //seleziono l'HTMLElement sul quale eseguire il dragging
                const itemToDrag = items[index];
                
                //ottengo l'oggetto comprendente i valori della posizione dell' elemento selezionato
                const dragBoundingClientRect = itemToDrag.getBoundingClientRect();
                //setto lo style inline dell' elemento in dragging
                itemToDrag.style.position = 'fixed',
                itemToDrag.style.zIndex = '5000',
                itemToDrag.style.width = `${dragBoundingClientRect.width}px`;
                itemToDrag.style.height = `${dragBoundingClientRect.height}px`;
                itemToDrag.style.top = `${dragBoundingClientRect.top}px`;
                itemToDrag.style.left = `${dragBoundingClientRect.left}px`;
                itemToDrag.style.cursor = 'grabbing'

                //creo un div temporaneo quando l'itemToDrag passa a position Fixed
                const tempDiv = document.createElement('div');
                tempDiv.id = "div-temp";
                tempDiv.style.width = `${dragBoundingClientRect.width}px`;
                tempDiv.style.height = `${dragBoundingClientRect.height}px`;
                tempDiv.style.pointerEvents = "none";

                // appendo il div temporaneo al container 
                container!.appendChild(tempDiv);

                //muovo gli elmenti sotto a dragItem
                //distanza da muovere
                const distance = dragBoundingClientRect.height;
                //applico la distanza agli altri elementi nell array
                itemsBelowDragItem.forEach((item) => {
                    item.style.transform = `translateY(${distance + 8}px )`
                })

                //coordinate originale del mouse
                let x = e.clientX;
                let y = e.clientY;
                //funzione che calcola lo spostamento dell item in base alle coordinate del mouse
                function dragMove (e:any) {
                    //calcolo la distanza che il pointer del mouse ha percorso
                    const posX = e.clientX - x;
                    const posY = e.clientY - y;

                    //muovo l'item
                    itemToDrag.style.transform = `translate(${posX}px, ${posY}px)`;

                    //swap della posizione dell'item
                    notDragItems.forEach(item => {
                        //controllo dell'overlap degli elementi attraverso le posizioni sulla pagina 
                        const rect1 = itemToDrag.getBoundingClientRect();
                        const rect2 = item.getBoundingClientRect();
                        let isOverlapping = rect1.y < rect2.y + (rect2.height / 2) && rect1.y + (rect1.height /2) > rect2.y;
                        //swap delle posizioni in UI
                        if(isOverlapping){
                            if(item.getAttribute("style")){
                                item.style.transform = "";
                                index ++
                            }else{
                                item.style.transform = `translateY(${distance}px)`;
                                index --
                            }

                            //swap nei dati
                            newData = data.filter(item => item.Id !== draggedElementData.Id);
                            newData.splice(index, 0 , draggedElementData);
                            newData.map((item,index) => item.posizione = index);
                        }
                    } )
                }

                //performo all'hover
                document.onpointermove = dragMove;

                //definisco la funzione di dragEnd che si esegue al rilascio del pulsante sinistro del mouse
                async function dragEnd () {
                    setData(newData)
                    await removeIndexToisDragging()
                    //reset degli eventi
                    document.onpointermove = resetrOnPointerMove;
                    //reset dello style dell elemento in dragging 
                    itemToDrag.style.position = "";
                    itemToDrag.style.zIndex = "";
                    itemToDrag.style.width = ""
                    itemToDrag.style.height = "";
                    itemToDrag.style.top = "";
                    itemToDrag.style.left = "";
                    itemToDrag.style.cursor = "";

                    //rimuovo il tempDiv
                    const tempDivToEliminate = document.getElementById('div-temp');
                    if(tempDivToEliminate){
                        tempDivToEliminate.remove();
                    };
                    
                };
            //eseguo dragEnd al rilascio del mouse sx
            document.onpointerup = dragEnd;
        }


        return(
            <>
                <div  className={`draggable-container ${isDragging === index ? 'dragging' : ''}`} >
                    <Box component={'div'} className='grab-icon' minHeight={'80px'} onPointerDown={(e) => dragStart(e, index)} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'10%'} >
                        <Icon  >
                            drag_indicator
                        </Icon>
                    </Box>
                    <Box  minHeight={'80px'} flexGrow={1} sx={{ cursor:'default'}}>
                        <Grid container sx={{border: '1px solid black'}}>
                            <Grid xs={12} md={12} lg={4} padding={'0 .5rem'} item>
                                <Custom_Select2 options={[]} />
                                <Custom_TextField backgroundColor='#fff' multiline maxRows={2} placeholder='descrizione attività' /> 
                            </Grid>
                            <Grid xs={12} md={6} lg={4} padding={'0 .5rem'} item>
                                <Custom_Select2  options={[]} placeholder='selziona utente...' />
                                <Custom_Select2 options={[]} placeholder='selziona gruppo...' />
                            </Grid>
                            <Grid xs={12} md={6} lg={4} padding={'0 .5rem'} item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {/* forse da sostituire con componente in AGD...da vedere */}
                                    <DatePicker disablePast sx={{backgroundColor:'#fff', width:'100%'}}/>
                                </LocalizationProvider>
                                <Custom_TextField backgroundColor='#fff' type='number' placeholder='Stima' endAdornment={<Icon>access_time</Icon>}/>
                            </Grid>
                        </Grid>
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
            <Box component={'div'} ref={containerRef} border={'1px solid red'} position={'relative'} minHeight={'300px'} padding={'.5rem 0rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={1}>
                {data && data.length === 0 &&
                    <NoActivityComponent/>

                }
                {
                    data &&  data.length > 0 &&
                    data.map((activity, index) =>
                        <ActivityComponent key={index} index={index} activity={activity} />
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
