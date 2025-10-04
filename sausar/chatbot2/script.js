// --- DATA ---
let user = {
    name: 'John Doe',
    initials: 'JD'
};

// --- GLOBAL ELEMENTS ---
const body = document.body;

// Chatbot elements
const toggleBtn = document.getElementById('chatbot-toggle-btn');
const closeBtn = document.getElementById('chatbot-close-btn');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotOverlay = document.getElementById('chatbot-overlay');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.querySelector('.chat-messages');

// Profile elements
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');

// Main App elements
const newProjectBtn = document.getElementById('new-project-btn');
const generateRoadmapBtn = document.getElementById('generate-roadmap-btn');
const mainInput = document.getElementById('main-input');
const popularTagsContainer = document.getElementById('popular-tags-container');

// Main App View elements
const welcomeView = document.getElementById('welcome-view');
const roadmapView = document.getElementById('roadmap-view');
const roadmapTopic = document.getElementById('roadmap-topic');
const roadmapStepsContainer = document.getElementById('roadmap-steps');
const loadingSpinner = document.getElementById('loading-spinner');
const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');

// Sidebar elements
const recentProjectsList = document.getElementById('recent-projects-list');
const noProjectsMessage = document.getElementById('no-projects-message');


// Function to format time (e.g., 10:30 PM)
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

// --- PROFILE FUNCTIONS --- (Now for dropdown)
function toggleProfileDropdown() {
    profileDropdown.classList.toggle('active');
}

// --- CHATBOT FUNCTIONS ---
function openChatbot() {
    body.classList.add('chatbot-open');
    toggleBtn.style.display = 'none'; 
    chatInput.focus(); 
}

function closeChatbot() {
    body.classList.remove('chatbot-open');
    setTimeout(() => {
        toggleBtn.style.display = 'block'; 
    }, 400); 
}

function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === "") return;

    // 1. Create User message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-bubble message-bubble';
    messageDiv.innerHTML = `<p>${messageText}</p><p class="timestamp">${formatTime(new Date())}</p>`;
    chatMessages.appendChild(messageDiv);

    // 2. Clear input and scroll to bottom
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 3. Simulate Assistant Reply
    setTimeout(() => {
        const replyText = `I received your message about: "${messageText}". I can help you create a roadmap for any topic!`;
        
        const replyDiv = document.createElement('div');
        replyDiv.className = 'assistant-bubble message-bubble';
        replyDiv.innerHTML = `<p>${replyText}</p><p class="timestamp">${formatTime(new Date())}</p>`;
        
        chatMessages.appendChild(replyDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500); 
}


// --- MAIN APP FUNCTIONS ---
function showWelcomeView() {
    roadmapView.classList.add('hidden');
    welcomeView.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');
    mainInput.value = '';
}

function addRecentProject(topic) {
    if (noProjectsMessage) {
        noProjectsMessage.classList.add('hidden');
    }
    const projectDiv = document.createElement('div');
    projectDiv.className = 'recent-project-item';
    projectDiv.textContent = topic;
    projectDiv.addEventListener('click', () => {
        mainInput.value = topic;
        showWelcomeView();
    });
    recentProjectsList.prepend(projectDiv);

    const maxItems = 5;
    while (recentProjectsList.children.length > maxItems + 1) { // +1 for the <p> tag
        recentProjectsList.removeChild(recentProjectsList.lastElementChild);
    }
}

function generateRoadmap() {
    const topic = mainInput.value.trim() || 'General Study Skills';
    welcomeView.classList.add('hidden');
    roadmapView.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    roadmapStepsContainer.innerHTML = ''; 
    roadmapTopic.textContent = topic;
    
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
        const steps = [
            { title: "Step 1: Core Concepts & Fundamentals", description: `Research and define the basic terminology, history, and key players in ${topic}.` },
            { title: "Step 2: Practical Application Exercises", description: `Complete hands-on tutorials or coding exercises related to ${topic}.` },
            { title: "Step 3: Intermediate Deep Dive", description: "Read advanced articles, case studies, and watch in-depth lectures." },
            { title: "Step 4: Project and Portfolio Building", description: "Design and execute a capstone project to demonstrate mastery." },
        ];

        steps.forEach(step => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'roadmap-step';
            stepDiv.innerHTML = `<h3>${step.title}</h3><p>${step.description}</p>`;
            roadmapStepsContainer.appendChild(stepDiv);
        });
        
        addRecentProject(topic);
        document.querySelector('.main-content').scrollTop = 0;
    }, 1500); 
}

// --- INITIALIZATION & EVENT LISTENERS ---

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    if(profileIcon) {
        profileIcon.textContent = user.initials;
    }

    // Profile Listeners
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            toggleProfileDropdown();
            e.stopPropagation(); // Prevents the document click from closing it immediately
        });
    }

    document.addEventListener('click', (e) => {
        if (profileDropdown && profileDropdown.classList.contains('active') && !profileIcon.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    if (document.getElementById('profile-link')) {
        document.getElementById('profile-link').addEventListener('click', () => { profileDropdown.classList.remove('active'); console.log('Navigated to Profile page.'); });
    }
    if (document.getElementById('settings-link')) {
        document.getElementById('settings-link').addEventListener('click', () => { profileDropdown.classList.remove('active'); console.log('Navigated to Settings page.'); });
    }
    if (document.getElementById('logout-link')) {
        document.getElementById('logout-link').addEventListener('click', () => { profileDropdown.classList.remove('active'); console.log('Logged out user.'); });
    }

    // Chatbot Listeners
    if (toggleBtn) {
        toggleBtn.addEventListener('click', openChatbot);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeChatbot);
    }
    if (chatbotOverlay) {
        chatbotOverlay.addEventListener('click', closeChatbot);
    }
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                sendMessage();
            }
        });
    }

    // Main App Listeners
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', showWelcomeView);
    }
    if (generateRoadmapBtn) {
        generateRoadmapBtn.addEventListener('click', generateRoadmap);
    }
    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', showWelcomeView);
    }
    
    // Popular tags fill the main input
    if (popularTagsContainer) {
        popularTagsContainer.querySelectorAll('span:not(.tag-label)').forEach(tag => {
            tag.addEventListener('click', (e) => {
                mainInput.value = e.target.textContent;
            });
        });
    }
});
