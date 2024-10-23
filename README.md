
# **Expense Tracker API**  

A simple **Expense Tracker** API built with **Node.js, Express, MongoDB, and Mongoose** to manage transactions, generate financial summaries, and create monthly reports.  

---

## **Table of Contents**  
1. [Features](#features)  
2. [Setup and Installation](#setup-and-installation)  
3. [API Documentation](#api-documentation)  
4. [Postman Collection](#postman-collection)  
5. [Project Structure](#project-structure)  
6. [Environment Variables](#environment-variables)  

---

## **Features**  
- Add, view, update, and delete transactions.  
- Filter transactions by type, category, and date.  
- Pagination for large datasets.  
- Generate financial summaries based on date ranges.  
- Create monthly reports for expenses grouped by category.

---

## **Setup and Installation**

### **Prerequisites**  
- [Node.js](https://nodejs.org/) (v14+)  
- [MongoDB](https://www.mongodb.com/) (local setup or MongoDB Atlas)

### **Installation Steps**  
1. **Clone the Repository:**  
   ```bash
   git clone <repository-url>
   cd ExpenseTracker
   ```

2. **Install Dependencies:**  
   ```bash
   npm install
   ```

3. **Create a `.env` File:**  
   In the project root, add a `.env` file with the following:  
   ```plaintext
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   ```

4. **Start the Server:**  
   ```bash
   npm start
   ```
   The server will run at: [http://localhost:5000](http://localhost:5000)

---

## **API Documentation**

### 1. **Add a Transaction**  
- **Endpoint:** `POST /transactions/add-trans`
![Screenshot 2024-10-23 021042](https://github.com/user-attachments/assets/43d8a2fa-c3bd-4164-8ee2-1d9ef2a3394d)

- **Request Body:**
   ```json
   {
     "type": "Income",
     "category": "Salary",
     "amount": 5000,
     "date": "2024-10-23",
     "description": "October salary"
   }
   ```
- **Response:**  
   ```json
   {
     "_id": "64f1e0387bd8b45678a12c34",
     "type": "Income",
     "category": "Salary",
     "amount": 5000,
     "date": "2024-10-23T00:00:00.000Z",
     "description": "October salary"
   }
   ```

### 2. **Get All Transactions (with Pagination & Filters)**  
- **Endpoint:** `GET /transactions` 
![Screenshot 2024-10-23 080841](https://github.com/user-attachments/assets/f6209c1e-f73e-439f-8b33-163c5de2329d)



- **Query Parameters:**  
   - `page` (optional, default: 1)  
   - `limit` (optional, default: 10)  
   - `type` (optional: 'Income' or 'Expense')  
   - `category` (optional)  

- **Example:**  
   ```
   GET /transactions?page=2&limit=5&type=Income
   eg:http://localhost:5000/transactions?page=2&limit=5
   eg2:http://localhost:5000/transactions?page=2&limit=5&type=Expense
   ```
   ![Screenshot 2024-10-23 080923](https://github.com/user-attachments/assets/a3f1eab4-a3ac-4f61-ad12-a5cb5d46c911)

- **Response:**  
   ```json
   {
     "totalTransactions": 15,
     "currentPage": 2,
     "totalPages": 3,
     "pageSize": 5,
     "transactions": [...]
   }
   ```

### 3. **Get a Single Transaction**  
- **Endpoint:** `GET /transactions/transaction/:id` 

![Screenshot 2024-10-23 024024](https://github.com/user-attachments/assets/7f82f9bd-c45f-4138-8c0a-1a5eabda8167)

- **Example:**  
   ```
   GET /transactions/transaction/64f1e0387bd8b45678a12c34
   ```
- **Response:**  
   ```json
   {
     "_id": "64f1e0387bd8b45678a12c34",
     "type": "Income",
     "category": "Salary",
     "amount": 5000,
     "date": "2024-10-23T00:00:00.000Z",
     "description": "October salary"
   }
   ```

### 4. **Update a Transaction**  
- **Endpoint:** `PUT /transactions/update/:id` 
![Screenshot 2024-10-23 080209](https://github.com/user-attachments/assets/c95128cb-0e82-4d7c-898c-4292c275fefa)


- **Request Body:**  
   ```json
   { "amount": 5500 }
   ```
- **Response:**  
   ```json
   {
     "_id": "64f1e0387bd8b45678a12c34",
     "type": "Income",
     "category": "Salary",
     "amount": 5500,
     "date": "2024-10-23T00:00:00.000Z",
     "description": "October salary"
   }
   ```

### 5. **Delete a Transaction**  
- **Endpoint:** `DELETE /transactions/delete/:id`
![Screenshot 2024-10-23 025711](https://github.com/user-attachments/assets/9848b5b3-39a3-40fe-851c-38c5ef95ee75)
 
- **Response:**  
   ```json
   { "message": "Transaction deleted successfully" }
   ```

### 6. **Get Transaction Summary**  
- **Endpoint:** `GET /transactions/summary` 
![Screenshot 2024-10-23 081012](https://github.com/user-attachments/assets/dc83752e-fbf2-4a6e-aaa2-f7451814b7bc)

- **Query Parameters:**  
   - `startDate` (YYYY-MM-DD)  
   - `endDate` (YYYY-MM-DD)  

- **Example:**  
   ```
   GET /transactions/summary?startDate=2022-01-12&endDate=2023-10-31

   eg:http://localhost:5000/transactions/summary?startDate=2022-01-12&endDate=2023-10-31
   ```
- **Response:**  
   ```json
   {
     "totalIncome": 12000,
     "totalExpenses": 5000,
     "balance": 7000,
     "numOfTransactions": 5,
     "transactions": [...]
   }
   ```

### 7. **Generate Monthly Reports**  
- **Endpoint:** `GET /transactions/reports`  
- **Query Parameters:**  
   - `month` (MM)  
   - `year` (YYYY)  
![Screenshot 2024-10-23 081134](https://github.com/user-attachments/assets/5f1da916-0b8a-4dcc-a8cd-d8dd5abc60cf)

- **Example:**  
   ```
   GET /transactions/reports?month=07&year=2024
   ```
   ``` 
   eg:http://localhost:5000/transactions/reports?month=07&year=2024
   
   ```
- **Response:**  
   ```json
   {
     "month": "07",
     "year": "2024",
     "report": [
       { "_id": "Food", "totalAmount": 3000, "count": 4 }
     ]
   }
   ```

---

## **Postman Collection**

You can use **Postman** to test the API endpoints.  
1. **Create a new collection** in Postman.  
2. Add the following API endpoints:  
   - **POST /transactions/add-trans**  
   - **GET /transactions**  
   - **GET /summary**  
   - **GET /reports** 
   - **PUT /update/:id**
   - **DELETE /delete/:id** 
   - **GET /transaction/:id**

---

## **Project Structure**
```
ExpenseTracker/
├── controller/
│   └── transactionController.js
├── model/
│   └── Transaction.js
├── routes/
│   └── transactionRoutes.js
├── .env
├── server.js
├── package.json
```

---

## **Environment Variables**

Create a `.env` file in the root directory and provide the following variables:

```plaintext
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
```
MONGO_URI=MONGO_URI="mongodb+srv://rajesh:rajesh123@cluster0.koq9o.mongodb.net/Tutorials"
---
## **dependencies**
```
Summary
body-parser: Parses incoming request data.
dotenv: Manages environment variables securely.
express: Handles routing and API logic.
mongodb: Provides NoSQL database functionality.
mongoose: Simplifies interactions with MongoDB via schemas and models.
nodemon: Restarts the server automatically during development.
These dependencies work together to build a robust and efficient backend for your Expense Tracker API.
```

## **Conclusion**  

This **Expense Tracker API** provides an efficient way to manage transactions, view summaries, and generate financial reports. Feel free to contribute to the project by creating pull requests or reporting issues.

---


