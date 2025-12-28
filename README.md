# 📈 StockEss

**StockEss** is a modern web application designed to support users in making informed investment decisions on the stock market. It provides easy access to market data, real-time stock information, predictions of oncoming prices and a suite of intuitive tools to help track and manage investment strategies.

## 🚀 Features

- 📊 **Real-Time Quotes** – View the latest market prices and key indicators
- 📈 **Interactive Charts** – Analyze stock performance over time
- 🧠 **AI Insights** – Analyze AI predicted future prices
- 🗂️ **Watchlist** – Customizable alerts to keep you informed about significant stock price movement
- 💸 **Virtual Wallet** – Test yourself on the real market with virtual currency

## 🛠️ Tech Stack

- **Frontend**: React ⚛️ + TypeScript 🟦, TailwindCSS 💨
- **Backend**: FastAPI 🐍, PostgreSQL 🐘, Spring Boot ☕🍃
- **APIs**: Yahoo Finance 📡 (via `yfinance`)
- **Others**: ApexCharts 📉, TA-Lib 🧠

## 🐳 Running the Application (Docker)

To run the StockEss project, the following tools are required:

- Docker
- Docker Compose

Make sure Docker is installed and running on your system.

## ▶️ Startup Instructions

Build the Docker images:

```bash
docker compose -p stockess build
```

Start all services:

```bash
docker compose -p stockess up
```

Once the containers are running, open your browser and go to:

**http://localhost:3000**

## 🛑 Stopping the Application

To stop and remove the running containers, use:

```bash
docker compose -p stockess down
```

## 👥 Authors

- [Krystian Sienkiewicz](https://github.com/HejSztynx)
- [Krzysztof Gołuchowski](https://github.com/Krzysztof-Goluchowski)
