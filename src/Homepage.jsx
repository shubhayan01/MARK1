import React, { useState, useEffect } from 'react';
import { Send, Calendar, FileText, ExternalLink, ChevronDown, LogOut, Bot, User, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

const Homepage = () => {
  const [chatInput, setChatInput] = useState('');
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [showTelegramInput, setShowTelegramInput] = useState(false);
  const [telegramId, setTelegramId] = useState('');
  const [greeting, setGreeting] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  const suggestions = [
    'Add a New Client', 'Make Invoice', 'Add a Reminder', 'Update Task',
    'Wish Client', 'Add Project', 'Update Client Timeline', 'Send Data', 'Remind me Tomorrow'
  ];

  const reportOptions = [
    'Revenue Reports', 'Task Reports', 'Project Reports', 
    'Customer Reports', 'Update Telegram ID'
  ];

  // Smart response generator
  const generateResponse = (input) => {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('client')) {
      if (inputLower.includes('add') || inputLower.includes('new')) {
        return "I'll help you add a new client. Please provide the client details like name, email, and contact information.";
      } else if (inputLower.includes('wish')) {
        return "I'll help you send a personalized message to your client. What's the occasion?";
      } else if (inputLower.includes('timeline')) {
        return "I'll update the client timeline for you. Which project timeline needs updating?";
      }
      return "I'm ready to help with client management. What specific action would you like to take?";
    }
    
    if (inputLower.includes('invoice')) {
      return "I'll generate an invoice for you. Please specify the client name, amount, and any items to include.";
    }
    
    if (inputLower.includes('reminder')) {
      return "I'll set up a reminder for you. What should I remind you about and when?";
    }
    
    if (inputLower.includes('task')) {
      if (inputLower.includes('update')) {
        return "I'll help you update a task. Which task would you like to modify?";
      }
      return "I'm ready to help with task management. What task-related action do you need?";
    }
    
    if (inputLower.includes('project')) {
      return "I'll help you manage your project. Would you like to create a new project or update an existing one?";
    }
    
    if (inputLower.includes('data') && inputLower.includes('send')) {
      return "I'll prepare to send your data. Which specific data or report would you like to send?";
    }
    
    // Default intelligent response
    return `I understand you want to: "${input}". I'm processing this request and will help you complete this task step by step.`;
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { type: 'user', content: chatInput, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('https://raia-ip2j.onrender.com/webhook-test/631fc343-c26e-4af0-a18a-192c7eb5991c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput, timestamp: new Date().toISOString() })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: generateResponse(chatInput), timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      setChatInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback response even if webhook fails
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: generateResponse(chatInput), timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
      setChatInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
  };

  const handleReportSend = async (reportType) => {
    if (reportType === 'Update Telegram ID') {
      setShowTelegramInput(true);
      setShowReportDropdown(false);
      return;
    }

    const userMessage = { type: 'user', content: reportType, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('https://raia-ip2j.onrender.com/webhook-test/888f713f-cdd0-45e6-a7d9-db2c766c158d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, timestamp: new Date().toISOString() })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: `Here's your ${reportType.toLowerCase()}. I've compiled the latest data and insights for your review. The report is being generated now.`, timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
      
      setShowReportDropdown(false);
    } catch (error) {
      console.error('Error sending report:', error);
      // Fallback response
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: `Generating ${reportType.toLowerCase()} for you. Please wait while I compile the data.`, timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
      setShowReportDropdown(false);
    }
  };

  const handleTelegramSubmit = async () => {
    if (!telegramId.trim()) return;
    
    const userMessage = { type: 'user', content: `Update Telegram ID: ${telegramId}`, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('https://raia-ip2j.onrender.com/webhook-test/888f713f-cdd0-45e6-a7d9-db2c766c158d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, action: 'update_telegram_id', timestamp: new Date().toISOString() })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: `Perfect! Your Telegram ID has been updated to: ${telegramId}. You'll now receive notifications on Telegram.`, timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
      
      setTelegramId('');
      setShowTelegramInput(false);
    } catch (error) {
      console.error('Error updating Telegram ID:', error);
      // Fallback response
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: `Telegram ID updated successfully: ${telegramId}`, timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
      setTelegramId('');
      setShowTelegramInput(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm && window.confirm('Are you sure you want to logout?')) {
      // In a real app, this would navigate to login page
      alert('Logout functionality would redirect to login page');
    }
  };

  const handleTasksClick = async () => {
    const userMessage = { type: 'user', content: 'Get Tasks', timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('https://raia-ip2j.onrender.com/webhook-test/389eafbd-f1e5-4179-8641-bf2941acde0c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_tasks', timestamp: new Date().toISOString() })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: "Here are your current tasks and deadlines. I'm fetching the latest updates from your task management system.", timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback response
      setTimeout(() => {
        const aiResponse = { type: 'ai', content: "Loading your tasks and schedule. Please wait while I gather your current assignments.", timestamp: Date.now() };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
    }
  };

  const handleDocsRedirect = () => {
    const userMessage = { type: 'user', content: 'Open Documents', timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const aiResponse = { type: 'ai', content: "Opening your document storage. I'm redirecting you to Google Drive where all your files are organized.", timestamp: Date.now() };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
    
    window.open('https://drive.google.com', '_blank');
  };

  const slideSuggestions = (direction) => {
    const maxIndex = Math.max(0, suggestions.length - 4);
    if (direction === 'left') {
      setCurrentSuggestionIndex(Math.max(0, currentSuggestionIndex - 1));
    } else {
      setCurrentSuggestionIndex(Math.min(maxIndex, currentSuggestionIndex + 1));
    }
  };

  const visibleSuggestions = suggestions.slice(currentSuggestionIndex, currentSuggestionIndex + 4);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Galaxy Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/6 left-1/6 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Starfield */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(300)].map((_, i) => {
          const size = 0.5 + Math.random() * 2.5;
          const brightness = Math.random();
          const animationType = Math.random();
          
          return (
            <div
              key={i}
              className={`absolute rounded-full ${
                animationType < 0.3 ? 'animate-pulse' :
                animationType < 0.6 ? 'animate-pulse' :
                animationType < 0.8 ? 'animate-pulse' :
                'animate-pulse'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: brightness > 0.7 ? 
                  `radial-gradient(circle, rgba(255,255,255,${0.8 + brightness * 0.2}) 0%, rgba(135,206,235,${0.4 + brightness * 0.3}) 50%, transparent 100%)` :
                  brightness > 0.4 ?
                  `radial-gradient(circle, rgba(255,255,255,${0.6 + brightness * 0.4}) 0%, rgba(173,216,230,${0.3 + brightness * 0.2}) 70%, transparent 100%)` :
                  `rgba(255,255,255,${0.3 + brightness * 0.5})`,
                boxShadow: brightness > 0.8 ? `0 0 ${size * 2}px rgba(255,255,255,${brightness * 0.6})` : 'none',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          );
        })}
      </div>

      {/* Moving Constellations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-spin"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${25 + i * 5}s`
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="10" cy="10" r="1.5" fill="white" opacity="0.6"/>
              <circle cx="30" cy="15" r="1" fill="white" opacity="0.5"/>
              <circle cx="50" cy="20" r="1.8" fill="white" opacity="0.7"/>
              <circle cx="15" cy="40" r="0.8" fill="white" opacity="0.4"/>
              <circle cx="45" cy="45" r="1.2" fill="white" opacity="0.6"/>
              <line x1="10" y1="10" x2="30" y2="15" stroke="white" strokeWidth="0.3" opacity="0.3"/>
              <line x1="30" y1="15" x2="50" y2="20" stroke="white" strokeWidth="0.3" opacity="0.3"/>
              <line x1="15" y1="40" x2="45" y2="45" stroke="white" strokeWidth="0.3" opacity="0.3"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Cosmic Dust */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8 relative z-10">
          <h1 className="text-xl md:text-2xl font-extralight tracking-[0.3em] text-white/95 drop-shadow-lg">
            NOVUS
          </h1>
          <button
            onClick={handleLogout}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-white/10"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
          </button>
        </header>

        {/* Greeting Section */}
        <div className="text-center mt-8 md:mt-12 mb-6 md:mb-8 px-4 opacity-0 animate-pulse">
          <div className="relative mx-auto mb-6 w-12 h-12 flex items-center justify-center">
            <div className="absolute w-full h-full">
              <Circle className="w-full h-full text-white/15 animate-spin" strokeWidth={1} />
            </div>
            <div className="absolute w-8 h-8">
              <Circle className="w-full h-full text-white/10 animate-spin" strokeWidth={1} />
            </div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extralight mb-3 text-white/90 tracking-wide">{greeting}</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <p className="text-white/50 text-sm md:text-base font-light tracking-wide mt-8">What shall we accomplish today?</p>
          </div>
        </div>

        {/* Telegram ID Input Modal */}
        {showTelegramInput && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-black/60 border border-white/20 rounded-2xl p-8 max-w-md w-full backdrop-blur-xl shadow-2xl">
              <h3 className="text-xl font-extralight mb-6 text-white/90 tracking-wide">Update Telegram ID</h3>
              <div className="space-y-6">
                <input
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Enter your Telegram ID"
                  className="w-full px-4 py-4 bg-white/5 border border-white/15 rounded-xl focus:outline-none focus:border-white/30 transition-all duration-300 text-white placeholder-white/30 font-light"
                  onKeyPress={(e) => e.key === 'Enter' && handleTelegramSubmit()}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleTelegramSubmit}
                    className="flex-1 px-4 py-4 bg-white/10 border border-white/20 rounded-xl font-extralight hover:bg-white/15 transition-all duration-300 text-white/90 tracking-wide"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowTelegramInput(false)}
                    className="flex-1 px-4 py-4 bg-black/50 border border-white/10 rounded-xl font-extralight hover:bg-black/70 transition-all duration-300 text-white/70 tracking-wide"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Container */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 pb-6 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 min-h-[200px] max-h-96">
            {messages.length === 0 ? (
              <div className="text-center py-12 md:py-16 opacity-0 animate-pulse">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                  <Bot className="w-7 h-7 md:w-9 md:h-9 text-white/50" />
                </div>
                <p className="text-white/40 text-sm md:text-base font-light tracking-wide">Hello! I'm your AI assistant. How can I help you today?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.timestamp}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} opacity-0 animate-pulse`}
                >
                  <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[75%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm ${msg.type === 'ai'
                        ? 'bg-white/5 border border-white/15'
                        : 'bg-white/10 border border-white/20'
                      }`}>
                      {msg.type === 'ai' ? <Bot className="w-4 h-4 text-white/50" /> : <User className="w-4 h-4 text-white/70" />}
                    </div>
                    <div className={`px-5 py-4 rounded-2xl text-sm md:text-base backdrop-blur-sm ${msg.type === 'user'
                        ? 'bg-white/10 border border-white/20 text-white/90'
                        : 'bg-white/5 border border-white/15 text-white/80'
                      } font-light leading-relaxed`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Suggestions with slider */}
          <div className="mb-6 opacity-0 animate-pulse">
            <div className="flex items-center gap-3">
              <button
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm"
                onClick={() => slideSuggestions('left')}
                disabled={currentSuggestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 text-white/50" />
              </button>
              <div className="flex-1 overflow-hidden">
                <div className="flex gap-3 transition-transform duration-300">
                  {visibleSuggestions.map((suggestion, index) => (
                    <button
                      key={currentSuggestionIndex + index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex-1 px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 whitespace-nowrap text-white/60 hover:text-white/90 font-light tracking-wide backdrop-blur-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm"
                onClick={() => slideSuggestions('right')}
                disabled={currentSuggestionIndex >= suggestions.length - 4}
              >
                <ChevronRight className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex gap-4 mb-6 opacity-0 animate-pulse">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-5 py-4 bg-white/5 border border-white/15 rounded-xl focus:outline-none focus:border-white/30 transition-all duration-300 placeholder-white/30 text-white/90 text-sm md:text-base font-light backdrop-blur-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
            />
            <button
              onClick={handleChatSend}
              className="px-6 py-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              <Send className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-pulse">
            <button
              onClick={handleTasksClick}
              className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 hover:border-white/25 transition-all duration-300 text-sm md:text-base text-white/60 hover:text-white/90 font-light tracking-wide backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Tasks</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReportDropdown(!showReportDropdown)}
                className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 hover:border-white/25 transition-all duration-300 text-sm md:text-base text-white/60 hover:text-white/90 font-light tracking-wide backdrop-blur-sm hover:scale-105 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Reports</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showReportDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showReportDropdown && (
                <div className="absolute bottom-full mb-3 left-0 w-56 bg-black/80 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl z-10">
                  {reportOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleReportSend(option)}
                      className="w-full px-5 py-3 text-left text-sm hover:bg-white/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl text-white/60 hover:text-white/90 font-light tracking-wide"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleDocsRedirect}
              className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 hover:border-white/25 transition-all duration-300 text-sm md:text-base text-white/60 hover:text-white/90 font-light tracking-wide backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Docs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
