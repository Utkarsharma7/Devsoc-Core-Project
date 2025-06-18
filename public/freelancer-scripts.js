// Sample data
const jobs = [
    {
        id: 1,
        title: "E-commerce Website Development",
        description: "Need a modern e-commerce website with payment integration, user authentication, and admin panel.",
        budget: 1200,
        category: "web-dev",
        tags: ["React", "Node.js", "MongoDB"],
        client: "TechStore Inc.",
        posted: "2 hours ago",
        proposals: 12
    },
    {
        id: 2,
        title: "Mobile App UI/UX Design",
        description: "Looking for a creative designer to create intuitive UI/UX for our fitness tracking mobile app.",
        budget: 800,
        category: "design",
        tags: ["Figma", "UI/UX", "Mobile Design"],
        client: "FitLife App",
        posted: "5 hours ago",
        proposals: 8
    },
    {
        id: 3,
        title: "Content Writing for Blog",
        description: "Need 10 SEO-optimized blog posts about digital marketing trends and strategies.",
        budget: 400,
        category: "writing",
        tags: ["SEO", "Content Writing", "Digital Marketing"],
        client: "Marketing Pro",
        posted: "1 day ago",
        proposals: 15
    },
    {
        id: 4,
        title: "Python Data Analysis Script",
        description: "Create a Python script to analyze sales data and generate automated reports with visualizations.",
        budget: 600,
        category: "web-dev",
        tags: ["Python", "Data Analysis", "Pandas"],
        client: "DataCorp",
        posted: "3 hours ago",
        proposals: 6
    }
];

const applications = [
    {
        id: 1,
        jobTitle: "E-commerce Website Development",
        client: "TechStore Inc.",
        appliedDate: "2024-06-15",
        status: "pending",
        budget: 1200,
        proposal: 1150
    },
    {
        id: 2,
        jobTitle: "Mobile App Development",
        client: "StartupXYZ",
        appliedDate: "2024-06-12",
        status: "accepted",
        budget: 2000,
        proposal: 1800
    },
    {
        id: 3,
        jobTitle: "Logo Design",
        client: "BrandCo",
        appliedDate: "2024-06-10",
        status: "rejected",
        budget: 300,
        proposal: 250
    }
];

const projects = [
    {
        id: 1,
        title: "Restaurant Management System",
        client: "Tasty Bites",
        progress: 75,
        deadline: "2024-06-25",
        budget: 1500,
        status: "in-progress"
    },
    {
        id: 2,
        title: "Company Website Redesign",
        client: "Corporate Solutions",
        progress: 40,
        deadline: "2024-07-10",
        budget: 2200,
        status: "in-progress"
    },
    {
        id: 3,
        title: "Inventory Management App",
        client: "RetailHub",
        progress: 90,
        deadline: "2024-06-20",
        budget: 1800,
        status: "near-completion"
    }
];

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
        displayJobs(jobs);
    } else if (tabName === 'applications') {
        displayApplications();
    } else if (tabName === 'projects') {
        displayProjects();
    }
}

// Display jobs
function displayJobs(jobsToShow) {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '';
    
    jobsToShow.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-meta">
                        <span>📅 Posted ${job.posted}</span>
                        <span>👤 ${job.client}</span>
                        <span>📊 ${job.proposals} proposals</span>
                    </div>
                </div>
                <div class="job-budget">$${job.budget}</div>
            </div>
            <p style="margin-bottom: 15px; color: #666; line-height: 1.5;">${job.description}</p>
            <div class="job-tags">
                ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="job-actions">
                <button class="btn btn-primary" onclick="openApplicationModal(${job.id})">Apply Now</button>
                <button class="btn btn-secondary">Save Job</button>
            </div>
        `;
        jobsList.appendChild(jobCard);
    });
}

// Display applications
function displayApplications() {
    const applicationsList = document.getElementById('applicationsList');
    applicationsList.innerHTML = '';
    
    applications.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'application-card';
        appCard.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${app.jobTitle}</div>
                    <div class="job-meta">
                        <span>Client: ${app.client}</span>
                        <span>Applied: ${app.appliedDate}</span>
                        <span>Your Bid: $${app.proposal}</span>
                    </div>
                </div>
                <span class="status status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
            </div>
        `;
        applicationsList.appendChild(appCard);
    });
}

// Display projects
function displayProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'application-card';
        projectCard.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${project.title}</div>
                    <div class="job-meta">
                        <span>Client: ${project.client}</span>
                        <span>Deadline: ${project.deadline}</span>
                        <span>Budget: $${project.budget}</span>
                    </div>
                </div>
                <span class="status status-accepted">Active</span>
            </div>
            <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Progress</span>
                    <span>${project.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
            </div>
            <div class="job-actions">
                <button class="btn btn-primary">View Details</button>
                <button class="btn btn-secondary">Upload Work</button>
            </div>
        `;
        projectsList.appendChild(projectCard);
    });
}

// Modal functions
function openApplicationModal(jobId) {
    document.getElementById('applicationModal').style.display = 'block';
    // You might want to store the jobId to use when the form is submitted
    // For example: document.getElementById('applicationForm').dataset.jobId = jobId;
}

function closeModal() {
    document.getElementById('applicationModal').style.display = 'none';
}

// Search and filter functionality
document.getElementById('jobSearch').addEventListener('input', filterJobs);
document.getElementById('categoryFilter').addEventListener('change', filterJobs);
document.getElementById('budgetFilter').addEventListener('change', filterJobs);

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

// Application form submission
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Application submitted successfully!');
    closeModal();
    // In a real application, you'd send this data to a backend
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('applicationModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    displayJobs(jobs); // Display jobs when the page first loads
});