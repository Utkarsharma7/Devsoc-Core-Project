
let adminData = {
    stats: {},
    users: [],
    jobs: [],
    applications: []
};


document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
});

async function checkAdminAuth() {
    try {
        const response = await fetch('/api/admin/stats', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            
            showDashboard();
            loadDashboardData();
        } else {
            showLoginForm();
        }
    } catch (error) {
        showLoginForm();
    }
}

// Show login form
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}

// Admin login
document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showDashboard();
            loadDashboardData();
            showNotification('Admin login successful!', 'success');
        } else {
            showNotification('Invalid credentials!', 'error');
        }
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
});

// Load dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadStats(),
        loadUsers(),
        loadJobs(),
        loadApplications()
    ]);
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch('/api/admin/stats', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            adminData.stats = data.stats;
            adminData.recentUsers = data.recentUsers;
            adminData.recentJobs = data.recentJobs;
            
            updateStatsDisplay();
            updateRecentActivity();
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Update stats display
function updateStatsDisplay() {
    document.getElementById('totalUsers').textContent = adminData.stats.totalUsers || 0;
    document.getElementById('totalJobs').textContent = adminData.stats.totalJobs || 0;
    document.getElementById('totalApplications').textContent = adminData.stats.totalApplications || 0;
    document.getElementById('activeJobs').textContent = adminData.stats.activeJobs || 0;
    document.getElementById('pendingApplications').textContent = adminData.stats.pendingApplications || 0;
}

// Update recent activity
function updateRecentActivity() {
    // Recent Users
    const recentUsersDiv = document.getElementById('recentUsers');
    if (adminData.recentUsers && adminData.recentUsers.length > 0) {
        let usersHTML = '<table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>';
        adminData.recentUsers.forEach(user => {
            usersHTML += `<tr><td>${user.name}</td><td>${user.email}</td><td><span class="status-badge status-active">${user.role}</span></td></tr>`;
        });
        usersHTML += '</tbody></table>';
        recentUsersDiv.innerHTML = usersHTML;
    } else {
        recentUsersDiv.innerHTML = '<p>No recent users</p>';
    }
    
    // Recent Jobs
    const recentJobsDiv = document.getElementById('recentJobs');
    if (adminData.recentJobs && adminData.recentJobs.length > 0) {
        let jobsHTML = '<table class="data-table"><thead><tr><th>Title</th><th>Client</th><th>Budget</th><th>Status</th></tr></thead><tbody>';
        adminData.recentJobs.forEach(job => {
            jobsHTML += `<tr><td>${job.title}</td><td>${job.clientId.name}</td><td>$${job.budget}</td><td><span class="status-badge status-active">${job.status}</span></td></tr>`;
        });
        jobsHTML += '</tbody></table>';
        recentJobsDiv.innerHTML = jobsHTML;
    } else {
        recentJobsDiv.innerHTML = '<p>No recent jobs</p>';
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            adminData.users = data.users;
            displayUsers();
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Display users
function displayUsers() {
    const usersTable = document.getElementById('usersTable');
    
    if (adminData.users.length === 0) {
        usersTable.innerHTML = '<p>No users found</p>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    adminData.users.forEach(user => {
        tableHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge status-active">${user.role}</span></td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    usersTable.innerHTML = tableHTML;
}

// Load jobs
async function loadJobs() {
    try {
        const response = await fetch('/api/admin/jobs', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            adminData.jobs = data.jobs;
            displayJobs();
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// Display jobs
function displayJobs() {
    const jobsTable = document.getElementById('jobsTable');
    
    if (adminData.jobs.length === 0) {
        jobsTable.innerHTML = '<p>No jobs found</p>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Client</th>
                    <th>Budget</th>
                    <th>Applications</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    adminData.jobs.forEach(job => {
        tableHTML += `
            <tr>
                <td>${job.title}</td>
                <td>${job.clientId.name}</td>
                <td>$${job.budget}</td>
                <td>${job.applications}</td>
                <td><span class="status-badge status-active">${job.status}</span></td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteJob('${job._id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    jobsTable.innerHTML = tableHTML;
}

// Load applications
async function loadApplications() {
    try {
        const response = await fetch('/api/admin/applications', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            adminData.applications = data.applications;
            displayApplications();
        }
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

// Display applications
function displayApplications() {
    const applicationsTable = document.getElementById('applicationsTable');
    
    if (adminData.applications.length === 0) {
        applicationsTable.innerHTML = '<p>No applications found</p>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Job</th>
                    <th>Freelancer</th>
                    <th>Proposed Budget</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    adminData.applications.forEach(app => {
        const appliedDate = new Date(app.appliedDate).toLocaleDateString();
        tableHTML += `
            <tr>
                <td>${app.jobId.title}</td>
                <td>${app.freelancerId.name}</td>
                <td>$${app.proposedBudget}</td>
                <td><span class="status-badge status-${app.status}">${app.status}</span></td>
                <td>${appliedDate}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    applicationsTable.innerHTML = tableHTML;
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            showNotification('User deleted successfully!', 'success');
            loadDashboardData(); // Reload all data
        } else {
            showNotification('Failed to delete user', 'error');
        }
    } catch (error) {
        showNotification('Error deleting user', 'error');
    }
}

// Delete job
async function deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/jobs/${jobId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            showNotification('Job deleted successfully!', 'success');
            loadDashboardData(); // Reload all data
        } else {
            showNotification('Failed to delete job', 'error');
        }
    } catch (error) {
        showNotification('Error deleting job', 'error');
    }
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load data based on tab
    switch(tabName) {
        case 'users':
            loadUsers();
            break;
        case 'jobs':
            loadJobs();
            break;
        case 'applications':
            loadApplications();
            break;
    }
}

// Logout
async function logout() {
    try {
        const response = await fetch('/api/admin/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            showLoginForm();
            showNotification('Logged out successfully!', 'success');
        }
    } catch (error) {
        showNotification('Logout failed', 'error');
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
        notification.style.backgroundColor = '#2ed573';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ff4757';
    } else {
        notification.style.backgroundColor = '#667eea';
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