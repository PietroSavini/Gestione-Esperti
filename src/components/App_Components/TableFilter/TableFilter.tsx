import './TabelFilter.scss'
import {  Grid, Paper, TextField,Button,FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { DataTable } from '../../../pages/SettingsPage/Tabs/TipologiaEspertoTab/DataTable'
import { useState } from 'react';

interface UserData {
  id: number;
  name: string;
  surname: string;
  age: number;
  gender: string;
};


//obbiettivo del componente: rendering di una dataTable al click di un pulsante.
//il pulsante dovrebbe processare un form "filters" checome scopo ha quello di filtrare il Json di dati in entrata con i filtri inseriti nel form
//restituendo un nuovo array di oggetti filtrati che poi servirà a compilare la dataTable
export const TableFilter = ({data}: {data: UserData[]}) => {
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userSurname, setUserSurname] =useState<string>('');
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(0);
  const [gender, setGender] = useState<string>('')
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  //variabile che ci permette di lavorare sia con un array di ogetti in entrata che con un oggetto di oggetti
  
  let dataArray: UserData[] = Array.isArray(data) ? data : Object.values(data);
  
  const generateTable= (users: UserData[]) => {
    //nuovo array filtrato da passare alla DataTable 
    const tableData = users.filter((user)=>{
      const idMatch = userId === 0 || user.id === userId;
      const nameMatch = userName === '' || user.name.toLowerCase().includes(userName.toLowerCase());
      const surnameMatch = userSurname === '' || user.surname.toLowerCase().includes(userSurname.toLowerCase());
      const ageMatch = (minAge === 0 || user.age >= minAge) && (maxAge === 0 || user.age <= maxAge);
      const genderMatch = (gender === '' || user.gender === gender)
      return idMatch && nameMatch && surnameMatch && ageMatch && genderMatch;
    })
    setFilteredData(tableData)
  }
  



  return (
    <>
      {/* Layout Componente */}
      <div className="filter-dataTable">
        <Paper className='form-container' elevation={8} >
          <div className="form-header">
            <h3>Data Table - filtro</h3>
          </div>
          {/* da sostituire con Form al collegamento con backend */}
          <div className="form-body">
            <hr />
            {/* Grid Container */}
            <h4>Filtra per Id utente:</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                  <TextField
                    label="Filtra per Id"
                    placeholder='1'
                    type='number'
                    onChange={(event) => setUserId(Number(event.target.value))}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{width:'210px'}}>
                  <InputLabel id="demo-gender-select-label">Sesso</InputLabel>
                  <Select
                    labelId="demo-gender-select-label"
                    id="demo-gender-select"
                    value={gender}
                    label="Age"
                    onChange={(e)=> setGender(e.target.value)}
                  >
                    <MenuItem value=''>tutti</MenuItem>
                    <MenuItem value='Male'>Maschio</MenuItem>
                    <MenuItem value='Female'>femmina</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <h4>Filtra per anagrafica:</h4>
            <Grid container spacing={2}>
              {/*  Grid Colonne */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Filtra per Nome"
                  placeholder='es. Mario'
                  type='text'
                  onChange={(event) => setUserName(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Filtra per Cognome"
                  placeholder='es. Rossi'
                  type='text'
                  onChange={(event) => setUserSurname(event.target.value)}
                />
              </Grid>
              {/*  /END Grid Colonne */}
            </Grid>
            {/* /END Grid Container */}
            <h4>filtra per età:</h4>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} >
                  <TextField
                    label="Da anni:"
                    placeholder='1-100'
                    type='number'
                    onChange={(event) => setMinAge(Number(event.target.value))}
                  />
                </Grid>
                <Grid item xs={12} md={6} >
                  <TextField
                      label="Ad anni:"
                      placeholder='1-100'
                      type='number'
                      onChange={(event) => setMaxAge(Number(event.target.value))}
                    />
                </Grid>
                
              </Grid>
            <br />
            <hr />
            <br />
            <Button onClick={() => generateTable(dataArray)} disabled={dataArray.length === 0} variant="contained">Cerca</Button>
            <br />
            <br />
          </div>
          {/* fine del form */}

          {/* Data Table generata dinamicamente */}
          {filteredData.length > 0 && (<DataTable data={filteredData} />)}
          <br />
          {/* /Data Table */}
        </Paper>
        <br />
      </div>
      {/* /Layout componente */}
    </>
  )
}
