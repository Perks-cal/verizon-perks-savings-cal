# 📱 Verizon Perks Savings Calculator

The **Verizon Perks Savings Calculator** is a **full-stack web application** that helps users understand how much they can save by subscribing to streaming and digital services through **Verizon Perks** instead of paying standalone subscription prices.

This project is designed as a **capstone-style deployment application**, showcasing **frontend development, backend API design, CI/CD automation, and cloud deployment** using modern tools and best practices.

> ⚠️ **Disclaimer:** This is an educational project created for learning and demonstration purposes only and is **not an official Verizon tool**.

---

## 🌐 Live Application

- **Frontend (React)**  
  🔗 https://verizon-perks-savings-cal-exs9.onrender.com/

- **Backend (Spring Boot API)**  
  🔗 https://verizon-perks-savings-cal-2.onrender.com/

---

## 🎯 What Users Can Do

- View a list of available Verizon perks
- Compare standalone subscription prices with Verizon perk prices
- See calculated **monthly savings** per perk
- View total potential savings
- (Developer feature) Manage perks using a full **CRUD REST API**

---

## 🧩 Key Features

### 💻 Frontend (React)

- Modern **Single Page Application (SPA)** built with React
- Clean and intuitive UI focused on price comparison
- Displays:
  - Available perks (e.g., Disney+ / Hulu / ESPN+, Netflix & Max, Apple One)
  - Standalone subscription price
  - Discounted Verizon perk price
  - Calculated monthly savings
- Responsive layout for better user experience
- API-driven data rendering

---

### ⚙️ Backend (Spring Boot REST API)

- Built using **Spring Boot 3**
- RESTful API located in `/perksapi`
- Full CRUD support for perks:
  - `GET /api/perks` – Retrieve all perks
  - `GET /api/perks/{id}` – Retrieve a perk by ID
  - `POST /api/perks` – Create a new perk
  - `PUT /api/perks/{id}` – Update an existing perk
  - `DELETE /api/perks/{id}` – Delete a perk
- JSON-based API designed for frontend consumption
- Configurable persistence:
  - In-memory database for local development
  - External database support for production
- Proper CORS configuration for frontend-backend communication

---

### 🔄 CI/CD & DevOps

- **GitHub Actions** workflow (`.github/workflows/ci-cd.yml`) that:
  - Installs dependencies
  - Builds the frontend and backend
  - Runs automated tests (configurable)
  - Triggers deployment to Render on push to `main`
- Enables:
  - **Continuous Integration (CI)**
  - **Continuous Deployment (CD)**
  - Scalable, production-ready workflows
- Compatible with:
  - Tier 2: Continuous Deployment
  - Tier 3: CI + Branch Protection Rules

---

## 🏗 Architecture

```text
         ┌──────────────────────────┐
         │        Frontend          │
         │      (React SPA)         │
         │                          │
         │  - UI components         │
         │  - Savings calculator    │
         │  - Fetches data from     │
         │    backend API           │
         └───────────┬──────────────┘
                     │ HTTP (JSON)
                     ▼
         ┌──────────────────────────┐
         │        Backend           │
         │    (Spring Boot API)     │
         │                          │
         │  - REST controllers      │
         │  - Business logic        │
         │  - Repository / JPA      │
         │  - Data persistence      │
         └──────────────────────────┘
```

---

## 📂 Project Structure

```text
root/
├── frontend/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── perksapi/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/verizon/perksapi/...
│   │   │   └── resources/application.properties
│   │   └── test/java/com/verizon/perksapi/...
│   ├── pom.xml
│   └── target/               # Build artifacts (ignored by Git)
│
└── .github/
    └── workflows/            # CI/CD pipelines
```

---

## 🛠 Tech Stack

### Frontend
- React
- JavaScript / JSX
- Fetch API / Axios
- Jest & React Testing Library
- Deployed on Render

### Backend
- Java 17
- Spring Boot 3
- Spring Web (REST)
- Spring Data JPA
- Maven
- Deployed on Render

### DevOps
- GitHub Actions
- Render Deploy Hooks
- Docker (containerization)
- Node 20 & Maven builds in CI

---

## 🚀 Getting Started (Local Development)

### ✅ Prerequisites

- Node.js (v18+ or v20)
- npm
- Java 17
- Maven 3.9+
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/verizon-perks-savings-cal.git
cd verizon-perks-savings-cal
```

---

### 2️⃣ Run Backend (Spring Boot)

```bash
cd perksapi
mvn clean package -DskipTests
mvn spring-boot:run
```

Backend runs at:
```
http://localhost:8080
```

---

### 3️⃣ Run Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at:
```
http://localhost:3000
```

---

## 🔌 API Overview

Base URL (local):
```
http://localhost:8080/api/perks
```

### Endpoints

| Method | Endpoint          | Description             |
|------|-------------------|-------------------------|
| GET  | `/api/perks`      | Get all perks           |
| GET  | `/api/perks/{id}` | Get perk by ID          |
| POST | `/api/perks`      | Create a new perk       |
| PUT  | `/api/perks/{id}` | Update a perk           |
| DELETE | `/api/perks/{id}` | Delete a perk         |

### Example Request Body

```json
{
  "name": "Disney+ Hulu ESPN+ with Ads",
  "standalonePrice": 14.99,
  "verizonPerkPrice": 10.00
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`feature/my-feature`)
3. Commit changes
4. Push to your branch
5. Open a Pull Request

✔ CI checks must pass before merging.

---

## 📌 Future Enhancements

- Authentication & authorization
- Role-based access control
- Database persistence improvements
- Enhanced UI/UX
- Monitoring & logging
