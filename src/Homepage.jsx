// Generate random shooting star data
const generateShootingStarStyle = (i) => {
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const angle = Math.random() * 360;
  const distance = 300 + Math.random() * 200;
  const duration = 2 + Math.random() * 2;
  const delay = i * 3 + Math.random() * 5;

  return {
    left: `${startX}%`,
    top: `${startY}%`,
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, FileText, ExternalLink, ChevronDown, LogOut, Bot, User, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

const Homepage = () => {
const [chatInput, setChatInput] = useState('');
const [showReportDropdown, setShowReportDropdown] = useState(false);
const [showTelegramInput, setShowTelegramInput] = useState(false);
const [telegramId, setTelegramId] = useState('');
const [greeting, setGreeting] = useState('');
const [messages, setMessages] = useState([]);
const [currentSuggestionPage, setCurrentSuggestionPage] = useState(0);
const [itemsPerPage, setItemsPerPage] = useState(4);

const suggestions = [
  'Add a New Client', 'Make Invoice', 'Add a Reminder', 'Update Task',
  'Wish Client', 'Add Project', 'Update Client Timeline', 'Send Data', 'Remind me Tomorrow'
];

const reportOptions = [
  'Revenue Reports', 'Task Reports', 'Project Reports',
  'Customer Reports', 'Update Telegram ID'
];

// Handle window resize for responsive design
useEffect(() => {
  const handleResize = () => {
    setItemsPerPage(window.innerWidth < 768 ? 2 : 4);
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Set greeting based on time
useEffect(() => {
  const hour = new Date().getHours();
  if (hour < 12) setGreeting('Good Morning');
  else if (hour < 17) setGreeting('Good Afternoon');
  else setGreeting('Good Evening');
}, []);

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

  if (inputLower.includes('hello') || inputLower.includes('hi')) {
    return "Hello! How can I assist you today?";
  }

  if (inputLower.includes('fuck you') || inputLower.includes('bc')) {
    return "Calling mom right now";
  }

  if (inputLower.includes('how are you') || inputLower.includes('how is everything?')) {
    return "I'm doing great! How about you?";
  }

  if (inputLower.includes('what is your name') || inputLower.includes('what is your name?')) {
    return "I'm R.A.I.A, your AI assistant. How can I help you today?";
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

  return `I understand you want to: "${input}". I'm processing this request and will help you complete this task step by step.`;
};

const handleChatSend = async () => {
  if (!chatInput.trim()) return;

  const userMessage = { type: 'user', content: chatInput, timestamp: Date.now() };
  setMessages(prev => [...prev, userMessage]);

  setTimeout(() => {
    const aiResponse = { type: 'ai', content: generateResponse(chatInput), timestamp: Date.now() };
    setMessages(prev => [...prev, aiResponse]);
  }, 1000);

  setChatInput('');
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

  setTimeout(() => {
    const aiResponse = { 
      type: 'ai', 
      content: `Here's your ${reportType.toLowerCase()}. I've compiled the latest data and insights for your review. The report is being generated now.`, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, aiResponse]);
  }, 800);

  setShowReportDropdown(false);
};

const handleTelegramSubmit = async () => {
  if (!telegramId.trim()) return;

  const userMessage = { type: 'user', content: `Update Telegram ID: ${telegramId}`, timestamp: Date.now() };
  setMessages(prev => [...prev, userMessage]);

  setTimeout(() => {
    const aiResponse = { 
      type: 'ai', 
      content: `Perfect! Your Telegram ID has been updated to: ${telegramId}. You'll now receive notifications on Telegram.`, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, aiResponse]);
  }, 800);

  setTelegramId('');
  setShowTelegramInput(false);
};

const handleLogout = () => {
  if (window.confirm('Are you sure you want to logout?')) {
    console.log('Logout clicked');
  }
};

const handleTasksClick = async () => {
  const userMessage = { type: 'user', content: 'Get Tasks', timestamp: Date.now() };
  setMessages(prev => [...prev, userMessage]);

  setTimeout(() => {
    const aiResponse = { 
      type: 'ai', 
      content: "Here are your current tasks and deadlines. I'm fetching the latest updates from your task management system.", 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, aiResponse]);
  }, 800);
};

const handleDocsRedirect = () => {
  const userMessage = { type: 'user', content: 'Open Documents', timestamp: Date.now() };
  setMessages(prev => [...prev, userMessage]);

  setTimeout(() => {
    const aiResponse = { 
      type: 'ai', 
      content: "Opening your document storage. I'm redirecting you to Google Drive where all your files are organized.", 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, aiResponse]);
  }, 500);

  window.open('https://drive.google.com', '_blank');
};

const slideSuggestions = (direction) => {
  const totalPages = Math.ceil(suggestions.length / itemsPerPage);

  if (direction === 'left') {
    setCurrentSuggestionPage((prev) => (prev - 1 + totalPages) % totalPages);
  } else {
    setCurrentSuggestionPage((prev) => (prev + 1) % totalPages);
  }
};

const startIndex = currentSuggestionPage * itemsPerPage;
const visibleSuggestions = suggestions.slice(startIndex, startIndex + itemsPerPage);

// Generate random shooting star data
const generateShootingStarStyle = (i) => {
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const angle = Math.random() * 360;
  const distance = 300 + Math.random() * 200;
  const duration = 2 + Math.random() * 2;
  const delay = i * 3 + Math.random() * 5;

  return {
    left: `${startX}%`,
    top: `${startY}%`,
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

return (
  <div className="min-h-screen bg-black text-white relative overflow-hidden">
    {/* Galaxy Background Effects */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-radial from-indigo-900/15 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-radial from-purple-900/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/6 left-1/6 w-64 h-64 bg-gradient-radial from-blue-900/10 to-transparent rounded-full blur-3xl"></div>
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
              animationType < 0.3 ? 'animate-twinkle-fast' :
              animationType < 0.6 ? 'animate-twinkle-slow' :
              animationType < 0.8 ? 'animate-pulse-star' :
              'animate-fade-star'
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

    {/* Shooting Stars */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-shooting-star"
          style={{
            left: `${Math.random() * 120 - 10}%`,
            top: `${Math.random() * 120 - 10}%`,
            animationDelay: `${i * 4 + Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          <div className="shooting-star-container">
            <div className="shooting-star-core"></div>
            <div className="shooting-star-trail"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Moving Constellations */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-20 animate-constellation-drift"
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
      <div className="w-full h-full" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                         radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)`,
      }}></div>
    </div>

    {/* Content Container */}
    <div className="relative z-20 min-h-screen flex flex-col">
      {/* Simple Header */}
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
      <div className="text-center mt-8 md:mt-12 mb-6 md:mb-8 px-4 animate-fade-in">
        <div className="relative mx-auto mb-6 w-12 h-12 flex items-center justify-center">
          <div className="absolute w-full h-full">
            <Circle className="w-full h-full text-white/15 animate-spin-slow" strokeWidth={1} />
          </div>
          <div className="absolute w-8 h-8">
            <Circle className="w-full h-full text-white/10 animate-spin-reverse" strokeWidth={1} />
          </div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse-subtle"></div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extralight mb-3 text-white/90 tracking-wide">{greeting}</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <p className="text-white/50 text-sm md:text-base font-light tracking-wide mt-8">What shall we accomplish today?</p>
        </div>
      </div>

      {/* Telegram Input Modal */}
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
            <div className="text-center py-12 md:py-16 animate-fade-in delay-500">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                <Bot className="w-7 h-7 md:w-9 md:h-9 text-white/50" />
              </div>
              <p className="text-white/40 text-sm md:text-base font-light tracking-wide">Hello! I'm your AI assistant. How can I help you today?</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.timestamp}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
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

        {/* Suggestions */}
        <div className="mb-6 animate-fade-in delay-700">
          <div className="flex items-center gap-3">
            <button
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm"
              onClick={() => slideSuggestions('left')}
            >
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-3 transition-transform duration-300">
                {visibleSuggestions.map((suggestion, index) => (
                  <button
                    key={startIndex + index}
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
            >
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex gap-4 mb-6 animate-fade-in delay-900">
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
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-1100">
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

    <style jsx>{`
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes spin-reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      
      @keyframes pulse-subtle {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes constellation-drift {
        0% { transform: translateX(0) translateY(0) rotate(0deg); }
        25% { transform: translateX(15px) translateY(-8px) rotate(90deg); }
        50% { transform: translateX(0) translateY(-15px) rotate(180deg); }
        75% { transform: translateX(-15px) translateY(-8px) rotate(270deg); }
        100% { transform: translateX(0) translateY(0) rotate(360deg); }
      }
      
      @keyframes shooting-star {
        0% { 
          transform: translateX(-200px) translateY(-200px) rotate(45deg);
          opacity: 0;
        }
        20% { 
          opacity: 1;
        }
        80% { 
          opacity: 1;
        }
        100% { 
          transform: translateX(calc(100vw + 200px)) translateY(calc(100vh + 200px)) rotate(45deg);
          opacity: 0;
        }
      }
      
      .shooting-star-container {
        position: relative;
        width: 100px;
        height: 2px;
      }
      
      .shooting-star-core {
        position: absolute;
        right: 0;
        top: 0;
        width: 4px;
        height: 2px;
        background: radial-gradient(ellipse at center, #ffffff 0%, #87ceeb 40%, transparent 70%);
        border-radius: 50%;
        box-shadow: 0 0 8px #ffffff, 0 0 16px #87ceeb;
      }
      
      .shooting-star-trail {
        position: absolute;
        right: 4px;
        top: 0;
        width: 96px;
        height: 2px;
        background: linear-gradient(to left, rgba(255,255,255,0.8) 0%, rgba(135,206,235,0.6) 30%, rgba(135,206,235,0.3) 60%, transparent 100%);
        border-radius: 0 2px 2px 0;
      }
      
      .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
      .animate-spin-slow { animation: spin-slow 30s linear infinite; }
      .animate-spin-reverse { animation: spin-reverse 25s linear infinite; }
      .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
      .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
      .animate-constellation-drift { animation: constellation-drift 25s ease-in-out infinite; }
      .animate-shooting-star { 
        animation: shooting-star var(--duration, 4s) ease-out infinite; 
      }
      
      .delay-300 { animation-delay: 0.3s; }
      .delay-500 { animation-delay: 0.5s; }
      .delay-700 { animation-delay: 0.7s; }
      .delay-900 { animation-delay: 0.9s; }
      .delay-1100 { animation-delay: 1.1s; }
      
      .bg-gradient-radial {
        background: radial-gradient(circle, var(--tw-gradient-stops));
      }
    `}</style>
  </div>
);
};

export default Homepage;