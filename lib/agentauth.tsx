import { getAccountID } from "./appwriteConfig";

export default async function handleResponse (question: string) {
    
    const userId : string = await getAccountID()
    if (!userId) {
        throw new Error("The user must be signed in!");
    }

    try {
        const response = await fetch('https://medical-assistant-jade.vercel.app/medicalAssistant',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({question, userId})
        })

        const reply = await response.json();

        if (!response.ok || reply.error) {
        return { error: reply.error || `Server error: ${response.status}` };
        }

        return reply; // valid response
        }
    catch(error){
        console.log("Error calling agent:", error);
        return { error: 'There was an error connecting with the Medical Assistant.' };
    }
}
