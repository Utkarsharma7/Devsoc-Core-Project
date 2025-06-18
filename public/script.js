// Modal functionality
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchModal(currentModal, targetModal) {
    closeModal(currentModal);
    openModal(targetModal);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Here you would normally send data to your backend
        // Example API call structure using Axios:
        
        axios.post('/app/login', {
            email: email,
            password: password
        })
        .then(response => {
            if (response.data.success) { 
                // Redirect based on role
                if (response.data.role === 'client') 
                {
                    window.location.href='/app/dashboard/client'
                } 
                if(response.data.role === 'freelancer')
                {
                   window.location.href='/app/dashboard/freelancer'
                }
            
                else 
                {
                    alert('Unknown role!');
                }
            } else {
                alert('Login failed: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.response) {
                // Server responded with error status
                alert('Login failed: ' + error.response.data.message);
            } else if (error.request) {
                // Request was made but no response received
                alert('Network error. Please check your connection.');
            } else {
                // Something else happened
                alert('Login failed. Please try again.');
            }
        });
        
        
        console.log('Login attempt:', { email, password });
        alert('Login functionality will be connected to your backend!\nEmail: ' + email);
        closeModal('loginModal');
    });

    // Signup form handler
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const role = document.getElementById('userRole').value;
        
        // Basic validation
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Here you would normally send data to your backend
        // Example API call structure using Axios:
        
        axios.post('/app/signup', {
            name: name,
            email: email,
            password: password,
            role: role
        })
        .then(response => {
            if (response.data.success) {
                alert('Account created successfully! Please check your email for verification.');
                closeModal('signupModal');
                openModal('loginModal');
            } else {
                alert('Signup failed: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.response) {
                // Server responded with error status
                alert('Signup failed: ' + error.response.data.message);
            } else if (error.request) {
                // Request was made but no response received
                alert('Network error. Please check your connection.');
            } else {
                // Something else happened
                alert('Signup failed. Please try again.');
            }
        });
        
        
        console.log('Signup attempt:', { name, email, password, role });
        alert('Signup functionality will be connected to your backend!\nWelcome ' + name + '!\nRole: ' + role);
        closeModal('signupModal');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 32, 44, 0.98)';
    } else {
        header.style.background = 'rgba(26, 32, 44, 0.95)';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Observe feature cards and stat cards for scroll animations
    document.querySelectorAll('.feature-card, .stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Keyboard navigation for modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal');
        openModals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Add real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#e53e3e';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value && !validatePassword(this.value)) {
                this.style.borderColor = '#e53e3e';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
});

// Statistics counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (target >= 1000 ? 'K+' : target === 95 ? '%' : '');
    }, 20);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('10K+')) animateCounter(stat, 10);
                else if (text.includes('5K+')) animateCounter(stat, 5);
                else if (text.includes('95%')) animateCounter(stat, 95);
                else if (text.includes('24/7')) stat.textContent = '24/7';
            });
            statsObserver.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});