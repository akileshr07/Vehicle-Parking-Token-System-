# 🚗 Vehicle Parking Token System

A full-stack web application for managing a smart parking facility. It provides real-time parking slot tracking, digital token generation, UPI-based payments, and administrative control.

---

## 📦 Tech Stack

| Layer        | Tech                     |
|--------------|--------------------------|
| **Frontend** | React.js, Tailwind CSS, Lucide Icons |
| **Backend**  | Spring Boot (Gradle)     |
| **Database** | MySQL                    |
| **API Test** | Postman                  |
| **Deployment** | Docker + Netlify       |

---

## 🔑 Features

### 👥 Admin
- Dashboard with vehicle stats
- Add/update/delete vehicles
- Configure slot and fee settings
- Update payment settings (UPI QR)
- Lookup vehicle token and exit

### 🅿️ Parking
- Vehicle entry generates unique token
- Real-time slot availability
- Automatic fee calculation
- Exit flow with UPI payment QR

---

## 🚀 Running the Project

### 1. Backend (Spring Boot)

```bash
cd backend
./gradlew bootRun
