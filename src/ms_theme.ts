import { createTheme } from "@mui/material/styles";
import { itIT as CoreLanguage } from "@mui/material/locale";
import { itIT } from "@mui/x-data-grid";
import { itIT as dateLanguage } from "@mui/x-date-pickers";

export const theme = createTheme({
    components:{
      MuiButton:{
        styleOverrides:{
          root:{
            textTransform:'none'
          }

        }
      },
      //@ts-ignore
      MuiDataGrid: {
        styleOverrides: {
          footerContainer: {
            justifyContent: 'initial',
          },
        },
      },

      MuiTablePagination:{
        styleOverrides:{
          root:{
            width:'100%',
            overflow:'initial'
            
          },
          spacer:{
            display:'none'
          },
          toolbar:{
            width:'100%',
            justifyContent:'flex-end',
            alignItems:'center',
            minHeight:'50px',
            flexWrap:'wrap',
            padding:'.5rem .5rem'
          }
        }
      },
    
    },
    
  }, CoreLanguage, dateLanguage, itIT)