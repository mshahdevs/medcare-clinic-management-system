# Frontend Integration Guide

## Base URL

Development:

```txt
http://localhost:5000/api
```

Production:

```txt
https://medcare-clinic-system-backend.vercel.app/api
```

---

# Authentication

## Register Patient

```http
POST /auth/register
```

## Login

```http
POST /auth/login
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {},
    "token": "JWT_TOKEN"
  }
}
```

Store token:

```js
localStorage.setItem('token', token);
```

---

# Authorization Header

For all protected routes:

```http
Authorization: Bearer JWT_TOKEN
```

---

# Doctors APIs

## Get All Doctors

```http
GET /doctors
```

## Get Single Doctor

```http
GET /doctors/:id
```

---

# Patient APIs

## Get My Profile

```http
GET /profile
```

## Update My Profile

```http
PUT /profile
```

## Book Appointment

```http
POST /appointments
```

Body:

```json
{
  "doctor": "DOCTOR_ID",
  "appointmentDate": "2026-06-20",
  "appointmentTime": "10:00 AM",
  "reason": "Fever"
}
```

## My Appointments

```http
GET /appointments/my
```

## Patient Dashboard

```http
GET /patient/dashboard
```

---

# Doctor APIs

## Doctor Appointments

```http
GET /appointments/doctor/my
```

## Doctor Dashboard

```http
GET /doctors/doctor/dashboard
```

---

# Admin APIs

## Create Doctor

```http
POST /admin/doctors
```

## Get All Appointments

```http
GET /appointments
```

## Update Appointment Status

```http
PUT /appointments/:id/status
```

Body:

```json
{
  "status": "approved"
}
```

## Admin Dashboard

```http
GET /admin/dashboard
```

---

# Status Values

```txt
pending
approved
completed
cancelled
```

---

# Notes

- All protected routes require JWT token.
- Email notifications are enabled for appointment booking and status updates.
- Role-based access control is implemented for Patient, Doctor, and Admin.
