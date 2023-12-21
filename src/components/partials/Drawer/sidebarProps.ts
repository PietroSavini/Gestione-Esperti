import { DrawerData } from "./DrawerTypes"

export const sidebar:DrawerData = {
  settings:{
    position:'left',
    //bug al cambio di width sull apertura e chiusura
    width: 240,
    isOpen: true,
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
      "titleColor":"#426389",
      "fontSize":"16px",
      "items": [
        {
          "text": "Personaliza stampe",
          "method": "/Personalizza-Stampe",
          "icon": "auto_fix_high",
          
        },
        
       
      ]
    },
    {
      "title": "Archivi",
      "titleColor":"#426389",
      "fontSize":"16px",
      "items": [
        {
          "text": "Anagrafiche",
          "method": "/Anagrafiche",
          "icon": "app_registration",
          
        },
        {
          "text": "Registro consensi",
          "method": "/Registro-consensi",
          "icon": "how_to_reg",
          
        },
        {
          "text": "Pubblicazioni",
          "method": "/link esterno???",
          "icon": "language",
          
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







