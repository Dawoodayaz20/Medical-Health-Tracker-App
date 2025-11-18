import React, { ReactNode, createContext, useState } from "react";
// import { getUserProfile } from "../../lib/appwrite_queries";

type ProfileContextType = {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

// const fetchProfile = () => {
//     const userData = async () => {
//             const data = await getUserProfile()
//           userData()    
//     }
// }


export const ProfileContext = createContext<ProfileContextType>({
    profile: {docId: "", name: "", age: "", gender:"", email: ""},
    setProfile: () => {}
})

const ProfileContextProvider = ({children}: {children: ReactNode}) => {
    const [profile, setProfile] = useState<Profile>({ docId: "", name: "", age: "", gender: "", email: "" });

    return (
        <ProfileContext.Provider value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
    )
};

export default ProfileContextProvider;