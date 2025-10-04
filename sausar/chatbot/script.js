const body = document.body;
const toggleBtn = document.getElementById('chatbot-toggle-btn');
const closeBtn = document.getElementById('chatbot-close-btn');
const chatbotContainer = document.getElementById('chatbot-container');

// Chat elements
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.querySelector('.chat-messages');

// Main App elements
const newProjectBtn = document.getElementById('new-project-btn');
const generateRoadmapBtn = document.getElementById('generate-roadmap-btn');
const mainInput = document.getElementById('main-input');
const profileIcon = document.getElementById('profile-icon');
const popularTagsContainer = document.getElementById('popular-tags-container');

// Main App View elements
const welcomeView = document.getElementById('welcome-view');
const roadmapView = document.getElementById('roadmap-view');
const roadmapTopic = document.getElementById('roadmap-topic');
const roadmapStepsContainer = document.getElementById('roadmap-steps');
const loadingSpinner = document.getElementById('loading-spinner');
const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
const profileDropdown = document.getElementById('profile-dropdown');

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

// --- CHATBOT FUNCTIONS ---

function openChatbot() {
    body.classList.add('chatbot-open');
    toggleBtn.style.display = 'none'; 
    chatInput.focus(); 
}

function closeChatbot() {
    // Remove the class to trigger the CSS transition (slide-out)
    body.classList.remove('chatbot-open');
    // Wait for the transition (0.4s) before showing the toggle button again
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

    const pText = document.createElement('p');
    pText.textContent = messageText;

    const pTime = document.createElement('p');
    pTime.className = 'timestamp';
    pTime.textContent = formatTime(new Date());

    messageDiv.appendChild(pText);
    messageDiv.appendChild(pTime);
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
    console.log("Action: Switched to Welcome View.");
}

function addRecentProject(topic) {
    // 1. Hide the initial message
    if(noProjectsMessage) {
        noProjectsMessage.classList.add('hidden');
    }
    
    // 2. Create the project link/div
    const projectDiv = document.createElement('div');
    projectDiv.className = 'recent-project-item';
    projectDiv.textContent = topic;

    // 3. Make the recent project clickable to fill the main input
    projectDiv.addEventListener('click', () => {
        mainInput.value = topic;
        showWelcomeView();
    });

    // 4. Add to the top of the list
    recentProjectsList.prepend(projectDiv);

    // 5. Limit list size (keep max 5 recent projects)
    const maxItems = 5;
    while (recentProjectsList.children.length > maxItems) {
        // Remove the oldest project (last element if it's not the 'no projects' message)
        if (recentProjectsList.lastElementChild && recentProjectsList.lastElementChild.id !== 'no-projects-message') {
            recentProjectsList.removeChild(recentProjectsList.lastElementChild);
        } else {
            break; // Stop if we hit the placeholder
        }
    }
}


function generateRoadmap() {
    const topic = mainInput.value.trim() || 'General Study Skills';
    
    // 1. Start Loading/Transition
    welcomeView.classList.add('hidden');
    roadmapView.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    roadmapStepsContainer.innerHTML = ''; 
    roadmapTopic.textContent = topic;
    
    // 2. Simulate API delay
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
        
        const steps = [
            { title: "Step 1: Core Concepts & Fundamentals", description: `Research and define the basic terminology, history, and key players in ${topic}.` },
            { title: "Step 2: Practical Application Exercises", description: `Complete hands-on tutorials or coding exercises related to ${topic}.` },
            { title: "Step 3: Intermediate Deep Dive", description: "Read advanced articles, case studies, and watch in-depth lectures." },
            { title: "Step 4: Project and Portfolio Building", description: "Design and execute a capstone project to demonstrate mastery." },
        ];

        // 3. Generate Roadmap Steps
        steps.forEach(step => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'roadmap-step';
            stepDiv.innerHTML = `<h3>${step.title}</h3><p>${step.description}</p>`;
            roadmapStepsContainer.appendChild(stepDiv);
        });
        
        // 4. Add topic to sidebar
        addRecentProject(topic);

        // Scroll to top of the new roadmap view
        document.querySelector('.main-content').scrollTop = 0;

    }, 1500); 
}

// --- EVENT LISTENERS ---

// Chatbot Toggling
toggleBtn.addEventListener('click', openChatbot);
closeBtn.addEventListener('click', closeChatbot);
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        sendMessage();
    }
});

// Main App Interactivity
newProjectBtn.addEventListener('click', showWelcomeView);
generateRoadmapBtn.addEventListener('click', generateRoadmap);
backToWelcomeBtn.addEventListener('click', showWelcomeView);

// Profile Icon (Toggles Dropdown Menu)
profileIcon.addEventListener('click', (e) => {
    profileDropdown.classList.toggle('active');
    e.stopPropagation(); 
});

// Close profile dropdown when clicking anywhere else
document.addEventListener('click', (e) => {
    if (profileDropdown.classList.contains('active') && 
        !profileDropdown.contains(e.target) && 
        e.target !== profileIcon) {
        profileDropdown.classList.remove('active');
    }
});

// Profile Dropdown item placeholders
document.getElementById('profile-link').addEventListener('click', () => { profileDropdown.classList.remove('active'); console.log('Navigated to Profile page.'); });
document.getElementById('settings-link').addEventListener('click', () => { profileDropdown.classList.remove('active'); console.log('Navigated to Settings page.'); });
document.getElementById('logout-link').addEventListener('click', () => { profileDropdown.classList.remove('active'); console.log('Logged out user.'); });


// Popular tags fill the main input
popularTagsContainer.querySelectorAll('span:not(.tag-label)').forEach(tag => {
    tag.addEventListener('click', (e) => {
        const selectedTopic = e.target.textContent;
        mainInput.value = selectedTopic;
    });
});