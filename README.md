# SheGuard AI

**A Multilingual, Voice-First Maternal Health Companion for Expectant Mothers in Nigeria**

> **⚠️ DISCLAIMER: DEMO APPLICATION**
> This application is a Minimum Viable Product (MVP) web demo built specifically for the **HER Hackathon 2026**. It is currently a simulated frontend environment. It is not a real medical device, does not store data on a live backend, and the AI responses are currently simulated to demonstrate the user flow. **Always consult a registered healthcare worker for real medical emergencies.**

---

## Live Web Demo

You don't need to download anything to try SheGuard! The app is fully deployed and accessible via the web.

🔗 **[Click Here to Open SheGuard on Netlify](https://sheguardapp.netlify.app/)**
_(Note: For the best experience, view this on a mobile device or use your browser's Developer Tools to simulate a mobile screen)._

**📸 Scan to open on Mobile:** ![SheGuard QR Code](./sheguard-images/qrcode.png)  
_(Upload your Netlify QR code image to your GitHub repo and replace the path above)_

---

## About the Project

**SheGuard AI** is an accessible, web-based mobile health companion built specifically for expectant mothers in Nigeria, with a strict focus on bridging the literacy and language gap for underserved and semi-rural communities.

Maternal mortality in Nigeria remains among the highest in the world. A significant proportion of preventable deaths are caused by the late recognition of danger signs—particularly preeclampsia, hemorrhage, and infection—that could have been identified and escalated hours earlier if the mother had understood the symptoms.

SheGuard aims to close that gap by putting a warm, culturally-aware, voice-first health companion directly in a mother's pocket, available in her own language.

### SheGuard is a triage and guidance tool that:

- **Bypasses the literacy barrier** via natural voice dictation and text-to-speech.
- **Detects danger signs** through conversation and raises immediate visual alerts.
- **Delivers trimester-specific**, evidence-based pregnancy guidance.
- **Connects mothers to nearby maternity facilities** using geospatial mapping.

---

## Screenshots

|              Home Dashboard              |              Pregnancy Guide               |                Clinic Locator                |                 Emergency Protocol                 |
| :--------------------------------------: | :----------------------------------------: | :------------------------------------------: | :------------------------------------------------: |
| ![Home](./sheguard-images/home-page.png) | ![Guide](./sheguard-images/guide-page.png) | ![Clinic](./sheguard-images/clinic-page.png) | ![Emergency](./sheguard-images/emergency-page.png) |

---

## Hackathon Project Team

This application was conceived, designed, and built for the HER Hackathon 2026 by Team SheGuard:

| Name                  | Role                                         |
| :-------------------- | :------------------------------------------- |
| **Ummulkhair Logun**  | Team Lead / Product & AI Strategy            |
| **Katrina Emegbagha** | Co-Lead / UX Design & Full-Stack Engineering |

> _"We built SheGuard because we believe every mother deserves a knowledgeable companion by her side — regardless of where she lives, what language she speaks, or how much she earns."_

---

## Project Structure

This MVP is structured as a modern React application powered by Vite, utilizing a modular component-based architecture for clean state management and routing. We specifically abstracted heavy business logic (like Voice and Storage) into custom hooks.

````text
SheGuard-App/
├── public/                 # Static assets (favicons, etc.)
├── src/                    # Main application source code
│   ├── hooks/              # Custom React hooks for core business logic
│   │   ├── useSpeech.js      # Handles Web Speech API for voice dictation & TTS
│   │   └── usePersistence.js # Manages offline-first local storage and state persistence
│   │
│   ├── pages/              # Core application screens
│   │   ├── RegisterPage.jsx   # Onboarding & User Profile Setup
│   │   ├── Dashboard.jsx      # Main Hub, Quick Actions & Tips Modal
│   │   ├── ChatPage.jsx       # Voice-first AI Conversation Interface
│   │   ├── ClinicPage.jsx     # React-Leaflet Map & Geolocation Discovery
│   │   ├── PregnancyGuide.jsx # Expandable Trimester Timelines
│   │   ├── ReminderPage.jsx   # Voice-dictated Task Scheduling
│   │   ├── SettingsPage.jsx   # Language, Theme & Profile Configuration
│   │   └── EmergencyPage.jsx  # Escalation Protocol & Danger Signs
│   │
│   ├── App.jsx             # Main routing, state container, and layout manager
│   ├── main.jsx            # React DOM entry point
│   ├── data.js             # Centralized multilingual translation dictionary & Mock DB
│   └── index.css           # Global styles and Tailwind CSS directives
│
├── package.json            # Project metadata and
└── vite.config.js          # Vite bundler configuration


## Core Dependencies & Tech Stack

If you are cloning this repository, running `npm install` will automatically install all necessary packages. The core libraries powering SheGuard AI include:

* **[React.js (Vite)](https://vitejs.dev/)** - Frontend framework for building fast, responsive user interfaces.

* **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework used for styling the premium pastel, mobile-first layouts.

* **[Lucide React](https://lucide.dev/)** - Beautiful, consistent SVG iconography used throughout the app.

* **[React Leaflet](https://react-leaflet.js.org/) & Leaflet** - Open-source interactive mapping libraries used for the Clinic Locator.

* **Web Speech API** - Native browser API utilized inside our `useSpeech` hook for low-latency dictation and audio reading.

---

##  Getting Started (Run Locally)

Want to run the demo on your own machine? Follow these steps:

### Prerequisites
Make sure you have **Node.js (v18+)** and **npm** installed on your computer.

### 1. Clone the Repository

```bash
git clone [https://github.com/KatrinaEmegbagha/SheGuard-App.git](https://github.com/KatrinaEmegbagha/SheGuard-App.git)
cd SheGuard-App

## 2. Install Dependencies
This command reads the package.json file and installs React, Tailwind, Leaflet, Lucide, and all other required packages.

```bash
npm install

## 3. Run the Development Server

```bash
npm run dev
Open your browser and navigate to http://localhost:5173 (or the port provided in your terminal).
To view the mobile layout properly, right-click the page, select Inspect, and click the "Device Toolbar" icon to simulate a mobile screen (e.g., iPhone 12 Pro).


## Future Roadmap (Beyond the MVP)
* **While this web demo successfully validates the voice-first UI and  translation routing, our vision for a production-ready SheGuard includes:

* **Native Mobile App (React Native): Migrating the codebase to Expo/React Native for true offline-first capabilities and push notifications.

* **Real-Time AI Voice Streaming (LiveKit): Integrating LiveKit WebRTC and Google Gemini 2.5 Native Audio for millisecond-latency, interruptible AI conversations.

* **Cloud Backend (Appwrite): Implementing secure user authentication and encrypted health journal syncing.

* **Feature Phone Integration (USSD/SMS): Building a USSD gateway so women without smartphones can receive localized health tips and trigger emergency alerts via basic SMS.

## License
This project is licensed under the MIT License.

You are free to use, modify, and distribute this software for educational and development purposes. We strongly encourage other developers to take this concept and adapt it to help vulnerable populations in their own regions.
````
