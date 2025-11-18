import React, { createContext, ReactNode, useState } from "react";

type RemindersContextType = {
    reminder: Reminder[],
    setReminder: React.Dispatch<React.SetStateAction<Reminder[]>>
}


export const RemindersContext = createContext<RemindersContextType>({
    reminder: [],
    setReminder: () => {}
})

const RemindersContextProvider = ({children}: {children: ReactNode}) => {
    const [reminder, setReminder] = useState<Reminder[]>([])
    
    return(
            <RemindersContext.Provider value={{ reminder, setReminder }}>
                        {children}
            </RemindersContext.Provider>
        )
}

export default RemindersContextProvider;