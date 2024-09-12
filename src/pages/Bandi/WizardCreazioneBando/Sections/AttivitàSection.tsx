import { Box, Grid, Icon, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { NoContentSvg } from '../../../../components/partials/svg/NoContentSvg';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { lista_tipi_attivita, selectOrganizzaDocumentoData, selectOrganizzaDocumentoSelect } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { AttivitaObj, useWizardBandoContext } from '../WizardBandoContext';
import useDebounce from '../../../../app/Hooks/useDebounceHook';
import { NoResultComponent } from '../../../../components/partials/placeholders/NoResultComponent';

export const AttivitàSection = () => {
    //states
    const [isDragging, setIsDragging] = useState<number | undefined>(undefined);
    //lista delle attività selezionabili
    const listaAttivitaData = useSelector(selectOrganizzaDocumentoData)?.lista_tipi_attivita;
    const selectOptions = useSelector(selectOrganizzaDocumentoSelect);
    const modelliProcedimentoSelect = useSelector(selectOrganizzaDocumentoSelect)?.modelli_procedimento;
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
                            <NoResultComponent message='Non ci sono attività da mostrare' />
                        }
                        {
                            nonEditableData.map((activity, index) =>
                                <NonEditableActivityComponent key={index} activity={activity} />
                            )
                        }
                    </Box>

                    {editableData &&
                        <Box component={'div'} ref={containerRef} display={'flex'} flexDirection={'column'} gap={1} paddingBottom={'8px'}>
                            {editableData.map((activity, index) =>
                                <ActivityComponent key={index} index={index} activity={activity} activityList={listaAttivitaData!} isDragging={isDragging} setIsDragging={setIsDragging} containerRef={containerRef} data={editableData} otherData={nonEditableData} setData={setData}/>
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

const NonEditableActivityComponent = ({ activity }: { activity: AttivitaObj }) => {

    const selectOptions = useSelector(selectOrganizzaDocumentoSelect);
    const assignedUser = selectOptions?.utenti_firmatari.find((item) => item.value === activity.utente)?.label
    const assignedGroup = selectOptions?.gruppo_utenti.find((item) => item.value === activity.gruppoUtenti)?.label;

    return (
        <Box className='non-editable-activity' sx={{ border: '1px solid rgba(196, 194, 194, 0.641)', borderRadius: '10px' }} >
            <Box sx={{ backgroundColor: '#fff', padding: '.5rem .5rem', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <Grid container>
                    <Grid item padding={'.2rem .3rem'} lg={3} md={6} xs={5} display={'flex'} alignItems={'center'}>
                        <Typography fontSize={'.8rem'}>{activity.actionName}</Typography>
                    </Grid>
                    <Grid item padding={'.2rem .3rem'} lg={3} md={6} xs={5} display={'flex'} alignItems={'center'}>
                        {assignedUser && <Icon sx={{ marginRight: '10px' }}>account_circle</Icon>}
                        <Typography fontSize={'.8rem'} > {assignedUser ? assignedUser : 'nessun utente selezionato'}</Typography>
                    </Grid>
                    <Grid item padding={'.2rem .3rem'} lg={3} md={6} xs={2} display={'flex'} alignItems={'center'}>
                        <Typography fontSize={'.8rem'}>{assignedGroup ? assignedGroup : 'nessun gruppo selezionato'}</Typography>
                    </Grid>
                    <Grid item padding={'.2rem .3rem'} lg={3} md={6} xs={12} display={'flex'} gap={1} alignItems={'center'} >
                        <Custom_TextField
                            placeholder='Scadenza'
                            endAdornment={<Icon>calendar_month</Icon>}
                            sx={{ marginBottom: 0 }}
                        />
                        <Custom_TextField
                            placeholder='Stima'
                            endAdornment={<Icon>access_time</Icon>}
                            sx={{ marginBottom: 0 }}
                        />
                    </Grid>
                </Grid>

            </Box>
            <Box sx={{ backgroundColor: 'aliceblue', padding: '1rem .7rem', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
                <Typography fontSize={'.8rem'}>{activity.descrizioneAttivitaUtente}</Typography>
            </Box>
        </Box>
    )
};

const ActivityComponent = ({ index, activity, activityList, isDragging, setIsDragging, containerRef, data, setData, otherData }: { index: number, activity: AttivitaObj, activityList: lista_tipi_attivita[] | [], isDragging: number | undefined, setIsDragging: React.Dispatch<React.SetStateAction<number | undefined>>, containerRef: React.RefObject<HTMLDivElement>, data: AttivitaObj[], setData: React.Dispatch<React.SetStateAction<AttivitaObj[]>>, otherData: AttivitaObj[] }) => {

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
    };

    async function dragStart(e: React.PointerEvent<HTMLDivElement>, index: number) {

        let dragStart = true;
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
        const notDragItems = items.filter((_, i) => i !== index);
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
        });

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
                };
            });
        };
        //performo all'hover
        document.onpointermove = dragMove;
        //definisco la funzione di dragEnd che si esegue al rilascio del pulsante sinistro del mouse
        async function dragEnd() {
            if (!dragStart) return;
            setData([...otherData, ...newData]);
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
    };

    function onActivityChange(newValue: Option) {

        //seleziono l'attività dalla lista attività per prendere i valori del nuovo oggetto
        const newActivity = activityList.find((item) => item.actionId === newValue.value);
        setActivityValue(newValue);

        if (newActivity) {
            //salvo tutto l oggeto sostituendolo all'oggetto originale
            const tempObj: AttivitaObj = {
                Id: activity.Id,
                delete: activity.delete,
                posizione: activity.posizione,
                scadenza: stima,
                gruppoUtenti: userGroup ? userGroup.value : userGroup,
                utente: user ? user.value as number : user,
                descrizioneAttivitaUtente: description,
                ...newActivity
            };
            const newData = data.map((item) => item.Id !== tempObj.Id ? item : tempObj);
            setData([...otherData, ...newData]);
        };
    };

    //END FUNZIONALITA' DRAG AND DROP DEGLI ELEMENTI--------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const selectOptions = useSelector(selectOrganizzaDocumentoSelect);
    //initial values
    useEffect(() => {
        setActivityValue(selectOptions?.tipi_attivita.find((item) => item.value === activity.actionId));
        setUser(selectOptions?.utenti_firmatari.find((item) => item.value === activity.utente));
        setUserGroup(selectOptions?.gruppo_utenti.find((item) => item.value === activity.gruppoUtenti)) ;
        setDescription(activity.descrizioneAttivitaUtente ? activity.descrizioneAttivitaUtente : '');
        setStima(activity.stima ? activity.stima : '0');
    },[data])

    
    //states
    const [activityValue, setActivityValue] = useState<Option | undefined>(undefined);
    const [user, setUser] = useState<Option | undefined>(undefined);
    const [userGroup, setUserGroup] = useState<Option | undefined>(undefined);
    const [description, setDescription] = useState<string>('');
    const [stima, setStima] = useState<string | number>('');
    //da aggiungere scadenza attività
    
    //useEffect utilizzato per forzare il rendering dei valori, se tolto avviene lo swap delle posizioni nei dati ma non avviene il cambio dei valori nei campi in UI
  

    //funzioni per salvataggio dei campi e  cambio valori.
    const handleSelectChange = (option: Option, field: string, setState: React.SetStateAction<any>) => {
        setState(option);
        const tempObj: AttivitaObj = {
            ...activity,
            [field]: option.value
        };
        const newData = data.map((item) => item.Id === tempObj.Id ? tempObj : item);
        setData([...otherData, ...newData]);
    };

    const handleInputChange = useDebounce((value: any, field: string) => {
        const tempObj: AttivitaObj = {
            ...activity,
            [field]: value
        };
        const newData = data.map((item) => item.Id === activity.Id ? tempObj : item);
        setData([...otherData, ...newData]);
    },200);

    function handleActivityDelete(id: string | number) {
        const newData = data.filter((item) => item.Id !== id);
        setData([...otherData, ...newData]);
    };

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
                                onChange={(e)=> {
                                    setDescription(e.target.value)
                                    handleInputChange(e.target.value, 'descrizioneAttivitaUtente')}}
                                sx={{ marginBottom: '0px' }}
                            />

                        </Grid>
                        <Grid xs={12} md={6} lg={4} padding={'0 .5rem'} display={'flex'} flexDirection={'column'} justifyContent={'center'} item>
                            <Custom_Select2
                                options={selectOptions!.utenti_firmatari}
                                defaultValue={user}
                                value={user}
                                onChangeSelect={newValue => handleSelectChange(newValue as Option, 'utente', setUser)}
                                placeholder='selziona utente...'
                                marginBottom='1px'
                            />

                            <Custom_Select2
                                options={selectOptions!.gruppo_utenti}
                                placeholder='selziona gruppo...'
                                value={userGroup}
                                onChangeSelect={newValue => handleSelectChange(newValue as Option, 'gruppoUtenti', setUserGroup)}
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
};

function SelectActivityComponent({ selectOptions, data, setData }: { selectOptions: Option[] | [], data: AttivitaObj[], setData: React.Dispatch<React.SetStateAction<AttivitaObj[]>> }) {

    const [modelliProcedimento, setModelliProcedimento] = useState<string | undefined>(undefined);
    const listaAttivitaData = useSelector(selectOrganizzaDocumentoData)?.lista_tipi_attivita;
    const [value, setValue] = useState<string | number | undefined>(undefined);

    function addAttivitaToList(value: string | number | undefined) {
        //se undefined non faccio nulla
        if (!value) return
        const uniqueId = uuid()
        //prendo l'oggetto attività alla lista delle attività nel redux state
        const selectedActivity = listaAttivitaData?.find((item) => item.actionId === value);

        if (selectedActivity) {
            const newActivityObj: AttivitaObj = {
                Id: uniqueId,
                delete: true,
                posizione: data.length,
                ...selectedActivity
            };

            setData(prev => [...prev, newActivityObj])
            setValue(undefined)
        };
    };

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
};


