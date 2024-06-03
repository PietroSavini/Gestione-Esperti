import 'dayjs/locale/it';
import { FormStepProps } from './FormStep1';
import { useEffect, useState } from 'react';
import { PubblicaAlbo_Section } from '../Sections/PubblicaAlbo_Section';
import { FirmaSection } from '../Sections/FirmaSection';
import { ProtocollazioneSection } from '../Sections/ProtocollazioneSection';
import { AmministrazioneTrasparente_Section } from '../Sections/AmministrazioneTrasparente_Section';
import { BachecheIstituzionali_Section } from '../Sections/BachecheIstituzionali_Section';
import { useSelector } from 'react-redux';
import { selectOrganizzaDocumentoSelect } from '../../../../app/store/Slices/organizzaDocumentoSlice';
import { selectPubblicazioniSelect } from '../../../../app/store/Slices/pubblicazioneSlice';

//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione

export const FormStep2 = (props: FormStepProps) => {
    const { register, errors, className, control, fn , unregister} = props;
    const [isFirmaExpanded, setFirmaExpanded] = useState(false);
    const [isProtocolloExpanded, setProtocolloExpanded] = useState(false);
    const [isPubblicaAlboSelected, setIsPubblicaAlboSelected] = useState<boolean>(false);
    const [isAmministrazioneTrasparenteSelected, setIsAmministrazioneTrasparenteSelected] = useState<boolean>(false);
    const [isBachecheIstituzionaliSelected, setIsBachecheIstituzionaliSelected] = useState<boolean>(false);
    const organizzaDocumentoSelectOptions = useSelector(selectOrganizzaDocumentoSelect);
    const pubblicazioniSelectOptions = useSelector(selectPubblicazioniSelect);
    const selectOptions = {...organizzaDocumentoSelectOptions, ...pubblicazioniSelectOptions};
    
    //LOGICA PER ESCLUSIONE DEI CAMPI DI INPUT QUANDO I FORM NON SONO APERTI / SELEZIONATI
    //FIRMA
    useEffect(()=>{
        if(unregister && !isFirmaExpanded) unregister(['firma-tipo-firma', 'firma-utente-firmatario','firma-gruppo-firmatario','date' ]);
    },[isFirmaExpanded]);
    
    //PROTOCOLLAZIONE
    useEffect(() => {   
        if(unregister && !isProtocolloExpanded) unregister(['protocollo-tipo', 'protocollo-utente-assegnato','protocollo-gruppo-utenti-assegnati']);
    },[isProtocolloExpanded]);

    //PUBBLICA SU ALBO ONLINE
    useEffect(()=>{
        if(unregister && !isPubblicaAlboSelected) unregister(['pubblicazione_albo_oggetto', 'pubblicazione_albo_richiedente']);
    },[isPubblicaAlboSelected]);

    return (
        <>
            {/* -------------------------------FIRMA--------------------------------------------------------- */}
            <FirmaSection selectValues={selectOptions} openSection={setFirmaExpanded} isOpen={isFirmaExpanded} className={className} control={control} errors={errors}/>
            {/* -------------------------------------PROTOCOLLO---------------------------------------------- */}
            <ProtocollazioneSection selectValues={selectOptions} openSection={setProtocolloExpanded} isOpen={isProtocolloExpanded} className={className} control={control} />
            {/* -------------------------------------SEZIONI CON SWITCHES------------------------------------------------ */}
            {/* Pubblica su albo online */}
            <PubblicaAlbo_Section selectValues={selectOptions} register={register} className={className} isOpen={isPubblicaAlboSelected} setIsOpen={setIsPubblicaAlboSelected} control={control} errors={errors}/>
            {/* Amministrazione trasparente */}
            <AmministrazioneTrasparente_Section selectValues={selectOptions} isOpen={isAmministrazioneTrasparenteSelected} setIsOpen={setIsAmministrazioneTrasparenteSelected} control={control} className={className} errors={errors}/>
            {/*  Bacheche istituzionali */}
            <BachecheIstituzionali_Section selectValues={selectOptions} isOpen={isBachecheIstituzionaliSelected} setIsOpen={setIsBachecheIstituzionaliSelected} control={control} className={className} errors={errors}/>

        </>
    )
}
