const canvas = document.getElementById("corazon");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- Variables ---
let particles = [];
let stars = [];
let angle = 0;
let colorIndex = 0;
let lastColorChange = Date.now();
const colors = ["red", "green", "pink", "orange"];

// --- Crear partículas del corazón ---
function createHeartParticles() {
    particles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 50; // más abajo
    const numParticles = 5000;

    for (let i = 0; i < numParticles; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = Math.random();
        const x = 16 * Math.pow(Math.sin(t), 3) * r;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;

        particles.push({
            x: centerX + x * 20,
            y: centerY + y * 20
        });
    }
}

// --- Crear estrellas de fondo ---
function createStars() {
    stars = [];
    for (let i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2,
            alpha: Math.random(),
            speed: Math.random() * 0.02
        });
    }
}

// --- Dibujar fondo espacial con nebulosa ---
function drawBackground() {
    // Fondo negro
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nebulosa difusa
    const grad = ctx.createRadialGradient(
        canvas.width * 0.6, canvas.height * 0.4, 50,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
    );
    grad.addColorStop(0, "rgba(180,100,255,0.3)");
    grad.addColorStop(0.3, "rgba(138,43,226,0.25)");
    grad.addColorStop(0.6, "rgba(25,25,112,0.2)");
    grad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar estrellas
    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed *= -1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
    });
}

// --- Dibujar corazón de partículas ---
function drawHeart() {
    // Cambio de color cada 3 segundos
    if (Date.now() - lastColorChange > 3000) {
        colorIndex = (colorIndex + 1) % colors.length;
        lastColorChange = Date.now();
    }
    const color = colors[colorIndex];

    angle += 0.004;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 50;

    particles.forEach(p => {
        let x = p.x - centerX;
        let y = p.y - centerY;
        let rx = x * Math.cos(angle) - y * Math.sin(angle);
        let ry = x * Math.sin(angle) + y * Math.cos(angle);

        ctx.beginPath();
        ctx.arc(centerX + rx, centerY + ry, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
    });
}

// --- Mostrar varios "Liseth ❤️" al mismo tiempo ---
function showLiseth() {
    const posiciones = [
        {top: "10%", left: "10%"},
        {top: "10%", right: "10%"},
        {bottom: "15%", left: "10%"},
        {bottom: "15%", right: "10%"},
        {top: "10%", left: "50%", transform: "translateX(-50%)"}
    ];

    posiciones.forEach(pos => {
        const nombreDiv = document.createElement("div");
        nombreDiv.style.position = "absolute";
        for (let key in pos) {
            nombreDiv.style[key] = pos[key];
        }
        nombreDiv.style.fontSize = "48px";
        nombreDiv.style.fontWeight = "bold";
        nombreDiv.style.color = "white";
        nombreDiv.style.display = "flex";
        nombreDiv.style.alignItems = "center";
        nombreDiv.style.gap = "15px";
        nombreDiv.style.opacity = "0";
        nombreDiv.style.transition = "opacity 1s ease-in-out";
        nombreDiv.innerHTML = `<span>Liseth</span><span style="animation: palpitar 1s infinite;">❤️</span>`;

        document.body.appendChild(nombreDiv);

        // Aparecer todos al mismo tiempo
        setTimeout(() => { nombreDiv.style.opacity = "1"; }, 100);
        // Desaparecer
        setTimeout(() => { nombreDiv.style.opacity = "0"; }, 5000);
        // Borrar
        setTimeout(() => { document.body.removeChild(nombreDiv); }, 6000);
    });
}

// --- Loop principal ---
function animate() {
    drawBackground();
    drawHeart();
    requestAnimationFrame(animate);
}

// --- Inicialización ---
createHeartParticles();
createStars();
animate();

// --- Mostrar nombres repetidamente ---
setInterval(showLiseth, 7000);

// --- CSS para el corazón palpitando ---
const style = document.createElement("style");
style.innerHTML = `
@keyframes palpitar {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.3); }
  100% { transform: scale(1); }
}`;
document.head.appendChild(style);

// --- Ajuste al redimensionar ---
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createHeartParticles();
    createStars();
});
