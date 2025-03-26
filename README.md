# 🏋️‍♂️ Fit Track Web Application

## 🚀 Overview
**FitTrack** is a modern and scalable platform designed to help users track their workouts, monitor nutrition, and visualize progress—all in one seamless experience.

![App Overview](https://github.com/DenisBG312/FitTrack/blob/main/Project-Images/Home.png)

---
## ✨ Features
✅ **Secure Authentication** – JWT-based authentication with RBAC.  
✅ **Workout Finder** – View all sort of workout added by professional coaches. Coaches can do CRUD on their workouts.  
✅ **Social Media Like** – There will be a place where people share their progress from the start of their journey, so they can motivate others -> (Soon to be done).  
✅ **Nutrition Tracking** – Monitor daily food intake and nutritional values -> (Soon to be done).  
✅ **Progress Monitoring** – Graphical representation of fitness progress .  
✅ **Profile Image Upload** – Upload profile pictures during registration.  

***NEW FEATURES IN THE NEAR FUTURE***

## 🛠 Tech Stack
### 🎨 Frontend
- ⚡ **React (Vite)** – Fast and optimized UI with JavaScript.
- 🎨 **Tailwind CSS** – Modern utility-first styling.
- 🔄 **React Router** – Smooth client-side navigation.

### 💻 Backend
- 🚀 **ASP.NET Core Web API** – Robust API development.
- 🗄 **PostgreSQL** – Reliable relational database.
- 🔐 **JWT Authentication** – Secure user sessions.
- 👤 **RBAC** – Role-based access control for different users.

---
## 🏗 Database Schema

### SOON!

---
## ⚙️ Installation and Setup
### 📌 Prerequisites
- Node.js & npm
- .NET SDK
- PostgreSQL

### 🔧 How to run the project?
## Backend
```sh
git clone https://github.com/DenisBG312/FitTrack.git
cd StrongerTogether.Client
```
* Create a file named appsettings.json in the main directory of the project and configure your PostgreSQL connection string there.
* In the appsettings.json you also need to configure the JWT as shown below:
  
```javascript
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string"
  },
  "Jwt": {
    "Issuer": "an-ssuer",
    "Audience": "some-audience",
    "SecretKey": "enter-your-secretKey"
  },
  "AllowedHosts": "*"
}
```

```sh
dotnet ef database update
dotnet run
```

### 🎨 Frontend Setup
```sh
cd StrongerTogether.Client
npm install
npm run dev
```

---
## 🔌 API Endpoints
### 🔑 Authentication
🔹 `POST /api/auth/register` – User registration.  
🔹 `POST /api/auth/login` – User login.  
🔹 `GET /api/auth/profile` – Get user profile (JWT required).  

### 💪 Workouts
🔹 `GET /api/workouts` – Get user workouts.  
🔹 `POST /api/workouts` – Add a new workout.  
🔹 `PUT /api/workouts/GetSpecificWorkout/{id}` – Edit a workout.  
🔹 `DELETE /api/workouts/{id}` – Delete a workout (owner-only).  

### MORE ARE BEING DEVELOPED

---
## 🔒 Security Considerations
- 🔹 **JWT Storage** – Tokens stored securely in HTTP-only cookies.
- 🔹 **Role-Based Access** – Restricted actions based on user roles.
- 🔹 **File Uploads** – Images stored securely in `/uploads`, path saved in PostgreSQL.

---
## 📜 License
This project is licensed under the **MIT License**.

## 📩 Contact
For questions or contributions, open an issue on GitHub. 🚀

