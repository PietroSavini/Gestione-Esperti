export type Requisito_Table = {
    fi_ee_req_id: string | number;
    fs_ee_req_desc: string;
    fi_ee_punt_id?: number;
    requisiti_list: Requisiti_List;
};

export type Requisiti_List = RequisitoType_RequisitoTab[] | [];

export type RequisitoType_RequisitoTab = {
    fi_ee_req_id: number | string; //id requisito
    fs_ee_req_desc: string; //descrizione del requisito
    fi_ee_req_customerid?: number | null; //sistema => true if null
    fi_ee_req_punteggio?: number;
    fi_ee_punt_id?: number;
    fi_ee_mst_id?:string | number;
};

export type TipologiaEspertoRow = {
    TEspId: string | number;
    TEspDesc: string;
    TEspBr: string;
    TEspVis: boolean;
    TEspSys: boolean;
};
