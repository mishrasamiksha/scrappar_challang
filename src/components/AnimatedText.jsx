import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AnimatedText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState(text); // Set displayedText directly to text
    const [isComplete, setComplete] = useState(true); // Set isComplete to true

    useEffect(() => {
        // Removed animation logic
        // ...
    }, [text]); // Only depend on text

    return (
        <div className="">
            <ReactMarkdown
                className="prose prose-invert"
                children={displayedText}
                remarkPlugins={[remarkGfm]}
            />
        </div>
    );
};

export default AnimatedText;
