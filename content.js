console.log("Content script running");

let startTime = Date.now();
let greenShown = false;
let redShown = false;
let emergencyUsed = false;
let selfRating = 5;  // default neutral
let twentyShown = false;
let ratingAsked = false;


function calculateBurnoutScore(minutes, selfRating, emergencyUsed) {

    // 1️⃣ Continuous Usage (Max 40)
    const continuousScore = Math.min(minutes, 5) / 5 * 60;


    // 2️⃣ Late Night (Max 20)
    const hour = new Date().getHours();
    const lateNightScore = (hour >= 0 && hour < 5) ? 20 : 0;

    // 3️⃣ Self Rating (Max 30)
    const inverted = 6 - (selfRating || 5); 
    const selfScore = inverted / 5 * 30;

    // 4️⃣ Emergency Penalty (Max 10)
    const emergencyScore = emergencyUsed ? 10 : 0;

    const total = continuousScore + lateNightScore + selfScore + emergencyScore;

    return Math.round(Math.min(total, 100));
}


setInterval(() => {
    let minutes = 8;   // FORCE TEST

    let minutes = Math.floor((Date.now() - startTime) / 60000);
    console.log("Minutes:", minutes);

    let burnoutScore = calculateBurnoutScore(minutes, selfRating, emergencyUsed);

    chrome.storage.local.set({
        burnoutScore: burnoutScore,
        totalMinutes: minutes
    });

    console.log("Burnout Score:", burnoutScore);

    // Green
    // Mild Risk (Hydration)
if (burnoutScore >= 35 && burnoutScore < 40 && !greenShown) {
    showGreenBox(minutes);
    greenShown = true;
}

// Moderate Risk (Eye Alert)
if (burnoutScore >= 40 && burnoutScore < 75 && !twentyShown) {
    console.log(burnoutScore);
    showTwentyRule();
    twentyShown = true;
}
if (burnoutScore >= 40 && !ratingAsked) {console.log(burnoutScore);
    showSelfCheck();
    ratingAsked = true;
}
// High Risk (Red)
if (burnoutScore >= 75 && !redShown) {
    console.log(burnoutScore);
    showRedOverlay(minutes);
    redShown = true;
}


}, 60);   // ← THIS must close setInterval

function showGreenBox(minutes) {

    let box = document.createElement("div");

    box.innerText = `You've worked ${minutes} ${minutes === 1 ? "minute" : "minutes"}.\nStay hydrated 💧`;

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

    // Remove after 10 seconds
    setTimeout(() => {
        box.remove();
    }, 10000);
}


function showRedOverlay(minutes) {

    // Add pulse animation
    let style = document.createElement("style");
    style.innerHTML = `
    @keyframes pulse {
        0% { background-color: rgba(255,0,0,0.95); }
        50% { background-color: rgba(200,0,0,1); }
        100% { background-color: rgba(255,0,0,0.95); }
    }`;
    document.head.appendChild(style);

    let overlay = document.createElement("div");

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
        animation: pulse 1s infinite;
    `;

    overlay.innerHTML = `
        <h2>⚠ High Risk Detected</h2>
        <p>You’ve worked ${minutes} minutes continuously.</p>
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
        overlay.remove();
    };
}

function showTwentyRule() {
console.log("show 20 rule");
    let box = document.createElement("div");

    box.innerHTML = `
        <div style="font-size:18px;margin-bottom:8px;">👀 Eye Strain Alert</div>
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
        transition: opacity 0.5s ease;
        opacity: 0;
    `;

    document.body.appendChild(box);

    setTimeout(() => {
        box.style.opacity = "1";
    }, 50);

    // Remove after 12 seconds
    setTimeout(() => {
        box.remove();
    }, 12000);
}
function showSelfCheck() {
console.log("self check");
    let box = document.createElement("div");

    box.innerHTML = `
        <div style="margin-bottom:10px;font-size:18px;">
            Hey — quick check in. How are you feeling?
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
            chrome.storage.local.set({ selfRating: selfRating });

            box.innerHTML = "Thanks for checking in 💙";

            setTimeout(() => {
                box.remove();
            }, 1500);
        };
    });
}