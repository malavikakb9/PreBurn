console.log("Content script running");

// ---------- CONFIG ----------
const DEMO_MODE = true;                          // Toggle demo/real mode
const INTERVAL_MS = DEMO_MODE ? 10000 : 60000;   // 10s demo, 1min real
const MAX_CONTINUOUS_SCORE = DEMO_MODE ? 60 : 40; // Max points for continuous usage
const DEMO_MAX_MINUTES = 10;                      // Cap “demo minutes” for formula

// ---------- STATE ----------
let startTime;
let emergencyUsed = false;
let selfRating = 5;

let greenShown = false;
let redShown = false;
let twentyShown = false;
let ratingAsked = false;

// ---------- RESTORE STATE ----------
chrome.storage.local.get(
    ["emergencyUsed", "selfRating", "startTime"],
    (data) => {

        // --- Demo mode: always start fresh at 0 ---
        startTime = DEMO_MODE ? Date.now() : (data.startTime || Date.now());

        emergencyUsed = data.emergencyUsed || false;
        selfRating = data.selfRating || 5;

        // Only save startTime for real mode
        if (!DEMO_MODE) {
            chrome.storage.local.set({ startTime });
        }

        startBurnoutTracking();
    }
);

// ---------- BURNOUT CALCULATION ----------
function calculateBurnoutScore(minutes, selfRating, emergencyUsed) {
    // 1️⃣ Continuous Usage - exponential for smooth demo
    const continuousScore = MAX_CONTINUOUS_SCORE * (1 - Math.exp(-minutes / 5));

    // 2️⃣ Late Night
    const hour = new Date().getHours();
    const lateNightScore = (hour >= 0 && hour < 5) ? 20 : 0;

    // 3️⃣ Self Rating
    const inverted = 6 - (selfRating || 5);
    const selfScore = inverted / 5 * 25;

    // 4️⃣ Emergency Penalty
    const emergencyScore = emergencyUsed ? 10 : 0;

    const total = continuousScore + lateNightScore + selfScore + emergencyScore;

    return Math.round(Math.min(total, 100));
}

// ---------- MAIN TRACKER ----------
function startBurnoutTracking() {
    setInterval(() => {

        // --- Controlled demo “minutes” ---
        let minutes;
        if (DEMO_MODE) {
            const elapsedDemoSeconds = (Date.now() - startTime) / 1000; // seconds since start
            minutes = Math.min(elapsedDemoSeconds / 5, DEMO_MAX_MINUTES); // 5s = 1 demo minute, cap
        } else {
            minutes = (Date.now() - startTime) / 60000; // real minutes
        }

        let burnoutScore = calculateBurnoutScore(minutes, selfRating, emergencyUsed);

        console.log("Minutes:", minutes.toFixed(1));
        console.log("Burnout Score:", burnoutScore);

        chrome.storage.local.set({
            burnoutScore,
            totalMinutes: minutes
        });

        // --- Alerts ---
        if (burnoutScore >= 50 && burnoutScore < 63 && !greenShown) {
            showGreenBox(minutes);
            greenShown = true;
        }

        if (burnoutScore >= 63 && burnoutScore < 72 && !twentyShown) {
            showTwentyRule();
            twentyShown = true;
        }

        if (burnoutScore >= 72 && !ratingAsked) {
            showSelfCheck();
            ratingAsked = true;
        }

        if (burnoutScore >= 75 && !redShown) {
            showRedOverlay(minutes);
            redShown = true;
        }

    }, INTERVAL_MS);
}

// ---------- GREEN BOX ----------
function showGreenBox(minutes) {
    let box = document.createElement("div");
    box.innerText = `You've worked ${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? "minute" : "minutes"}.\nStay hydrated 💧`;
    box.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 9999;
    `;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 10000);
}

// ---------- RED OVERLAY ----------
function showRedOverlay(minutes) {
    if (document.getElementById("burnoutOverlay")) return;

    let overlay = document.createElement("div");
    overlay.id = "burnoutOverlay";

    overlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,0,0,0.95);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        font-size: 24px;
        text-align: center;
    `;

    overlay.innerHTML = `
        <h2>⚠ High Risk Detected</h2>
        <p>You’ve worked ${Math.floor(minutes)} minutes continuously.</p>
        <p>Take a break.</p>
        <button id="emergencyBtn" disabled>
            Emergency Continue (5)
        </button>
    `;

    document.body.appendChild(overlay);

    let btn = document.getElementById("emergencyBtn");
    let countdown = 5;

    let interval = setInterval(() => {
        countdown--;
        btn.innerText = `Emergency Continue (${countdown})`;
        if (countdown === 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.innerText = "Emergency Continue";
        }
    }, 1000);

    btn.onclick = () => {
        emergencyUsed = true;
        chrome.storage.local.set({ emergencyUsed: true });
        overlay.remove();
    };
}

// ---------- 20-20-20 RULE ----------
function showTwentyRule() {
    let box = document.createElement("div");
    box.innerHTML = `
        <div style="font-size:18px;margin-bottom:8px;">
            👀 Eye Strain Alert
        </div>
        <div>Look at something 20 feet away for 20 seconds.</div>
    `;
    box.style = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #FFC107;
        color: black;
        padding: 20px;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 12000);
}

// ---------- SELF CHECK ----------
function showSelfCheck() {
    let box = document.createElement("div");
    box.innerHTML = `
        <div style="margin-bottom:10px;font-size:18px;">
            Quick check-in: How are you feeling?
        </div>
        <div style="font-size:28px; cursor:pointer;">
            <span data-val="1">😄</span>
            <span data-val="2">🙂</span>
            <span data-val="3">😐</span>
            <span data-val="4">😫</span>
            <span data-val="5">😵</span>
        </div>
    `;
    box.style = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: black;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        z-index: 99999;
        text-align: center;
    `;
    document.body.appendChild(box);

    box.querySelectorAll("span").forEach(span => {
        span.onclick = () => {
            selfRating = parseInt(span.getAttribute("data-val"));
            chrome.storage.local.set({ selfRating });
            box.innerHTML = "Thanks for checking in 💙";
            setTimeout(() => box.remove(), 1500);
        };
    });
}
