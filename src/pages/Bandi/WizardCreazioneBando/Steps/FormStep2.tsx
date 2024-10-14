import 'dayjs/locale/it';
import { FormStepProps } from './FormStep1';
import { useEffect, useState } from 'react';
import { PubblicaAlbo_Section } from '../Sections/PubblicaAlbo_Section';
import { FirmaSection } from '../Sections/FirmaSection';
import { ProtocollazioneSection } from '../Sections/ProtocollazioneSection';
import { AmministrazioneTrasparente_Section } from '../Sections/AmministrazioneTrasparente_Section';
import { BachecheIstituzionali_Section } from '../Sections/BachecheIstituzionali_Section';
import { useWizardBandoContext } from '../WizardBandoContext';

//passo funzione register e array di ogetti errore di react hook forms al componente per permettere la validazione

export const FormStep2 = (props: FormStepProps) => {
    const { register, errors, className, control, unregister} = props;
    const [isFirmaExpanded, setFirmaExpanded] = useState(false);
    const [isProtocolloExpanded, setProtocolloExpanded] = useState(false);
    const [isPubblicaAlboSelected, setIsPubblicaAlboSelected] = useState<boolean>(false);
    const [isAmministrazioneTrasparenteSelected, setIsAmministrazioneTrasparenteSelected] = useState<boolean>(false);
    const [isBachecheIstituzionaliSelected, setIsBachecheIstituzionaliSelected] = useState<boolean>(false);
    const selectOptions = useWizardBandoContext().selectValues
    const organizzaDocumentoSelectOptions = selectOptions.organizzaDocumentoSelectValues;
    const pubblicazioniSelectOptions = selectOptions.pubblicazioniSelectValues;
    // valori delle select 
    const selectValues = {...organizzaDocumentoSelectOptions, ...pubblicazioniSelectOptions};
    

    //LOGICA PER ESCLUSIONE DEI CAMPI DI INPUT QUANDO I FORM NON SONO APERTI / SELEZIONATI
    //FIRMA
    useEffect(()=>{
        if(unregister && !isFirmaExpanded) unregister(['firma-tipo-firma', 'firma-utente-firmatario','firma-gruppo-firmatario','date' ]);
    },[isFirmaExpanded]);
    
    //PROTOCOLLAZIONE
    useEffect(() => {   
        if(unregister && !isProtocolloExpanded) unregister(['protocollo-tipo', 'protocollo-utente-assegnato','protocollo-gruppo-utenti-assegnati',"protocollazione_oggetto"]);
    },[isProtocolloExpanded]);

    //PUBBLICA SU ALBO ONLINE
    useEffect(()=>{
        if(unregister && !isPubblicaAlboSelected) unregister(['pubblicazione_albo_oggetto', 'pubblicazione_albo_richiedente']);
    },[isPubblicaAlboSelected]);

    return (
        <>  
            <FirmaSection selectValues={selectValues} openSection={setFirmaExpanded} isOpen={isFirmaExpanded} className={className} control={control} errors={errors}/>
    
            <ProtocollazioneSection selectValues={selectValues} openSection={setProtocolloExpanded} isOpen={isProtocolloExpanded} className={className} control={control} register={register} errors={errors} />
    
            <PubblicaAlbo_Section selectValues={selectValues} register={register} className={className} isOpen={isPubblicaAlboSelected} setIsOpen={setIsPubblicaAlboSelected} control={control} errors={errors}/>
    
            <AmministrazioneTrasparente_Section selectValues={selectValues} isOpen={isAmministrazioneTrasparenteSelected} setIsOpen={setIsAmministrazioneTrasparenteSelected} control={control} className={className} errors={errors}/>
    
            <BachecheIstituzionali_Section selectValues={selectValues} isOpen={isBachecheIstituzionaliSelected} setIsOpen={setIsBachecheIstituzionaliSelected} control={control} className={className} errors={errors}/>
      
        </>
    )
}
