# 🚀 CryptoPulse Dashboard

**CryptoPulse** is a premium, real-time cryptocurrency tracking application designed for modern web standards and Cloud-Native Application (CNA) environments. It provides users with live market insights, price trends, and a customizable watchlist within a sleek, Glassmorphism-inspired interface.

---

## ✨ Key Features

### 1. Real-time Market Data
- Fetches live data for the top 100 cryptocurrencies via the **CoinGecko API**.
- Automatic background refreshing every 60 seconds using **TanStack Query**.

### 2. Visual Price Trends (Sparklines)
- Interactive, minimalist trend charts showing 7-day price movements for every coin.
- Dynamic color-coding: Green for positive trends, Red for negative trends.

### 3. Global Currency Support
- Instant toggle between **USD ($)** and **INR (₹)**.
- Real-time exchange rate conversion handled at the API layer.

### 4. Smart Watchlist (Favorites)
- Add coins to your personal favorites with a single click.
- Persistent storage using `localStorage` (data remains after page refresh).
- Dedicated "Favorites" filter to focus on your pinned assets.

### 5. Premium UI/UX
- **Glassmorphism Design:** Modern translucent panels with backdrop blur effects.
- **Responsive Layout:** Fully optimized for Mobile, Tablet, and Desktop screens.
- **Dark Mode First:** Deep aesthetic focused on readability and high-end feel.

---

## 💡 Why CryptoPulse?

While many trading platforms exist, CryptoPulse is designed with a different philosophy:

- **Minimalist Intelligence:** Unlike cluttered exchanges, CryptoPulse provides a clean "Market Pulse" view, allowing users to understand trends in seconds.
- **Privacy-First:** User preferences and watchlists are stored locally (`localStorage`). No tracking, no wallets, just data.
- **Enterprise-Ready:** Built as a decoupled, containerized microservice that can be integrated into any larger financial portal or enterprise dashboard.
- **Environmental Consistency:** Leveraging Docker ensures the application runs identically across Development, Staging, and Production environments (Azure/AWS/GCP).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS v3
- **Data Fetching:** Axios, TanStack Query v5
- **Visualization:** Custom SVG Sparklines (Optimized)
- **Icons:** Lucide React
- **Containerization:** Docker, Docker Compose

---

## ⚡ Performance Optimization

CryptoPulse has been optimized for high performance and low resource usage:
- **SVG Sparklines:** Replaced heavy charting libraries with lightweight SVG paths, reducing the DOM overhead by over 80%.
- **Smart Pagination:** Implemented a "Load More" pattern to ensure smooth scrolling even with large datasets.
- **Backdrop Optimization:** Optimized CSS blurs and transparency for fluid GPU rendering across all devices.

---

## 🐳 Cloud Native (CNA) Features

This project is built to demonstrate Cloud Native principles:
- **Containerization:** The entire app is containerized using a multi-stage `Dockerfile`.
- **Optimization:** Uses a multi-stage build process to keep the final production image lightweight (serving static files via Nginx).
- **Orchestration:** Managed via `docker-compose` for easy deployment and scalability.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (Optional, for containerization)

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Running with Docker
To launch the app in a production-ready container:
```bash
docker-compose up --build
```
The app will be available at `http://localhost:3000`.

---

## 🔮 Future Enhancements
- [ ] **AI Price Predictions:** Integrating machine learning models for market forecasting.
- [ ] **Push Notifications:** Alerting users when a coin hits a target price.
- [ ] **Portfolio Tracking:** Allowing users to track their actual holdings and profit/loss.
- [ ] **News Integration:** Adding a real-time crypto news feed with sentiment analysis.

---

Developed as a **CNA Lab Project** | 2026
