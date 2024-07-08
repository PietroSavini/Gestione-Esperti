import { Box, Grid, Icon, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { NoContentSvg } from '../../../../components/partials/svg/NoContentSvg';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { lista_tipi_attivita, selectOrganizzaDocumentoData, selectOrganizzaDocumentoSelect } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { AttivitaObj, useWizardBandoContext } from '../WizardBandoContext';

// type Props = {
//     data: AttivitaObj[] | [];
//     setData: React.Dispatch<React.SetStateAction<AttivitaObj[]>>;
// }

export const AttivitàSection = () => {

    //states
    const [isDragging, setIsDragging] = useState<number | undefined>(undefined);
    //lista delle attività selezionabili
    const listaAttivitaData = useSelector(selectOrganizzaDocumentoData)?.lista_tipi_attivita;
    const selectOptions = useSelector(selectOrganizzaDocumentoSelect);
    const modelliProcedimentoSelect = useSelector(selectOrganizzaDocumentoSelect)!.modelli_procedimento
    //ref per stabilire l'elemento da draggare
    const containerRef = useRef<HTMLDivElement>(null);

    //prendo i dati dal contextprovider
    const attivitaData = useWizardBandoContext().attivita;
    const data = attivitaData.listaAttivita;
    const setData = attivitaData.setListaAttivita;

    const nonEditableData = data.filter((item) => item.delete === false);
    const editableData = data.filter((item) => item.delete === true);

    

    return (
        <>
            <Box className={'attivita-container'} sx={{ minHeight: '350px' }} padding={'.5rem 0rem'} position={'relative'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
                <Box>
                    <Box marginBottom={'8px'} display={'flex'} flexDirection={'column'} gap={1}>
                        {data && data.length === 0 &&
                            <NoActivityComponent />
                        }
                        {
                            nonEditableData.map((activity, index) =>
                                <NonEditableActivityComponent key={index} activity={activity} />
                        )
                    }
                    </Box>
                    
                    { editableData && 
                        <Box component={'div'} ref={containerRef} display={'flex'} flexDirection={'column'} gap={1} paddingBottom={'8px'}>
                            {  editableData.map((activity, index) =>
                                <ActivityComponent key={index} index={index} activity={activity} activityList={listaAttivitaData!} isDragging={isDragging} setIsDragging={setIsDragging} containerRef={containerRef} data={editableData} otherData={nonEditableData} setData={setData} />
                            )}
                        </Box>
                    }
                </Box>
                <Box >
                    <SelectActivityComponent data={data} setData={setData} selectOptions={selectOptions!.tipi_attivita} />
                </Box>
            </Box>
        </>
    )
}

const NonEditableActivityComponent = ({ activity }: {activity: AttivitaObj}) => {

    const selectOptions = useSelector(selectOrganizzaDocumentoSelect);
    const assignedUser = selectOptions?.utenti.find( (item) => item.value === activity.fiUserId)?.label
    const assignedGroup = selectOptions?.gruppo_utenti.find((item) => item.value === activity.fiGruppoId)?.label
    
    return (
        <Box className='non-editable-activity' sx={{border:'1px solid rgba(196, 194, 194, 0.641)', borderRadius:'10px' }} >
            <Box sx={{backgroundColor:'#fff', padding:'.5rem .5rem', borderTopLeftRadius:'10px', borderTopRightRadius:'10px'}}>
                <Grid container>
                    <Grid item padding={'.2rem .3rem'} lg={3} md={6} xs={5} display={'flex'} alignItems={'center'}>
                        <Typography fontSize={'.8rem'}>{activity.fsActionName}</Typography>
                    </Grid>
                    <Grid item padding={'.2rem .3rem'}  lg={3} md={6} xs={5} display={'flex'} alignItems={'center'}>
                        { assignedUser && <Icon sx={{marginRight:'10px'}}>account_circle</Icon>} 
                        <Typography fontSize={'.8rem'} > {assignedUser ? assignedUser : 'nessun utente selezionato'}</Typography>
                    </Grid>
                    <Grid item padding={'.2rem .3rem'} lg={3} md={6} xs={2} display={'flex'} alignItems={'center'}>
                        <Typography fontSize={'.8rem'}>{assignedGroup ? assignedGroup : 'nessun gruppo selezionato'}</Typography>
                    </Grid>
                    <Grid item padding={'.2rem .3rem'} lg={3} md={6} xs={12} display={'flex'} gap={1} alignItems={'center'} >
                        <Custom_TextField
                            placeholder='Scadenza'
                            endAdornment={<Icon>calendar_month</Icon>}
                            sx={{marginBottom:0}}
                        />
                        <Custom_TextField
                            placeholder='Stima'
                            endAdornment={<Icon>access_time</Icon>}
                            sx={{marginBottom:0}}
                        />
                    </Grid>
                </Grid>
                
            </Box>
            <Box sx={{backgroundColor:'aliceblue', padding:'1rem .7rem', borderBottomLeftRadius:'10px', borderBottomRightRadius:'10px'}}>
                <Typography fontSize={'.8rem'}>{activity.fsDescriptionOfUserActivity}</Typography>
            </Box>
        </Box>
    )
}

const ActivityComponent = ({ index, activity, activityList, isDragging, setIsDragging, containerRef, data, setData, otherData }: { index: number, activity: AttivitaObj, activityList: lista_tipi_attivita[] | [], isDragging: number | undefined, setIsDragging: React.Dispatch<React.SetStateAction<number | undefined>>, containerRef: React.RefObject<HTMLDivElement>, data: AttivitaObj[], setData: React.Dispatch<React.SetStateAction<AttivitaObj[]>> , otherData:AttivitaObj[]}) => {

    const selectOptions = useSelector(selectOrganizzaDocumentoSelect);
    //trovo i valori delle select che utilizzo come default value
    useEffect(() => {
        setUser(selectOptions!.utenti.find((user) => user.value === activity.fiUserId)!)
        setActivityValue(selectOptions!.tipi_attivita.find((item) => item.value === activity.actionId)!);
        setUserGroup(selectOptions!.gruppo_utenti.find((user) => user.value === activity.fiGruppoId)!);
        setDescription(activity.fsDescriptionOfUserActivity);
        setStima(activity.fiExtimatedDuration ? activity.fiExtimatedDuration : 0)
    }, [activity])

    //states
    const [activityValue, setActivityValue] = useState<Option | null>(null)
    const [user, setUser] = useState<Option | null>(null);
    const [userGroup, setUserGroup] = useState<Option | null>(null);
    const [description, setDescription] = useState<string | null | undefined>('');
    const [stima, setStima] = useState<number | string | null>(0);

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
        //assegno l'index ad 'isDragging' in modo da assegnare la classe "dragging" all elemento che sto draggando
        // Calcola l'indice effettivo degli elementi modificabili
        setIsDragging(index);
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
        document.onpointermove = dragMove;
        //definisco la funzione di dragEnd che si esegue al rilascio del pulsante sinistro del mouse
        async function dragEnd() {
            if (!dragStart) return;
            console.log('dragEnd');
            setData([...otherData,...newData]);
            setIsDragging(undefined);
            document.onpointermove = resetOnPointerMove;
            //reset dello style dell elemento in dragging 
            itemToDrag.style.position = "";
            itemToDrag.style.zIndex = "";
            itemToDrag.style.width = ""
            itemToDrag.style.height = "";
            itemToDrag.style.top = "";
            itemToDrag.style.left = "";
            itemToDrag.style.cursor = "";
            itemToDrag.style.transform = "";
            //reset dello stle degli altri elementi
            notDragItems.forEach((item) => item.style.transform = "");
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
    function onActivityChange(newValue: Option) {

        //seleziono l'attività dalla lista attività per prendere i valori del nuovo oggetto
        const newActivity = activityList.find((item) => item.fiActionId === newValue.value)
        setActivityValue(newValue);

        if (newActivity) {
            //salvo tutto l oggeto sostituendolo all'oggetto originale
            const tempObj: AttivitaObj = {
                Id: activity.Id,
                actionDesc: newActivity.fsActionDescription,
                actionDett: newActivity.fsAction,
                actionId: newActivity.fiActionId,
                actionName: newActivity.fsActionName,
                delete: activity.delete,
                posizione: activity.posizione,
                fiExtimatedDuration: stima,
                fiGruppoId: userGroup ? userGroup.value : userGroup,
                fiUserId: user ? user.value as number : user,
                fsDescriptionOfUserActivity: description,
            }

            const newData = data.map((item) => item.Id !== tempObj.Id ? item : tempObj);
            setData([...otherData,...newData]);
        }


    }

    const handleSelectChange = (option: Option, field: string, setState: React.SetStateAction<any>) => {
        setState(option);

        const tempObj: AttivitaObj = {
            ...activity,
            [field]: option.value
        };

        const newData = data.map((item) => item.Id === tempObj.Id ? tempObj : item);
        setData([...otherData,...newData]);
    };

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;

        const tempObj: AttivitaObj = {
            ...activity,
            [field]: value
        };

        const newData = data.map((item) => item.Id === tempObj.Id ? tempObj : item);
        setData([...otherData,...newData]);;
        setDescription(value)

    };

    function handleActivityDelete(id: string | number) {
        const newData = data.filter((item) => item.Id !== id);
        setData([...otherData, ...newData]);
    }

    return (
        <>


            <Box className={`draggable-container ${isDragging === index ? 'dragging' : ''}`} >
                <Box component={'div'} className='grab-icon' onPointerDown={(e) => dragStart(e, index)} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'30px'} >
                    <Icon sx={{ marginTop: '5px', marginLeft: '5px' }} >
                        drag_indicator
                    </Icon>
                </Box>
                <Box flexGrow={1} sx={{ cursor: 'default' }}>
                    <Grid container>
                        <Grid xs={12} md={12} lg={6} padding={'0 .5rem'} item display={'flex'} flexDirection={'column'} justifyContent={'center'}>
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
                                onChange={(e) => handleInputChange(e, 'fsDescriptionOfUserActivity')}
                                sx={{ marginBottom: '0px' }}
                            />

                        </Grid>
                        <Grid xs={12} md={6} lg={4} padding={'0 .5rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} item>
                            <Custom_Select2
                                options={selectOptions!.utenti}
                                defaultValue={user}
                                value={user}
                                onChangeSelect={newValue => handleSelectChange(newValue as Option, 'fiUserId', setUser)}
                                placeholder='selziona utente...'
                                marginBottom='1px'
                            />

                            <Custom_Select2
                                options={selectOptions!.gruppo_utenti}
                                placeholder='selziona gruppo...'
                                value={userGroup}
                                onChangeSelect={newValue => handleSelectChange(newValue as Option, 'fiGruppoId', setUserGroup)}
                                defaultValue={userGroup}
                                marginBottom='0px'
                            />

                        </Grid>
                        <Grid xs={12} md={6} lg={2} padding={'0 .5rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} item>
                            <Custom_TextField
                                backgroundColor='#fff'
                                type='text'
                                placeholder='DATEPICKER '
                                endAdornment={<Icon>access_time</Icon>}
                                sx={{ marginBottom: '5px', marginTop: '5px' }}
                            />

                            <Custom_TextField
                                backgroundColor='#fff'
                                type='number'
                                placeholder='Stima'
                                value={stima}
                                onChange={(e) => setStima(e.target.value)}
                                endAdornment={<Icon>access_time</Icon>}
                                sx={{ marginBottom: '0px', marginTop: '3px' }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box width={'45px'} sx={{ cursor: 'default' }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <IconButton sx={{ marginRight: '10px', marginTop: '5px' }} size='large' onClick={() => handleActivityDelete(activity.Id)}>
                        <Icon color='error' >
                            delete
                        </Icon>
                    </IconButton>
                </Box>
            </Box>
            
        </>
    )
}


function SelectActivityComponent({ selectOptions, data, setData }: { selectOptions: Option[] | [], data: AttivitaObj[], setData: React.Dispatch<React.SetStateAction<AttivitaObj[]>> }) {

    const [modelliProcedimento, setModelliProcedimento] = useState<string | undefined>(undefined);
    const listaAttivitaData = useSelector(selectOrganizzaDocumentoData)?.lista_tipi_attivita;

    // const attivitaData = useWizardBandoContext().attivita;
    // const data = attivitaData.listaAttivita;
    // const setData = attivitaData.setListaAttivita;

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

//componente per attivtà non editabili