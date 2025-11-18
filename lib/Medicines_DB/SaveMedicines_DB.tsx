import { ID } from "appwrite"
import { databases, getAccountID } from "../appwriteConfig"

export async function SaveMedicines (name: string, illness: string, dosage: string, time: string, detail: string) {
    const userId = await getAccountID()

    try{
        await databases.createDocument(
        process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        "medicines",
         ID.unique(),
        {
            userID: userId,
            name: name,
            illness: illness,
            dosage: dosage,
            time: time,
            detail: detail
        },  
        [
        `read("user:${userId}")`,
        `write("user:${userId}")`
        ],
    )
    console.log("Info saved successfully!")
    }
    catch(error){
        console.log("There was an error saving the Medicinal information:", error)
    }
}

export async function UpdateMedicine(
    docId: string,
    name:string, 
    illness: string, 
    dosage: string, 
    time: string,
    detail: string
    ) 
    {
        const userAccount = await getAccountID()
        if(userAccount){
            try{
                await databases.updateDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                "medicines",
                docId,
                {
                    userID: userAccount,
                    name,
                    illness,
                    dosage,
                    time,
                    detail
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