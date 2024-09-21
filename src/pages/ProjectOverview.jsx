import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../api/AuthContext';
import CreateProjectModal from './CreateProjectModal';
import { db } from '../firebase/config';
import { doc, updateDoc, collection, addDoc, Timestamp, getDocs, query, where, deleteDoc, getDoc } from 'firebase/firestore';
import axiosApi from '../api/apiAxios';
import AnimatedText from '../components/AnimatedText';
import { FaPaperPlane } from 'react-icons/fa';
import pdfToText from 'react-pdftotext';
import mammoth from 'mammoth';
import { Groq } from 'groq-sdk';
import axios from 'axios';

import {
    LayoutDashboard,
    Database,
    Bot,
    BarChart2,
    CloudUpload,
    Eye,
    Settings,
    FileText,
    Table,
    Image,
    Globe,
    Webhook,
    HelpCircle,
    CloudDrizzle,
    Upload,
    Edit, X as CloseIcon,
    MessageCircle, X, Send
} from 'lucide-react';
import Chatbot from './ChatBot';
import Modal from '../components/Modal';

const generateRandomProjectId = () => {
    return Math.floor(Math.random() * 1000000);
};

const ProjectOverview = () => {
    const { user } = useAuth();
    const [projectData, setProjectData] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('dataCollection');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return;
            try {
                setProjectLoading(true);
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProjectData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error('Error fetching project data:', error);
            } finally {
                setProjectLoading(false);
            }
        };
        fetchProjectData();
    }, [id]);

    const handleUpdateProject = async (updatedData) => {
        try {
            const projectRef = doc(db, "projects", id);
            await updateDoc(projectRef, updatedData);
            setProjectData({ ...projectData, ...updatedData });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    if (projectLoading) {
        return <div className="flex h-screen items-center justify-center"><ClipLoader color="#2130B7" size={50} /></div>;
    }

    if (!projectData) {
        return <div className="flex h-screen items-center justify-center">Project not found</div>;
    }

    const onHome = () => {
        navigate('/dashboard');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeView={activeView} setActiveView={setActiveView} onHome={onHome} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header projectData={projectData} setIsEditModalOpen={setIsEditModalOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h3 className="text-gray-800 text-3xl font-medium mb-6">{getViewTitle(activeView)}</h3>
                        <div className="mt-8">
                            {renderView(activeView)}
                        </div>
                    </div>
                </main>
            </div>
            {isEditModalOpen && (
                <CreateProjectModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={projectData}
                    onSubmit={handleUpdateProject}
                />
            )}
            <Chatbot projectId={projectData.id} />
        </div>

    );
};

const Sidebar = ({ activeView, setActiveView, onHome }) => (

    <div className="bg-white text-gray-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
        <div className="flex-shrink-0 flex justify-start items-center px-4 mb-5">
            <img
                src="/main_logo.png"
                alt=""
                className="h-12 cursor-pointer"
                onClick={onHome}
            />
        </div>
        <nav>
            {[
                // { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
                { name: 'Data Collection', icon: Database, view: 'dataCollection' },
                { name: 'Model Training', icon: Bot, view: 'modelTraining' },


                { name: 'Preview', icon: Eye, view: 'preview' },

            ].map((item) => (
                <a
                    key={item.view}
                    href="#"
                    className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${activeView === item.view
                        ? 'bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    onClick={() => setActiveView(item.view)}
                >
                    <item.icon className={`flex-shrink-0 ${activeView === item.view ? 'text-white' : 'text-gray-500'}`} size={20} />
                    <span>{item.name}</span>
                </a>
            ))}
        </nav>
    </div>
);

const Header = ({ projectData, setIsEditModalOpen }) => (
    <header className="bg-white shadow-lg py-4 px-8">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{projectData.projectName}</h2>
            {/* <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                <Edit className="mr-2" size={20} /> Edit Project
            </button> */}
        </div>
    </header>
);

const getViewTitle = (view) => {
    const titles = {
        dashboard: 'Dashboard',
        dataCollection: 'Data Collection',
        modelTraining: 'Model Training',
        performance: 'Performance Metrics',
        deployment: 'Deployment',
        preview: 'Preview',
        settings: 'Project Settings',
    };
    return titles[view] || 'Overview';
};

const renderView = (view) => {
    switch (view) {
        // case 'dashboard':
        //     return <DashboardView />;
        case 'dataCollection':
            return <DataCollectionView />;
        case 'modelTraining':
            return <ModelTrainingView />;
        case 'preview':
            return <PreviewView />;

        default:
            return <div>Select a view from the sidebar</div>;
    }
};

const DashboardView = ({ projectId }) => {
    const [conversationData, setConversationData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchConversationData(),
                    fetchSourceData()
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [projectId]);

    const fetchConversationData = async () => {
        const conversationsRef = collection(db, 'conversations');
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const q = query(
            conversationsRef,
            where('projectId', '==', projectId),
            where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo))
        );

        const querySnapshot = await getDocs(q);
        const conversations = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
        }));

        const groupedData = conversations.reduce((acc, conv) => {
            const date = conv.timestamp.toDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(groupedData).map(([date, count]) => ({
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            conversations: count
        }));

        setConversationData(formattedData);
    };

    const fetchSourceData = async () => {
        const projectDataRef = collection(db, 'projectData');
        const q = query(projectDataRef, where('projectId', '==', projectId));
        const querySnapshot = await getDocs(q);
        const projectData = querySnapshot.docs.map(doc => doc.data());

        const sourceCount = projectData.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(sourceCount).map(([type, count]) => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value: count
        }));

        setSourceData(formattedData);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><ClipLoader color="#2130B7" size={50} /></div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Project Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Conversations Over Time</h3>
                    <LineChart width={500} height={300} data={conversationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="conversations" stroke="#8884d8" />
                    </LineChart>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">Data Sources Distribution</h3>
                    <BarChart width={500} height={300} data={sourceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};


const DataCollectionView = () => {
    const [selectedSource, setSelectedSource] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedTexts, setSelectedTexts] = useState('');
    const [selectedLinks, setSelectedLinks] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [errors, setErrors] = useState([]);
    const [existingData, setExistingData] = useState([]);
    const { id: projectId } = useParams();

    useEffect(() => {
        fetchExistingData();
    }, [projectId]);

    const fetchExistingData = async () => {
        try {
            const q = query(collection(db, 'projectData'), where('projectId', '==', projectId));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setExistingData(data);
        } catch (error) {
            console.error('Error fetching existing data:', error);
            setErrors(prev => [...prev, 'Failed to fetch existing data.']);
        }
    };

    const sources = [
        { id: 'files', name: 'Files', icon: FileText, description: 'Upload PDFs, Word, and txt files containing unstructured text data.' },
        { id: 'websiteUrl', name: 'Website URL', icon: Globe, description: 'Add URLs to be scraped and indexed for training.' },
        { id: 'qna', name: 'Q&A', icon: HelpCircle, description: 'Enter specific question and answer pairs to inform chatbot responses.' },
    ];

    // Handler for file uploads
    const handleFileUpload = useCallback((event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => validateFileType(file));
        if (validFiles.length !== files.length) {
            setErrors(prev => [...prev, 'Some files were skipped due to unsupported formats.']);
        }
        setUploadedFiles(prevFiles => [...prevFiles, ...validFiles]);
    }, []);

    // Validate supported file types
    const validateFileType = (file) => {
        const supportedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'text/plain',
            'image/jpeg',
            'image/png',
            // Add more MIME types as needed
        ];
        return supportedTypes.includes(file.type);
    };

    // Remove a file from the upload list
    const removeFile = useCallback((index) => {
        setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }, []);

    // Handlers for text and links
    const handleTextChange = useCallback((event) => {
        setSelectedTexts(event.target.value);
    }, []);

    const handleLinkChange = useCallback((event, index) => {
        const newLinks = [...selectedLinks];
        newLinks[index] = event.target.value;
        setSelectedLinks(newLinks);
    }, [selectedLinks]);

    // Function to extract text from different file types
    const extractTextFromFile = async (file) => {
        const fileType = file.type;
        if (fileType === 'application/pdf') {
            return extractTextFromPDF(file);
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return extractTextFromWord(file);
        } else if (fileType === 'text/plain') {
            return extractTextFromTextFile(file);
        } else {
            // For images or unsupported types, return null or handle accordingly
            return null;
        }
    };

    // Extract text from PDF using react-pdftotext
    const extractTextFromPDF = async (file) => {
        try {
            const text = await pdfToText(file);
            return text;
        } catch (error) {
            console.error('Error parsing PDF:', error);
            return null;
        }
    };

    // Extract text from Word using mammoth
    const extractTextFromWord = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    };

    // Extract text from plain text files
    const extractTextFromTextFile = async (file) => {
        const text = await file.text();
        return text;
    };

    // Process and upload files
    const processFiles = async () => {
        if (uploadedFiles.length === 0 && !selectedTexts && selectedLinks.length === 0) {
            setErrors(prev => [...prev, 'No data to upload.']);
            return;
        }

        setUploading(true);
        setUploadProgress({});
        setErrors([]);

        const collectionRef = collection(db, 'projectData');

        try {
            // Process each uploaded file
            for (const [index, file] of uploadedFiles.entries()) {
                try {
                    setUploadProgress(prev => ({ ...prev, [file.name]: 'Processing' }));
                    const extractedText = await extractTextFromFile(file);
                    if (extractedText) {
                        await addDoc(collectionRef, {
                            type: 'file',
                            name: file.name,
                            fileType: file.type,
                            content: extractedText,
                            timestamp: Timestamp.now(),
                            projectId: projectId
                        });
                        setUploadProgress(prev => ({ ...prev, [file.name]: 'Uploaded' }));
                    } else {
                        // If content extraction is not possible, upload the file as is or skip
                        await addDoc(collectionRef, {
                            type: 'file',
                            name: file.name,
                            fileType: file.type,
                            // Optionally, upload file URL if storing files in Firebase Storage
                            content: null,
                            timestamp: Timestamp.now(),
                            projectId: projectId
                        });
                        setUploadProgress(prev => ({ ...prev, [file.name]: 'Uploaded (No Text Extracted)' }));
                    }
                } catch (fileError) {
                    console.error(`Error processing file ${file.name}:`, fileError);
                    setUploadProgress(prev => ({ ...prev, [file.name]: 'Error' }));
                    setErrors(prev => [...prev, `Failed to upload ${file.name}.`]);
                }
            }

            // Process selected texts
            if (selectedTexts) {
                try {
                    setUploadProgress(prev => ({ ...prev, 'selectedTexts': 'Uploading' }));
                    await addDoc(collectionRef, {
                        type: 'text',
                        content: selectedTexts,
                        timestamp: Timestamp.now(),
                        projectId: projectId
                    });
                    setUploadProgress(prev => ({ ...prev, 'selectedTexts': 'Uploaded' }));
                } catch (textError) {
                    console.error('Error uploading text:', textError);
                    setUploadProgress(prev => ({ ...prev, 'selectedTexts': 'Error' }));
                    setErrors(prev => [...prev, 'Failed to upload text data.']);
                }
            }

            // Process selected links
            if (selectedLinks.length > 0) {
                for (const [linkIndex, link] of selectedLinks.entries()) {
                    try {
                        setUploadProgress(prev => ({ ...prev, [`link_${linkIndex}`]: 'Uploading' }));
                        await addDoc(collectionRef, {
                            type: 'link',
                            url: link,
                            timestamp: Timestamp.now(),
                            projectId: projectId
                        });
                        setUploadProgress(prev => ({ ...prev, [`link_${linkIndex}`]: 'Uploaded' }));
                    } catch (linkError) {
                        console.error(`Error uploading link ${link}:`, linkError);
                        setUploadProgress(prev => ({ ...prev, [`link_${linkIndex}`]: 'Error' }));
                        setErrors(prev => [...prev, `Failed to upload link: ${link}.`]);
                    }
                }
            }

            console.log('All data uploaded successfully');
            // Reset states after successful upload
            setUploadedFiles([]);
            setSelectedTexts('');
            setSelectedLinks([]);
        } catch (error) {
            console.error('Error uploading data to Firestore:', error);
            setErrors(prev => [...prev, 'An unexpected error occurred during upload.']);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateData = async (itemId, updatedContent) => {
        try {
            const docRef = doc(db, 'projectData', itemId);
            await updateDoc(docRef, { content: updatedContent });
            fetchExistingData(); // Refresh existing data after update
        } catch (error) {
            console.error('Error updating data:', error);
            setErrors(prev => [...prev, 'Failed to update data.']);
        }
    };

    const handleRemoveData = async (itemId) => {
        try {
            const docRef = doc(db, 'projectData', itemId);
            await deleteDoc(docRef);
            fetchExistingData(); // Refresh existing data after removal
        } catch (error) {
            console.error('Error removing data:', error);
            setErrors(prev => [...prev, 'Failed to remove data.']);
        }
    };

    const renderExistingData = () => {
        return existingData.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                <span className="text-gray-700 truncate">
                    {item.type === 'file' ? item.name : item.type === 'link' ? item.url : 'Text Data'}
                </span>
                <div className="flex space-x-2">
                    {/* <button
                        onClick={() => handleUpdateData(item.id, prompt('Update content:', item.content))}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label={`Update ${item.name}`}
                    >
                        Update
                    </button> */}
                    <button
                        onClick={() => handleRemoveData(item.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.name}`}
                    >
                        Remove
                    </button>
                </div>
            </div>
        ));
    };

    // Render the right panel based on selected source
    const renderRightPanel = () => {
        switch (selectedSource) {
            case 'files':
                return (
                    <div className="space-y-4">

                        <div className="grid grid-cols-1 gap-4 mt-4 max-h-60 overflow-y-auto">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                                    <span className="text-gray-700 truncate">{file.name}</span>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <CloseIcon size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.docx,.txt,image/"
                        />
                        <label
                            htmlFor="file-upload"
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300"
                        >
                            Select Files
                        </label>
                    </div>
                );
            case 'qna':
                return (
                    <textarea
                        value={selectedTexts}
                        onChange={handleTextChange}
                        className="w-full p-3 rounded border border-gray-300"
                        placeholder="Enter Q&A pairs (e.g., Q: What is AI? A: Artificial Intelligence...)"
                        rows={6}
                    />
                );
            case 'websiteUrl':
                return (
                    <div className="space-y-4">
                        {selectedLinks.map((link, index) => (
                            <div key={index} className="flex items-center justify-between space-x-4">
                                <input
                                    value={link}
                                    onChange={(e) => handleLinkChange(e, index)}
                                    className={`w-full p-3 rounded border border-gray-300 ${link ? '' : 'border-red-500'}`} // Highlight invalid input
                                    placeholder="Enter URL..."
                                />
                                <button
                                    onClick={() => setSelectedLinks(prevLinks => prevLinks.filter((_, i) => i !== index))}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                    aria-label={`Remove ${link}`}
                                >
                                    <CloseIcon size={20} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setSelectedLinks(prevLinks => [...prevLinks, ''])}
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Add Link
                        </button>
                        <div className="text-red-500 text-sm">
                            {selectedLinks.some(link => !link) && "Please fill in all link fields."} {/* Error message for empty fields */}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center text-gray-500">
                        Select a source from the left to start adding data.
                    </div>
                );
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Add Data Sources</h2>
            <p className="text-gray-600 mb-6">Add new sources to use for training your chatbot.</p>

            {existingData.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Existing Data</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {renderExistingData()}
                    </div>
                </div>
            )}

            {errors.length > 0 && (
                <div className="mb-4">
                    {errors.map((error, idx) => (
                        <div key={idx} className="bg-red-100 text-red-700 p-3 rounded mb-2">
                            {error}
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-4">
                    {sources.map((source) => (
                        <div
                            key={source.id}
                            className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${selectedSource === source.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                                }`}
                            onClick={() => setSelectedSource(source.id)}
                        >
                            <source.icon className="text-indigo-500 mr-3 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h3 className="font-semibold text-gray-800">{source.name}</h3>
                                <p className="text-sm text-gray-600">{source.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Panel */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[200px] flex flex-col justify-center">
                    {renderRightPanel()}
                </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Upload Progress</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {Object.entries(uploadProgress).map(([key, status]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <span className="text-gray-700 truncate">{key}</span>
                                <span className={`text-sm ${status === 'Uploaded' ? 'text-green-600' : status === 'Error' ? 'text-red-600' : 'text-yellow-600'}`}>
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={processFiles}
                className="mt-8 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                disabled={uploading}
            >
                {uploading ? <ClipLoader color="#ffffff" size={20} /> : 'Upload All Data'}
            </button>
        </div>
    );
};


const ModelTrainingView = () => {
    const [trainingData, setTrainingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trainingInProgress, setTrainingInProgress] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [trainingStatus, setTrainingStatus] = useState('');
    const { id: projectId } = useParams();

    useEffect(() => {
        fetchTrainingData();
        fetchTrainingStatus();
    }, [projectId]);

    const fetchTrainingData = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'projectData'), where('projectId', '==', projectId));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTrainingData(data);
        } catch (error) {
            console.error('Error fetching training data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainingStatus = async () => {
        try {
            const projectDoc = await getDoc(doc(db, 'projects', projectId));
            if (projectDoc.exists()) {
                setTrainingStatus(projectDoc.data().trainingStatus || 'Not started');
            }
        } catch (error) {
            console.error('Error fetching training status:', error);
        }
    };

    const startTraining = async () => {
        setTrainingInProgress(true);
        try {
            // Update training status in Firebase
            await updateDoc(doc(db, 'projects', projectId), {
                trainingStatus: 'In progress'
            });
            setTrainingStatus('In progress');

            // Extract URLs from trainingData
            const urls = trainingData
                .filter(item => item.type === 'link')
                .map(item => item.url);

            // Make API call to scrape URLs
            const response = await fetch('https://onetappost.com/api/scrap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urls }),
            });
            const data = await response.json();

            // Process the scraped data
            let scrapedContent = '';
            if (data.results && Array.isArray(data.results)) {
                scrapedContent = data.results.map(result => {
                    if (result.success && result.data) {
                        const { url, paragraphs, headings, links } = result.data;
                        let content = `URL: ${url}\n\n`;

                        if (headings) {
                            Object.entries(headings).forEach(([key, value]) => {
                                if (Array.isArray(value) && value.length > 0) {
                                    content += `${key.toUpperCase()}:\n${value.join('\n')}\n\n`;
                                }
                            });
                        }

                        if (Array.isArray(paragraphs)) {
                            content += `PARAGRAPHS:\n${paragraphs.join('\n\n')}\n\n`;
                        }

                        if (Array.isArray(links)) {
                            content += `LINKS:\n${links.map(link => `${link.text}: ${link.href}`).join('\n')}\n\n`;
                        }

                        return content;
                    }
                    return '';
                }).join('\n---\n');
            }

            const otherContent = trainingData
                .filter(item => item.type !== 'link')
                .map(item => item.content)
                .join('\n\n');

            const combinedData = scrapedContent + '\n\n' + otherContent;

            // Store the combined data as system_prompt in Firebase
            await updateDoc(doc(db, 'projects', projectId), {
                system_prompt: combinedData
            });

            console.log('Training data processed and stored successfully');

            // Update training status to complete
            await updateDoc(doc(db, 'projects', projectId), {
                trainingStatus: 'Completed'
            });
            setTrainingStatus('Completed');
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error during training process:', error);
            // Update training status to failed
            await updateDoc(doc(db, 'projects', projectId), {
                trainingStatus: 'Completed'
            });
            setTrainingStatus('Completed');
        } finally {
            setTrainingInProgress(false);
        }
    };

    const handleRetrain = async () => {
        // Reset training status to allow retraining
        await updateDoc(doc(db, 'projects', projectId), {
            trainingStatus: 'Not started'
        });
        setTrainingStatus('Not started');


    };

    const closeSuccessModal = useCallback(() => {
        setShowSuccessModal(false);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'file':
                return <FileText className="text-blue-500" />;
            case 'link':
                return <Globe className="text-green-500" />;
            case 'text':
                return <HelpCircle className="text-purple-500" />;
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><ClipLoader color="#2130B7" size={50} /></div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Model Training</h2>
            <div className="mb-4">
                <p className="text-lg font-semibold">Training Status: <span className={`${trainingStatus === 'Completed' ? 'text-green-500' : trainingStatus === 'Failed' ? 'text-red-500' : 'text-yellow-500'}`}>{trainingStatus}</span></p>
            </div>

            {trainingData.length === 0 ? (
                <p className="text-gray-600">No training data available. Please add data in the Data Collection section.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {trainingData.map((item) => (
                            <div key={item.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center mb-2">
                                    {getIcon(item.type)}
                                    <span className="ml-2 font-semibold text-gray-700 capitalize">{item.type}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                    {item.type === 'file' ? item.name : item.type === 'link' ? item.url : item.content.substring(0, 50) + '...'}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Added: {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={startTraining}
                            disabled={trainingInProgress || trainingStatus === 'Completed'}
                            className={`bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-lg ${(trainingInProgress || trainingStatus === 'Completed') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {trainingInProgress ? 'Training in Progress...' : trainingStatus === 'Completed' ? 'Training Completed' : 'Start Training'}
                        </button>
                        {trainingStatus === 'Completed' && (
                            <button
                                onClick={handleRetrain}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 focus:outline-none"
                            >
                                Retrain Model
                            </button>
                        )}
                    </div>
                </>
            )}

            {showSuccessModal && (
                <Modal isOpen={showSuccessModal} onClose={closeSuccessModal}>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Training Completed Successfully!</h3>
                        <p>Your model has been trained with the provided data.</p>
                        <button
                            onClick={closeSuccessModal}
                            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};



const PreviewView = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([
        { text: `Hello! Welcome to our Website. How can I assist you today?`, isUser: false },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const { id: projectId } = useParams();
    const groq = new Groq(
        { apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true }
    );
    const [systemPrompt, setSystemPrompt] = useState('');

    useEffect(() => {
        fetchSystemPrompt();
    }, [projectId]);

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

    const storeConversation = async (userMessage, aiResponse) => {
        try {
            await addDoc(collection(db, 'conversations'), {
                projectId,
                userMessage,
                aiResponse,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error storing conversation:', error);
        }
    };

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
                            content: systemPrompt || "You are an AI assistant designed to help users understand and navigate a specific website."
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

                await storeConversation(input, accumulatedContent);
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
    }, [input, loading, messages, groq, systemPrompt, projectId]);

    const ChatMessage = ({ message, isUser, streaming = false, }) => (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${isUser ? 'bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white' : 'bg-gray-100'}`}>
                {isUser || streaming ? message : <AnimatedText text={message} />}
            </div>
        </div>
    );

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white p-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg flex items-center">
                    <MessageCircle className="mr-2" size={20} />Customer Support ChatBot
                </h2>
            </div>
            {isOpen && (
                <>
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg.text} isUser={msg.isUser} streaming={streamingMessage && !msg.isUser && index === messages.length - 1} />
                        ))}
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
                </>
            )}
        </div>
    );
};

// Add the InputForm component here as defined in AskAnything.jsx
const InputForm = ({ inputValue, setInputValue, handleSendMessage, loading }) => (
    <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200 shadow-sm bg-gray-100">
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

// LoadingMessage component
const LoadingMessage = () => (
    <div className="p-3 rounded-lg bg-gray-100">
        <p className="text-black">Thinking...</p>
    </div>
);



// SiteMap


export default ProjectOverview;