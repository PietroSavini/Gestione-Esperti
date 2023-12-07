export type DrawerData = {
    settings: Settings
    sections: Section[];
};

type Settings = {
    position?: 'top' | 'right' | 'bottom' | 'left';
    width: number | string;
    isOpen: boolean;
    fontSize?: string
}

export type Section = {
    title?: string;
    items: Items;
    bgColor?: string;
    titleColor?: string;
    fontSize?: string;
    color?: string;
};

type Items = Item[];

export type Item = {
    text: string;
    method?: string;
    baseUrl?: string;
    image?: string;
    icon?: string;
    color?: string;
    subItems?: Items
};

export type Variant = 'temporary' | 'permanent' | 'persistent' | undefined;