import React, { useState, useEffect } from 'react';

// --- Static Data Mockup ---
const STATS = [
  { icon: '🕒', title: 'Total Study Time', value: '2h 15m' },
  { icon: '🔥', title: 'Study Streak', value: '3 days' },
  { icon: '◉', title: 'Total Sessions', value: '3' },
  { icon: '📈', title: 'Avg Session', value: '45m' },
];

const RECENT_SESSIONS = [
  { topic: 'Machine Learning', date: 'Oct 9, 09:05 PM', duration: '30m' },
  { topic: 'Web Dev', date: 'Oct 8, 09:05 PM', duration: '1h 0m' },
  { topic: 'Machine Learning', date: 'Oct 7, 09:05 PM', duration: '45m' },
];

// --- Sub-Components ---
const Sidebar = () => (
  <aside className="sidebar">
    <div className="logo">NeonMind</div>
    <button className="new-project-btn">+ New Project</button>
    <div className="recent-projects">
      <h3>RECENT PROJECTS</h3>
      <p>No projects yet. Start your first roadmap!</p>
    </div>
  </aside>
);

const UserDropdown = ({ isDropdownOpen, toggleDropdown, goToDashboard }) => (
  <div className="relative">
    <button className="user-profile" onClick={toggleDropdown}>JD</button>
    {isDropdownOpen && (
      <div className="dropdown-menu">
        <div className="dropdown-header">JD</div>
        <div className="dropdown-item" onClick={goToDashboard}>View Progress</div>
        <div className="dropdown-item">Profile</div>
        <div className="dropdown-item">Settings</div>
        <div className="dropdown-item">Logout</div>
      </div>
    )}
  </div>
);

const HomePage = ({ goToDashboard }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile') && !event.target.closest('.dropdown-menu')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="main-content">
      <header className="header">
        <UserDropdown 
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
          goToDashboard={() => { goToDashboard(); setIsDropdownOpen(false); }}
        />
      </header>

      <section className="welcome-section">
        <h1>Welcome to <span>NeonMind</span></h1>
        <p>Turn any topic into a glowing learning roadmap ✨</p>

        <div className="search-bar">
          <input type="text" placeholder="What would you like to learn today?" />
          <button>Generate Roadmap</button>
        </div>

        <div className="popular-topics">
          Popular: 
          {['Machine Learning', 'Web Dev', 'Data Science', 'UI/UX'].map(topic => (
            <span key={topic} className="topic-tag">{topic}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

const Dashboard = ({ goToHome }) => (
  <div className="main-content">
    <header className="dashboard-header">
      <button id="back-to-dashboard-btn" onClick={goToHome}>← Back to Dashboard</button>
      <div className="user-profile">JD</div>
    </header>

    <h2>Progress Tracker</h2>

    <div className="stat-cards-container">
      {STATS.map((stat, i) => (
        <div key={i} className="stat-card">
          <span className="stat-icon">{stat.icon}</span>
          <div className="stat-info">
            <span className="stat-title">{stat.title}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="dashboard-panels">
      <div className="panel study-timer-panel">
        <h3>Study Timer</h3>
        <select>
          <option>Choose a topic...</option>
          <option>Machine Learning</option>
          <option>Web Dev</option>
        </select>
        <button className="start-session-btn">Start Study Session</button>
      </div>

      <div className="panel today-progress-panel">
        <h3>Today's Progress</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: '30%' }}></div>
        </div>
        <p>Daily goal: 3 hours</p>
      </div>
    </div>

    <div className="dashboard-bottom-panels">
      <div className="panel progress-by-topic">
        <h3>Progress by Topic</h3>
        <p>Visualization chart goes here.</p>
      </div>
      <div className="panel recent-sessions">
        <h3>Recent Study Sessions</h3>
        {RECENT_SESSIONS.map((session, i) => (
          <div key={i} className="session-item">
            <div>
              <span className="session-topic">{session.topic}</span>
              <span className="session-date">{session.date}</span>
            </div>
            <span className="session-duration">{session.duration}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const App = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'dashboard'
  return (
    <div className="app-container">
      <Sidebar />
      {currentView === 'home' ? (
        <HomePage goToDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard goToHome={() => setCurrentView('home')} />
      )}
    </div>
  );
};

export default App;


