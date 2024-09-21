import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Ensure you have framer-motion installed


export default function LandingPage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Header */}
            <header className="flex items-center h-16 px-6 lg:px-12 border-b bg-white shadow-md fixed w-full z-10">
                <a className="flex items-center" href="#">
                    <span className="sr-only">AI Chatbot</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 mr-3 text-indigo-600"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="font-bold text-2xl text-indigo-600">AI Chatbot</span>
                </a>
                <nav className="ml-auto flex gap-6">
                    <a className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition" href="#features">Features</a>
                    <a className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition" href="#how-it-works">How It Works</a>
                    <a className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition" href="#pricing">Pricing</a>
                    <a className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition" href="#faq">FAQ</a>
                    <button
                        onClick={handleSubmit}
                        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Get Started
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 mt-16">
                {/* Hero Section */}
                <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <div className="container mx-auto px-6 md:px-12 text-center">
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Welcome to AI-Powered Customer Support
                        </motion.h1>
                        <motion.p
                            className="mx-auto max-w-2xl mt-6 text-lg md:text-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            Revolutionize your customer service with intelligent chatbots that provide instant, accurate, and personalized responses.
                        </motion.p>
                        <motion.button
                            onClick={handleSubmit}
                            className="mt-10 inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-gray-100 transition"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: 'spring', stiffness: 100 }}
                        >
                            Get Started
                        </motion.button>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 md:py-24 lg:py-32 bg-gray-50">
                    <div className="container mx-auto px-6 md:px-12 text-center">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-12 text-gray-800"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            Key Features
                        </motion.h2>
                        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                            {[
                                {
                                    title: 'Instant Setup',
                                    description: "Just enter your website URL and we'll do the rest. Get your chatbot up and running in minutes.",
                                    icon: (
                                        <circle cx="12" cy="12" r="10" />
                                    ),
                                },
                                {
                                    title: 'AI-Powered Responses',
                                    description: 'Our LLM provides accurate and context-aware answers, enhancing customer satisfaction.',
                                    icon: (
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    ),
                                },
                                {
                                    title: 'Multi-Platform Support',
                                    description: 'Embed the chatbot on your website or integrate with messaging platforms like Slack, Facebook, and more.',
                                    icon: (
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    ),
                                },
                                {
                                    title: '24/7 Availability',
                                    description: 'Ensure your customers receive assistance anytime, day or night, without delays.',
                                    icon: (
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    ),
                                },
                                {
                                    title: 'Customizable',
                                    description: 'Tailor the chatbot’s appearance and behavior to align with your brand identity.',
                                    icon: (
                                        <path d="M12 2l4 8h-8l4-8zM2 22h20v-2H2v2z" />
                                    ),
                                },
                                {
                                    title: 'Analytics & Insights',
                                    description: 'Gain valuable insights into customer interactions and improve your service strategies.',
                                    icon: (
                                        <path d="M3 12h18M12 3v18" />
                                    ),
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md"
                                    whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-12 w-12 mb-4 text-indigo-600"
                                    >
                                        {feature.icon}
                                    </svg>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-16 md:py-24 lg:py-32 bg-white">
                    <div className="container mx-auto px-6 md:px-12 text-center">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-12 text-gray-800"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            How It Works
                        </motion.h2>
                        <div className="grid gap-8 lg:grid-cols-3">
                            {[
                                { step: '1', title: 'Enter Your Website URL', description: 'Provide the link to your website, and our system will start the scraping process to understand your content.' },
                                { step: '2', title: 'AI Analyzes Your Content', description: 'Our advanced AI processes and understands your website\'s content and structure to generate accurate responses.' },
                                { step: '3', title: 'Chatbot Goes Live', description: 'Your personalized AI chatbot is ready to assist your website visitors instantly, improving engagement and support.' },
                            ].map((work, index) => (
                                <motion.div
                                    key={index}
                                    className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.3, duration: 0.8 }}
                                >
                                    <span className="text-4xl font-bold text-indigo-600 mb-4">{work.step}</span>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{work.title}</h3>
                                    <p className="text-sm text-gray-600">{work.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* Pricing Section */}


                {/* Team Section */}
                <section id="team" className="py-16 md:py-24 lg:py-32 bg-gray-50">
                    <div className="container mx-auto px-6 md:px-12 text-center">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-12 text-gray-800"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            Meet Our Team
                        </motion.h2>
                        <div className="flex flex-col md:flex-row gap-8">
                            <motion.div
                                className="flex-1 bg-white rounded-lg shadow-md p-6"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <img src="/samu.png" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800">Samiksha Mishra</h3>
                                <span className="text-sm text-gray-500">Software Engineer</span>
                                <p className="mt-4 text-gray-600">Samiksha is a software engineer with a passion for creating innovative solutions to complex problems.</p>
                            </motion.div>

                            <motion.div
                                className="flex-1 bg-white rounded-lg shadow-md p-6"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <img src="/astha.png" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800">Astha Gupta</h3>
                                <span className="text-sm text-gray-500">Software Engineer</span>
                                <p className="mt-4 text-gray-600">Astha is a skilled software engineer dedicated to crafting cutting-edge solutions for intricate challenges.</p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-16 md:py-24 lg:py-32 bg-white">
                    <div className="container mx-auto px-6 md:px-12 text-center">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-12 text-gray-800"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            Frequently Asked Questions
                        </motion.h2>
                        <div className="max-w-4xl mx-auto space-y-6">
                            {[
                                {
                                    question: 'How long does it take to set up the chatbot?',
                                    answer: 'The initial setup takes just a few minutes. Once you provide your website URL, our AI begins analyzing your content immediately. The chatbot is usually ready within 24 hours, depending on the size and complexity of your website.',
                                },
                                {
                                    question: 'Can I customize the chatbot\'s appearance?',
                                    answer: 'Yes, you can customize the chatbot\'s appearance to match your website\'s design. We offer various themes and the ability to use your own CSS for complete control over the look and feel.',
                                },
                                {
                                    question: 'How accurate are the chatbot\'s responses?',
                                    answer: 'Our AI-powered chatbot provides highly accurate responses based on your website\'s content. It continuously learns and improves over time. However, for critical information, we recommend having a human review the chatbot\'s responses periodically.',
                                },
                                {
                                    question: 'Can I integrate the chatbot with my existing customer support tools?',
                                    answer: 'Yes, our chatbot can be integrated with many popular customer support tools and CRM systems. We offer APIs and webhooks for seamless integration. For specific integrations, please contact our support team.',
                                },
                                {
                                    question: 'What kind of support do you offer?',
                                    answer: 'We offer 24/7 email and phone support for all our plans. Additionally, Pro and Enterprise plans include priority support and dedicated account managers.',
                                },
                            ].map((faq, index) => (
                                <motion.details
                                    key={index}
                                    className="p-6 border rounded-lg bg-gray-50 text-left group"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2, duration: 0.8 }}
                                >
                                    <summary className="font-semibold cursor-pointer flex justify-between items-center">
                                        {faq.question}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="h-6 w-6 transition-transform group-open:rotate-180"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <motion.p
                                        className="mt-4 text-gray-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {faq.answer}
                                    </motion.p>
                                </motion.details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Signup Section */}
                <section id="newsletter" className="py-16 md:py-24 lg:py-32 bg-indigo-600">
                    <div className="container mx-auto px-6 md:px-12 text-center text-white">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-6"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Stay Updated
                        </motion.h2>
                        <p className="mb-8 text-lg">
                            Subscribe to our newsletter to receive the latest updates and news.
                        </p>
                        <form className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full sm:w-auto px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-md hover:bg-gray-100 transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-6 w-full bg-gray-800 text-gray-300">
                <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">&copy; 2024 AI Chatbot Inc. All rights reserved.</p>
                    <nav className="flex gap-4 mt-4 md:mt-0">
                        <a className="text-sm hover:text-white transition" href="#">Terms of Service</a>
                        <a className="text-sm hover:text-white transition" href="#">Privacy Policy</a>
                        <a className="text-sm hover:text-white transition" href="#">Contact</a>
                        <a className="text-sm hover:text-white transition" href="#">Careers</a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
