import React, { useState } from 'react';
import './chatbot.css';
import { AiOutlineClose } from "react-icons/ai";

function ChatBot({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { text: inputValue, sender: 'user' }]);
            setInputValue('');
        }
    };

    const convertInput = async (input) => {
        const params = new URLSearchParams({
            text: input,
            itc: 'ml-t-i0-und',
            num: 5,
            cp: 0,
            cs: 1,
            ie: 'utf-8',
            oe: 'utf-8',
        }).toString();

        const url = 'https://inputtools.google.com/request';

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const result = await response.json();
            const tokens = result[1][0][1];
            const firstToken = tokens && Array.isArray(tokens) ? tokens[0] : null;

            return firstToken || input;
        } catch (error) {
            console.error('Error fetching data:', error);
            return input; // Return original input in case of an error
        }
    };

    const handleInputKeyDown = async (e) => {
        // Check if the key pressed is the space bar
        if (e.key === ' ' || e.keyCode === 32) {
            // Prevent the default space behavior (like scrolling down the page)
            e.preventDefault();

            // Perform the conversion and update the messages
            const convertedInput = await convertInput(inputValue);
            setMessages([...messages, { text: convertedInput, sender: 'user' }]);

            // Clear the input value
            setInputValue('');
        }
    };

    return (
        <>
            <div className="chatbot-container">
                <div className="flex bg-blue-500 justify-between items-center p-4">
                    <h2 className="text-white">ParentAssist</h2>
                    <button className="bg-red-500 text-white rounded-lg" onClick={onClose}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="chatbot-messages h-96 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="chatbot-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                    />
                    <button className='bg-green-500 rounded-lg w-16 text-white' onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatBot;
