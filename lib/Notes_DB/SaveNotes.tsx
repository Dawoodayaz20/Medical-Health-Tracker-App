import { ID, type Models } from "appwrite"
import { account, databases } from "../appwriteConfig"
import { getAccountID } from "../appwriteConfig"

export async function saveNoteToAppwrite (title: string, date: string, med_note: string): Promise<Models.Document | null> {

    const accountInfo = await account.get()
    const userId = accountInfo.$id

    try{
        const doc = await databases.createDocument(
        process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        "medical_notes",
        ID.unique(),
        {
            userId: userId,
            title,
            date,
            med_note,
        },  
        [
        `read("user:${userId}")`,
        `write("user:${userId}")`
        ],
    )
    console.log("Info saved successfully!", doc)
    return doc
    }
    catch(error){
        console.log("There was an error saving the info:", error)
        return null;
    }
}

export async function UpdateMedicalNote(
    docId: string,
    title:string, 
    date: string, 
    med_note: string, 
    ) 
    {
        const userAccount = await getAccountID()
        if(userAccount){
            try{
                const updatedDoc = await databases.updateDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                "medical_notes",
                docId,
                {
                    title,
                    date,
                    med_note
                },  
                [
                `read("user:${userAccount}")`,
                `write("user:${userAccount}")`
                ],
                )
                return updatedDoc;
            }
        catch(error){
            console.log("There was an error saving the info:", error)
            return error
        }
        }
        else{
            alert("User must be logged in to save info!")
        }
}