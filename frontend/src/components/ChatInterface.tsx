import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! How can I help you with your repositories today?",
      role: "assistant",
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm analyzing your repository data. What specific information would you like to know?",
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full border-none shadow-none">
      <CardHeader className="pb-2 pt-3 px-4 border-b">
        <CardTitle className="text-lg font-medium flex items-center text-foreground">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          GitSum Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 pb-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "px-3 py-2 rounded-lg text-sm max-w-[80%]",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "bg-muted text-foreground rounded-bl-none"
                )}
              >
                {message.content}
              </div>
              
              {message.role === "user" && (
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Ask anything about the repository..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 focus-visible:ring-primary"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={!input.trim()}
            className="h-9 w-9 rounded-full"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;