import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane, FaCopy, FaDownload, FaMicrophone } from 'react-icons/fa';
import { useAuth } from '../api/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../api/apiAxios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AnimatedText from '../components/AnimatedText';
const generateRandomProjectId = () => {
    return Math.floor(Math.random() * 1000000);
};

const AskAnything = () => {
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const [streamingResponse, setStreamingResponse] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) return;

        const userMessage = { type: 'user', text: inputValue };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputValue('');
        setLoading(true);
        setStreamingResponse('');

        try {
            const projectId = generateRandomProjectId();
            const response = await axiosApi.post('/groq/chat', {
                prompt: inputValue,
                system_prompt: "You are a DevOps AI assistant.",
                projectId: projectId
            }, {
                responseType: 'stream'
            });

            const reader = response.data.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                setStreamingResponse(prev => prev + chunk);
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'ai', text: streamingResponse }
            ]);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setMessages(prevMessages => [...prevMessages, {
                type: 'ai',
                text: 'Sorry, something went wrong. Please try again later.',
            }]);
        } finally {
            setLoading(false);
            setStreamingResponse('');
        }
    }, [inputValue, loading]);

    const handleCopy = useCallback((text) => {
        navigator.clipboard.writeText(text);
        alert('Message copied to clipboard!');
    }, []);

    const exportChatToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Chat History', 14, 22);
        const columns = ['Sender', 'Message'];
        const rows = messages.map(msg => [
            msg.type === 'ai' ? 'Assistant' : 'User',
            msg.text,
        ]);
        autoTable(doc, {
            startY: 30,
            head: [columns],
            body: rows,
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [22, 160, 133] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { top: 20 },
        });
        doc.save('chat-history.pdf');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white shadow-sm p-4">
                <div className="mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/main_logo.png"
                            alt="DevOpsAI"
                            className="pointer-events-none select-none text-center -ml-1 h-10"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #16B197, #2091DC)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        />
                    </div>
                    <nav>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-md hover:from-[#14a085] hover:to-[#1c7fc7]"
                        >
                            Dashboard
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-grow overflow-hidden flex flex-col">
                <div className="flex-grow overflow-hidden flex flex-col max-w-7xl mx-auto w-full">
                    <div className="flex-grow overflow-hidden flex flex-col bg-white shadow-lg rounded-lg m-4">
                        {messages.length === 0 ? (
                            <div className="flex-grow flex items-center justify-center">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                                    <Section title="Learn" icon="📚" setInputValue={setInputValue}>
                                        <SectionItem text="Explain CI/CD pipelines in DevOps" />
                                        <SectionItem text="What is Infrastructure as Code?" />
                                    </Section>
                                    <Section title="Ask" icon="❓" setInputValue={setInputValue}>
                                        <SectionItem text="Best practices for container orchestration" />
                                        <SectionItem text="How to implement blue-green deployments" />
                                    </Section>
                                    <Section title="Practice" icon="🔧" setInputValue={setInputValue}>
                                        <SectionItem text="Set up a Jenkins pipeline" />
                                        <SectionItem text="Configure Kubernetes autoscaling" />
                                    </Section>
                                </div>
                            </div>
                        ) : (
                            <MessageList
                                messages={messages}
                                loading={loading}
                                handleCopy={handleCopy}
                                messagesEndRef={messagesEndRef}
                                streamingResponse={streamingResponse}
                            />
                        )}
                        <InputForm
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            handleSendMessage={handleSendMessage}
                            loading={loading}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

const Section = ({ title, icon, children, setInputValue }) => (
    <div className="bg-gradient-to-br from-[#e6f7f5] to-[#e6f2f9] p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
            <span className="mr-2">{icon}</span>
            {title}
        </h4>
        {React.Children.map(children, child =>
            React.cloneElement(child, { setInputValue })
        )}
    </div>
);

const SectionItem = ({ text, setInputValue }) => (
    <div
        className="bg-white p-3 rounded-md mb-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-700 shadow-sm"
        onClick={() => setInputValue(text)}
    >
        {text}
    </div>
);

const MessageList = ({ messages, loading, handleCopy, messagesEndRef, streamingResponse }) => (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
            <Message key={index} msg={msg} handleCopy={handleCopy} />
        ))}
        {loading && (
            <Message
                msg={{ type: 'ai', text: streamingResponse || 'Thinking...' }}
                handleCopy={handleCopy}
                streaming={true}
            />
        )}
        <div ref={messagesEndRef} />
    </div>
);

const Message = ({ msg, handleCopy, streaming = false }) => (
    <div className={`p-3 rounded-lg ${msg.type === 'ai' ? 'bg-indigo-100' : 'bg-indigo-500'}`}>
        <p className={msg.type === 'ai' ? 'text-gray-700' : 'text-white'}>
            {msg.type === 'ai' && !streaming ? <AnimatedText text={msg.text} /> : msg.text}
        </p>
        {msg.type === 'ai' && !streaming && (
            <button
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => handleCopy(msg.text)}
            >
                <FaCopy className="inline mr-1" /> Copy
            </button>
        )}
    </div>
);

const LoadingMessage = () => (
    <div className="p-3 rounded-lg bg-gray-100">
        <p className="text-black">Thinking...</p>
    </div>
);

const InputForm = ({ inputValue, setInputValue, handleSendMessage, loading }) => (
    <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200 shadow-sm bg-gray-100">
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full shadow">
            <FaMicrophone className="text-gray-500" />
        </button>
        <input
            type="text"
            placeholder="Type your message..."
            className="bg-white text-black flex-1 mx-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
        />
        <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-md hover:bg-gradient-to-r hover:from-[#16B197] hover:to-[#2091DC] shadow-lg"
            disabled={loading}
        >
            <FaPaperPlane />
        </button>
    </form>
);

export default AskAnything;