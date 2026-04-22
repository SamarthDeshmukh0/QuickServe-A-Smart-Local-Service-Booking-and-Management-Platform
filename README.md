# 🚀 QuickServe

### Smart Local Service Booking Platform

QuickServe is a full-stack web application that connects customers with verified local service providers such as plumbers, electricians, carpenters, and more. It streamlines the entire service lifecycle—from booking to payment—using AI-powered recommendations and real-time tracking.

---

## 📌 Problem Statement

Finding reliable local service providers is inefficient and unreliable:
- Lack of trust and verification
- No clear pricing structure
- No visibility of provider availability
- No proper tracking after booking

---

## ✅ Solution

QuickServe addresses these challenges by offering:
- Verified and admin-approved professionals
- Slot-based booking system (no waiting)
- AI-powered provider recommendation engine
- Real-time booking status tracking
- Transparent pricing and payment system

---

## 🚀 Key Features

- AI-powered **provider recommendation system**
- **Slot-based booking system** (prevents double booking)
- Complete **booking lifecycle tracking**
- **Role-based authentication** (Customer, Provider, Admin)
- **Earnings dashboard & analytics for providers**
- **Admin analytics with demand insights**
- **Price estimation before booking**
- **Emergency & group booking support**
- **Skill badges for provider ranking**
- **Heatmap-based demand visualization**

---

## 🏗️ System Architecture

- **Spring Boot Backend (Main API)**  
  Handles authentication, booking logic, slot management, payments, and business workflows.

- **Python Flask Microservice (AI Engine)**  
  Computes provider recommendation scores based on rating, experience, and proximity.

- **React Frontend**  
  Provides user interface for customers, providers, and admin dashboards.

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router v6
- Axios
- Chart.js / Recharts
- React Hook Form
- Context API

### Backend
- Spring Boot 3.x
- Spring Security
- JWT Authentication
- Spring Data JPA (Hibernate)
- MySQL

### AI Microservice
- Python Flask (Recommendation Engine)

---

## ✨ Features

### 🔹 Core Features
- Multi-role Authentication (Customer / Provider / Admin)
- AI-Based Provider Recommendation
- Slot-Based Booking System
- Booking Lifecycle Management
- Payment Simulation
- Ratings & Reviews

### 🔹 Advanced Features
- 💰 Price Estimator
- 🏅 Skill Badges for Providers
- 📍 Real-Time Status Tracker
- 🔥 Demand Heatmap (Admin Analytics)
- 📈 Earnings Forecast (Providers)
- 👥 Group Booking
- ⚡ Emergency Booking

---

## 🚀 Work Flow

QuickServe supports three primary user roles: **Customer**, **Service Provider**, and **Admin**. Each role interacts with the platform differently as outlined below.

---

### 👤 Customer Workflow

1. Register or log in as a customer  
2. Select a service (e.g., plumber, electrician, AC repair)  
3. View AI-recommended service providers based on rating, experience, and proximity  
4. Choose a provider and select an available time slot  
5. Confirm the booking request  
6. Track booking status in real-time (Booked → Accepted → In Progress → Completed → Paid)  
7. Complete payment after service completion  
8. Rate and review the service provider  

---

### 🧑‍🔧 Service Provider Workflow

1. Register as a service provider  
2. Await admin approval before accessing the platform  
3. Log in and configure availability using slot management  
4. View incoming job requests matching skills and location  
5. Accept or reject job requests  
6. Update job progress (Accepted → In Progress → Completed)  
7. Track earnings, job history, and performance analytics  

---

### 🛡️ Admin Workflow

- Review and approve or reject provider registrations  
- Monitor all platform bookings and users  
- Analyze system data including revenue, service demand, and usage trends  
- View advanced analytics such as heatmaps and top-performing providers  

---
