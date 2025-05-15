import React, { useState } from 'react';
import { TypographySmall } from './ui/Typography';
import { Textarea } from './ui/textarea';
import { SendIcon } from 'lucide-react';
import { useSendChat } from '@/hooks/useSendChat';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface AssistantMessageProps {
  message: Message;
}

interface UserMessageProps {
  message: Message;
}


const AssistantMessage: React.FC<AssistantMessageProps> = ({ message }) => {
  return (
    <div className="flex justify-start">
      <div className="bg-inherit text-foreground p-2 max-w-[80%] text-left">
        <TypographySmall text={message.content} />
      </div>
    </div>
  );
};


const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex justify-end">
      <div className="bg-muted text-primary-foreground dark:text-foreground p-2 pb-1 px-4 rounded-xl max-w-[80%] text-left">
        <TypographySmall text={message.content} />
      </div>
    </div>
  );
};

interface ChatInterfaceProps {
  repositoryId: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ repositoryId }) => {
  const { mutate: sendChat, isPending } = useSendChat();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello, how are you?',
      role: 'assistant',
    },
  ]);

  const [input, setInput] = useState<string>('');

  const handleSendMessage = () => {
    if(!input.trim()) return;

    // Add user message to the conversation
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: 'user',
    };

    // Update the messages state
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const messageToSend = input;

    setInput('');

    sendChat(
      { repositoryId, message: messageToSend },
      {
        onSuccess: (data) => {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            content: data.message,
            role: 'assistant',
          };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        },
        onError: (error) => {
          const errorMessage: Message = {
            id: `error-${Date.now()}`,
            content: "Sorry, I couldn't process your request. Please try again.",
            role: 'assistant',
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
          console.error(error);
        }
      }
    );



  };


  return (
    <div className="flex flex-col h-full justify-end">
      

      {/* Conversation History */}
      <div className="flex flex-col justify-end overflow-auto p-0 ">
        <div className="flex flex-col justify-between p-5">
          {messages.map((message) => (
            message.role === 'assistant' ? (
              <AssistantMessage key={message.id} message={message} />
            ) : (
              <UserMessage key={message.id} message={message} />
            )
          ))}
        </div>
      </div>


      <footer className="bg-inherit p-4">
        <div className="relative w-full rounded-4xl border overflow-hidden bg-background">
          <Textarea 
            value={input}
            placeholder="Type your message here..."
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
            disabled={isPending}
            className="absolute right-2 bottom-3 w-6 h-6 flex items-center justify-center !rounded-full !border-0 !p-0 !bg-white hover:!bg-primary/90 text-primary-foreground"
          >
            <SendIcon className="w-3 h-3 text-black" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;