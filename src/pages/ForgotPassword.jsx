import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [buttonLoading, setButtonLoading] = useState(false);

    const validateForm = async () => {
        const schema = Yup.object().shape({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        });

        try {
            await schema.validate({ email }, { abortEarly: false });
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
        setEmail(e.target.value);
    };

    const sendForm = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (isValid) {
            setButtonLoading(true);
            try {
                // Simulate an API call
                setTimeout(() => {
                    toast.success('Password reset link sent to your email!');
                    setButtonLoading(false);
                }, 2000);
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
                setButtonLoading(false);
            }
        }
    };

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
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Forgot Password</h1>
                <p className="text-center text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={sendForm} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Type your email"
                            value={email}
                            onChange={handleData}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            aria-invalid={!!errors.email}
                            aria-describedby="email-error"
                        />
                        {errors.email && <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 py-2 flex items-center justify-center bg-gradient-to-r from-[#16B197] to-[#2091DC] text-white rounded-md hover:bg-gradient-to-r hover:from-[#16B197] hover:to-[#2091DC] shadow-lg"
                        disabled={buttonLoading}
                    >
                        {buttonLoading ? <ClipLoader color="#ffffff" loading={buttonLoading} size={20} /> : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Remember your password? <Link to='/login' className="text-blue-500 underline">Sign in</Link>
                </p>

                <p className="text-center text-gray-500 text-sm mt-4">
                    Don't have an account? <Link to='/register' className="text-blue-500 underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
