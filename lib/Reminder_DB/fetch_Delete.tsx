import { Query } from "appwrite";
import { getAccountID } from "../appwriteConfig";
import { databases } from "../appwriteConfig";

export async function DeleteReminder(documentId: string) {
    try {
        await databases.deleteDocument(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "reminders",
            documentId
        );
        console.log("Reminder deleted successfully!");
    } catch (error) {
        console.log("Error deleting reminder:", error);
    }
}

export async function getReminders(): Promise<Reminder[] | null> {
    try{
        const userID = await getAccountID()
        if (!userID) {
            console.log("The user must be logged in!")
            }

        const response = await databases.listDocuments({
            databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            collectionId: "reminders",
            queries: [Query.equal("userID", userID)]
        });
            return response.documents.map((doc: any) => ({
                id: doc.$id,
                userID: doc.userID,
                title: doc.title,
                description: doc.description,
                reminderId: doc.reminderId,
                hour: doc.hour,
                minute: doc.minute
            }));
        }
    catch(err){
        console.log("Error fetching Notes Data", err)
        return null;
    }
}