import { lista_archivi } from "../../app/store/Slices/organizzaDocumentoSlice";
import { Tview } from "../../components/partials/TreeView/Treeview";


export function convertTreeViewData (data:any[]): Tview[] | [] {

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

function checkData (data:any[]): number {
    
    if(data && data.length > 0){
        const firstItem = data[0];
        if('fiDossierId' in firstItem && 'fiDossierIdRef' in firstItem && 'fsDossierName' in firstItem){
            console.log('convertTreeViewData() => dati in conversione : Archivi, typeOf lista_archivi[]');
            return 1;
        }else{
            return 0;
        };
    }else{
        return 0
    };
};

function convertArchivitreeView (data:lista_archivi[]): Tview[] {
    //creo un dizionario per aumentare l'efficenza dell'algoritmo
    const idToNodeMap: { [key: number]: Tview & { parent?: Tview } } = {};

    // Step 1: creare tutti i nodi e inserirli nella mappa
    data.forEach(item => {
        idToNodeMap[item.fiDossierId] = {
            value: item.fiDossierId.toString(),
            label: item.fsDossierName,
            children: [],
        };
    });

    const tree: Tview[] = [];
    let counter = 0;
    // Step 2: Iterare su data per costruire l'albero
    data.forEach(item => {
        const node = idToNodeMap[item.fiDossierId];
        if (item.fiDossierIdRef === 0) {
            // Nessun genitore, quindi è un nodo radice
            tree.push(node);
        } else {
            const parentNode = idToNodeMap[item.fiDossierIdRef];
            if (parentNode) {
                // Aggiungere il nodo corrente come figlio del genitore
                parentNode.children!.push(node);
                node.parent = parentNode;  // Aggiungere riferimento al genitore (opzionale)
            }
        }
        counter ++;
    });
    console.log('convertTreeViewData() => numero di elementi processati : ', counter)
    return tree;
};
