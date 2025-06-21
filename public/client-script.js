// Global variables to store data from API
let jobs = [];
let applications = [];
let contracts = [];
let dashboardStats = {
    activeJobs: 0,
    totalApplications: 0,
    activeContracts: 0,
    totalSpent: 0
};

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadJobs();
});

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/dashboard/stats', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                dashboardStats = data.stats;
                updateStatsDisplay();
            } else {
                console.error('Failed to load stats:', data.message);
            }
        } else if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/app';
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Show fallback stats
        updateStatsDisplay();
    }
}

// Update stats display
function updateStatsDisplay() {
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = dashboardStats.activeJobs;
        statCards[1].textContent = dashboardStats.totalApplications;
        statCards[2].textContent = dashboardStats.activeContracts;
        statCards[3].textContent = `$${dashboardStats.totalSpent.toLocaleString()}`;
    }
}

// Tab functionality
function showTab(event, tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load content based on tab
    switch(tabName) {
        case 'manage-jobs':
            loadJobs();
            break;
        case 'applications':
            loadApplications();
            break;
        case 'contracts':
            loadContracts();
            break;
        case 'post-job': // Clear form when switching to post-job tab
            document.getElementById('job-form')?.reset();
            break;
    }
}

// Job posting
async function postJob(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
        // Show loading state
        submitButton.textContent = 'Posting...';
        submitButton.disabled = true;
        
        const formData = {
            title: document.getElementById('job-title').value,
            category: document.getElementById('job-category').value,
            description: document.getElementById('job-description').value,
            budget: document.getElementById('job-budget').value,
            deadline: document.getElementById('job-deadline').value,
            skills: document.getElementById('job-skills').value
        };
        
        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Reset form
            event.target.reset();
            
            // Show success message
            showNotification('Job posted successfully!', 'success');
            
            // Reload jobs and stats
            await loadJobs();
            await loadDashboardStats();
            
            // Switch to manage jobs tab
            showTab({ target: document.querySelector('.tab-btn[onclick*="manage-jobs"]') }, 'manage-jobs');
        } else {
            showNotification('Error posting job: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error posting job:', error);
        showNotification('Error posting job. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Load jobs from API
async function loadJobs() {
    const jobList = document.getElementById('job-list');
    
    try {
        // Show loading state
        jobList.innerHTML = '<p>Loading jobs...</p>';
        
        const response = await fetch('/api/jobs/client', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                jobs = data.jobs;
                displayJobs();
            } else {
                jobList.innerHTML = '<p>Error loading jobs: ' + data.message + '</p>';
            }
        } else if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/app';
        } else {
            jobList.innerHTML = '<p>Error loading jobs. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        jobList.innerHTML = '<p>Error loading jobs. Please check your connection.</p>';
    }
}

// Display jobs in the UI
function displayJobs() {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = '';
    
    if (jobs.length === 0) {
        jobList.innerHTML = '<p>No jobs posted yet. Post a new job to get started!</p>';
        return;
    }

    jobs.forEach(job => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        
        const postedDate = new Date(job.postedDate).toLocaleDateString();
        const deadline = new Date(job.deadline).toLocaleDateString();
        
        jobItem.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-meta">
                        <span>Budget: $${job.budget}</span>
                        <span>•</span>
                        <span>Posted: ${postedDate}</span>
                        <span>•</span>
                        <span>Deadline: ${deadline}</span>
                    </div>
                    <p style="margin-top: 10px; color: #666;">${job.description}</p>
                </div>
                <div style="text-align: right;">
                    <div class="job-status status-${job.status}">${job.status.toUpperCase()}</div>
                    <div class="applications-count" style="margin-top: 10px;">${job.applications} Applications</div>
                </div>
            </div>
            <div style="margin-top: 15px;">
                <strong>Skills:</strong> ${job.skills.join(', ')}
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn btn-primary" onclick="viewApplicationsForJob('${job._id}')">View Applications</button>
                <button class="btn btn-secondary" onclick="editJob('${job._id}')">Edit Job</button>
                <button class="btn btn-secondary" onclick="deleteJob('${job._id}')">Delete</button>
            </div>
        `;
        jobList.appendChild(jobItem);
    });
}

// Load applications (placeholder for now)
function loadApplications() {
    const applicationsList = document.getElementById('applications-list');
    applicationsList.innerHTML = '<p>No applications received yet.</p>';
}

// Load contracts (placeholder for now)
function loadContracts() {
    const contractsList = document.getElementById('contracts-list');
    contractsList.innerHTML = '<p>No active contracts yet.</p>';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196F3';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Placeholder functions for future implementation
function acceptApplication(jobId, freelancerName) {
    showNotification(`Application from ${freelancerName} accepted for job ${jobId}`, 'success');
}

function declineApplication(jobId, freelancerName) {
    showNotification(`Application from ${freelancerName} declined for job ${jobId}`, 'info');
}

function messageFreelancer(freelancerName) {
    showNotification(`Opening chat with ${freelancerName}`, 'info');
}

function viewApplicationsForJob(jobId) {
    showNotification(`Viewing applications for job ${jobId}`, 'info');
}

function editJob(jobId) {
    showNotification(`Editing job ${jobId}`, 'info');
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        showNotification(`Deleting job ${jobId}`, 'info');
    }
}

function openChat(chatId) {
    document.getElementById('current-chat').textContent = chatId === 'sarah-wilson' ? 'Sarah Wilson' : 'Mike Johnson';
    // Add more chat functionality here
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (message) {
        const messageSection = document.getElementById('message-section');
        const newMessage = document.createElement('div');
        newMessage.className = 'message sent';
        newMessage.innerHTML = `
            <div>${message}</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 5px;">${new Date().toLocaleTimeString()}</div>
        `;
        messageSection.appendChild(newMessage);
        messageInput.value = '';
        messageSection.scrollTop = messageSection.scrollHeight;
    }
}

function viewContract(contractId) {
    showNotification(`Viewing contract ${contractId}`, 'info');
}

function updateProgress(contractId) {
    showNotification(`Updating progress for contract ${contractId}`, 'info');
}

function releasePayment(contractId) {
    showNotification(`Releasing payment for contract ${contractId}`, 'info');
}