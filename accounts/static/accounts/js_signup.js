
      document.getElementById('year').textContent = new Date().getFullYear();

      // Particle System
      function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';

          // Random size and position
          const size = Math.random() * 4 + 2;
          particle.style.width = size + 'px';
          particle.style.height = size + 'px';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';

          // Random animation delay
          particle.style.animationDelay = Math.random() * 2 + 's';
          particle.style.animationDuration = Math.random() * 3 + 2 + 's';

          particlesContainer.appendChild(particle);
        }
      }

      // Magnetic Effect
      function addMagneticEffect() {
        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach((element) => {
          element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;

            if (distance < maxDistance) {
              const strength = (maxDistance - distance) / maxDistance;
              const moveX = x * strength * 0.3;
              const moveY = y * strength * 0.3;

              element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
          });

          element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
          });
        });
      }

      // Password Toggle Function
      function togglePassword(fieldId) {
        const field = document.getElementById(fieldId);
        const icon = document.getElementById(fieldId + 'Icon');
        
        if (field.type === 'password') {
          field.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          field.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }

      // Password Strength Checker
      function checkPasswordStrength(password) {
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) strength++;
        else feedback.push('at least 8 characters');

        if (/[a-z]/.test(password)) strength++;
        else feedback.push('lowercase letter');

        if (/[A-Z]/.test(password)) strength++;
        else feedback.push('uppercase letter');

        if (/[0-9]/.test(password)) strength++;
        else feedback.push('number');

        if (/[^A-Za-z0-9]/.test(password)) strength++;
        else feedback.push('special character');

        return { strength, feedback };
      }

      // Password Strength Indicator
      document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const strengthIndicator = document.getElementById('passwordStrength');
        const strengthText = document.getElementById('passwordStrengthText');
        
        const { strength, feedback } = checkPasswordStrength(password);
        
        strengthIndicator.className = 'password-strength rounded-full';
        
        if (password.length === 0) {
          strengthIndicator.style.width = '0%';
          strengthText.textContent = '';
        } else if (strength <= 2) {
          strengthIndicator.classList.add('strength-weak');
          strengthText.textContent = 'Weak password. Add: ' + feedback.slice(0, 2).join(', ');
          strengthText.className = 'text-xs text-red-500 mt-1';
        } else if (strength === 3) {
          strengthIndicator.classList.add('strength-fair');
          strengthText.textContent = 'Fair password. Add: ' + feedback.slice(0, 1).join(', ');
          strengthText.className = 'text-xs text-yellow-500 mt-1';
        } else if (strength === 4) {
          strengthIndicator.classList.add('strength-good');
          strengthText.textContent = 'Good password!';
          strengthText.className = 'text-xs text-blue-500 mt-1';
        } else {
          strengthIndicator.classList.add('strength-strong');
          strengthText.textContent = 'Strong password!';
          strengthText.className = 'text-xs text-green-500 mt-1';
        }
      });

      // Password Match Checker
      document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;
        const matchIndicator = document.getElementById('passwordMatch');
        
        if (confirmPassword.length === 0) {
          matchIndicator.textContent = '';
          matchIndicator.className = 'text-xs mt-1';
        } else if (password === confirmPassword) {
          matchIndicator.textContent = '✓ Passwords match';
          matchIndicator.className = 'text-xs text-green-500 mt-1';
        } else {
          matchIndicator.textContent = '✗ Passwords do not match';
          matchIndicator.className = 'text-xs text-red-500 mt-1';
        }
      });

      // Form Validation
      document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        
        if (!terms) {
          alert('Please accept the Terms of Service and Privacy Policy.');
          return;
        }
        
        const { strength } = checkPasswordStrength(password);
        if (strength < 3) {
          alert('Please choose a stronger password.');
          return;
        }
        
        // If all validations pass, show success message
        alert('Account created successfully! Welcome to Preventra!');
        // Here you would typically send the data to your server
      });

      // Initialize effects
      createParticles();
      addMagneticEffect();

      // Add sparkle effect on click
      document.addEventListener('click', (e) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'particle';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = 'sparkle 0.6s ease-out forwards';

        document.body.appendChild(sparkle);

        setTimeout(() => {
          sparkle.remove();
        }, 600);
      });