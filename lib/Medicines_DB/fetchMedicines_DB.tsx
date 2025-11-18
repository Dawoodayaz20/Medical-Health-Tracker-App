import { Query } from "appwrite";
import { databases, getAccountID } from "../appwriteConfig";

export async function fetchMedicines(): Promise<Medicines[] | null> {
    try{
        const userID = await getAccountID()
        if (!userID) {
            console.log("The user must be logged in!")
            }

        const response = await databases.listDocuments({
            databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            collectionId: "medicines",
            queries: [Query.equal("userID", userID)]
        });
            return response.documents.map((doc: any) => ({
                id: doc.$id,
                userID: doc.userID,
                name: doc.name,
                illness: doc.illness,
                dosage: doc.dosage,
                time: doc.time,
                detail: doc.detail
            }));
        }
    catch(err){
        console.log("Error fetching Notes Data", err)
        return null;
    }
}

export async function DeleteMedicine(documentId: string) {
    try {
        await databases.deleteDocument(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "medicines",
            documentId
        );
        console.log("Medicine deleted successfully!");
    } catch (error) {
        console.log("Error deleting medicine:", error);
    }
}