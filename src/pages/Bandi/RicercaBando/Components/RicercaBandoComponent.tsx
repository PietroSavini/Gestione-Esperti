import { Box, Collapse, Divider, Grid, Icon } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { Filters, useRicercaBandoContext } from '../RicercaBandoContext'
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { Custom_TextField } from '../../../../components/partials/Inputs/CustomITextField';
import { ActionButton } from '../../../../components/partials/Buttons/ActionButton';
import { Custom_DatePicker } from '../../../../components/partials/Inputs/Custom_DatePicker';
import useDebounce from '../../../../app/Hooks/useDebounceHook';
import dayjs from 'dayjs';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';

type Props = {
    setRows: React.Dispatch<React.SetStateAction<any[]>>
}
export const RicercaBandoComponent = (props : Props) => {

    const { filters, setFilters } = useRicercaBandoContext().filtriRicerca;
    const { tipologiaEsperto, users } = useRicercaBandoContext().selectValues;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const options = {
        annoRif: [
            {
                value: 2024,
                label: "2024"
        

            },
            {
                value: 2025,
                label: "2025",
            },
            {
                value: 2026,
                label: "2026"

            },
            {
                value: 2027,
                label: "2027"

            },
            {
                value: 2028,
                label: "2028"

            },
            {
                value: 2029,
                label: "2029"

            },
            {
                value: 2030,
                label: "2030"

            },
        ],
        TipologiaEsperto: tipologiaEsperto,
        users: users,
        StatoBando: [
            {
                value: 0,
                label: "In Costruzione"

            },
            {
                value: 1,
                label: "Pubblicato"

            },
            {
                value: 2,
                label: "In Attesa di Procedimento"

            },
        ]

    }

    const handleSearch = async () => {
        AXIOS_HTTP.Retrieve({ url: '/api/launch/retrieve', sModule: 'GET_BANDI', sService: 'READ_BANDI', body: filters })
            .then((resp) => {
                const searchResult = resp.response;
                props.setRows(searchResult);
            })
            .catch(err => console.error(err))
    }

    const handleChange = useDebounce((newValue: any, field: string) => {
        let newFilters: Filters = {
            ...filters
        }

        switch (field) {

            case 'anno-riferimento':
                newFilters.anno = newValue ? parseInt(newValue.value) : null;
                setFilters(newFilters);
                break;

            case 'TEsp':
                newFilters.TEsp = newValue ? newValue.value : null;
                setFilters(newFilters);
                break;

            case 'parola-chiave':
                newFilters.searchPattern = newValue;
                setFilters(newFilters);
                break;

            case 'numero-protocollo':
                newFilters.numeroProtocollo = newValue;
                setFilters(newFilters);
                break;

            case 'numero-procedimento':
                newFilters.numeroProcedimento = newValue;
                setFilters(newFilters);
                break;

            case 'stato-bando':
                newFilters.stato = newValue ? newValue.value : null;
                setFilters(newFilters);
                break;

            case 'caricato-da':
                newFilters.utenteFirmatario = newValue ? newValue.value : null;
                setFilters(newFilters);
                break;

            case 'creato-il':
                if(newValue !== null){
                    const date = dayjs(newValue).format("YYYY/MM/DD");
                    newFilters.dataCreazione = date;
                    setFilters(newFilters);
                }else{
                    newFilters.dataCreazione = null;
                    setFilters(newFilters);
                }
                break;
        }

    }, 300)

    const resetlFilters = () => {

        const resetFilters: Filters = {
            ...filters,
            numeroProtocollo: null,
            numeroProcedimento: null,
            stato: null,
            utenteFirmatario: null,
            dataCreazione: null,
        };

        // resetta tutti gli state degli input
        setFilters(resetFilters);
    };

    //watcher per pulire i filtri se si effettua quando isOpen è false
    useEffect(() => {
        if (!isOpen) {
            resetlFilters();
        }
    }, [isOpen]);

    return (
        <Box sx={{margin:'0 1rem'}}>
            <Box>
                <Grid container>
                    <Grid item xs={12} sm={6} lg={3} padding={'0 .5rem'}> <Custom_Select2 onChangeSelect={(newValue) => handleChange(newValue, 'anno-riferimento')} label='Anno di riferimento' isClearable options={options.annoRif} defaultValue={options.annoRif[0]} /></Grid>
                    <Grid item xs={12} sm={6} lg={3} padding={'0 .5rem'}> <Custom_Select2 onChangeSelect={(newValue) => handleChange(newValue, 'TEsp')} label='Tipologia Esperto' isClearable options={options.TipologiaEsperto} /></Grid>
                    <Grid item xs={12} sm={6} lg={4} padding={'0 .5rem'}> <Custom_TextField onChange={(e) => handleChange(e.target.value, 'parola-chiave')} backgroundColor='#fff' label={'Parola chiave'} placeholder='Inserisci parola chiave...' /></Grid>
                    <Grid item xs={12} sm={6} lg={2} display={'flex'} justifyContent={'end'} alignItems={'center'} padding={'0 .5rem'} gap={1} marginBottom={1}>
                        <ActionButton onClick={() => handleSearch()} sx={{ minHeight: '40px', maxHeight: '50px', marginTop: '9px' }} color='secondary' text='Cerca' endIcon={<Icon>search</Icon>} />
                        <ActionButton onClick={() => setIsOpen(!isOpen)} sx={{ minHeight: '40px', maxHeight: '50px', marginTop: '10px' }} color={isOpen ? 'error' : 'warning'} text={isOpen ? 'Annulla' : 'Ricerca Avanzata'} endIcon={<Icon>{isOpen ? 'filter_alt_off' : 'filter_alt'}</Icon>} />
                    </Grid>
                </Grid>
                <Divider />
            </Box>

            <Collapse sx={{ backgroundColor: 'aliceblue', borderTop: '1px efefef' }} in={isOpen} timeout={'auto'} unmountOnExit>
                <Grid container padding={'1rem 0'}>
                    <Grid item xs={12} sm={6} lg={4} padding={'0 .5rem'}> <Custom_TextField onChange={(e) => handleChange(e.target.value, 'numero-protocollo')} label={'Numero Protocollo'} backgroundColor='#fff' type='number' placeholder='numero protocollo...' /></Grid>
                    <Grid item xs={12} sm={6} lg={4} padding={'0 .5rem'}> <Custom_TextField onChange={(e) => handleChange(e.target.value, 'numero-procedimento')} label={'Numero Procedimento'} backgroundColor='#fff' type='number' placeholder='numero procedimento...' /></Grid>
                    <Grid item xs={12} sm={6} lg={4} padding={'0 .5rem'}> <Custom_Select2 onChangeSelect={(newValue) => handleChange(newValue, 'stato-bando')} label={'Stato del Bando'} placeholder='Seleziona lo stato del bando...' options={options.StatoBando} /></Grid>
                    <Grid item xs={12} sm={6} lg={6} padding={'0 .5rem'}> <Custom_Select2 onChangeSelect={(newValue) => handleChange(newValue, 'caricato-da')} label={'Caricato da'} placeholder="Seleziona l'utente..." options={options.users} /></Grid>
                    <Grid item xs={12} sm={6} lg={6} padding={'0 .5rem'}> <Custom_DatePicker onChange={(date) => handleChange(date, 'creato-il')} label={'Creato il'} /> </Grid>
                </Grid>
                <Divider />
            </Collapse>
        </Box>
    )
}
