import { ID, } from "appwrite"
import { databases, getAccountID } from "../appwriteConfig"

export async function saveUserInfo(email: string, password:string, name:string, age: string, gender: string) {

    const userAccount = await getAccountID()
    if(userAccount){
        try{
            await databases.createDocument(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "users",
            ID.unique(),
            {
                userID: userAccount,
                email,
                password,
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


export async function UpdateUserInfo(
    docId: string,
    name:string, 
    age: string, 
    gender: string, 
    ) 
    {
        const userAccount = await getAccountID()
        if(userAccount){
            try{
                await databases.updateDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                "users",
                docId,
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