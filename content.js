console.log("Content script running");

let startTime = Date.now();
let greenShown = false;
let redShown = false;

setInterval(() => {

    let minutes = Math.floor((Date.now() - startTime) / 60000);
    console.log("Minutes:", minutes);

    if (minutes >= 1 && !greenShown) {
        showGreenBox(minutes);
        greenShown = true;
    }

    if (minutes >= 2 && !redShown) {
        showRedOverlay(minutes);
        redShown = true;
    }

}, 60000);


function showGreenBox(minutes) {
    let box = document.createElement("div");
    box.innerText = `You've worked ${minutes} minute.\nStay hydrated 💧`;
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
}


function showRedOverlay(minutes) {
    let overlay = document.createElement("div");
    overlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,0,0,0.9);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        font-size: 22px;
        text-align: center;
    `;

    overlay.innerHTML = `
        <h2>⚠ High Risk Detected</h2>
        <p>You’ve worked ${minutes} minutes continuously.</p>
        <p>Take a break.</p>
        <button id="emergencyBtn">Emergency Continue</button>
    `;

    document.body.appendChild(overlay);

    document.getElementById("emergencyBtn").onclick = () => {
        overlay.remove();
    };
}
