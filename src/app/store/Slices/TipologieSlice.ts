// slices/tipologieSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TipologiaEspertoRow } from '../../../pages/SettingsPage/Tabs/TipologiaEspertoTab/Tables/Table_tipologieDiSistema';

interface TipologieState {
  tipologieDiSistema: TipologiaEspertoRow[];
  tipologiePersonalizzate: TipologiaEspertoRow[];
}

const initialState: TipologieState = {
  tipologieDiSistema: [
    {
      id:'0',
      title:'Medico competente',
      description:'medico sportivo per attività semi-agonistica',
      visible:true,

      requisitiTables:[
        {
          sectionTitle:'titolo di Studio',
          requisitiList:[
            {
              id:'0',
              title:'Laurea Vecchio ordinamento',
              punteggio:'3',
              isNew:false,
            },
            {
              id:'1',
              title:'Laurea Triennale',
              punteggio:'1',
              isNew:false,
            },
            {
              id:'2',
              title:'Laurea specialistica',
              punteggio:'2',
              isNew:false
            }
          ]
        }
      ]
    },
    {
      id:'1',
      title:'Psicologo',
      description:'Psicologo espertoi in psicologia infantile',
      visible:false,
      
      requisitiTables:[]
    },
    {
      id:'2',
      title:'DPO',
      description:'DPO',
      visible:true,
      
      requisitiTables:[]
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

    copyTipologiaPersonalizzata: (state, action: PayloadAction<TipologiaEspertoRow>) => {
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