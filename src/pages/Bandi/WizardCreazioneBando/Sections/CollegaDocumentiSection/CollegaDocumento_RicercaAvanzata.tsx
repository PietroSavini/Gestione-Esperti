import { Box, Grid, Icon, Divider, Collapse } from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import AXIOS_HTTP from "../../../../../app/AXIOS_ENGINE/AXIOS_HTTP";
import useDebounce from "../../../../../app/Hooks/useDebounceHook";
import { ActionButton } from "../../../../../components/partials/Buttons/ActionButton";
import { Custom_DatePicker } from "../../../../../components/partials/Inputs/Custom_DatePicker";
import { Custom_Select2 } from "../../../../../components/partials/Inputs/Custom_Select2";
import { Custom_TextField } from "../../../../../components/partials/Inputs/CustomITextField";
import { Filters } from "../../../RicercaBando/RicercaBandoContext";

type Props = {
    setRows: React.Dispatch<React.SetStateAction<any[]>>
}

export const CollegaDocumento_RicercaAvanzata = (props: Props) => {
    const [filters, setFilters] = useState<any>({})
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

    }

    const handleSearch = async () => {

    }

    const handleChange = useDebounce((newValue: any, field: string) => {
        let newFilters: any = {
            ...filters
        }

        switch (field) {

            case 'anno-riferimento':
                newFilters.anno = newValue ? parseInt(newValue.value) : null;
                setFilters(newFilters);
                break;

            case 'creato-il':
                if (newValue !== null) {
                    const date = dayjs(newValue).format("YYYY/MM/DD");
                    newFilters.dataCreazione = date;
                    setFilters(newFilters);
                } else {
                    newFilters.dataCreazione = null;
                    setFilters(newFilters);
                }
                break;
        }

    }, 300)

    const resetFilters = () => {

        const resetFilters = {};
        // resetta tutti gli state degli input
        setFilters(resetFilters);
    };

    //watcher per pulire i filtri se si effettua quando isOpen è false
    useEffect(() => {
        if (!isOpen) {
            resetFilters();
        }
    }, [isOpen]);

    return (
        <Box sx={{ margin: '0 1rem' }}>
            <Box>
                <Grid container>
                    <Grid item xs={12} sm={8} lg={6} padding={'0 .5rem'}>
                        <Custom_TextField
                            onChange={(e) => handleChange(e.target.value, 'parola-chiave')}
                            backgroundColor='#fff'
                            label={'Parola chiave'}
                            placeholder='Inserisci parola chiave...'
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} lg={3} padding={'0 .5rem'}>
                        <Custom_Select2
                            onChangeSelect={(newValue) => handleChange(newValue, 'anno-riferimento')}
                            label='Anno di riferimento'
                            isClearable
                            options={options.annoRif}
                            defaultValue={options.annoRif[0]}
                        />

                    </Grid>
                    <Grid item xs={12} sm={12} lg={3} display={'flex'} justifyContent={'end'} alignItems={'center'} padding={'0 .5rem'} gap={1} marginBottom={1}>
                        <ActionButton
                            onClick={() => handleSearch()}
                            sx={{ minHeight: '40px', maxHeight: '50px', marginTop: '9px' }}
                            color='secondary'
                            text='Cerca'
                            endIcon={<Icon>search</Icon>}
                        />
                        <ActionButton
                            onClick={() => setIsOpen(!isOpen)}
                            sx={{ minHeight: '40px', maxHeight: '50px', marginTop: '10px' }}
                            color={isOpen ? 'error' : 'warning'} text={isOpen ? 'Annulla' : 'Ricerca Avanzata'}
                            endIcon={<Icon>{isOpen ? 'filter_alt_off' : 'filter_alt'}</Icon>}
                        />
                    </Grid>
                </Grid>
                <Divider />
            </Box>

            <Collapse sx={{ backgroundColor: 'aliceblue', borderTop: '1px efefef' }} in={isOpen} timeout={'auto'} unmountOnExit>
                <Box>
                    
                </Box>
                <Grid container padding={'1rem 0'}>


                </Grid>
                <Divider />
            </Collapse>
        </Box>
    )
}



