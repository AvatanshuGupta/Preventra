// Health Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('healthForm');
    const submitBtn = document.querySelector('.submit-btn');

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        form.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Collect form data
        const formData = new FormData(form);
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset loading state
            form.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Health Information';
            
            // Show success message
            showMessage('Health information submitted successfully!', 'success');
            
            // Reset form
            form.reset();
            
        }, 2000);
    });

    // Show message function
    function showMessage(text, type) {
        const message = document.createElement('div');
       message.className = `message ${type}`;
      message.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${text}`;

        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 4000);
    }

    // Enhanced checkbox interactions
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    checkboxLabels.forEach(label => {
        label.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input[type="checkbox"]');
            }
        });
    });

    // Form validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
    });

    function validateField(e) {
        const field = e.target;
        const isValid = field.checkValidity();
        
        if (!isValid) {
            field.style.borderColor = '#e74c3c';
        } else {
            field.style.borderColor = '#27ae60';
        }
    }

    // Smooth animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe form groups for animation
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
       group.style.transition = `all 0.6s ease ${index * 0.1}s`;

        observer.observe(group);
    });
});