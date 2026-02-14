console.log("Content script running");

// ---------- CONFIG ----------
const DEMO_MODE = true;                          // Toggle demo/real mode
const INTERVAL_MS = DEMO_MODE ? 10000 : 60000;   // 10s demo, 1min real
const MAX_CONTINUOUS_SCORE = DEMO_MODE ? 60 : 40; // Max points for continuous usage
const DEMO_MAX_MINUTES = 20;                      // Cap “demo minutes” for formula

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
        startTime = DEMO_MODE ? Date.now() : (data.startTime || Date.now());
        emergencyUsed = data.emergencyUsed || false;
        selfRating = data.selfRating || 5;

        if (!DEMO_MODE) chrome.storage.local.set({ startTime });

        startBurnoutTracking();
    }
);

// ---------- BURNOUT CALCULATION ----------
function calculateBurnoutScore(minutes, selfRating, emergencyUsed) {
    const continuousScore = MAX_CONTINUOUS_SCORE * (1 - Math.exp(-minutes / 5));
    const hour = new Date().getHours();
    const lateNightScore = (hour >= 0 && hour < 5) ? 20 : 0;
    const inverted = 6 - (selfRating || 5);
    const selfScore = inverted / 5 * 25;
    const emergencyScore = emergencyUsed ? 10 : 0;
    const total = continuousScore + lateNightScore + selfScore + emergencyScore;
    return Math.round(Math.min(total, 100));
}

// ---------- MAIN TRACKER ----------
function startBurnoutTracking() {
    setInterval(() => {
        let minutes;
        if (DEMO_MODE) {
            const elapsedDemoSeconds = (Date.now() - startTime) / 2000;
            minutes = Math.min(elapsedDemoSeconds / 5, DEMO_MAX_MINUTES);
        } else {
            minutes = (Date.now() - startTime) / 60000;
        }

        let burnoutScore = calculateBurnoutScore(minutes, selfRating, emergencyUsed);

        console.log("Minutes:", minutes.toFixed(1));
        console.log("Burnout Score:", burnoutScore);

        chrome.storage.local.set({
            burnoutScore,
            totalMinutes: minutes
        });

        if (burnoutScore >= 53 && burnoutScore < 65 && !greenShown) {
            showGreenBox(minutes);
            greenShown = true;
        }

        if (burnoutScore >= 65 && burnoutScore < 72 && !twentyShown) {
            showTwentyRule();
            twentyShown = true;
        }

        if (burnoutScore >= 72 && !ratingAsked) {
            showSelfCheck();
            ratingAsked = true;
        }

        if (burnoutScore >= 90 && !redShown) {
            showRedOverlay(minutes);
            redShown = true;
        }

    }, INTERVAL_MS);
}

// ---------- GREEN BOX ----------
function showGreenBox(minutes) {
    let box = document.createElement("div");
    box.innerText = `🌿 Focus Mode Active!
You've worked ${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? "minute" : "minutes"}.
Hydrate & stretch for max energy 💧✨`;
    box.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        text-align: center;
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
        opacity: 0;
        transition: opacity 0.5s ease;
        font-family: Arial, sans-serif;
    `;

    overlay.innerHTML = `
        <h2>⚠ Time to Pause!</h2>
        <p>You've been working ${Math.floor(minutes)} minutes straight! 🧠💨</p>
        <p>Take a short break — stretch, sip water, or breathe deeply. Recharge to stay sharp! 💪✨</p>
        <button id="emergencyBtn" disabled>
            Continue Carefully (5)
        </button>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => overlay.style.opacity = "1", 50);

    let btn = document.getElementById("emergencyBtn");
    let countdown = 5;

    let interval = setInterval(() => {
        countdown--;
        btn.innerText = `Continue Carefully (${countdown})`;
        if (countdown <= 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.innerText = "Continue Carefully";
            btn.style.transition = "transform 0.2s ease";
            btn.onmouseover = () => btn.style.transform = "scale(1.05)";
            btn.onmouseout = () => btn.style.transform = "scale(1)";
        }
    }, 1000);

    btn.onclick = () => {
        emergencyUsed = true;
        chrome.storage.local.set({ emergencyUsed: true });
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 500);
    };
}

// ---------- 20-20-20 RULE ----------
function showTwentyRule() {
    let box = document.createElement("div");
    box.innerHTML = `
        <div style="font-size:18px;margin-bottom:8px;">👀 Eye Recharge Alert!</div>
        <div style="font-size:16px;">Look at something ~20 feet away for 20 seconds. Your eyes deserve a mini-vacation! 🌳✨</div>
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
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.3s ease;
        font-family: Arial, sans-serif;
        text-align: center;
    `;
    document.body.appendChild(box);

    setTimeout(() => {
        box.style.opacity = "1";
        box.style.transform = "translateY(0)";
    }, 50);

    setTimeout(() => {
        box.style.opacity = "0";
        box.style.transform = "translateY(20px)";
    }, 11000);

    setTimeout(() => box.remove(), 12000);
}

// ---------- SELF CHECK ----------
function showSelfCheck() {
    let box = document.createElement("div");
    box.style = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: white;
        color: black;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 99999;
        text-align: center;
        opacity: 0;
        transition: opacity 0.5s ease, transform 0.3s ease;
        font-family: Arial, sans-serif;
    `;
    box.innerHTML = `
        <div style="margin-bottom:10px;font-size:18px;">💬 How are you feeling right now?</div>
        <div style="font-size:28px; cursor:pointer;">
            <span data-val="5">😄 Fantastic</span>
            <span data-val="4">🙂 Good</span>
            <span data-val="3">😐 Okay</span>
            <span data-val="2">😫 Tired</span>
            <span data-val="1">😵 Exhausted</span>
        </div>
        <div style="margin-top:8px;font-size:14px;color:#555;">Your well-being matters 💙</div>
    `;
    document.body.appendChild(box);

    setTimeout(() => {
        box.style.opacity = "1";
        box.style.transform = "translateX(-50%) translateY(0)";
    }, 50);

    box.querySelectorAll("span").forEach(span => {
        span.style.transition = "transform 0.2s ease";
        span.onmouseover = () => span.style.transform = "scale(1.2)";
        span.onmouseout = () => span.style.transform = "scale(1)";

        span.onclick = () => {
            selfRating = parseInt(span.getAttribute("data-val"));
            chrome.storage.local.set({ selfRating });

            span.style.transform = "scale(1.3)";
            setTimeout(() => span.style.transform = "scale(1)", 200);

            box.innerHTML = "Thanks for checking in 💙";

            setTimeout(() => {
                box.style.opacity = "0";
                box.style.transform = "translateX(-50%) translateY(20px)";
            }, 1000);
            setTimeout(() => box.remove(), 1200);
        };
    });
}
