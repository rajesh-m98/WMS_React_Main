# 📦 WMS - High-Fidelity Warehouse Management System

## Overview
A high-performance, enterprise-grade Warehouse Management System (WMS) front-end built with **React**, **Redux Toolkit**, and **Tailwind CSS**. This platform provides comprehensive visibility and control over inventory lifecycle, handheld terminal management, and hierarchical storage configurations.

---

## 🚀 Key Features

### 📊 Real-time Dashboard Command Center
- **Live KPI Tracking**: Real-time synchronization of Active Users, Total Items, HST Devices, and Warehouse counts.
- **Session-Persistent Deltas**: Integrated change tracking using `localStorage` to highlight inventory gains or reductions since the last login (e.g., `+5` or `No Changes`).
- **Activity Analytics**: Visual trend analysis of Inward and Outward transaction flows.

### 👥 Advanced User & Permission Management
- **Role-Based Access Control (RBAC)**: Comprehensive permission matrix (Create/Edit/Delete/View) across all functional modules.
- **Outlet Mapping**: Strategic assignment of users to specific warehouse outlets and permissions.

### 📱 HST (Handheld Terminal) Lifecycle
- **Device Management**: Tracking of Device IDs, Names, Brands, and Serial Numbers.
- **Operational Mapping**: Support for Aisle-level mapping (Single or Multiple) for synchronized picking/putting tasks.

### 📦 Item & Inventory Intelligence
- **Deep SKU Visibility**: Management of Item Codes, Batch Numbers, and Barcode numbers.
- **Inventory Metrics**: Tracking of Opening Stock and real-time Current Stock levels.
- **Smart Location Mapping**: Automated bin association for rapid lookups.

### 🗺️ Hierarchical Storage (6-Layer)
- **Granular Bin Configuration**: Support for up to 6 layers of location nesting (Warehouse > Zone > Aisle > Rack > Shelf > Bin).

---

## 🛠️ Technology Stack
- **Framework**: React 18+ (Vite)
- **State Management**: Redux Toolkit (Manager-Slice Pattern)
- **Styling**: Tailwind CSS / Shadcn/UI (Premium Dark/Indigo Theme)
- **icons**: Lucide React
- **Charts**: Recharts (High-performance SVG)
- **Network**: Centralized Axios wrapper with `endpoints.ts` orchestration.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or bun

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Techative-Solutions/WMS_React_Main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://wms.giri.in:8083/api/v1
   VITE_COMPANYID=1
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🏗️ Project Architecture
The project follows a **Manager-Slice pattern** for maximum scalability:
- `/src/app/manager/`: Handles all asynchronous API logic and data transformations.
- `/src/app/store/`: Centralized Redux state management.
- `/src/core/config/`: System-wide configurations and API endpoints.
- `/src/components/ui/`: Atomic design components based on Shadcn/Radix.
- `/src/pages/`: Modular page views with local `Config.json` for string management.

---

## 📪 Contact & Support
Developed for **Techative Solutions**. For system inquiries or technical support, please contact the development team through the internal DevOps portal.
