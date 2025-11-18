import { Query } from "appwrite";
import { databases, getAccountID } from "./appwriteConfig";


export async function getUserProfile() {
    try{
        const userID = await getAccountID()
        if(userID) {
            const response = await databases.listDocuments({
                databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                collectionId: "users",
                queries: [Query.equal("userID", userID)],
        });
            if(response.documents.length > 0){
                return response.documents[0];
            } else {
                return null;
            }
        }
        else{
            console.log("The user is not logged in!")
        }
    }
    catch(error){
        console.log("Error fetching profile data", error)
    }
}

export async function getDocumentID () {
    const userID = await getAccountID()
    
    const response = await databases.listDocuments(
        process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        "users",
        [Query.equal("userID", userID)]
    );
    
    const user$id = response.documents[0].$id
    return user$id
}