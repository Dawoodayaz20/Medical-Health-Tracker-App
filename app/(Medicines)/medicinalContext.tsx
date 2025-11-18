import { ReactNode, useState, createContext } from "react";

type medicineContextType = {
    medicine: Medicines[],
    setMedicine: React.Dispatch<React.SetStateAction<Medicines[]>>
}

export const MedicineContext = createContext<medicineContextType>({
    medicine: [],
    setMedicine: () => {}
})

function MedicineContextProvider ({children} : {children: ReactNode}) {
    const [medicine, setMedicine] = useState<Medicines[]>([])
    
    return(
        <MedicineContext.Provider value={{medicine, setMedicine}}>
            {children}
        </MedicineContext.Provider>
    )
}

export default MedicineContextProvider;