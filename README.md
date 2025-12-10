````markdown
# 📱 Verizon Perks Savings Calculator

The **Verizon Perks Savings Calculator** is a full-stack web application that helps users understand how much they can save by subscribing to streaming and other digital services through Verizon “Perks” instead of paying standalone prices.

Users can:

- View a list of available perks
- Compare **standalone subscription cost vs Verizon perk price**
- See **monthly savings** and totals
- (Developer) Manage perks via a full CRUD API

> This project is built as a capstone-style app with multiple tiers: MVP CRUD, CI/CD, and a roadmap toward authentication and security.

---

## 🌐 Live Application

- **Frontend (React)**  
  🔗 `https://verizon-perks-savings-cal-exs9.onrender.com/`

- **Backend (Spring Boot API)**  
  🔗 _Backend Render URL_ → `https://<your-backend-service>.onrender.com`  
  (update here once deployed)

---

## 🧩 Key Features

### 💻 Frontend

- Modern **React** SPA
- Clean UX designed around the Perks comparison use case
- Displays:
  - List of available perks (e.g., Disney+ / Hulu / ESPN+, Netflix & Max, Apple One, etc.)
  - Original standalone subscription price
  - Discounted Verizon Perk price
  - Calculated savings per perk and total savings
- Responsive layout and organized data presentation

### ⚙️ Backend (REST API)

- **Spring Boot** REST API in `/perksapi`
- Full **CRUD** for perks:
  - `GET /api/perks` – list all perks
  - `GET /api/perks/{id}` – get perk by id
  - `POST /api/perks` – create a new perk
  - `PUT /api/perks/{id}` – update an existing perk
  - `DELETE /api/perks/{id}` – delete a perk
- JSON-based API designed for frontend consumption
- Configurable persistence (e.g., in-memory DB for local dev, external DB for production)

### 🔄 CI/CD & DevOps

- **GitHub Actions** workflow (`.github/workflows/ci-cd.yml`) that:
  - Builds & tests the **frontend**
  - Builds the **backend** (tests can be configured/skipped as needed)
  - Triggers **automatic deployments to Render** via deploy hooks when changes are pushed to `main`
- Suitable for:
  - **Tier 2:** Continuous Deployment  
  - **Tier 3:** Continuous Integration + branch protection rules

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
         │  - Services / business   │
         │    logic                 │
         │  - Repository / JPA      │
         │  - DB / persistence      │
         └──────────────────────────┘
````

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
│   └── target/               # build artifacts (ignored by Git)
│
└── .github/
    └── workflows/
        └── ci-cd.yml         # GitHub Actions CI/CD pipeline
```

---

## 🛠 Tech Stack

### Frontend

* **React**
* JavaScript / JSX
* Fetch API / Axios (for HTTP calls)
* Jest + React Testing Library (for unit tests)
* Deployed on **Render** (static site / web service)

### Backend

* **Java 17**
* **Spring Boot 3**
* Spring Web (REST)
* Spring Data JPA
* Maven
* In-memory DB / external DB (depending on configuration)
* Deployed on **Render** (web service)

### DevOps

* **GitHub Actions**
* Render Deploy Hooks
* Branch Protection Rules (Tier 3)
* Node 20 & Maven builds in CI

---

## 🚀 Getting Started (Local Development)

### ✅ Prerequisites

* Node.js (v18+ or v20)
* npm
* Java 17
* Maven 3.9+
* Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/verizon-perks-savings-cal.git
cd verizon-perks-savings-cal
```

---

### 2️⃣ Backend – Run Spring Boot API

From the project root:

```bash
cd perksapi
```

#### Build (skip tests if necessary)

```bash
mvn clean package -DskipTests
```

#### Run the application

```bash
mvn spring-boot:run
# or
java -jar target/perksapi-0.0.1-SNAPSHOT.jar
```

The backend will be available at:

```text
http://localhost:8080
```

Example API call:

```text
GET http://localhost:8080/api/perks
```

---

### 3️⃣ Frontend – Run React App

In another terminal window, from project root:

```bash
cd frontend
npm install
npm start
```

By default, the frontend runs at:

```text
http://localhost:3000
```

Make sure the frontend is configured to call the backend via an environment variable, e.g.:

* `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8080
```

Then in your frontend code:

```js
const API_BASE_URL = process.env.REACT_APP_API_URL;
```

---

## 🔌 API Overview

Base URL (local):

```text
http://localhost:8080/api/perks
```

Base URL (production, example):

```text
https://<your-backend-service>.onrender.com/api/perks
```

### Endpoints

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/perks`      | Get all perks           |
| GET    | `/api/perks/{id}` | Get perk by ID          |
| POST   | `/api/perks`      | Create a new perk       |
| PUT    | `/api/perks/{id}` | Update an existing perk |
| DELETE | `/api/perks/{id}` | Delete a perk           |

#### Example `POST /api/perks` Request Body

```json
{
  "name": "Disney+ Hulu ESPN+ with Ads",
  "standalonePrice": 14.99,
  "verizonPerkPrice": 10.00
}
```

---

## 🔄 CI/CD with GitHub Actions & Render

The CI/CD pipeline is defined in:

```text
.github/workflows/ci-cd.yml
```

### Workflow Summary

* **Triggers**:

  * `push` to `main`
  * `pull_request` targeting `main`
* **Jobs**:

  * `frontend-ci`

    * Installs dependencies
    * Runs tests
    * Builds production bundle
  * `backend-ci`

    * Builds the Spring Boot app (optionally skipping tests)
  * `deploy`

    * Runs only on `push` to `main`
    * Triggers frontend & backend deploys on Render via deploy hooks

### Secrets Required (GitHub → Settings → Secrets and variables → Actions)

* `RENDER_HOOK_FRONTEND` – Render deploy hook URL for frontend service
* `RENDER_HOOK_BACKEND` – Render deploy hook URL for backend service

---

## 🧪 Testing

### Frontend Tests

From `frontend/`:

```bash
npm test
```

Typical tests:

* Component rendering
* Core interactions / UI behavior

### Backend Tests

From `perksapi/`:

```bash
mvn test
```

If certain tests are unstable or still under development, they can be skipped during CI builds via:

```bash
mvn clean package -DskipTests
```

(This is the command used in CI/CD until tests are fully stabilized.)

---

## 🎯 Mapping to Tier Requirements

### Tier 1 – MVP, CRUD & REST

* ✅ React frontend with organized UI and UX
* ✅ Users can view and interact with perk data
* ✅ Backend exposes full CRUD via RESTful endpoints
* ✅ Data organized logically for comparison and savings

### Tier 2 – Deployed Application via Continuous Deployment

* ✅ App deployed to **Render** (frontend + backend)
* ✅ GitHub Actions workflow configured
* ✅ Automatic deployment triggered on `push` to `main`

### Tier 3 – Continuous Integration

* ✅ CI pipeline runs on **pull requests**
* ✅ Frontend tests run before merging
* ✅ Backend build verifies compilation & packaging
* ✅ Branch protection rule can require CI checks to pass before merging to `main`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

CI must pass before the PR is merged.

```
