// ---------------------------
// Full JS: Particles + Dynamic Chart.js initialization
// Replace your old chart JS with this file.
// ---------------------------

// Particle System (keeps your existing behavior)

function createParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;
  const particleCount = 30;
  // clear existing particles if any (safe re-init)
  particlesContainer.innerHTML = "";
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 3 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 2 + "s";
    particle.style.animationDuration = Math.random() * 3 + 2 + "s";
    particlesContainer?.appendChild(particle);
  }
}

// ---------------------------
// Dynamic Chart Initialization (fetch data from Django endpoint)
// ---------------------------

function initializeCharts() {
  const chartDataElement = document.getElementById("chart-data");
  if (!chartDataElement || !chartDataElement.textContent) {
    console.error("Chart data element not found or is empty.");
    // Initialize with fallback data if element is missing
    buildBpChart(fallback.bp);
    buildWeightChart(fallback.weight);
    buildSugarChart(fallback.sugar);
    return;
  }

  const chartData = JSON.parse(chartDataElement.textContent);
  console.log(chartData);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 11 },
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(15, 23, 42, 0.05)", drawBorder: false },
        ticks: { color: "#64748b", font: { size: 11, weight: "500" } },
      },
      y: {
        grid: { color: "rgba(15, 23, 42, 0.05)", drawBorder: false },
        ticks: { color: "#64748b", font: { size: 11, weight: "500" } },
      },
    },
    elements: {
      point: { radius: 4, hoverRadius: 6, borderWidth: 2, hoverBorderWidth: 3 },
      line: { borderWidth: 3, tension: 0.3 },
    },
    interaction: { intersect: false, mode: "index" },
  };

  // Chart instances
  let bpChart = null;
  let weightChart = null;
  let sugarChart = null;

  // Fallback static data (your original samples)
  const fallback = {
    bp: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      systolic: [120, 125, 118, 122, 128, 121],
      diastolic: [80, 82, 78, 81, 85, 80],
    },
    weight: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [70, 70.5, 71, 70.8, 71.2, 71.5],
    },
    sugar: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
      values: [95, 98, 102, 105, 108, 106, 104, 106],
    },
  };

  // Build BP chart
  function buildBpChart(data) {
    const el = document.getElementById("bloodPressureChart");
    if (!el) return;
    const ctx = el.getContext("2d");
    const cfg = {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Systolic",
            data: data.systolic,
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            pointBackgroundColor: "#ef4444",
            pointBorderColor: "#ffffff",
            fill: true,
          },
          {
            label: "Diastolic",
            data: data.diastolic,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#ffffff",
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            beginAtZero: false,
            min: 60,
            max: 140,
            ticks: {
              ...commonOptions.scales.y.ticks,
              callback: function (value) {
                return value + " mmHg";
              },
            },
          },
        },
      },
    };

    if (bpChart) {
      try { bpChart.destroy(); } catch (e) { /* ignore */ }
      bpChart = null;
    }
    bpChart = new Chart(ctx, cfg);
  }

  // Build Weight chart
  function buildWeightChart(data) {
    const el = document.getElementById("weightTrendChart");
    if (!el) return;
    const ctx = el.getContext("2d");

    // compute sensible y min/max if numeric values exist
    let minVal = Math.min(...(data.values.filter(v => typeof v === "number")));
    let maxVal = Math.max(...(data.values.filter(v => typeof v === "number")));
    if (!isFinite(minVal)) { minVal = undefined; }
    if (!isFinite(maxVal)) { maxVal = undefined; }

    const cfg = {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: data.values,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#ffffff",
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            beginAtZero: false,
            min: typeof minVal === "number" ? Math.floor(minVal - 2) : undefined,
            max: typeof maxVal === "number" ? Math.ceil(maxVal + 2) : undefined,
            ticks: {
              ...commonOptions.scales.y.ticks,
              callback: function (value) {
                return value + " kg";
              },
            },
          },
        },
      },
    };

    if (weightChart) {
      try { weightChart.destroy(); } catch (e) {}
      weightChart = null;
    }
    weightChart = new Chart(ctx, cfg);
  }

  // Build Blood Sugar chart
  function buildSugarChart(data) {
    const el = document.getElementById("bloodSugarChart");
    if (!el) return;
    const ctx = el.getContext("2d");

    let minVal = Math.min(...(data.values.filter(v => typeof v === "number")));
    let maxVal = Math.max(...(data.values.filter(v => typeof v === "number")));
    if (!isFinite(minVal)) { minVal = undefined; }
    if (!isFinite(maxVal)) { maxVal = undefined; }

    const cfg = {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Blood Sugar (mg/dl)",
            data: data.values,
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.15)",
            pointBackgroundColor: "#f59e0b",
            pointBorderColor: "#ffffff",
            fill: true,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            beginAtZero: false,
            min: typeof minVal === "number" ? Math.floor(minVal - 5) : undefined,
            max: typeof maxVal === "number" ? Math.ceil(maxVal + 5) : undefined,
            ticks: {
              ...commonOptions.scales.y.ticks,
              callback: function (value) {
                return value + " mg/dl";
              },
            },
          },
        },
      },
    };

    if (sugarChart) {
      try { sugarChart.destroy(); } catch (e) {}
      sugarChart = null;
    }
    sugarChart = new Chart(ctx, cfg);
  }

  // Use the data from Django to build the charts
  function buildChartsFromData() {
    const bpData = {
      labels: chartData.systolic.labels,
      systolic: chartData.systolic.data,
      diastolic: chartData.diastolic.data,
    };

    const weightData = {
      labels: chartData.weight.labels,
      values: chartData.weight.data,
    };

    const sugarData = {
      labels: chartData.glucose.labels,
      values: chartData.glucose.data,
    };

    buildBpChart(bpData);
    buildWeightChart(weightData);
    buildSugarChart(sugarData);
  }

  // Initial render
  buildChartsFromData();
}

// ---------------------------
// Initialize everything on DOM ready
// ---------------------------
document.addEventListener("DOMContentLoaded", function () {
  createParticles();
  initializeCharts();
});