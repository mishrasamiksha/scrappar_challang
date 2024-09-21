import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Groq } from 'groq-sdk';
import AnimatedText from '../components/AnimatedText';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const ChatMessage = ({ message, isUser, streaming = false, }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-3/4 p-3 rounded-lg ${isUser ? 'bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white' : 'bg-gray-100'}`}>
            {isUser || streaming ? message : <AnimatedText text={message} />}
        </div>
    </div>
);

export default function Chatbot({ projectId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! Welcome to our website. How can I assist you today?", isUser: false },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const [systemPrompt, setSystemPrompt] = useState('');
    const groq = new Groq(
        { apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true }
    );

    useEffect(() => {
        fetchSystemPrompt();
    }, []);

    const fetchSystemPrompt = async () => {
        try {
            const projectDoc = await getDoc(doc(db, 'projects', projectId));
            if (projectDoc.exists()) {
                setSystemPrompt(projectDoc.data().system_prompt || '');
            }
        } catch (error) {
            console.error('Error fetching system prompt:', error);
        }
    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, streamingMessage]);

    const handleSend = useCallback(async () => {
        if (input.trim() && !loading) {
            const userMessage = { text: input, isUser: true };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setInput('');
            setLoading(true);
            setStreamingMessage({ text: '', isUser: false });

            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt || "You are a travel assistant for Olanka Travel."
                        },
                        ...messages.map(msg => ({
                            role: msg.isUser ? "user" : "assistant",
                            content: msg.text
                        })),
                        { role: "user", content: input }
                    ],
                    model: "llama-3.1-70b-versatile",
                    stream: true,
                });

                let accumulatedContent = '';
                for await (const chunk of chatCompletion) {
                    accumulatedContent += chunk.choices[0]?.delta?.content || "";
                    setStreamingMessage({ text: accumulatedContent, isUser: false });
                }

                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: accumulatedContent, isUser: false }
                ]);
            } catch (error) {
                console.error('Error fetching AI response:', error);
                setMessages(prevMessages => [...prevMessages, {
                    text: 'Sorry, something went wrong. Please try again later.',
                    isUser: false
                }]);
            } finally {
                setLoading(false);
                setStreamingMessage(null);
            }
        }
    }, [input, loading, messages, groq, systemPrompt]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    className="bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-full p-4 shadow-lg hover:from-[#14a085] hover:to-[#1c7fc7] transition duration-300 transform hover:scale-110"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white shadow-2xl rounded-lg w-80 sm:w-96 overflow-hidden transition-all duration-300 transform scale-100 translate-y-0">
                    <div className="bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white p-4 flex justify-between items-center">
                        <h2 className="font-semibold text-lg flex items-center">
                            Customer Support
                        </h2>
                        <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
                        ))}
                        {streamingMessage && <ChatMessage message={streamingMessage.text || "Thinking..."} isUser={false} streaming={true} />}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16B197]"
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                className="bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-full p-2 hover:from-[#14a085] hover:to-[#1c7fc7] transition duration-300"
                                aria-label="Send message"
                                disabled={loading}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}