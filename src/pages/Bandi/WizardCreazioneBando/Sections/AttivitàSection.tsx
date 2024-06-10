import { Box, Grid, Icon, IconButton, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AttivitaObj } from '../WizardCreazioneBando';
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { NoContentSvg } from '../../../../components/partials/svg/NoContentSvg';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { lista_tipi_attivita, selectOrganizzaDocumentoData, selectOrganizzaDocumentoSelect } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

type Props = {
    data: AttivitaObj[] | [];
    setData: React.Dispatch<React.SetStateAction<AttivitaObj[]>>;
}

export const AttivitàSection = ({ data, setData }: Props) => {

    //states
    const [isDragging, setIsDragging] = useState<number | undefined>(undefined);
    //lista delle attività selezionabili
    const listaAttivitaData = useSelector(selectOrganizzaDocumentoData)?.lista_tipi_attivita;
    const selectOptions = useSelector(selectOrganizzaDocumentoSelect);
    const modelliProcedimentoSelect = useSelector(selectOrganizzaDocumentoSelect)!.modelli_procedimento
    //ref per stabilire l'elemento da draggare
    const containerRef = useRef<HTMLDivElement>(null);

    function SelectActivityComponent({ selectOptions }: { selectOptions: Option[] | [] }) {

        const [modelliProcedimento, setModelliProcedimento] = useState<string | undefined>(undefined);

        function addAttivitaToList(value: string | number | undefined) {
            //se undefined non faccio nulla
            if (!value) return
            const uniqueId = uuid()
            //prendo l'oggetto attività alla lista delle attività nel redux state
            const selectedActivity = listaAttivitaData?.find((item) => item.fiActionId === value);

            if (selectedActivity) {
                const newActivityObj: AttivitaObj = {
                    Id: uniqueId,
                    actionId: selectedActivity.fiActionId,
                    actionDett: selectedActivity.fsAction,
                    actionDesc: selectedActivity.fsActionDescription,
                    actionName: selectedActivity.fsActionName,
                    delete: true,
                    posizione: data.length
                };

                setData(prev => [...prev, newActivityObj])
                setValue(undefined)
            };
        }

        useEffect(() => { console.log('DATA: ',data) }, [data])

        const [value, setValue] = useState<string | number | undefined>(undefined);

        return (
            <>
                <Box sx={{ backgroundColor: '#e9eaf7', borderRadius: '13px' }} display={'flex'} alignItems={'center'} >
                    <Box padding={'.5rem .5rem'} display={'flex'} alignItems={'center'}>
                        <Typography component={'span'} fontWeight={600} sx={{ color: '#42648a' }}> Aggiungi attività </Typography>
                        <Icon sx={{ color: '#42648a' }}>chevron_right</Icon>
                    </Box>
                    <Box paddingLeft={'.3rem'} paddingRight={'.3rem'} flexGrow={1} paddingTop={'.5rem'} >
                        <Custom_Select2 placeholder='Seleziona attività...' options={selectOptions} onChangeSelect={(newValue) => setValue(newValue!.value)} />
                    </Box>
                    <Box padding={'.5rem .5rem'} >
                        <ActionButton color='secondary' text='Aggiungi' startIcon={<Icon>add</Icon>} onClick={() => addAttivitaToList(value)} />
                    </Box>
                </Box>
            </>
        )
    }

    //componente che si visualizza quando non ci sono attività selezionate
    function NoActivityComponent() {
        return (
            <>
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <NoContentSvg width='200px' height='200px' />
                    <Typography sx={{ marginTop: '2rem', color: '#525354' }} fontSize={28} fontStyle={'bold'} textAlign={'center'}>Non ci sono attività da mostrare</Typography>
                </Box>
            </>
        )
    }

    function ActivityComponent({ index, activity, activityList }: { index: number, activity: AttivitaObj, activityList:lista_tipi_attivita[] | []}) {

        //trovo i valori delle select che utilizzo come default value
        const currentActivityValue = selectOptions!.tipi_attivita.find((item) => item.value === activity.actionId);
        const currentUserValue = selectOptions!.utenti.find((user) => user.value === activity.fiProcessOwnerId);
        const currentUserGroupValue = selectOptions!.gruppo_utenti.find((user) => user.value === activity.fiGruppoId);
        const currentDescriptionValue = activity.fsDescriptionOfUserActivity;
        const currentStimaValue = activity.fiExtimatedDuration;
        const descriptionRef = useRef<HTMLInputElement | null>(null);
        //states
        const [activityValue, setActivityValue] = useState<Option | null>(currentActivityValue!)
        const [user, setUser] = useState<Option | null>(currentUserValue!);
        const [userGroup, setUserGroup] = useState<Option | null>(currentUserGroupValue!);
        const [description, setDescription] = useState<string | null | undefined>(currentDescriptionValue);
        const [stima, setStima] = useState<number | string |null >(currentStimaValue? currentStimaValue : 0);
        

        //funzione con debounce applicata al campo descrizione per salvare i dati in origine
        //TODO: cercare di ripristinare il focus una volta cambiati i dati, si stimola un nuovo render una volta aggiornato il campo e per questo va ripristinato il focus
        useEffect(() => {

            if(description !== currentDescriptionValue ){
                const updateActivityDescription = setTimeout(() => {
                    const tempObj: AttivitaObj = {
                        ...activity,
                        fsDescriptionOfUserActivity: description,
                    }
                    setData(prev => prev.map((item) => item.Id === activity.Id ? tempObj : item));
                    if (descriptionRef.current) {
                        descriptionRef.current.focus();
                    }
                }, 2000);
                return () => clearTimeout(updateActivityDescription)
            }

        }, [description]);
   
        
        //FUNZIONALITA' DRAG AND DROP DEGLI ELEMENTI--------------------------------------------------------------------------------------------------------------------------------------
        // variabili di reset 
        const resetOnPointerMove = document.onpointermove;
        //funzione per verificare che il pulsante del mouse cliccato sia quello sinistro
        function detectLeftMouseClick(e: any) {
            if ("buttons" in e) {
                return e.buttons === 1;
            }
            let button = e.which || e.button;
            return button === 1;
        }

        async function dragStart(e: React.PointerEvent<HTMLDivElement>, index: number) {
            let dragStart = true;
            console.log('dragStart')
            //controllo che sia un click con il pulsante sinistro del mouse
            if (!detectLeftMouseClick(e)) return;
            //evito il comportamento di default dell'evento (selezione del testo o elementi html)
            e.preventDefault();

            /* (HACK FIX) => sviluippo una funzione asincrona che mi permette di aspettare che l'index venga effettivamente messo sulla variabile di state di useState, 
            * in quanto se fosse sincrono andrei ad applicare lo syle inline, 
            * poi l'index si setta sull indice dell elemento selezionato applicando la classe "dragging" che sovrascriverebbe lo style inline in quanto stimolerebbe un nuovo rendering.
            */
            async function addIndexToisDragging(index: number) {
                setIsDragging(index);
            }
            async function removeIndexToisDragging() {
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

            const itemsBelowDragItem = items.slice(index + 1);
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
            function dragMove(e: any) {
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
                    let isOverlapping = rect1.y < rect2.y + (rect2.height / 2) && rect1.y + (rect1.height / 2) > rect2.y;
                    //swap delle posizioni in UI
                    if (isOverlapping) {
                        if (item.getAttribute("style")) {
                            item.style.transform = "";
                            index++
                        } else {
                            item.style.transform = `translateY(${distance}px)`;
                            index--
                        }

                        //swap nei dati
                        newData = data.filter(item => item.Id !== draggedElementData.Id);
                        newData.splice(index, 0, draggedElementData);
                        newData.map((item, index) => item.posizione = index);
                    }
                })
            }

            //performo all'hover
            container!.onpointermove = dragMove;

            //definisco la funzione di dragEnd che si esegue al rilascio del pulsante sinistro del mouse
            async function dragEnd() {
                if(!dragStart) return;
                console.log('dragEnd')
                setData(newData)
                await removeIndexToisDragging()
                //reset degli eventi
                document.onpointermove = resetOnPointerMove;
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
                if (tempDivToEliminate) {
                    tempDivToEliminate.remove();
                };
                dragStart = false;
            };
            //eseguo dragEnd al rilascio del mouse sx
            document.onpointerup = dragEnd;
        }
        //END FUNZIONALITA' DRAG AND DROP DEGLI ELEMENTI--------------------------------------------------------------------------------------------------------------------------------------

        

        //funzioni per salvataggio dei campi e  cambio valori.
        function onActivityChange(newValue:Option) {

            //seleziono l'attività dalla lista attività per prendere i valori del nuovo oggetto
            const newActivity = activityList.find((item) => item.fiActionId === newValue.value)
            setActivityValue(newValue);

            if(newActivity){
                //salvo tutto l oggeto sostituendolo all'oggetto originale
                const tempObj: AttivitaObj={
                    Id: activity.Id,
                    actionDesc: newActivity.fsActionDescription,
                    actionDett: newActivity.fsAction,
                    actionId: newActivity.fiActionId,
                    actionName: newActivity.fsActionName,
                    delete: activity.delete,
                    posizione: activity.posizione,
                    fiExtimatedDuration: stima ,
                    fiGruppoId: userGroup? userGroup.value : userGroup,
                    fiProcessOwnerId: user? user.value : user,
                    fsDescriptionOfUserActivity:description,
                }

                const newData = data.map((item) => item.Id !== tempObj.Id ? item : tempObj);
                setData(newData);
            }
            
           
        }

        const handleSelectChange = (option: Option, field: string, setState:React.SetStateAction<any>) => {
            setState(option);

            const tempObj:AttivitaObj ={ 
                ...activity,
                [field]: option.value
            };

            setData(prevData => {
                const newData = prevData.map((item) => item.Id === tempObj.Id ? tempObj : item);
                return newData;
            });
        };
        
        return (
            <>
                <div className={`draggable-container ${isDragging === index ? 'dragging' : ''}`} >
                    <Box component={'div'} className='grab-icon'  onPointerDown={(e) => dragStart(e, index)} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'30px'} >
                        <Icon sx={{marginTop:'5px'}} >
                            drag_indicator
                        </Icon>
                    </Box>
                    <Box  flexGrow={1} sx={{ cursor: 'default' }}>
                        <Grid container>
                            <Grid xs={12} md={12} lg={4} padding={'0 .5rem'} item display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                                <Custom_Select2
                                    options={selectOptions!.tipi_attivita}
                                    //defaultValue={currentActivityValue}
                                    value={activityValue}
                                    onChangeSelect={newValue => onActivityChange(newValue as Option)}
                                    marginBottom='.2rem'
                                />

                                <Custom_TextField
                                    backgroundColor='#fff'
                                    multiline 
                                    maxRows={2}
                                    minRows={1.4}
                                    placeholder='descrizione attività'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    sx={{marginBottom:'0px'}}
                                />

                            </Grid>
                            <Grid xs={12} md={6} lg={4} padding={'0 .5rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} item>
                                <Custom_Select2
                                    marginBottom='0px'
                                    options={selectOptions!.utenti}
                                    defaultValue={currentUserValue}
                                    value={user}
                                    onChangeSelect={newValue => handleSelectChange(newValue as Option, 'fiProcessOwnerId', setUser)}
                                    placeholder='selziona utente...'
                                />

                                <Custom_Select2 
                                    options={selectOptions!.gruppo_utenti}
                                    placeholder='selziona gruppo...'
                                    value={userGroup}
                                    onChangeSelect={newValue => handleSelectChange(newValue as Option, 'fiGruppoId', setUserGroup)}
                                    defaultValue={currentUserGroupValue}
                                    marginBottom='0px'
                                />

                            </Grid>
                            <Grid xs={12} md={6} lg={4} padding={'0 .5rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} item>
                                <Custom_TextField
                                        backgroundColor='#fff'
                                        type='text'
                                        placeholder='DATEPICKER '
                                        endAdornment={<Icon>access_time</Icon>}
                                        sx={{marginBottom:'3px', marginTop:'5px'}}
                                    />
                                
                                <Custom_TextField
                                    backgroundColor='#fff'
                                    type='number'
                                    placeholder='Stima'
                                    value={stima}
                                    onChange={(e) => setStima(e.target.value)}
                                    endAdornment={<Icon>access_time</Icon>}
                                    sx={{marginBottom:'0px', marginTop:'3px'}}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box  width={'45px'} sx={{ cursor: 'default' }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <IconButton sx={{marginRight:'10px', marginTop:'5px'}} size='large'>
                            <Icon color='error'>
                                delete
                            </Icon>
                        </IconButton>
                    </Box>
                </div>
            </>
        )
    }

    return (
        <>
            <Box className={'attivita-container'} sx={{ minHeight: '250px' }}>
                <Box component={'div'} ref={containerRef} position={'relative'} minHeight={'300px'} padding={'.5rem 0rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={1}>
                    {data && data.length === 0 &&
                        <NoActivityComponent />
                    }
                    {
                        data && data.length > 0 &&
                        data.map((activity, index) =>
                            <ActivityComponent key={index} index={index} activity={activity} activityList={listaAttivitaData!}/>
                        )
                    }
                </Box>
                <Box >
                    <SelectActivityComponent selectOptions={selectOptions!.tipi_attivita} />
                </Box>
            </Box>
        </>
    )
}
