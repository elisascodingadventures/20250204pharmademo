"use client";

import { useState, useEffect } from "react";

// ----- TYPE DEFINITIONS -----

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

// Displays text one character at a time; typewriter aesthetic. 
const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
};


export default function ChatPage() {
  // Global dark mode state 
  const [darkMode, setDarkMode] = useState(true);

  // Toggle profile dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Welcome to Amgen Platform. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [botResponse, setBotResponse] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Append user's message to chat completion
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const query = input.trim();
    setInput("");

    // Fetch the response from OpenAI API route
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("API response was not OK");

      const data = await res.json();
      // Set the bot response to be typed out
      setBotResponse(data.message);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setBotResponse("Sorry, something went wrong. Please try again later.");
    }
  };

  // Complete typewriter effect
  const handleBotTypingComplete = () => {
    const botMessage: Message = {
      id: Date.now(),
      sender: "bot",
      text: botResponse || "",
    };
    setMessages((prev) => [...prev, botMessage]);
    setBotResponse(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Header */}
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Amgen Platform
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 border rounded transition-colors ${
              darkMode
                ? "border-gray-500 text-white hover:bg-gray-600"
                : "border-gray-300 text-gray-800 hover:bg-gray-100"
            }`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* New Top Navigation Bar */}
      <nav
        className={`flex items-center justify-between px-4 py-2 border-b ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
        }`}
      >
        {/* 24/7 Hotline (Left) */}
        <div className={`text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>
          24/7 Hotline: <span className="font-bold">1-800-123-4567</span>
        </div>

        {/* Tabs (Center) */}
        <div className="flex space-x-4">
          <button
            className={`px-3 py-1 rounded ${
              darkMode
                ? "text-white hover:bg-gray-700"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            My Prescriptions
          </button>
          <button
            className={`px-3 py-1 rounded ${
              darkMode
                ? "text-white hover:bg-gray-700"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Appointments
          </button>
          <button
            className={`px-3 py-1 rounded ${
              darkMode
                ? "text-white hover:bg-gray-700"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Medical Records
          </button>
        </div>

        {/* Profile Button (Right) */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`px-3 py-1 rounded ${
              darkMode
                ? "text-white hover:bg-gray-700"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            Profile
          </button>
          {profileDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded shadow-lg p-4 z-10 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
              }`}
            >
              <p className="font-semibold">John Doe</p>
              <p>DOB: 01/01/1980</p>
              <p>Blood Type: O+</p>
              <p>Allergies: None</p>
            </div>
          )}
        </div>
      </nav>

      {/* Chat window area */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div
          className={`w-2/3 h-2/3 rounded-lg shadow-lg overflow-hidden flex flex-col ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Chat header */}
          <div className={`px-4 py-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Chatbot
            </h2>
          </div>
          {/* Chat messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg shadow-md max-w-xs ${
                    msg.sender === "user"
                      ? darkMode
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-blue-400 text-white rounded-br-none"
                      : darkMode
                      ? "bg-gray-700 text-gray-200 rounded-bl-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Render bot response with typewriter effect */}
            {botResponse && (
              <div className="flex justify-start">
                <div
                  className={`px-4 py-2 rounded-lg shadow-md max-w-xs ${
                    darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <Typewriter text={botResponse} speed={40} onComplete={handleBotTypingComplete} />
                </div>
              </div>
            )}
          </div>
          {/* Chat input */}
          <form
            onSubmit={handleSend}
            className={`flex border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              className={`flex-1 px-4 py-3 focus:outline-none ${
                darkMode
                  ? "bg-gray-900 text-white placeholder-gray-500"
                  : "bg-white text-gray-800 placeholder-gray-500"
              }`}
            />
            <button
              type="submit"
              className={`px-4 py-3 font-semibold transition-opacity hover:opacity-90 ${
                darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
              }`}
            >
              Send
            </button>
          </form>
        </div>
      </main>
      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Amgen Platform. All rights reserved.
      </footer>
    </div>
  );
}
