const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
let currentCity = 'Banda Aceh, ID';
let lastKnownTemp = 0;
let secondsSinceUpdate = 0;

// Chart Config
const ctx = document.getElementById('liveChart').getContext('2d');
const liveChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: '#06b6d4',
            borderWidth: 3,
            fill: true,
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            pointRadius: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { display: false } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    }
});

// Navigasi Section
function showSection(sectionId, element) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    element.classList.add('active');
}

// Pilih Kota
function selectCity(cityName) {
    currentCity = cityName + ", Aceh, ID";
    updateWeatherData();
    showSection('beranda', document.getElementById('btn-beranda'));
}

// Ambil Data API
async function updateWeatherData() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&units=metric&appid=${API_KEY}&lang=id`);
        const data = await res.json();
        if(data.cod === 200) {
            lastKnownTemp = data.main.temp;
            secondsSinceUpdate = 0; // Reset counter 1 detik
            document.getElementById('humVal').innerText = `${data.main.humidity}%`;
            document.getElementById('locationName').innerText = data.name;
            document.getElementById('weatherDesc').innerText = data.weather[0].description;
            
            const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            if(liveChart.data.labels.length > 10) { 
                liveChart.data.labels.shift(); 
                liveChart.data.datasets[0].data.shift(); 
            }
            liveChart.data.labels.push(time);
            liveChart.data.datasets[0].data.push(lastKnownTemp);
            liveChart.update();
        }
    } catch (e) { console.error("API Error"); }
}

// Update Real-Time Per Detik
setInterval(() => {
    // 1. Jam Digital
    document.getElementById('clock').innerText = new Date().toLocaleTimeString('id-ID');
    
    // 2. Counter Update API
    secondsSinceUpdate++;
    document.getElementById('last-sync').innerText = `${secondsSinceUpdate}s ago`;

    // 3. Efek Angka Berjalan (Desimal)
    if (lastKnownTemp !== 0) {
        const fluc = (Math.random() * 0.1 - 0.05).toFixed(2);
        document.getElementById('tempVal').innerText = `${(parseFloat(lastKnownTemp) + parseFloat(fluc)).toFixed(1)}°C`;
    }
}, 1000);

// Search Event
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') { selectCity(e.target.value); e.target.value = ""; }
});

updateWeatherData();
setInterval(updateWeatherData, 30000); // Sync data asli tiap 30 detik