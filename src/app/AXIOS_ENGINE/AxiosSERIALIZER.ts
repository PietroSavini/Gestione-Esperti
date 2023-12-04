
class Serializer {

  static serialize(selector: string, selectorType?: number): { [key: string]: string | number } {
    
    const formData: { [key: string]: string | number } = {};
    const elemArr: Element[] = this.getElements(selector, selectorType);
    let result : { [key: string]: string | number } = {};
    
    //preparo il Json risultante
    elemArr.forEach((element) => {
      const name = element.getAttribute('name');
      const value = (element as HTMLInputElement).value;
      const numericValue = parseFloat(value);

      if (name) {
        formData[name] =  isNaN(numericValue) ? value : numericValue;
      };

    });
      
    if (Object.keys(formData).length > 0){
      if(this.isJSON(formData)){
        result = formData;
      }
      return result
    }else{
      throw console.error('ERRORE DI SERIALIZZAZIONE: accettarsi di aver inserito un selettore CSS corretto accoppiato al giusto tipo di selectorType (0: per ricerca tramite selettore CSS | 1: per ricerca di attributo etc)');
    };
  };

  //funzione che gestisce le casistiche di selezione con switch case e restituisce un Array di Input dal quale preparare il JSON Uscente
  private static getElements(selector: string, selectorType?: number): Element[]{
    
    let result : Element[] = [];
    
    switch(selectorType){
      //caso di raggruppamento per selettori CSS
      case 0: 
          const selection = document.querySelectorAll(selector); 
          result = this.groupElementsByCssSelector(selection)
      break;

      //altri casi es raggruppamento per attributi.
      case 1:
        
      break;

    };

    return result;
  }

  //funzione ricorsiva che analizza l'albero del Dom dal nodo in entrata, cerca gli elementi che hanno attributo name e ritorna un array di input
  private static findInputElements(node:Element): Element[]{
      const inputs: Element[] = [];
     
      // Se l'elemento corrente ha l'attributo name e non è vuoto
      if (node instanceof Element && node.hasAttribute('name') && node.getAttribute('name') !== '' ) {
        inputs.push(node);
      }
  
      // Per ogni figlio dell'elemento corrente, chiamiamo ricorsivamente la funzione findInputElements
      for (const child of Array.from(node.children)) {
        inputs.push(...this.findInputElements(child as Element));
      }
      
      return inputs;
    }
  
    // funzione che restituisce array di input dopo aver invocato la funzione ricorsiva findInputElements sul nodo derivante dal querySelectorAll
    private static groupElementsByCssSelector(selection: NodeListOf<Element>): Element[] {
      //array che contiene tutti gli elementi figli della selection
      const allInputs: Element[] = [];

      // Per ogni elemento nella selezione, cercare tutti gli input nidificati
      selection.forEach((node) => {
        allInputs.push(...this.findInputElements(node));
      });
  
      return allInputs;
    }

  //funzione di controllo del JSON di uscita
  private static isJSON(entryJSON : Object): boolean {
    const jsonString = JSON.stringify(entryJSON)
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }
  
}

export default Serializer;
