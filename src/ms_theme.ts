import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    components:{
      MuiButton:{
        styleOverrides:{
          root:{
            textTransform:'none'
          }

        }
      },
      // @ts-ignore
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
      }
    }
  })