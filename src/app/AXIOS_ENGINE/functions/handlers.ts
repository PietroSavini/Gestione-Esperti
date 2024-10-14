import { lista_archivi } from "../../store/Slices/organizzaDocumentoSlice";
import { Tview } from "../../../components/partials/TreeView/Treeview";
import { Option } from "../../../components/partials/Inputs/Custom_Select2";

//
export function convertTreeViewData (data:any[]): Tview[] | [] {
    //funzione per controllare dati in ingresso e gestirli per preparare la treeView
    function checkData (data:any[]): number {
        
        if(data && data.length > 0){
            const firstItem = data[0];
            if('dossier_id' in firstItem && 'dossier_ref_id' in firstItem && 'dossier_name' in firstItem){
                //console.log('convertTreeViewData() => dati in conversione : Archivi, typeOf lista_archivi[]');
                return 1;
            }else{
                return 0;
            };
        }else{
            return 0;
        };
    };
    
    const typeOfData:number = checkData(data);
    let tree: Tview[] = []
    
    switch (typeOfData) {
        case 0:
            console.error('convertTreeViewData() => struttura dati in ingressso non riconosciuta o vuota');
            break;
        case 1:
            tree = convertArchivitreeView(data);
        break;
        }
        
        return tree;
    }
    

function convertArchivitreeView (data:lista_archivi[]): Tview[] {
    //creo un dizionario per aumentare l'efficenza dell'algoritmo
    const idToNodeMap: { [key: number]: Tview & { parent?: Tview } } = {};
    // Step 1: creare tutti i nodi e inserirli nella mappa
    data.forEach(item => {
        idToNodeMap[item.dossier_id] = {
            value: item.dossier_id.toString(),
            label: item.dossier_name,
            children: [],
        };
    });

    const tree: Tview[] = [];
    let counter = 0;
    // Step 2: Iterare su data per costruire l'albero
    data.forEach(item => {
        const node = idToNodeMap[item.dossier_id];
        if (item.dossier_ref_id === 0) {
            // Nessun genitore, quindi è un nodo radice
            tree.push(node);
        } else {
            const parentNode = idToNodeMap[item.dossier_ref_id];
            if (parentNode) {
                // Aggiungere il nodo corrente come figlio del genitore
                parentNode.children!.push(node);
                node.parent = parentNode;  // Aggiungere riferimento al genitore (opzionale)
            }
        }
        counter ++;
    });
    //console.log('convertTreeViewData() => numero di elementi processati : ', counter)
    return tree;
};




type Titolari = {
   // id:number;
    detailId:number; //value
   // rif:string;
    rifDetailId:number; // identificativo padre
   // descrizione:string;
   // codice:string;
   // codTitolo:string;
    descCodice:string; // label
   // codC:string;
}

//Funzione che prepara la lista di opzioni con visualizzazione ad albero della lista dei titolari
export const createTitolariOptionArray = (titolariArr : Titolari[]) => {
    const buildOptions = (parentId: number, level: number): Option[] => {
        return titolariArr
            .filter((titolario) => titolario.rifDetailId === parentId)
            .map((titolario) => ({
                value: titolario.detailId,
                label: titolario.descCodice,
                level: level,
                isDisabled: level === 0, // disabilitiamo solo i genitori (titoli)
                isTitle: level === 0,    // consideriamo solo i genitori come titoli
            }))
            .reduce((acc: Option[], parentOption) => {
                acc.push(parentOption);
                // Aggiungiamo i figli (e poi i nipoti) sotto ogni genitore, aumentando il livello
                const childOptions = buildOptions(parentOption.value, level + 1);
                return acc.concat(childOptions);
            }, []);
    };
    // Partiamo dai genitori, ovvero quelli con `rifDetailId === 0` e livello 0
    const finalOptions = buildOptions(0, 0);
    return finalOptions;
};
//funzione per preparare gli array semplici di Opzioni per le select
export const createOptionArray = ({ arr, value, label }: { arr: any[], value: string, label: string }) => {
    if (arr && arr.length > 0) {
        const newArr = arr.map((item) => ({ value: item[value], label: item[label] }))
        return newArr;
    } else {
        return []
    }
}