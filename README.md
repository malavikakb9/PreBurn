PreBurn

Basic Details
Team Name: Hackers zone
Team Members
Member 1: Malavika K B - Rajiv Gandhi Institute of Technology

Hosted Project Link
[Add your hosted project link here]

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
The extension runs automatically in browser tabs
#Open a new tab to see burnout alerts

Project Documentation
For Software:
Screenshots
Green hydration alert popup
Yellow 20-20-20 eye reminder popup
Red high-risk overlay
Self-rating popup

Diagrams

System Architecture:


Extension monitors active time, calculates burnout score, triggers alerts, stores user data via Chrome Storage

Application Workflow:


Flow of events: Start → Continuous Monitoring → Score Calculation → Alerts → Self-Check → Emergency Override

Additional Documentation
For Web Projects with Backend : Not applicable (pure frontend Chrome extension)
For Scripts/CLI Tools : Not applicable

Project Demo
Video
[Add your demo video link here - YouTube, Google Drive, etc.]
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
