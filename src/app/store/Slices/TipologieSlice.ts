// slices/tipologieSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Row } from '../../../pages/SettingsPage/Tabs/TipologiaEspertoTab/Tables/Table_tipologieDiSistema';

interface TipologieState {
  tipologieDiSistema: Row[];
  tipologiePersonalizzate: Row[];
}

const initialState: TipologieState = {
  tipologieDiSistema: [],
  tipologiePersonalizzate: [],
};

const tipologieSlice = createSlice({
  name: 'tipologie',
  initialState,
  reducers: {
    setTipologieData: (state, action: PayloadAction<TipologieState>) => {
      return { ...state, ...action.payload };
    },
    addTipologiaPersonalizzata: (state, action: PayloadAction<Row>) => {
      state.tipologiePersonalizzate.push(action.payload);
    },
    toggleVisible: (state, action: PayloadAction<number>) => {
      const indexDiSistema = state.tipologieDiSistema.findIndex(row => row.id === action.payload);
      if (indexDiSistema !== -1) {
        state.tipologieDiSistema[indexDiSistema].visible = !state.tipologieDiSistema[indexDiSistema].visible;
      }

      const indexPersonalizzate = state.tipologiePersonalizzate.findIndex(row => row.id === action.payload);
      if (indexPersonalizzate !== -1) {
        state.tipologiePersonalizzate[indexPersonalizzate].visible = !state.tipologiePersonalizzate[indexPersonalizzate].visible;
      }
    },
    removeTipologiaPersonalizzata: (state, action: PayloadAction<number>) => {
      state.tipologiePersonalizzate = state.tipologiePersonalizzate.filter(row => row.id !== action.payload);
    },
  }});

export const { setTipologieData, addTipologiaPersonalizzata, toggleVisible, removeTipologiaPersonalizzata } = tipologieSlice.actions;
export const selectTipologie = (state: RootState) => state.tipologie;
export default tipologieSlice.reducer;