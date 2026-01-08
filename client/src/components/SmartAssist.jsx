import { useState, useEffect, useRef } from 'react';

const SmartAssist = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! I am SmartAssist. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            let botText = "I'm sorry, I'm currently in training. You can contact our support at 139 for immediate help!";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes('pnr')) {
                botText = "You can check your PNR status by clicking on the 'PNR Status' tab on the home page.";
            } else if (lowerInput.includes('refund') || lowerInput.includes('cancel')) {
                botText = "Cancellations can be made through 'My Bookings' section. Refunds usually take 3-5 business days.";
            } else if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
                botText = "Hello! How can I assist you with your railway journey today?";
            } else if (lowerInput.includes('food') || lowerInput.includes('meal')) {
                botText = "You can order delicious meals for your journey through our 'MEALS' section in the menu!";
            }

            setMessages(prev => [...prev, { text: botText, isBot: true }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: "'Roboto', sans-serif" }}>
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #213d77 0%, #3a5ba0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: 'popIn 0.5s ease-out'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                >
                    <span style={{ fontSize: '30px' }}>🤖</span>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '0',
                        background: '#fb792b',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>Ask AI</div>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #213d77 0%, #3a5ba0 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '24px' }}>🤖</div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>SmartAssist</div>
                                <div style={{ fontSize: '11px', opacity: 0.8 }}>Online | AI Powered</div>
                            </div>
                        </div>
                        <div
                            onClick={() => setIsOpen(false)}
                            style={{ cursor: 'pointer', fontSize: '20px', opacity: 0.8 }}
                        >✕</div>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                        background: '#f8f9fa',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                maxWidth: '80%',
                                padding: '12px 16px',
                                borderRadius: msg.isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                                background: msg.isBot ? 'white' : '#213d77',
                                color: msg.isBot ? '#333' : 'white',
                                fontSize: '14px',
                                lineHeight: '1.4',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                border: msg.isBot ? '1px solid #eee' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{
                        padding: '15px',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '10px',
                        background: 'white'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your query..."
                            style={{
                                flex: 1,
                                padding: '10px 15px',
                                borderRadius: '25px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <button type="submit" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#fb792b',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>
                            ➤
                        </button>
                    </form>
                </div>
            )}

            <style>
                {`
                    @keyframes popIn {
                        from { transform: scale(0); }
                        to { transform: scale(1); }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(100%) scale(0.8); opacity: 0; }
                        to { transform: translateY(0) scale(1); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default SmartAssist;
