# **Customer Insights Dashboard**  

## **Overview**  
The **Customer Insights Dashboard** is a full-stack web application that aggregates and visualizes customer data. It provides key insights into customer demographics, spending behavior, and trends using interactive charts and analytics.  

## **Features**  
- 📊 **Data Visualization** – Display customer insights using **Recharts** and **Chart.js**.  
- ⚡ **FastAPI Backend** – A lightweight, high-performance RESTful API.  
- 🗄️ **PostgreSQL Database** – Efficiently stores and queries customer data.  
- 🐳 **Dockerized Deployment** – Seamless containerized deployment.  
- ☁️ **Cloud-Ready** – Deployed using **Railway** for easy scalability.  

## **Tech Stack**  
### **Frontend**  
- **React.js** – Interactive UI  
- **Recharts & Chart.js** – Data visualization  
- **Tailwind CSS** – Styling  

### **Backend**  
- **FastAPI** – High-performance Python API  
- **PostgreSQL** – Relational database  
- **SQLAlchemy** – ORM for database interactions  

### **Deployment & DevOps**  
- **Docker** – Containerization  
- **Railway** – Cloud hosting  
- **Render** – Alternative backend hosting option  

## **Installation & Setup**  

### **1. Clone the repository**  
```sh
git clone https://github.com/yourusername/customer-insights-dashboard.git
cd customer-insights-dashboard

Installation & Setup
1. Clone the repository

git clone https://github.com/yourusername/customer-insights-dashboard.git
cd customer-insights-dashboard
```
### **2. Set up the backend** 
```sh

cd backend
pip install -r requirements.txt
```

Create a .env file and add:
```sh
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/customer_insights
```
Run the FastAPI server:
```sh
uvicorn main:app --reload
```
3. Set up the frontend
```sh
cd frontend
npm install
npm run dev
```
4. Run with Docker (Optional)
```sh
docker-compose up --build
```
API Endpoints
```sh
Method	Endpoint	Description
GET	/api/customers	Fetch all customer data
GET	/api/summary	Get an overview summary
```
## **Live Demo**  
🚀 [View Live Project](https://customer-dashboard-e9kh.onrender.com/)

