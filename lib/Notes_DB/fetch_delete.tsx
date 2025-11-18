import { Query } from "appwrite";
import { databases } from "../appwriteConfig";
import { getAccountID } from "../appwriteConfig";

export async function getNotes(): Promise<Note[] | null> {
    try{
        const userID = await getAccountID()
        if (!userID) {
            console.log("The user must be logged in!")
            }

        const response = await databases.listDocuments(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                "medical_notes",
                [Query.equal("userId", userID)]
            );
            return response.documents.map((doc: any) => ({
                id: doc.$id,
                userId: doc.userId,
                title: doc.title,
                date: doc.date,
                med_note: doc.med_note
            }));
        }
    catch(err){
        console.log("Error fetching Notes Data", err)
        return null;
    }
}

export async function DeleteNote (documentId: string) {
    try{
        await databases.deleteDocument(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "medical_notes",
            documentId
        );
        console.log("Medical Note has been deleted successfully!")
    }
    catch (error) {
        console.log("Error deleting medical note:", error)
    }
}
