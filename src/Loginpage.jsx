import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, Circle } from 'lucide-react';
import { AuthContext } from './App';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = '474767072349-9d9ert9oo7doklq992os9j6112sfoepj.apps.googleusercontent.com';
  const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    // Gmail scopes - for send, read, receive, compose
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
    // Drive scopes - for search, create, modify/update, download
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    // Calendar scopes - for search, create
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    // Sheets scopes - for search, create, update
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ].join(' ');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Load Google API
    loadGoogleAPI();
  }, []);

  const loadGoogleAPI = () => {
    // Check if Google API is already loaded
    if (window.google) {
      initializeGoogleAPI();
      return;
    }

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogleAPI;
    script.onerror = () => {
      console.error('Failed to load Google API');
      setError('Failed to load Google authentication');
    };
    document.head.appendChild(script);
  };

  const initializeGoogleAPI = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (email === 'emp@rg' && password === '1234') {
        setUser({ 
          email,
          role: 'employee',
          name: 'John Employee'
        });
        navigate('/employee-tasks');
      } else if (email === 'admin@eg' && password === '6969') {
        setUser({
          email,
          role: 'client',
          name: 'Jane Admin'
        });
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      setIsGoogleLoading(false);
      
      // Decode the JWT token to get user info
      const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Send the credential to your Zapier webhook
      const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/23493393/uop35m9/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          google_credential: response.credential,
          timestamp: new Date().toISOString(),
          action: 'google_login'
        })
      });

      if (zapierResponse.ok) {
        setUser({
          email: userInfo.email,
          role: 'client',
          name: userInfo.name,
          picture: userInfo.picture,
          googleConnected: true,
          googleCredential: response.credential
        });
        navigate('/');
      } else {
        setError('Failed to process Google authentication');
      }
    } catch (err) {
      console.error('Google authentication error:', err);
      setError('Google authentication failed');
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!window.google) {
      setError('Google authentication not available');
      return;
    }

    setIsGoogleLoading(true);
    setError('');

    try {
      // Request OAuth token with required scopes
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPES,
        prompt: 'consent', // This forces refresh token
        access_type: 'offline', // This is needed for refresh token
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setError('Failed to authenticate with Google');
            setIsGoogleLoading(false);
            return;
          }

          try {
            // Get user profile information
            const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                'Authorization': `Bearer ${tokenResponse.access_token}`
              }
            });

            if (!profileResponse.ok) {
              throw new Error('Failed to fetch user profile');
            }

            const userProfile = await profileResponse.json();

            // Send data to n8n webhook
            const n8nResponse = await fetch('http://localhost:5678/webhook-test/4107c769-ade1-4767-9153-13b2406de892', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: userProfile.email, // Using email as unique user ID
                email: userProfile.email,
                name: userProfile.name,
                picture: userProfile.picture,
                access_token: tokenResponse.access_token,
                refresh_token: tokenResponse.refresh_token || null,
                expires_in: tokenResponse.expires_in || 3600,
                scope: tokenResponse.scope,
                timestamp: new Date().toISOString(),
                created_at: new Date().toISOString(),
                action: 'store_google_credentials'
              })
            });

            if (n8nResponse.ok) {
              setUser({
                email: userProfile.email,
                role: 'client',
                name: userProfile.name,
                picture: userProfile.picture,
                googleConnected: true,
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token
              });
              navigate('/');
            } else {
              setError('Failed to process authentication');
            }
          } catch (err) {
            console.error('Profile fetch error:', err);
            setError('Failed to retrieve user profile');
          } finally {
            setIsGoogleLoading(false);
          }
        },
      });

      tokenClient.requestAccessToken();
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError('Google authentication failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Subtle Galaxy Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-radial from-indigo-900/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-radial from-purple-900/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/6 left-1/6 w-64 h-64 bg-gradient-radial from-blue-900/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${0.5 + Math.random() * 2}px`,
              height: `${0.5 + Math.random() * 2}px`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Moving constellations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-30 animate-constellation-drift"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 5}s`
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="5" cy="5" r="1" fill="white" opacity="0.6"/>
              <circle cx="20" cy="8" r="0.8" fill="white" opacity="0.5"/>
              <circle cx="35" cy="12" r="1.2" fill="white" opacity="0.7"/>
              <circle cx="8" cy="25" r="0.6" fill="white" opacity="0.4"/>
              <circle cx="30" cy="30" r="1" fill="white" opacity="0.6"/>
              <line x1="5" y1="5" x2="20" y2="8" stroke="white" strokeWidth="0.3" opacity="0.3"/>
              <line x1="20" y1="8" x2="35" y2="12" stroke="white" strokeWidth="0.3" opacity="0.3"/>
              <line x1="8" y1="25" x2="30" y2="30" stroke="white" strokeWidth="0.3" opacity="0.3"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Subtle cosmic dust */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)`,
        }}></div>
      </div>

      {/* Brand Name - Top Left */}
      <div className="absolute top-8 left-8 animate-fade-in z-20">
        <h2 className="text-2xl font-light tracking-[0.3em] text-white/90">
          NOVUS
        </h2>
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md mx-6">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative mx-auto mb-10 w-16 h-16 flex items-center justify-center">
            <div className="absolute w-full h-full">
              <Circle className="w-full h-full text-white/20 animate-spin-slow" strokeWidth={1} />
            </div>
            <div className="absolute w-10 h-10">
              <Circle className="w-full h-full text-white/15 animate-spin-reverse" strokeWidth={1} />
            </div>
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse-subtle"></div>
          </div>
          
          <h1 className="text-5xl font-extralight mb-8 tracking-[0.3em] text-white/95">
            MARK 1
          </h1>

          <h3 className="text-2xl font-extralight mb-8 tracking-[0.3em] text-white/95">
            World's First AI-Powered Personal Assistant
          </h3>
          
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              <p className="text-lg text-white/70 font-light tracking-[0.15em] mt-12 animate-slide-up delay-300">
                {greeting}
              </p>
            </div>
            <p className="text-sm text-white/50 font-light tracking-wide animate-slide-up delay-500">
              Please authenticate to continue
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in delay-700">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all duration-300"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors duration-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-4 py-3 text-white font-light tracking-wider transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Circle className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-white/30 text-sm">
              Demo Accounts:
            </p>
            <p className="text-white/50 text-xs mt-1">
              Employee: emp@rg / 1234
              <br />
              Admin: admin@eg / 6969
            </p>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-10 animate-fade-in delay-1100">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-black/20 text-white/40 font-light tracking-wider">Connect your Google Account</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/25 text-white/90 hover:text-white font-light py-4 rounded-xl transition-all duration-500 transform hover:scale-[1.01] animate-slide-up delay-1200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center space-x-3">
            {isGoogleLoading ? (
              <Circle className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-m tracking-wide">
              {isGoogleLoading ? 'Connecting...' : 'Connect with Google'}
            </span>
          </div>
        </button>

        {/* Footer Links */}
        <div className="mt-10 text-center space-y-4 animate-fade-in delay-1300">
          <p className="text-xs text-white/30 font-light tracking-wide">
            By signing in, you agree to our Terms of Service
          </p>
          <div className="flex justify-center space-x-8 text-l">
            <button className="text-white/40 hover:text-white/70 transition-colors duration-300 font-light tracking-wide">
              Forgot Password?
            </button>
            <button className="text-white/40 hover:text-white/70 transition-colors duration-300 font-light tracking-wide">
              Contact Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};






     


      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
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
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes constellation-drift {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(10px) translateY(-5px) rotate(90deg); }
          50% { transform: translateX(0) translateY(-10px) rotate(180deg); }
          75% { transform: translateX(-10px) translateY(-5px) rotate(270deg); }
          100% { transform: translateX(0) translateY(0) rotate(360deg); }
        }
        
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.8s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 35s linear infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-constellation-drift { animation: constellation-drift 30s ease-in-out infinite; }
        
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1100 { animation-delay: 1.1s; }
        .delay-1200 { animation-delay: 1.2s; }
        .delay-1300 { animation-delay: 1.3s; }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>


export default LoginPage;