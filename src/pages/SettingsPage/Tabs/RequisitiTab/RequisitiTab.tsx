import { Box } from '@mui/material';
import { useEffect, useState } from 'react'
import { AddSectionButtonWithDialog } from '../../../../components/partials/Buttons/AddSectionButtonWithDialog';
import Requisiti_Table from './Tables/Table_requisiti';
import AXIOS_HTTP from '../../../../app/AXIOS_ENGINE/AXIOS_HTTP';
import { Requisito_Table } from '../../types';
import { convertData } from '../../functions';






export const RequisitiTab = () => {
    const [tables, setTables] = useState<Requisito_Table[] | []>([]);
    //chiamata iniziale per requisiti gia presenti
    useEffect(() => {

        AXIOS_HTTP.Retrieve({ url: '/api/launch/retrieve', body: null, sService: 'READ_REQUISITI', sModule: 'IMPOSTAZIONI_GET_ALL_REQUISITI' })
            .then(result => {
                setTables(convertData(result.response, 0))
            })
            .catch(error => {
                console.log(error)
            });


    }, [])


    const handleAddSection = async (title: string) => {
        const newMasterReq = {
            descrizione: title,
            masterId: 0
        };

        await AXIOS_HTTP.Execute({ sService: 'WRITE_REQUISITI', sModule: 'IMPOSTAZIONI_INSERT_REQUISITO', body: newMasterReq, url: '/api/launch/execute' })
            .then((resp) => {
                console.log('INSERIMENTO MASTER ID SU DB E RISPOSTA: ', resp)
                if (resp.errorCode === 1) {
                    return
                }

                const newRequisitoMaster: Requisito_Table = {
                    fi_ee_req_id: resp.response.fi_ee_req_id,
                    fs_ee_req_desc: title,
                    requisiti_list: []
                };

                console.log('requisito MAster passato alla tabella :', newRequisitoMaster)
                setTables((prev) => [...prev, newRequisitoMaster])

            })

    }

    return (
        <>
            <Box sx={{ marginBottom: '1.5rem' }} display={'flex'} width={'100%'} justifyContent={'flex-start'}>
                <AddSectionButtonWithDialog successFn={handleAddSection} />
            </Box>
            <Box component='section' className='requisiti-section'>

                {tables && tables.map((table, index) => (
                    <Requisiti_Table key={index} data={table} setData={setTables} />
                ))}

                {tables.length === 0 && <Box>nessun requisito da mostrare </Box>}
            </Box>

        </>
    )
}
