import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = async () => {
        const schema = Yup.object().shape({
            name: Yup.string().required('Name required.').min(2, 'Name must be 2 characters or more.'),
            email: Yup.string().email('Invalid email address.').required('Email required.'),
            password: Yup.string().required('Password required.').min(6, 'Password must be 6 characters or more.'),
        });

        try {
            await schema.validate(inputData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
            return false;
        }
    };

    const handleData = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
    };

    const sendForm = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (isValid) {
            setButtonLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, inputData.email, inputData.password);
                await updateProfile(userCredential.user, { displayName: inputData.name });
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name: inputData.name,
                    email: inputData.email
                });
                setButtonLoading(false);
                setShowSuccessModal(true);
            } catch (error) {
                toast.error(error.message || 'Something went wrong!');
                setButtonLoading(false);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await setDoc(doc(db, "users", result.user.uid), {
                name: result.user.displayName,
                email: result.user.email
            });
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Google sign-up failed');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ClipLoader color="#2130B7" loading={loading} size={60} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 sm:px-4 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <img
                    src="/main_logo.png"
                    width={190}
                    height={40}
                    alt="DevOpsAI"
                    className="pointer-events-none select-none text-center mx-auto"
                />
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign up for a Free Account</h1>

                <form onSubmit={sendForm} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder='Type your name'
                            value={inputData.name}
                            onChange={handleData}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                            aria-invalid={!!errors.name}
                            aria-describedby="name-error"
                        />
                        {errors.name && <p id="name-error" className="mt-2 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder='Type your email'
                            value={inputData.email}
                            onChange={handleData}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                            aria-invalid={!!errors.email}
                            aria-describedby="email-error"
                        />
                        {errors.email && <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a Password"
                                value={inputData.password}
                                onChange={handleData}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10 text-black bg-white"
                                aria-invalid={!!errors.password}
                                aria-describedby="password-error"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        {errors.password && <p id="password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 py-2 flex items-center justify-center bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-md hover:bg-gradient-to-r hover:from-[#16B197] hover:to-[#2091DC] shadow-lg"
                        disabled={buttonLoading}
                    >
                        {buttonLoading ? <ClipLoader color="#ffffff" loading={buttonLoading} size={20} /> : 'Sign Up'}
                    </button>
                </form>

                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center py-2 border border-black cursor-pointer hover:bg-gray-100 bg-white text-black font-semibold rounded-md"
                    >
                        <img src='https://auth.openai.com/assets/google-logo-NePEveMl.svg' alt='google' className="w-5 h-5 mr-2" />
                        Continue with Google
                    </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    By continuing, you agree to Customer Support AI's <a href="#" className="text-blue-500 underline">Terms of Service</a> and <a href="#" className="text-blue-500 underline">Privacy Policy</a>.
                </p>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account? <Link to='/login' className="text-blue-500 underline">Sign in</Link>
                </p>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-bold text-gray-900 text-center">Registration Successful!</h2>
                        <p className="text-gray-700 text-center mt-4">You have successfully registered. Click the button below to login.</p>
                        <button
                            onClick={handleLoginRedirect}
                            className="w-full mt-6 py-2 bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-md hover:bg-gradient-to-r hover:from-[#16B197] hover:to-[#2091DC] shadow-lg"
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterScreen;
