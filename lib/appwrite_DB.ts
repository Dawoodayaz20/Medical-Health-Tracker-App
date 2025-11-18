import { ID } from "appwrite"
import { databases, getAccountID } from "./appwriteConfig"
import { getDocumentID } from "./appwrite_queries"

export async function saveNoteToAppwrite (title: string, date: string, med_note: string) {

    const userId = await getAccountID()

    try{
        await databases.createDocument(
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
    console.log("Info saved successfully!")
    }
    catch(error){
        console.log("There was an error saving the info:", error)
    }
}

export async function saveUserInfo(name:string, age: string, gender: string) {

    const userAccount = await getAccountID()
    if(userAccount){
        try{
            await databases.createDocument(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "users",
            ID.unique(),
            {
                userID: userAccount,
                name,
                age,
                gender
            },  
            [
            `read("user:${userAccount}")`,
            `write("user:${userAccount}")`
            ],
            )
        }
    catch(error){
        console.log("There was an error saving the info:", error)
    }
    }
    else{
        alert("User must be logged in to save info!")
    }
}

export async function updateUserInfo(name: string, age: string, gender: string, email: string) {
    const documentID = await getDocumentID()
    if (documentID) {
        try{
            const updated = await databases.updateDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                "users",
                documentID,
                {
                    name, age, gender, email,
                }
            )
        }
        catch(error){

        }
    }
}