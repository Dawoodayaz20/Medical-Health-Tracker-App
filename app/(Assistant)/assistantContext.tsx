import React, { createContext, useContext, useState, ReactNode } from "react";
import handleResponse from "../../lib/agentauth";

type Message = { text: string; from: "user" | "bot" };

type ChatContextType = {
  messages: Message[];
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    const userMessage: { text: string; from: "user" | "bot" } = { text, from: "user" };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setText("");

    try {
      const conversation = updatedMessages
        .map(m => `${m.from === "user" ? "User" : "Assistant"}: ${m.text}`)
        .join("\n");

      const reply = await handleResponse(conversation);

      const botReply =
        typeof reply === "object" && reply?.error
          ? `Error: ${reply.error}`
          : reply || "Sorry, I couldn't process your request.";

      setMessages(prev => [...prev, { text: botReply, from: "bot" }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { text: "Something went wrong.", from: "bot" },
      ]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, text, setText, handleSubmit }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within ChatProvider");
  return context;
};
