import { Query } from "appwrite";
import { getAccountID, databases} from "../appwriteConfig";

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