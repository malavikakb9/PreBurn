PreBurn

Basic Details
Team Name: Hackers zone
Team Members
Member 1: Malavika K B - Rajiv Gandhi Institute of Technology

Hosted Project Link


Project Description

A real-time burnout tracking tool that monitors continuous work, self-rating, and emergency usage, giving users visual reminders to take breaks. Includes “green”, “yellow”, and “red” alerts based on risk levels.

The Problem statement

Many individuals overwork or ignore physical strain during long coding sessions or work-from-home setups, leading to burnout and decreased productivity.

The Solution

We provide a web extension that monitors work time, shows visual alerts, prompts self-check-ins, and suggests preventive actions like the 20-20-20 eye exercise.

Technical Details
Technologies/Components Used

For Software:
Languages used: JavaScript, HTML, CSS
Frameworks used: None (vanilla JS)
Libraries used: Chrome Storage API
Tools used: VS Code, Chrome DevTools

For Hardware:
Not applicable

Features
List the key features of your project:
Real-time burnout scoring with continuous usage, self-rating, and emergency penalties
Visual alerts: green hydration reminder, yellow eye-strain 20-20-20 popup, red high-risk overlay
Self-check-in system to adjust risk assessment
Persistent user data using Chrome storage

Implementation
For Software:
Installation
# Load the extension in Chrome
1. Open Chrome > Extensions > Manage Extensions
2. Enable "Developer mode"
3. Click "Load unpacked" and select project folder

Run
# The extension runs automatically in browser tabs
Open a new tab to see burnout alerts

Project Documentation
For Software:

Screenshots

Real-time burnout tracking: Minutes worked vs. current burnout score
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/edfdb9b5-c0b6-4c4c-ae64-8b611aa3d6df" />

Green hydration alert popup
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/65ae08f1-68b5-4b74-a882-34d0f3abff86" />

Yellow 20-20-20 eye reminder popup
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6f79a278-39c1-4cdc-b464-d731627eada4" />

Self-rating popup
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/83fc9b2e-ef31-468a-a7a6-00407331b1ee" />

Red high-risk overlay
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1f8b8348-6ea7-4bea-ab73-a65b80c4a373" />


Diagrams

System Architecture:
The burnout tracker is a Chrome extension that monitors user activity and provides real-time alerts to prevent fatigue.
Core Components:
1.Content Script: Tracks time, calculates burnout score, and injects interactive alerts (hydration reminders, eye strain alerts, mood check-ins, and high-risk warnings).
2.Chrome Storage: Saves user data (startTime, selfRating, emergencyUsed) to maintain continuity across sessions.
3.Score Engine: Computes burnout score using continuous usage, late-night activity, self-rating, and emergency actions to trigger relevant alerts.
4.UI Layer: Dynamically displays styled popups and overlays with animations and interactive elements.
Extension monitors active time, calculates burnout score, triggers alerts, stores user data via Chrome Storage

Application Workflow:
Flow of events: Start → Continuous Monitoring → Score Calculation → Alerts → Self-Check → Emergency Override
<img width="1280" height="1104" alt="image" src="https://github.com/user-attachments/assets/54d1d686-5ad6-4075-9c4b-fa298a3d9380" />

Additional Documentation
For Web Projects with Backend : Not applicable (pure frontend Chrome extension)
For Scripts/CLI Tools : Not applicable

Project Demo
Video
https://drive.google.com/file/d/1WFM5EIP2ttA9i9RgW-2S3bLtH53-cSMb/view?usp=drive_link
Demonstrates real-time burnout scoring, demo mode acceleration, and alert pop-ups.

AI Tools Used 

Tool Used: ChatGPT
Purpose: Debugging, code optimization, guidance for demo-mode logic
Key Prompts Used:
“Make burnout score increase smoothly for demo mode”
“Create visual pop-ups with fade in/out and alerts”
Percentage of AI-generated code: ~15%
Human Contributions: Architecture design, Chrome extension implementation, UI/UX, alert logic, demo presentation setup

Team Contributions
Malavika K B: Full-stack implementation, Chrome extension logic, UI/UX, alert system, demo mode logic, documentation

License
This project is licensed under the MIT License - see the LICENSE file for details
