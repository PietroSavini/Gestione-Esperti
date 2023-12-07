import { DrawerData } from "./DrawerTypes"

export const sidebar:DrawerData = {
  settings:{
    position:'left',
    width:240,
    isOpen: true,
    fontSize:'.8rem',
  },
  sections:[
    {
      "items":[
        {
          "text": "Gestione Esperti",
          "method": "/Gestione-Esperti",
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
      "titleColor":"#426389",
      "fontSize":"16px",
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
      "titleColor":"#426389",
      "fontSize":"16px",
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
    },
   
  ]
  
}







