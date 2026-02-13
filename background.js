console.log("Background script started");

function createAlarm() {
    chrome.alarms.create("usageCheck", {
        periodInMinutes: 1
    });
    console.log("Alarm created");
}

chrome.runtime.onInstalled.addListener(createAlarm);
chrome.runtime.onStartup.addListener(createAlarm);

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm triggered:", alarm.name);
});
