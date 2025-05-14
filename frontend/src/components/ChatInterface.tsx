import React, { useState } from 'react';
import { TypographyP } from './ui/Typography';
import { Textarea } from './ui/textarea';
import { SendIcon } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}


const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello, how are you?',
      role: 'user',
    },
  ]);

  const [input, setInput] = useState<string>('');

  const handleSendMessage = () => {
    if(!input.trim()) return;

    // Add user message to the conversation
    const newMessage: Message = {
      id: new Date().toISOString(),
      content: input,
      role: 'user',
    };

    // Update the messages state
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Clear the input field
    setInput('');

    // Simulate an assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: new Date().toISOString(),
        content: 'Analyzing repository data...',
        role: 'assistant',
      };

      // Update the messages state with the assistant response
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }, 1000);
  };


  return (
    <div className="flex flex-col h-full justify-end">
      

      {/* Conversation History */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}
              >
                <TypographyP text={message.content} />
              </div>
            </div>
          ))}
        </div>
      </div>


      <footer className="bg-inherit p-4">
        <div className="relative w-full rounded-4xl border overflow-hidden bg-background">
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className='border-none p-4 pr-10 resize-none bg-transparent w-full max-h-70' />
          <button 
            onClick={handleSendMessage}
            className="absolute right-2 bottom-3 w-6 h-6 flex items-center justify-center !rounded-full !border-0 !p-0 !bg-primary hover:!bg-primary/90 text-primary-foreground"
          >
            <SendIcon className="w-3 h-3 text-black" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;