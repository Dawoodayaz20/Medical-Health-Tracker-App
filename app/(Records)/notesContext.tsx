import React, { createContext, useState, ReactNode } from "react";

type NotesContextType = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

export const NotesContext = createContext<NotesContextType>({
    notes: [],
    setNotes: () => {},
});


const NotesProvider = ({ children }: {children: ReactNode}) => {
    const [notes, setNotes] = useState<Note[]>([]);
    
    return(
        <NotesContext.Provider value={{ notes, setNotes }}>
            {children}
        </NotesContext.Provider>
    );
}

export default NotesProvider;