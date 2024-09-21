import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createProject } from '../api/projects';
import { auth } from '../firebase/config';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        projectName: '',
        websiteUrl: '',
        scrapingDepth: 1,
        dataTypes: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const dataTypeOptions = [
        'Text Content',
        'Images',
        'Links',
        'Metadata',
        'Structured Data'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDataTypeToggle = (dataType) => {
        const updatedDataTypes = formData.dataTypes.includes(dataType)
            ? formData.dataTypes.filter(t => t !== dataType)
            : [...formData.dataTypes, dataType];
        setFormData({ ...formData, dataTypes: updatedDataTypes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const projectData = {
                ...formData,
                userId: auth.currentUser.uid,
                createdAt: new Date(),
                status: 'pending'
            };
            // await createProject(projectData);
            await onSubmit(projectData);

            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create New Scraping Project</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Website URL</label>
                        <input
                            type="url"
                            name="websiteUrl"
                            value={formData.websiteUrl}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Scraping Depth</label>
                        <input
                            type="number"
                            name="scrapingDepth"
                            value={formData.scrapingDepth}
                            onChange={handleChange}
                            min="1"
                            max="5"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Data Types to Collect</label>
                        <div className="mt-2 space-y-2">
                            {dataTypeOptions.map((dataType, index) => (
                                <label key={index} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.dataTypes.includes(dataType)}
                                        onChange={() => handleDataTypeToggle(dataType)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2">{dataType}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
