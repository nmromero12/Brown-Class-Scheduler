# Brown-Class-Scheduler


A course scheduler for Brown University students to find their courses and add them to their cart.

---

## About

Brown Class Scheduler is a comprehensive full-stack web application designed specifically for Brown University students to efficiently plan and manage their course schedules and exams. It features secure user authentication, a responsive and intuitive interface, and collaborative tools such as a friends system and shared calendars.

The backend leverages Java and Spring Boot for robust API services, integrating PostgreSQL for persistent data storage. Course data is dynamically sourced through Selenium-powered web scraping and synchronized with the official Courses at Brown API to ensure up-to-date and accurate academic information.

This platform empowers students to seamlessly organize their academic life, share schedules with peers, and export calendar data to Google Calendar.


**Note:** This project is currently in active development and not yet finished.

---

## ✨ Features

- 🔐 Secure Firebase email/password authentication  
- 🧾 Add courses to your personal cart  
- 🗓️ In-app calendar displaying your course schedule  
- 📤 Export your schedule to Google Calendar  
- 👥 Add friends and send/accept friend requests  
- 🔍 View your friends' schedules in the calendar  
- 🧩 Overlay your schedule with a friend's for comparison  
- 🐍 Uses data scraped with Selenium to send POST requests as payloads to the Courses at Brown API, populating and updating course information  
- 📦 Full REST API with Spring Boot + PostgreSQL backend  
- 🎨 Tailwind CSS UI for a modern, responsive experience  
  

---

## 🧱 Technologies Used

### Frontend
- **React** with **TypeScript** — for building the user interface  
- **Tailwind CSS** — utility-first CSS framework for styling  
- **Firebase Authentication** — secure email/password sign-in and password reset  

### Backend
- **Java** with **Spring Boot** — REST API and business logic  
- **PostgreSQL** — relational database for persistent data storage  
- **Java with Selenium** — web scraping to collect course data used by the backend 
---


