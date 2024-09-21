import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaPlus, FaChevronDown, FaSearch, FaTimes, FaFacebookMessenger } from 'react-icons/fa';
import 'rc-slider/assets/index.css';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../api/AuthContext';
import CreateProjectModal from './CreateProjectModal';
import Lottie from 'lottie-react';
import animationData from '../assets/bot.json';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleAsk = () => {
        // navigate('/ask');
    };

    const fetchProjects = async () => {
        if (!user) return;
        setIsLoadingProjects(true);
        // empty the projects array
        setProjects([]);
        try {
            const q = query(collection(db, "projects"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(projectsData);
            setProjects(projectsData);
            setFilteredProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredProjects(
            projects.filter((project) => project.name.toLowerCase().includes(query))
        );
    };

    useEffect(() => {
        fetchProjects();
    }, [user]);

    const handleCreateProject = async (data) => {
        try {
            await addDoc(collection(db, "projects"), {
                ...data,
                userId: user.uid,
                createdAt: serverTimestamp(),
                status: 'pending'
            });
            closeModal();
            fetchProjects();
            setSuccessMessage('Project created successfully!');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="overflow-y-scroll max-h-screen">
            <div className="min-h-screen">
                <nav className="border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex-shrink-0 flex justify-start items-center">
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
                            <div className="flex items-center relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="flex h-9 w-full rounded-md border text-black border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-black/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 mr-4"
                                    placeholder="Search projects..."
                                />
                                <button
                                    className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 hover:bg-black/20 h-9 px-4 py-2 flex items-center space-x-2"
                                    type="button"
                                    onClick={handleDropdownToggle}
                                >
                                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                        <img className="aspect-square h-full w-full" src="/13.jpg" alt="User Avatar" />
                                    </span>
                                    <span className='text-black'>{user?.email}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-black">
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-black">My Projects</h2>

                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white shadow hover:opacity-90 h-9 px-4 py-2"
                            type="button"
                            onClick={openModal}
                        >
                            <FaPlus className="mr-2" />
                            Create New Project
                        </button>
                    </div>
                    {successMessage && (
                        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {isLoadingProjects ? (
                        <div className="flex justify-center items-center h-32">
                            <ClipLoader color="#2130B7" size={50} />
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center h-96">
                            <FaRocket className="text-gray-400 text-6xl mb-4" />
                            <h3 className="text-xl font-bold text-gray-800">No Projects Available</h3>
                            <p className="text-gray-600 mb-6">Get started by creating your first project.</p>
                            <button
                                className="mb-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white shadow hover:opacity-90 h-9 px-4 py-2"
                                type="button"
                                onClick={handleAsk}
                            >
                                <FaFacebookMessenger className="mr-2" />
                                Ask Anything
                            </button>

                            <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white shadow hover:opacity-90 h-9 px-4 py-2"
                                type="button"
                                onClick={openModal}
                            >
                                <FaPlus className="mr-2" />
                                Create New Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    id={project.id}
                                    title={project.projectName} // Make sure this matches the field name in Firestore
                                    date={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                                    status={project.status || 'Active'}
                                />
                            ))}
                        </div>
                    )}

                    {isModalOpen && (<CreateProjectModal
                        isOpen={isModalOpen}
                        onSubmit={handleCreateProject}
                        onClose={() => {
                            closeModal();
                            fetchProjects();
                        }}
                        setIsLoading={setIsLoading}
                        setSuccessMessage={setSuccessMessage}
                    />)}

                    <div style={styles.lottieContainer}>
                        <Lottie onClick={handleAsk} animationData={animationData} loop={true} style={styles.lottieStyle} />
                    </div>
                </main>
            </div>
        </div>
    );
};

const styles = {
    lottieContainer: {
        position: 'fixed',
        bottom: '0px',
        right: '0px',
        zIndex: 1000,
    },
    lottieStyle: {

        height: '180px',
    },
};

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'in progress':
            return 'bg-yellow-100 text-yellow-700';
        case 'completed':
            return 'bg-green-100 text-green-700';
        case 'pending':
            return 'bg-blue-100 text-blue-700';
        case 'on hold':
            return 'bg-orange-100 text-orange-700';
        case 'canceled':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};


const ProjectCard = ({ title, date, status, id }) => {
    const navigate = useNavigate();

    const navigateToProject = () => {
        navigate(`/project/${id}`);
    };

    return (
        <div className="rounded-xl border bg-white text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        Active
                    </span>
                </div>
                {/* <p className="text-xs text-gray-500 mt-2">Created on {date}</p> */}
            </div>
            <div className="flex items-center justify-between px-6 pb-6">
                <button
                    onClick={navigateToProject}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white shadow hover:opacity-90 h-9 px-4 py-2"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};






export default Dashboard;

