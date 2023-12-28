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
  },
});

export const { setTipologieData, addTipologiaPersonalizzata } = tipologieSlice.actions;
export const selectTipologie = (state: RootState) => state.tipologie;
export default tipologieSlice.reducer;