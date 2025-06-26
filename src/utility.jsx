import React from 'react'

function utility() {
  return (
    <div>
      <style jsx>{`
        .cosmic-container {
          min-height: 100vh;
          background: #000000;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .stars-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .star {
          position: absolute;
          width: 1px;
          height: 1px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: starPulse linear infinite;
        }

        @keyframes starPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .cosmic-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: cosmicFloat 25s infinite ease-in-out;
          z-index: 1;
        }

        .cosmic-glow-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          top: 20%;
          right: 10%;
        }

        .cosmic-glow-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(147, 197, 253, 0.08) 0%, transparent 70%);
          bottom: 30%;
          left: 15%;
          animation-delay: -12s;
        }

        @keyframes cosmicFloat {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -20px); }
          50% { transform: translate(-20px, 15px); }
          75% { transform: translate(15px, -25px); }
        }

        .main-content {
          position: relative;
          z-index: 10;
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.1em;
        }

        .logout-btn {
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .logout-btn:hover {
          background: rgba(0, 0, 0, 0.5);
          color: white;
          transform: translateY(-1px);
        }

        .greeting-section {
          text-align: center;
          margin-bottom: 2rem;
          flex-shrink: 0;
          animation: fadeInUp 0.8s ease-out;
        }

        .greeting {
          font-size: 2.5rem;
          font-weight: 300;
          color: #ffffff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .greeting-sub {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 300;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-main-container {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 1.5rem;
          padding-right: 0.5rem;
          min-height: 0;
        }

        .welcome-message {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          animation: welcomeGlow 2s ease-in-out infinite alternate;
        }

        .bot-icon {
          color: rgba(59, 130, 246, 0.8);
          animation: botFloat 3s ease-in-out infinite;
        }

        @keyframes botFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes welcomeGlow {
          0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
          100% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
        }

        .message {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          animation: messageSlideIn 0.4s ease-out;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-icon {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message.ai .message-icon {
          color: rgba(59, 130, 246, 0.8);
        }

        .message.user .message-icon {
          color: rgba(255, 255, 255, 0.8);
        }

        .message-content {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
          max-width: 70%;
          font-size: 0.95rem;
        }

        @keyframes messageSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .suggestions-container {
          margin-bottom: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
        }

        .suggestions-slider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .slider-btn {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .slider-btn:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.1);
          color: white;
        }

        .slider-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          flex: 1;
        }

        .suggestion-btn {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .suggestion-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s;
        }

        .suggestion-btn:hover::before {
          left: 100%;
        }

        .suggestion-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
          color: white;
          transform: translateY(-2px);
        }

        .chat-input-container {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
        }

        .chat-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          padding: 1rem 1.5rem;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .chat-input:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .send-btn {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.75rem;
          padding: 1rem;
          color: rgba(59, 130, 246, 0.9);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .send-btn:hover {
          background: rgba(59, 130, 246, 0.3);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover {
          background: rgba(0, 0, 0, 0.6);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .dropdown-container {
          position: relative;
        }

        .chevron {
          transition: transform 0.3s ease;
        }

        .chevron.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          bottom: calc(100% + 0.5rem);
          left: 0;
          min-width: 180px;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.5rem;
          z-index: 50;
          animation: dropdownFade 0.2s ease-out;
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 0.25rem;
          transition: all 0.2s ease;
          font-size: 0.85rem;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-messages::-webkit-scrollbar {
          width: 3px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        @media (max-width: 1024px) {
          .suggestions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
          
          .greeting {
            font-size: 2rem;
          }
          
          .action-buttons {
            flex-wrap: wrap;
          }
          
          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
    
  )
}

export default utility