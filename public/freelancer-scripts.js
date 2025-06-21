// Global variables to store data from API
let jobs = [];
let applications = [];
let dashboardStats = {
    totalApplications: 0,
    pendingApplications: 0,
    activeProjects: 0,
    totalEarnings: 0
};

let currentJobId = null;

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadDashboardStats();
    loadJobs();
    loadApplications();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search and filter functionality
    document.getElementById('jobSearch').addEventListener('input', filterJobs);
    document.getElementById('categoryFilter').addEventListener('change', filterJobs);
    document.getElementById('budgetFilter').addEventListener('change', filterJobs);

    // Application form submission
    document.getElementById('applicationForm').addEventListener('submit', submitApplication);

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('applicationModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Load user information
async function loadUserInfo() {
    try {
        const response = await fetch('/app/user/profile', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updateUserDisplay(data.user);
            }
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

// Update user display
function updateUserDisplay(user) {
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    const userRoleElement = document.getElementById('user-role');
    
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
    
    if (userAvatarElement) {
        // Create initials from user name
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        userAvatarElement.textContent = initials;
    }
    
    if (userRoleElement) {
        userRoleElement.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch('/app/freelancer/stats', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                dashboardStats = data.stats;
                updateStatsDisplay();
                updateRecentActivity();
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
        statCards[0].textContent = dashboardStats.totalApplications;
        statCards[1].textContent = dashboardStats.pendingApplications;
        statCards[2].textContent = dashboardStats.activeProjects;
        statCards[3].textContent = `$${dashboardStats.totalEarnings.toLocaleString()}`;
    }
}

// Update recent activity
function updateRecentActivity() {
    const recentActivity = document.getElementById('recent-activity');
    
    if (applications.length === 0) {
        recentActivity.innerHTML = '<p>No recent activity. Start applying for jobs to see your activity here!</p>';
        return;
    }

    // Show last 3 applications
    const recentApplications = applications.slice(0, 3);
    recentActivity.innerHTML = '';

    recentApplications.forEach(app => {
        const activityCard = document.createElement('div');
        activityCard.className = 'job-card';
        
        const appliedDate = new Date(app.appliedDate).toLocaleDateString();
        
        activityCard.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${app.jobId.title}</div>
                    <div class="job-meta">
                        <span>Applied: ${appliedDate}</span>
                        <span>Your Bid: $${app.proposedBudget}</span>
                    </div>
                </div>
                <div class="status status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</div>
            </div>
        `;
        recentActivity.appendChild(activityCard);
    });
}

// Tab switching functionality
function showTab(tabName, event) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab and activate button
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load data based on active tab
    if (tabName === 'jobs') {
        loadJobs();
    } else if (tabName === 'applications') {
        loadApplications();
    } else if (tabName === 'dashboard') {
        loadDashboardStats();
    }
}

// Load jobs from API
async function loadJobs() {
    const jobsList = document.getElementById('jobsList');
    
    try {
        // Show loading state
        jobsList.innerHTML = '<p>Loading jobs...</p>';
        
        const response = await fetch('/app/jobs/all', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                jobs = data.jobs;
                displayJobs(jobs);
            } else {
                jobsList.innerHTML = '<p>Error loading jobs: ' + data.message + '</p>';
            }
        } else if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/app';
        } else {
            jobsList.innerHTML = '<p>Error loading jobs. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        jobsList.innerHTML = '<p>Error loading jobs. Please check your connection.</p>';
    }
}

// Display jobs
function displayJobs(jobsToShow) {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '';
    
    if (jobsToShow.length === 0) {
        jobsList.innerHTML = '<p>No jobs available at the moment.</p>';
        return;
    }
    
    jobsToShow.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        const postedDate = new Date(job.postedDate).toLocaleDateString();
        const deadline = new Date(job.deadline).toLocaleDateString();
        
        jobCard.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-meta">
                        <span>📅 Posted ${postedDate}</span>
                        <span>👤 ${job.clientId.name}</span>
                        <span>📊 ${job.applications} proposals</span>
                        <span>⏰ Deadline: ${deadline}</span>
                    </div>
                </div>
                <div class="job-budget">$${job.budget}</div>
            </div>
            <p style="margin-bottom: 15px; color: #666; line-height: 1.5;">${job.description}</p>
            <div class="job-tags">
                ${job.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
            <div class="job-actions">
                <button class="btn btn-primary" onclick="openApplicationModal('${job._id}')">Apply Now</button>
                <button class="btn btn-secondary">Save Job</button>
            </div>
        `;
        jobsList.appendChild(jobCard);
    });
}

// Load applications from API
async function loadApplications() {
    const applicationsList = document.getElementById('applicationsList');
    
    try {
        const response = await fetch('/app/applications/freelancer', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                applications = data.applications;
                displayApplications();
                updateRecentActivity();
            } else {
                applicationsList.innerHTML = '<p>Error loading applications: ' + data.message + '</p>';
            }
        } else if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/app';
        } else {
            applicationsList.innerHTML = '<p>Error loading applications. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        applicationsList.innerHTML = '<p>Error loading applications. Please check your connection.</p>';
    }
}

// Display applications
function displayApplications() {
    const applicationsList = document.getElementById('applicationsList');
    applicationsList.innerHTML = '';
    
    if (applications.length === 0) {
        applicationsList.innerHTML = '<p>No applications yet. Start applying for jobs to see your applications here!</p>';
        return;
    }
    
    applications.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'application-card';
        
        const appliedDate = new Date(app.appliedDate).toLocaleDateString();
        
        appCard.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${app.jobId.title}</div>
                    <div class="job-meta">
                        <span>Client: ${app.jobId.clientId.name}</span>
                        <span>Applied: ${appliedDate}</span>
                        <span>Your Bid: $${app.proposedBudget}</span>
                        <span>Timeline: ${app.estimatedTime}</span>
                    </div>
                </div>
                <span class="status status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
            </div>
            <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <strong>Cover Letter:</strong>
                <p style="margin-top: 5px; color: #666;">${app.coverLetter}</p>
            </div>
        `;
        applicationsList.appendChild(appCard);
    });
}

// Search and filter functionality
function filterJobs() {
    const searchTerm = document.getElementById('jobSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const budgetFilter = document.getElementById('budgetFilter').value;
    
    let filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) || 
                              job.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || job.category === categoryFilter;
        
        let matchesBudget = true;
        if (budgetFilter) {
            if (budgetFilter === '0-500') {
                matchesBudget = job.budget <= 500;
            } else if (budgetFilter === '500-1000') {
                matchesBudget = job.budget > 500 && job.budget <= 1000;
            } else if (budgetFilter === '1000+') {
                matchesBudget = job.budget > 1000;
            }
        }
        
        return matchesSearch && matchesCategory && matchesBudget;
    });
    
    displayJobs(filteredJobs);
}

// Modal functions
function openApplicationModal(jobId) {
    currentJobId = jobId;
    document.getElementById('applicationModal').style.display = 'block';
    
    // Reset form
    document.getElementById('applicationForm').reset();
}

function closeModal() {
    document.getElementById('applicationModal').style.display = 'none';
    currentJobId = null;
}

// Submit application
async function submitApplication(event) {
    event.preventDefault();
    
    if (!currentJobId) {
        showNotification('Error: No job selected', 'error');
        return;
    }
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
        // Show loading state
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        const formData = {
            jobId: currentJobId,
            coverLetter: document.getElementById('coverLetter').value,
            proposedBudget: document.getElementById('proposedBudget').value,
            estimatedTime: document.getElementById('estimatedTime').value
        };
        
        const response = await fetch('/app/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Reset form and close modal
            event.target.reset();
            closeModal();
            
            // Show success message
            showNotification('Application submitted successfully!', 'success');
            
            // Reload data
            await loadJobs();
            await loadApplications();
            await loadDashboardStats();
        } else {
            showNotification('Error submitting application: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        showNotification('Error submitting application. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
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