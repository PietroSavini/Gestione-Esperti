import 'dayjs/locale/it';
import { FormStepProps } from './FormStep1';
import { useEffect, useState } from 'react';
import { PubblicaAlbo_Section } from '../Sections/PubblicaAlbo_Section';
import { FirmaSection } from '../Sections/FirmaSection';
import { ProtocollazioneSection } from '../Sections/ProtocollazioneSection';
import { AmministrazioneTrasparente_Section } from '../Sections/AmministrazioneTrasparente_Section';
import { BachecheIstituzionali_Section } from '../Sections/BachecheIstituzionali_Section';

const options = {
    select1: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    select2: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    aoo: [
        { value: '1', label: 'NUOVA AOO' },
    ],
    adc: [
        { value: '1', label: 'Archivio corrente' },
    ]
}
//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione

export const FormStep2 = (props: FormStepProps) => {
    const { register, errors, className, control, fn , unregister} = props;
    const [isFirmaExpanded, setFirmaExpanded] = useState(false)
    const [isProtocolloExpanded, setProtocolloExpanded] = useState(false)
    const [isPubblicaAlboSelected, setIsPubblicaAlboSelected] = useState<boolean>(false)
    const [isAmministrazioneTrasparenteSelected, setIsAmministrazioneTrasparenteSelected] = useState<boolean>(false)
    const [isBachecheIstituzionaliSelected, setIsBachecheIstituzionaliSelected] = useState<boolean>(false)
    
    //LOGICA PER ESCLUSIONE DEI CAMPI DI INPUT QUANDO I FORM NON SONO APERTI / SELEZIONATI
    //FIRMA
    useEffect(()=>{
        if(unregister && !isFirmaExpanded) unregister(['firma-tipo-firma', 'firma-utente-firmatario','firma-gruppo-firmatario','date' ])
    },[isFirmaExpanded]);
    
    //PROTOCOLLAZIONE
    useEffect(() => {   
        if(unregister && !isProtocolloExpanded) unregister(['protocollo-tipo', 'protocollo-utente-assegnato','protocollo-gruppo-utenti-assegnati'])
    },[isProtocolloExpanded]);

    //PUBBLICA SU ALBO ONLINE
    useEffect(()=>{
        if(unregister && !isPubblicaAlboSelected) unregister(['pubblicazione_albo_oggetto', 'pubblicazione_albo_richiedente'])
    },[isPubblicaAlboSelected]);

    return (
        <>
            {/* -------------------------------FIRMA--------------------------------------------------------- */}
            <FirmaSection openSection={setFirmaExpanded} isOpen={isFirmaExpanded} className={className} control={control} errors={errors}/>
            {/* -------------------------------------PROTOCOLLO---------------------------------------------- */}
            <ProtocollazioneSection openSection={setProtocolloExpanded} isOpen={isProtocolloExpanded} className={className} control={control} />
            {/* -------------------------------------SEZIONI CON SWITCHES------------------------------------------------ */}
            {/* Pubblica su albo online */}
            <PubblicaAlbo_Section className={className} isOpen={isPubblicaAlboSelected} setIsOpen={setIsPubblicaAlboSelected} control={control} errors={errors}/>
            {/* Amministrazione trasparente */}
            <AmministrazioneTrasparente_Section isOpen={isAmministrazioneTrasparenteSelected} setIsOpen={setIsAmministrazioneTrasparenteSelected} control={control} className={className} errors={errors}/>
            {/*  Bacheche istituzionali */}
            <BachecheIstituzionali_Section isOpen={isBachecheIstituzionaliSelected} setIsOpen={setIsBachecheIstituzionaliSelected} control={control} className={className} errors={errors}/>

        </>
    )
}
