import { DrawerData } from "./Drawer"

export const sidebar:DrawerData = {
  settings:{
    position: "left",
    width:240,
    isOpen:true,
    fontSize:'.8rem',
  },
  sections:[
    {
      "items":[
        {
          "text": "Gestione Esperti",
          "method": "/",
          "icon":"auto_awesome_mosaic"
        }
      ]
    },
    {
      "title":"Servizi",
      "titleColor":"#426389",
      "fontSize":"20px",
      "items": [
        {
          "text": "Bandi",
          "method": "/Bandi",
          "icon": "document_scanner",
          
        },
        {
          "text": "Candidature",
          "method": "/Candidature",
          "image": "",
          "icon": "content_paste_search",
         
        },
        {
          "text": "Affidamento Diretto",
          "method": "/Affidamento-diretto",
          "image": "",
          "icon": "contact_mail",
         
        },
        {
          "text": "Incarichi",
          "method": "/Incarichi",
          "image": "",
          "icon": "checklist",
         
        },
        {
          "text": "Contratti",
          "method": "/Contratti",
          "image": "",
          "icon": "summarize",
         
        },
       
      ]
    },
    {
      "title": "Stampe",
      "items": [
        {
          "text": "Pagina 4",
          "method": "/pagina4",
          "icon": "print",
          
        },
        
       
      ]
    },
    {
      "title": "Utility",
      "items":[
        {
          "text": "App",
          "icon": "app_settings_alt",
          "subItems": [
            {
              "text": "impostazioni",
              "method": "/Impostazioni",
              "icon": "settings_suggest",
              
            },
            {
              "text": "Supporto",
              "method": "/Assistenza",
              "icon": "support_agent",
             
            }
          ]
        }
      ]
    }
  ]
  
}
























export const sidebarItems=[
 
  {
    "items":[
      {
        "text": "Gestione Esperti",
        "method": "/",
        "icon":"auto_awesome_mosaic"
      }
    ]
  },
  {
    "title":"Servizi",
    "items": [
      {
        "text": "Bandi",
        "method": "/Bandi",
        "icon": "document_scanner",
        "color": "#fff"
      },
      {
        "text": "Candidature",
        "method": "/Candidature",
        "image": "",
        "icon": "content_paste_search",
        "color": "#33FF57"
      },
      {
        "text": "Affidamento Diretto",
        "method": "/Candidature",
        "image": "",
        "icon": "contact_mail",
        "color": "#33FF57"
      },
      {
        "text": "Incarichi",
        "method": "/Candidature",
        "image": "",
        "icon": "checklist",
        "color": "#33FF57"
      },
      {
        "text": "Contratti",
        "method": "/Candidature",
        "image": "",
        "icon": "summarize",
        "color": "#33FF57"
      },
     
    ]
  },
  {
    "title": "Stampe",
    "items": [
      {
        "text": "Pagina 4",
        "method": "/pagina4",
        "image": "M10 2L2 10M2 10L10 18M2 10L18 10",
        "color": "#FF5733"
      },
      {
        "text": "Pagina 5",
        "method": "/pagina5",
        "icon": "",
        "color": "#33FF57"
      },
     
    ]
  },
  {
    "title": "Utility",
    "items":[
      {
        "text": "App",
        "icon": "app_settings_alt",
        "subItems": [
          {
            "text": "impostazioni",
            "method": "/Impostazioni",
            "icon": "settings_suggest",
            "color": "#3366FF"
          },
          {
            "text": "Supporto",
            "method": "/Assistenza",
            "icon": "support_agent",
            "color": "#3366FF"
          }
        ]
      }
    ]
  }
]


