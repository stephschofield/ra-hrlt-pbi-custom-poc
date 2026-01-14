'use client';

import { useState } from 'react';

interface CopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CopilotChat({ isOpen, onClose }: CopilotChatProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HR Compliance AI Assistant. I can help you analyze compliance patterns, compare regional performance, and identify trends in your workforce data.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Sample responses for POC demonstration
  const sampleResponses: Record<string, string> = {
    'compliance rate': 'Based on the current data, your overall compliance rate is 73.2%, which is 3.2% above the global benchmark of 70%. North America leads at 75.8%, while EMEA at 68.4% needs attention.',
    'trends': 'Looking at month-over-month trends, North America improved by 2.1%, APAC by 1.3%, but EMEA declined by 0.8%. Friday compliance consistently dips to 60-65% across all regions.',
    'regions': 'Regional analysis shows North America performing best (75.8%), followed by APAC (71.9%), and EMEA (68.4%). EMEA and parts of APAC are below the 70% target threshold.',
    'benchmarks': 'Compared to the 70% global benchmark: North America +5.8%, APAC +1.9%, EMEA -1.6%. Your organization overall performs 3.2% above benchmark.',
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const lowerInput = inputText.toLowerCase();
      let responseText = "I understand you're asking about compliance data. Could you be more specific about which metric or region you'd like me to analyze?";

      // Find matching response based on keywords
      for (const [key, response] of Object.entries(sampleResponses)) {
        if (lowerInput.includes(key)) {
          responseText = response;
          break;
        }
      }

      const botResponse = {
        id: messages.length + 2,
        text: responseText,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const suggestedQuestions = [
    "What's our current compliance rate?",
    "Show me regional trends",
    "How do we compare to benchmarks?",
    "Which regions need attention?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-medium">HR Compliance Assistant</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.isBot
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}

        {/* Suggested questions (only show initially) */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Try asking:</p>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputText(question)}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about compliance data..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          POC Mode: Responses are simulated. Configure Copilot Studio for live AI.
        </p>
      </div>
    </div>
  );
}