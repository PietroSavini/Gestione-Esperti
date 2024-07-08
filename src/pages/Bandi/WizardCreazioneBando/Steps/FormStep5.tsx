import { Grid, Paper } from '@mui/material';
import { Custom_Select2 } from '../../../../components/partials/Inputs/Custom_Select2';
import { FormStepProps } from './FormStep1';
import { AttivitàSection } from '../Sections/AttivitàSection';
import { useSelector } from 'react-redux';
import { selectOrganizzaDocumentoSelect } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { useWizardBandoContext } from '../WizardBandoContext';




export const FormStep5 = (props:FormStepProps) => {
    const { register, errors, className, control, fn , unregister} = props;
    //const [lstAttivita, setLstAttivita] = useState< [] | AttivitaObj[] >([]);
    const respProc = useSelector(selectOrganizzaDocumentoSelect)?.utenti;
    //const listaAttivitaSelezionate = useMemo(() => lstAttivita, [lstAttivita]);
    
    
  return (
    <>
        <Paper className={className} sx={{ padding: ' 1rem 1rem' }}>
            {/*Responsabile del procedimento */}
            <Grid container>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Custom_Select2 
                        label='Responsabile del procedimento' 
                        placeholder="Seleziona il responsabile..." 
                        name={'responsabile'}
                        isRequired 
                        control={control} 
                        options={respProc!}
                        validations={{required:'il responsabile è obbligatorio'}}
                        error={!! errors.responsabile}
                        errorMessage={errors.responsabile?.message as string}
                    />
                </Grid>
            </Grid>

            <AttivitàSection/>
        </Paper>
    </>
  )
}
