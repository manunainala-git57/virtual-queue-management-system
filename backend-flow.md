# Virtual Queue Management System – Backend

This backend implements a **Virtual Queue Management System** using **Node.js, Express, MySQL, and JWT authentication**.  
It supports **role-based access**, **virtual token queues**, and **admin analytics** for a hospital-style workflow.

---

##  Tech Stack

- Node.js + Express
- MySQL
- JWT Authentication
- bcryptjs (password hashing)

---

## Roles

- **USER** – Takes and views tokens
- **EMPLOYEE (Doctor)** – Views and serves queue
- **ADMIN** – Monitors system analytics

---

## Security

- JWT-based authentication for all protected routes
- Passwords hashed using bcrypt
- Role-based authorization using middleware

---

## Database Design

### `users` – Authentication & Roles
Stores login credentials and role information for all users.

| Column | Purpose |
|------|--------|
| id | Primary key |
| name, email, mobile | User details |
| password | bcrypt-hashed password |
| role | USER / EMPLOYEE / ADMIN |

---

### `employees` – Doctor Details
Maps doctors to users and stores service-related information.

| Column | Purpose |
|------|--------|
| id | Primary key |
| user_id | Reference to users table |
| employee_name | Doctor name / specialization |
| avg_service_time | Used to calculate estimated time |
| is_active | Doctor availability |

---

### `tokens` – Virtual Queue
Represents the virtual queue for each doctor.

| Column | Purpose |
|------|--------|
| id | Token primary key |
| user_id | Patient |
| employee_id | Doctor |
| token_number | Token number (per doctor) |
| queue_position | Current queue position |
| estimated_time | Estimated waiting time |
| status | WAITING / SERVED |

---

###  Queue Lifecycle (Core Logic)
```
USER → Take Token → WAITING 
EMPLOYEE → Serve Token → SERVED
```
- Queue is per doctor
- Estimated time updates dynamically
- Tokens are never deleted (status-based)

## Key APIs

#### All protected routes require an Authorization header:
---
` Authorization: Bearer <JWT_TOKEN> `

### USER APIs
- `GET /employees` – View available doctors
- `POST /tokens` – Take a token
- `GET /tokens/my` – View my active token

---

###  EMPLOYEE APIs
- `GET /tokens/employee` – View my queue (tokens that are booked by patients to this particular employee)
- `POST /tokens/:id/serve` – Serve a token

---

### ADMIN APIs
- `GET /admin/tokens/today` – Today’s token summary
- `GET /admin/doctor-load` – Doctor-wise workload
- `GET /admin/active-employees` – Active doctors today
- `GET /admin/tokens/weekly` – Weekly token trends

---

## Admin Analytics

Admin can monitor:
- Total tokens generated today
- Served vs waiting tokens
- Doctor-wise patient load
- Weekly system usage trends
