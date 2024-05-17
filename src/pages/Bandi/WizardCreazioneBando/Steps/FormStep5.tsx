import { Box, Grid, Paper } from '@mui/material';
import React, { useState } from 'react'
import { Custom_Select2, Option } from '../../../../components/partials/Inputs/Custom_Select2';
import { Label } from '@mui/icons-material';

import { FormStepProps } from './FormStep1';
import { AttivitàSection } from '../Sections/AttivitàSection';
import { AttivitaObj } from '../WizardCreazioneBando';


const activityData = [
    {
        Id:'1',
        actionDett:'AZIONE 1',
        delete:true,
        posizione:0
    },
    {
        Id:'2',
        actionDett:'AZIONE 2',
        delete:true,
        posizione:1
    },
    {
        Id:'3',
        actionDett:'AZIONE 3',
        delete:true,
        posizione:2
    }
]

export const FormStep5 = (props:FormStepProps) => {
    const { register, errors, className, control, fn , unregister} = props;
    const [lstAttivita, setLstAttivita] = useState< [] | AttivitaObj[] >(activityData);

    const respList : Option[] = [
        {
            value:'0',
            label:'ABBALE VALENTINA',
            icon:'account_circle'
        },
        {
            value:'1',
            label:'ADRIANI FRANCESCA',
            icon:'account_circle'
        },
        {
            value:'2',
            label:'ARZEO ADELINA',
            icon:'account_circle'
        },
    ]


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
                        isRequired control={control} 
                        options={respList}
                        validations={{required:'il responsabile è obbligatorio'}}
                        error={!! errors.responsabile}
                        errorMessage={errors.responsabile?.message as string}
                    />
                </Grid>
            </Grid>

            <AttivitàSection data={lstAttivita} setData={setLstAttivita} userList={[]} attList={[]} userGroup={[]} modelliProcedimento={[]}/>
        </Paper>
    </>
  )
}
