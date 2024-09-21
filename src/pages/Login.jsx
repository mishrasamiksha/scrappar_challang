import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';

const Login = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('to');
    const [error, setError] = useState(null);
    const [inputData, setInputData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            navigate(redirectTo || '/dashboard', { replace: true });
        }
    }, [user, loading, navigate, redirectTo]);

    const validateForm = async () => {
        const schema = Yup.object().shape({
            email: Yup.string().email('Invalid email address.').required('Email Required.'),
            password: Yup.string().required('Password required.'),
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
                await signInWithEmailAndPassword(auth, inputData.email, inputData.password);
                setButtonLoading(false);
                navigate('/dashboard');
            } catch (error) {
                toast.error(error.message || 'Something went wrong!');
                setButtonLoading(false);
                setError(error.message);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Google sign-in failed');
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ClipLoader color="#2130B7" size={50} />
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
                    alt="AI Support"
                    className="pointer-events-none select-none text-center mx-auto"
                />
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign in</h1>

                <form onSubmit={sendForm} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={inputData.email}
                            onChange={handleData}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                            aria-invalid={!!errors.email}
                            aria-describedby="email-error"
                        />
                        {errors.email && <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Your Password"
                            value={inputData.password}
                            onChange={handleData}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                            aria-invalid={!!errors.password}
                            aria-describedby="password-error"
                        />
                        <div className="text-blue-600 text-sm flex justify-end mt-2">
                            <Link to='/forgotpassword'>Forgot Password?</Link>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-4 py-2 flex items-center justify-center bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-md hover:bg-gradient-to-r hover:from-[#16B197] hover:to-[#2091DC] shadow-lg"
                        disabled={buttonLoading}
                    >
                        {buttonLoading ? <ClipLoader color="#ffffff" loading={buttonLoading} size={20} /> : 'Log in'}
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
                    By continuing, you agree to Customer Support AI <a href="#" className="text-blue-500 underline">Terms of Service</a> and <a href="#" className="text-blue-500 underline">Privacy Policy</a>.
                </p>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account? <Link to='/register' className="text-blue-500 underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
