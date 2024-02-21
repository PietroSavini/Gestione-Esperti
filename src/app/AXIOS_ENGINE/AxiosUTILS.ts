//Libreria Utility 
import { Base64 } from 'js-base64';

class Utility {

    static Logger = class {
      private static oldConsoleLog  :((...data: any[]) => void) | null  =   null;


      static enable = ( ) => {
        if(this.oldConsoleLog == null) return;
        window['console']['log']  = this.oldConsoleLog ;
      };
      static disable = () => {
        this.oldConsoleLog = console.log;
        window['console']['log']  = function() {};
      }
      
    };
    static Strings = class {

        static Decode(input: string) {
          let result;
          if (input === '' || typeof input !== 'string' || !Base64.isValid(input)) {
            return input;
          } else {
            try {
              const decodedString = Base64.decode(input);
              try{
                const decodedObject = JSON.parse(decodedString);
                result = { ...decodedObject };
                return result;
              }catch(err){
                result = decodedString;
              }
            } catch (error) {
              console.error("Errore nella decodifica:", error);
              return null;
            };
            return result;
          };
        };
      
        static Encode(param: any) {
          const bodyString = JSON.stringify(param);
          const newBodyBase64 = Base64.encode(bodyString);
          return newBodyBase64;
        };
    };

};

export default Utility;