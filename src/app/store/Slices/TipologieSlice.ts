// slices/tipologieSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Row } from '../../../pages/SettingsPage/Tabs/TipologiaEspertoTab/Tables/Table_tipologieDiSistema';

interface TipologieState {
  tipologieDiSistema: Row[];
  tipologiePersonalizzate: Row[];
}

const initialState: TipologieState = {
  tipologieDiSistema: [
    {
      id:'0',
      title:'Medico competente',
      description:'medico sportivo per attività semi-agonistica',
      visible:true,
      requisiti:[]
    },
    {
      id:'1',
      title:'Psicologo',
      description:'Psicologo espertoi in psicologia infantile',
      visible:false,
      requisiti:[]
    },
    {
      id:'2',
      title:'DPO',
      description:'DPO',
      visible:true,
      requisiti:[]
    },
  ],
  tipologiePersonalizzate: [],
};
//funzione finder negli arrai di ogetti


const tipologieSlice = createSlice({
  name: 'tipologie',
  initialState,
  reducers: {
    setTipologieData: (state, action: PayloadAction<TipologieState>) => {
      return { ...state, ...action.payload };
    },

    copyTipologiaPersonalizzata: (state, action: PayloadAction<Row>) => {
      state.tipologiePersonalizzate.push(action.payload);
    },

    toggleVisibleSistema: (state, action: PayloadAction<string>) => {
      const indexDiSistema = state.tipologieDiSistema.findIndex(row => row.id === action.payload);
      if (indexDiSistema !== -1) {
        state.tipologieDiSistema[indexDiSistema].visible = !state.tipologieDiSistema[indexDiSistema].visible;
      }

    },

    toggleVisiblePersonalizzate: ( state, action: PayloadAction<string> )=>{
      const indexPersonalizzate = state.tipologiePersonalizzate.findIndex(row => row.id === action.payload);
      if (indexPersonalizzate !== -1) {
        state.tipologiePersonalizzate[indexPersonalizzate].visible = !state.tipologiePersonalizzate[indexPersonalizzate].visible;
      }
    },
    removeTipologiaPersonalizzata: (state, action: PayloadAction<string>) => {
      state.tipologiePersonalizzate = state.tipologiePersonalizzate.filter(row => row.id !== action.payload);
    },
  }});

export const { setTipologieData, copyTipologiaPersonalizzata, toggleVisibleSistema,toggleVisiblePersonalizzate, removeTipologiaPersonalizzata } = tipologieSlice.actions;
export const selectTipologie = (state: RootState) => state.tipologie;
export default tipologieSlice.reducer;