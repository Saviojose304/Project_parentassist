import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'react-toastify';
import axios from 'axios';

function ChatBot({ onClose }) {
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        // Add a welcome message when the component mounts
        setMessages([
            { sender: 'left', text: `Hello ${parsedToken ? parsedToken.userName : ''}, ParentAssist-lekku swagatham, enikku ningale engane sahaayikkanaakum` }
        ]);
        scrollToBottom();
    }, []);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const handleSend = async () => {
        // Check if the input value contains only alphabets and spaces
        const isValidInput = /^[a-zA-Z\s]*$/.test(inputValue);

        if (!isValidInput) {
            // If not valid, show toast warning
            toast.warning("Only Allow Alphabets");
        } else {
            setIsLoading(true);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'right', text: inputValue },
                {
                    sender: 'left', text: <div className="loading-dots">
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                    </div>
                },
            ]);
            // If valid, proceed with conversion and update messages
            const convertedInput = await convertInput(inputValue);

            console.log(convertedInput);

            try {
                const response = await axios.post('http://13.233.162.230:9000/chatBotMessages', { message: convertedInput });

                if (response.data.doctorData) {
                    // Format doctor data as a message
                    const doctorTable = (
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Specialization</th>
                                        <th>Hospital</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {response.data.doctorData.map((doctor, index) => (
                                        <tr key={index}>
                                            <td>{doctor.name}</td>
                                            <td>{doctor.specialization}</td>
                                            <td>{doctor.hospital}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );

                    // Add doctor message to messages state
                    setMessages((prevMessages) => [
                        ...prevMessages.slice(0, -1), // Remove the loading message
                        { sender: 'left', text: "Ithan thangel chodhicha doctors list" },
                        { sender: 'left', text: doctorTable }
                    ]);
                } else {
                    // Add the received message to the messages state
                    setMessages((prevMessages) =>
                        prevMessages.map((message, index) =>
                            index === prevMessages.length - 1
                                ? { ...message, text: response.data.englishMessage }
                                : message
                        )
                    );
                }
                setIsLoading(false);
            } catch (error) {
                setMessages((prevMessages) =>
                    prevMessages.map((message, index) =>
                        index === prevMessages.length - 1
                            ? { ...message, text: "kshamikkanam, ningal enthaanu parayunnathennu enikku manasilaakunnilla" }
                            : message
                    )
                );
                setIsLoading(false);
            }

            // Update the last message with the converted input

        }

        // Clear the input value
        setInputValue('');
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
                    <div ref={messagesEndRef} />
                </div>
                <div className="chatbot-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                    />
                    <button className='bg-green-500 rounded-lg w-16 text-white' onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatBot;
