# Virtual Queue Management System 
The Virtual Queue Management System is a role-based web application designed to eliminate physical waiting lines in organizations by replacing them with a smart, virtual token system

### VQMS solves these problems by enabling:
* Virtual token generation
* Real-time queue tracking
* Estimated service time calculation
* Centralized monitoring and analytics

## User Roles
* User (Customer) - who wants to book an appointment with an employee
* Employee - A staff member who serves customers in the queue
* Admin - monitors system performance and customer flow

## Application Workflow
**1. Welcome Page**
>Provides:

* Get Started button

* Take Token button 
(Both redirect to Login / Signup)

**2. Authentication**
 > Users, Employees, and Admins register using:
* Name
* Email
* Mobile Number
* Password
>A single authentication system is used and 
Access to dashboards is determined by the user’s role

**3. User Workflow**
> Step 1: Registration & Login

Users register and log in to the application.

> Step 2: Select Employee & Take Token

- User selects an employee from a fixed list (e.g., 5 employees)
- Clicks Take Token
- System assigns:
    - Token number
    - Queue position
    - Estimated waiting time

> Step 3: Token Card Display
- User sees a card containing:
    - Token Number
    - Selected Employee
    - Number of customers ahead
    - Estimated time to be served
    - Current status (Waiting)
> Step 4: Notifications (Future Enhancement)

**4. Employee Workflow**
> Step 1: Registration & Login

Employees register and log in using their credentials.

> Step 2: Employee Dashboard

- Employees see a table with:
    - Customer list
    - Token status
    - Customers ahead
    - Estimated service time
    -Action button (Serve)

> Serve Action
- Marks the current token as Served
- Moves the queue forward
- Updates estimated time for remaining customers

**5. Admin Workflow**
> Step 1: Registration & Login

Admins log in using admin credentials.

> Step 2: Admin Dashboard

- Admin can view:

    - Today’s total customers
    - Served vs not served tokens
    - Active employees
    - Employee performance

> Step 3: Analytics & Reports
- Daily reports
- Weekly reports
- Monthly reports
- Customer flow analysis
- Service efficiency insights

**We implemented role-based authorization using a reusable middleware that checks roles from JWT payload.**

** Admin wants answers to questions like:**

- How many tokens today?
- How many served vs waiting?
- Which doctors are busy?
- Who logged in today?
- weekly analytics?
