// Sample data
let jobs = [
    {
        id: 1,
        title: "E-commerce Website Development",
        category: "web-development",
        description: "Need a full-stack e-commerce website with payment integration",
        budget: 1500,
        deadline: "2025-07-15",
        skills: ["React", "Node.js", "MongoDB"],
        status: "active",
        applications: 12,
        postedDate: "2025-06-10"
    },
    {
        id: 2,
        title: "Logo Design for Startup",
        category: "graphic-design",
        description: "Modern, minimalist logo for tech startup",
        budget: 300,
        deadline: "2025-06-30",
        skills: ["Adobe Illustrator", "Photoshop"],
        status: "pending",
        applications: 8,
        postedDate: "2025-06-15"
    }
];

let applications = [
    {
        jobId: 1,
        freelancer: {
            name: "Sarah Wilson",
            avatar: "SW",
            rating: 4.9,
            experience: "5 years",
            skills: ["React", "Node.js", "MongoDB", "AWS"]
        },
        bid: 1200,
        proposal: "I have extensive experience in e-commerce development...",
        appliedDate: "2025-06-12"
    },
    {
        jobId: 1,
        freelancer: {
            name: "Alex Chen",
            avatar: "AC",
            rating: 4.7,
            experience: "3 years",
            skills: ["React", "Express", "PostgreSQL"]
        },
        bid: 1400,
        proposal: "I can deliver a high-quality e-commerce solution...",
        appliedDate: "2025-06-13"
    }
];

let contracts = [
    {
        id: 1,
        jobTitle: "E-commerce Website Development",
        freelancer: "Sarah Wilson",
        budget: 1200,
        progress: 65,
        status: "in-progress",
        deadline: "2025-07-15",
        startDate: "2025-06-15"
    },
    {
        id: 2,
        jobTitle: "Mobile App UI Design",
        freelancer: "Mike Johnson",
        budget: 800,
        progress: 100,
        status: "completed",
        deadline: "2025-06-20",
        startDate: "2025-06-01"
    }
];

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
function postJob(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('job-title').value,
        category: document.getElementById('job-category').value,
        description: document.getElementById('job-description').value,
        budget: document.getElementById('job-budget').value,
        deadline: document.getElementById('job-deadline').value,
        skills: document.getElementById('job-skills').value.split(',').map(s => s.trim())
    };
    
    // Add to jobs array
    const newJob = {
        id: jobs.length + 1,
        ...formData,
        status: 'active',
        applications: 0,
        postedDate: new Date().toISOString().split('T')[0]
    };
    
    jobs.push(newJob);
    
    // Reset form
    event.target.reset();
    
    // Show success message
    alert('Job posted successfully!');
    
    // Switch to manage jobs tab
    showTab({ target: document.querySelector('.tab-btn[onclick*="manage-jobs"]') }, 'manage-jobs');
}

// Load jobs
function loadJobs() {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = '';
    
    if (jobs.length === 0) {
        jobList.innerHTML = '<p>No jobs posted yet. Post a new job to get started!</p>';
        return;
    }

    jobs.forEach(job => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        jobItem.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-meta">
                        <span>Budget: $${job.budget}</span>
                        <span>•</span>
                        <span>Posted: ${job.postedDate}</span>
                        <span>•</span>
                        <span>Deadline: ${job.deadline}</span>
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
                <button class="btn btn-primary" onclick="viewApplicationsForJob(${job.id})">View Applications</button>
                <button class="btn btn-secondary" onclick="editJob(${job.id})">Edit Job</button>
                <button class="btn btn-secondary" onclick="deleteJob(${job.id})">Delete</button>
            </div>
        `;
        jobList.appendChild(jobItem);
    });
}

// Load applications
function loadApplications() {
    const applicationsList = document.getElementById('applications-list');
    applicationsList.innerHTML = '';
    
    if (applications.length === 0) {
        applicationsList.innerHTML = '<p>No applications received yet.</p>';
        return;
    }

    applications.forEach(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (!job) return; // Skip if job not found (e.g., job was deleted)

        const appItem = document.createElement('div');
        appItem.className = 'job-item'; // Reusing job-item style for consistency
        appItem.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">Application for: ${job.title}</h4>
                <div class="freelancer-list">
                    <div class="freelancer-item">
                        <div class="freelancer-info">
                            <div class="freelancer-avatar">${app.freelancer.avatar}</div>
                            <div class="freelancer-details">
                                <h4>${app.freelancer.name}</h4>
                                <div class="freelancer-rating">
                                    <span class="stars">★★★★★</span>
                                    <span>${app.freelancer.rating}</span>
                                    <span>•</span>
                                    <span>${app.freelancer.experience}</span>
                                </div>
                                <div style="font-size: 14px; color: #666; margin-top: 5px;">
                                    Skills: ${app.freelancer.skills.join(', ')}
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="bid-amount">$${app.bid}</div>
                            <div style="font-size: 12px; color: #666; margin-top: 5px;">Applied: ${app.appliedDate}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 10px;">
                    <strong>Proposal:</strong>
                    <p style="margin-top: 8px; color: #666;">${app.proposal}</p>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="acceptApplication(${app.jobId}, '${app.freelancer.name}')">Accept</button>
                    <button class="btn btn-secondary" onclick="messageFreelancer('${app.freelancer.name}')">Message</button>
                    <button class="btn btn-secondary" onclick="declineApplication(${app.jobId}, '${app.freelancer.name}')">Decline</button>
                </div>
            </div>
        `;
        applicationsList.appendChild(appItem);
    });
}

// Load contracts
function loadContracts() {
    const contractsList = document.getElementById('contracts-list');
    contractsList.innerHTML = '';
    
    if (contracts.length === 0) {
        contractsList.innerHTML = '<p>No active contracts yet. Accept an application to start a contract!</p>';
        return;
    }

    contracts.forEach(contract => {
        const contractItem = document.createElement('div');
        contractItem.className = 'contract-item';
        contractItem.innerHTML = `
            <div class="contract-header">
                <div>
                    <h4 style="color: #333; margin-bottom: 5px;">${contract.jobTitle}</h4>
                    <p style="color: #666; font-size: 14px;">with ${contract.freelancer}</p>
                </div>
                <div class="job-status status-${contract.status}">${contract.status.toUpperCase()}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span><strong>Budget:</strong> $${contract.budget}</span>
                <span><strong>Deadline:</strong> ${contract.deadline}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Progress: ${contract.progress}%</strong>
            </div>
            <div class="contract-progress">
                <div class="progress-bar" style="width: ${contract.progress}%"></div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn btn-primary" onclick="viewContract(${contract.id})">View Details</button>
                <button class="btn btn-secondary" onclick="messageFreelancer('${contract.freelancer}')">Message</button>
                ${contract.status === 'in-progress' ? `<button class="btn btn-secondary" onclick="updateProgress(${contract.id})">Update Progress</button>` : ''}
                ${contract.status === 'completed' ? '<button class="btn btn-primary" onclick="releasePayment(' + contract.id + ')">Release Payment</button>' : ''}
            </div>
        `;
        contractsList.appendChild(contractItem);
    });
}

// Application actions
function acceptApplication(jobId, freelancerName) {
    const job = jobs.find(j => j.id === jobId);
    const application = applications.find(a => a.jobId === jobId && a.freelancer.name === freelancerName);
    
    if (!job || !application) {
        alert('Error: Job or application not found.');
        return;
    }

    // Check if a contract already exists for this job to prevent duplicates
    const existingContract = contracts.find(c => c.jobTitle === job.title && c.freelancer === freelancerName);
    if (existingContract) {
        alert('A contract for this job with this freelancer already exists.');
        return;
    }

    const newContract = {
        id: contracts.length > 0 ? Math.max(...contracts.map(c => c.id)) + 1 : 1,
        jobTitle: job.title,
        freelancer: freelancerName,
        budget: application.bid,
        progress: 0,
        status: 'in-progress',
        deadline: job.deadline,
        startDate: new Date().toISOString().split('T')[0]
    };
    
    contracts.push(newContract);
    
    // Update job status
    job.status = 'in-progress';
    
    // Remove the accepted application and all other applications for this job
    applications = applications.filter(app => app.jobId !== jobId || app.freelancer.name === freelancerName);

    // Decrease the application count for the job, as only the accepted one remains conceptually
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    if (jobIndex > -1) {
        jobs[jobIndex].applications = applications.filter(app => app.jobId === jobId).length;
    }


    alert(`Application accepted! Contract created with ${freelancerName}`);
    loadApplications();
    loadJobs(); // Refresh jobs to reflect status change
}

function declineApplication(jobId, freelancerName) {
    const initialApplicationsCount = applications.length;
    applications = applications.filter(a => !(a.jobId === jobId && a.freelancer.name === freelancerName));
    
    if (applications.length < initialApplicationsCount) {
        alert('Application declined.');
        // Decrement application count for the specific job
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            job.applications--;
        }
        loadApplications();
        loadJobs(); // Update job application count in manage jobs tab
    } else {
        alert('Application not found.');
    }
}

function messageFreelancer(freelancerName) {
    // Switch to messages tab and open chat
    showTab({ target: document.querySelector('.tab-btn[onclick*="messages"]') }, 'messages');
    openChat(freelancerName.toLowerCase().replace(/\s/g, '-')); // Format name to match IDs like 'sarah-wilson'
}

function viewApplicationsForJob(jobId) {
    // Filter applications to show only for the selected job
    const jobApplications = applications.filter(app => app.jobId === jobId);
    
    const applicationsList = document.getElementById('applications-list');
    applicationsList.innerHTML = ''; // Clear current applications list

    if (jobApplications.length === 0) {
        applicationsList.innerHTML = '<p>No applications for this job yet.</p>';
        return;
    }

    jobApplications.forEach(app => {
        const job = jobs.find(j => j.id === app.jobId);
        const appItem = document.createElement('div');
        appItem.className = 'job-item';
        appItem.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">Application for: ${job.title}</h4>
                <div class="freelancer-list">
                    <div class="freelancer-item">
                        <div class="freelancer-info">
                            <div class="freelancer-avatar">${app.freelancer.avatar}</div>
                            <div class="freelancer-details">
                                <h4>${app.freelancer.name}</h4>
                                <div class="freelancer-rating">
                                    <span class="stars">★★★★★</span>
                                    <span>${app.freelancer.rating}</span>
                                    <span>•</span>
                                    <span>${app.freelancer.experience}</span>
                                </div>
                                <div style="font-size: 14px; color: #666; margin-top: 5px;">
                                    Skills: ${app.freelancer.skills.join(', ')}
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="bid-amount">$${app.bid}</div>
                            <div style="font-size: 12px; color: #666; margin-top: 5px;">Applied: ${app.appliedDate}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 10px;">
                    <strong>Proposal:</strong>
                    <p style="margin-top: 8px; color: #666;">${app.proposal}</p>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="acceptApplication(${app.jobId}, '${app.freelancer.name}')">Accept</button>
                    <button class="btn btn-secondary" onclick="messageFreelancer('${app.freelancer.name}')">Message</button>
                    <button class="btn btn-secondary" onclick="declineApplication(${app.jobId}, '${app.freelancer.name}')">Decline</button>
                </div>
            </div>
        `;
        applicationsList.appendChild(appItem);
    });

    // Also switch to the applications tab visually
    const applicationsTabButton = document.querySelector('.tab-btn[onclick*="applications"]');
    if (applicationsTabButton) {
        showTab({ target: applicationsTabButton }, 'applications');
    }
}


function editJob(jobId) {
    alert(`Editing job with ID: ${jobId}`);
    // In a real application, you would populate the "Post Job" form with job data
    // and then switch to that tab for editing.
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        const initialJobCount = jobs.length;
        jobs = jobs.filter(job => job.id !== jobId);
        
        if (jobs.length < initialJobCount) {
            // Also remove related applications and contracts (optional, but good practice)
            applications = applications.filter(app => app.jobId !== jobId);
            contracts = contracts.filter(contract => jobs.some(j => j.title === contract.jobTitle)); // Remove contracts if job is gone
            
            alert('Job deleted successfully!');
            loadJobs(); // Refresh the list
            loadApplications(); // Refresh applications in case any were linked to deleted job
            loadContracts(); // Refresh contracts
        } else {
            alert('Job not found.');
        }
    }
}

function openChat(chatId) {
    const freelancerName = chatId.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    document.getElementById('current-chat').textContent = freelancerName;
    const messageSection = document.getElementById('message-section');
    messageSection.innerHTML = `
        <div class="message received">
            <div>Hello, this is a chat with ${freelancerName}.</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
    `;
    // In a real application, you would load chat history for the selected freelancer
    messageSection.scrollTop = messageSection.scrollHeight; // Scroll to bottom
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    
    if (messageText) {
        const messageSection = document.getElementById('message-section');
        const newMessage = document.createElement('div');
        newMessage.className = 'message sent';
        newMessage.innerHTML = `
            <div>${messageText}</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 5px;">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        messageSection.appendChild(newMessage);
        messageInput.value = '';
        messageSection.scrollTop = messageSection.scrollHeight; // Scroll to bottom
    }
}

function viewContract(contractId) {
    alert(`Viewing details for contract ID: ${contractId}`);
    // In a real application, this would open a modal or new page with full contract details.
}

function updateProgress(contractId) {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
        let newProgress = prompt(`Enter new progress percentage for "${contract.jobTitle}" (current: ${contract.progress}%):`);
        newProgress = parseInt(newProgress);
        if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
            contract.progress = newProgress;
            if (newProgress === 100) {
                contract.status = 'completed';
            } else if (newProgress > 0 && newProgress < 100) {
                contract.status = 'in-progress';
            } else {
                contract.status = 'pending'; // Or whatever initial state is
            }
            alert('Contract progress updated!');
            loadContracts(); // Refresh the contracts list
        } else {
            alert('Invalid progress percentage. Please enter a number between 0 and 100.');
        }
    } else {
        alert('Contract not found.');
    }
}


function releasePayment(contractId) {
    const contract = contracts.find(c => c.id === contractId);
    if (contract && contract.status === 'completed') {
        if (confirm(`Are you sure you want to release payment of $${contract.budget} for "${contract.jobTitle}"?`)) {
            // In a real system, this would trigger a payment processing logic
            alert(`Payment of $${contract.budget} released for "${contract.jobTitle}" to ${contract.freelancer}!`);
            // Optionally, mark the contract as paid or remove it from active contracts
            contracts = contracts.filter(c => c.id !== contractId);
            loadContracts();
            // Update total spent in stats (this is not implemented in sample data, but would be here)
        }
    } else {
        alert('Payment can only be released for completed contracts.');
    }
}


// Initial load
document.addEventListener('DOMContentLoaded', () => {
    // Automatically load the 'post-job' tab on page load
    showTab({ target: document.querySelector('.tab-btn.active') }, 'post-job'); 
});