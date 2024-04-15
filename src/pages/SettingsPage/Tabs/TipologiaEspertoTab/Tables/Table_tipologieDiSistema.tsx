import { Box, Grid, Switch } from '@mui/material'
import { DataGrid, GridColDef} from '@mui/x-data-grid'
import { useState } from 'react'
import { ActionButton } from '../../../../../components/partials/Buttons/ActionButton'
import { CustomPagination } from '../../../../../components/partials/CustomPagination/CustomPagination'
import AXIOS_HTTP from '../../../../../app/AXIOS_ENGINE/AXIOS_HTTP'
import { useNavigate } from 'react-router-dom'


type Props ={ 
    addToTipologiePersonalizzateFn?: React.Dispatch<React.SetStateAction<TipologiaEspertoRow[] | []>>
    rows: TipologiaEspertoRow[] | []
}


export type TipologiaEspertoRow = {
    TEspId:string | number;
    TEspDesc:string,
    TEspBr:string;
    TEspVis:boolean;
    TEspSys:boolean;
}


export const Table_tipologieDiSistema = ({rows, addToTipologiePersonalizzateFn} : Props ) => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSwitchChange = (id: string | number) => {
        setIsLoading(true)
        //faccio chiamata ad endpoint per il salavataggio dei dati in DB
            //se la risposta è positiva
                // Aggiorna lo stato con il nuovo valore dello switch

        setIsLoading(false)
        //se la risposta è negativa
            //faccio uscire un messaggio di errore
    };

    const handleAddClick = async (row:TipologiaEspertoRow) => {
        let rowObj = {
            TEspId: row.TEspId,
            TEspDesc: row.TEspDesc,
            TEspBr: `${row.TEspBr}-(COPIA)`,
            TEspVis: false,
            EspSys: false,
        };

        //faccio chiamata a webService x l'id
        await AXIOS_HTTP.Execute({sService:'WRITE_TIPOLOGIE_ESPERTO', sModule:'IMPOSTAZIONI_DUPLICA_TIPOLOGIA_ESPERTO', body:rowObj, url:'/api/launch/execute'})
            .then((response) => {
                const id = response.response.fi_ee_tesp_id;
                console.log('NUOVO ID: ',id)
                const newTipologia: TipologiaEspertoRow = {
                    TEspId: id,
                    TEspBr: rowObj.TEspBr,
                    TEspDesc: rowObj.TEspDesc,
                    TEspVis : rowObj.TEspVis,
                    TEspSys: rowObj.EspSys
                };
                console.log('TIPOLOGIA DUPLICATA: ',newTipologia)
                if(addToTipologiePersonalizzateFn){
                    console.log('aggiungo a tablella personalizzate')
                    addToTipologiePersonalizzateFn((prev) => [...prev, newTipologia])
                };
                
            });
    };
 
    
    const VisibleSwitch = (TErow:TipologiaEspertoRow) => {
        const value = TErow.TEspVis;
        const id = TErow.TEspId as string;
        const [switchValue, setValue] = useState<boolean>(value);

        const handleSwitchChange = async (value: boolean) => {
        
            const newValue: boolean = !value;
            await AXIOS_HTTP.Execute({sService:'WRITE_TIPOLOGIE_ESPERTO', url:'/api/launch/execute', sModule:'IMPOSTAZIONI_UPDATE_TIPOLOGIA_ESPERTO', 
                body:{
                    TEspId: id,
                    TEspDesc: TErow.TEspDesc,
                    TEspBr: TErow.TEspBr,
                    TEspVis: newValue,
                },
            }).then((res) =>{
                const addNewValue: boolean = res.response.TEspVis
                setValue(addNewValue);
            }).catch((err) => 
                console.log(err)
            )

        };

        return <Switch id={id as string} onChange={() => handleSwitchChange(switchValue)} checked={switchValue} />;
    };

    const DataGridActions = ({params}:{params:any}) => {   
        const row = params.row as TipologiaEspertoRow
        return(
            <div className='dataGrid-actions'>
                <ActionButton color='primary' onClick={() => handleAddClick(row)} text='Duplica' icon='content_copy' direction='row-reverse' />  
                <ActionButton color='warning' onClick={() => { navigate(`/impostazioni/visualizza-tipologia`,{state:{...row}})}} text='Visualizza' icon='preview' direction='row-reverse'/>
            </div>
        )  
    };

   
    //dichiaro un array di oggetti "columns" per semplificare la creazione degli Headers delle colonne
    const columns:GridColDef[] = [
        {field: 'TEspBr', headerName: 'Descrizione', minWidth:150, flex:0.3, sortable:false, filterable:false ,  },
        {field: 'TEspDesc', headerName: 'Descrizione Lunga', flex:1, minWidth:350 ,sortable:false, filterable:false },
        {field: 'TEspVis', headerName: 'Visibile', minWidth: 70, align:'center', headerAlign:'center', flex:.3, sortable:false, filterable:false,
            renderCell(params) {
                const row : TipologiaEspertoRow = params.row
                return(
                    <VisibleSwitch  {...row} />
                )
            }
        },
        {field: 'actions', type:'actions', headerAlign:'center', align:'center',headerName:'azioni',  width: 320 , sortable:false, filterable:false , renderCell: (params:any) => (<DataGridActions params={params}/>)}
    ]; 

 

  return (
    <Box className="dataTable" >
        <Grid container mb={10} ml={15} spacing={2}>
            <Grid item width={'100%'} padding={'0 !important'}>
                <DataGrid
                    getRowId={(row)=> row.TEspId}
                    slots={{
                        pagination: CustomPagination,
                    }}
                    hideFooterSelectedRowCount
                    loading={isLoading}
                    autoHeight
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 }
                        },
                    }}
                    pageSizeOptions={[5, 10, 20, 50]}
                    sx={{
                        padding:'0',
                        fontSize: 14,
                    }}
                    localeText={{
                        noRowsLabel:'Nessun elemento trovato',
                        MuiTablePagination: {
                            labelRowsPerPage: 'Righe per pagina:',
                        },
                    }}
                />
            </Grid>
        </Grid>
    </Box>
  )
}
