document.getElementById("year").textContent = new Date().getFullYear();

// Enhanced Particle System
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 35;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random size and position
    const size = Math.random() * 4 + 2;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    // Random animation delay and duration
    particle.style.animationDelay = Math.random() * 5 + "s";
    particle.style.animationDuration = Math.random() * 5 + 4 + "s";

    particlesContainer.appendChild(particle);
  }
}

// Enhanced Magnetic Effect
function addMagneticEffect() {
  const magneticElements = document.querySelectorAll(".magnetic");

  magneticElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 150;

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        const moveX = x * strength * 0.15;
        const moveY = y * strength * 0.15;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate(0, 0)";
    });
  });
}

// Form Enhancement with Better Focus States
function enhanceForm() {
  const inputs = document.querySelectorAll(
    'input[type="email"], input[type="password"]'
  );

  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
      input.style.transform = "translateY(-2px)";
    });

    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("focused");
      input.style.transform = "translateY(0)";
    });
  });
}

// Initialize effects
createParticles();
addMagneticEffect();
enhanceForm();

// Enhanced sparkle effect on click
document.addEventListener("click", (e) => {
  const sparkle = document.createElement("div");
  sparkle.className = "particle";
  sparkle.style.position = "fixed";
  sparkle.style.left = e.clientX + "px";
  sparkle.style.top = e.clientY + "px";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "9999";
  sparkle.style.animation = "sparkle 1s ease-out forwards";
  sparkle.style.background =
    "radial-gradient(circle, rgba(50, 205, 50, 1) 0%, transparent 70%)";
  sparkle.style.width = "8px";
  sparkle.style.height = "8px";

  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 1000);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});