# MedCare API Testing Guide

## Testing Tool

All backend APIs can be tested using **Postman**.

## Base URL

```txt
http://localhost:5000/api
```

## 1. Patient Registration API

**Method:** POST
**Endpoint:**

```txt
/api/auth/register
```

**Body:**

```json
{
  "fullName": "Muhammad Shah",
  "email": "mshah@example.com",
  "password": "123456",
  "phone": "03001234567",
  "role": "patient",
  "gender": "male",
  "age": 24,
  "address": "Peshawar, Pakistan"
}
```

**Expected Result:**

- Patient registered successfully
- JWT token returned

---

## 2. Login API

**Method:** POST
**Endpoint:**

```txt
/api/auth/login
```

**Body:**

```json
{
  "email": "mshah@example.com",
  "password": "123456"
}
```

**Expected Result:**

- Login successful
- User data returned
- JWT token returned

---

## 3. Create Doctor API

**Method:** POST
**Endpoint:**

```txt
/api/admin/doctors
```

**Body:**

```json
{
  "fullName": "Dr. Ali Khan",
  "email": "drali@medcare.com",
  "password": "123456",
  "phone": "03111234567",
  "gender": "male",
  "specialization": "Cardiologist",
  "experience": 8,
  "qualification": "MBBS, FCPS",
  "consultationFee": 2500,
  "address": "Peshawar, Pakistan"
}
```

**Expected Result:**

- Doctor created successfully
- Doctor role should be `doctor`

---

## 4. Get All Doctors API

**Method:** GET
**Endpoint:**

```txt
/api/doctors
```

**Expected Result:**

- List of all active doctors
- Password should not be returned

---

## 5. Get Single Doctor API

**Method:** GET
**Endpoint:**

```txt
/api/doctors/:id
```

**Expected Result:**

- Single doctor details returned
- Doctor must have role `doctor`

---

# Basic QA Test Cases

## Positive Test Cases

- Patient can register with valid data.
- Patient can login with correct email and password.
- Admin can create doctor with valid doctor data.
- Doctors list API returns active doctors.
- Single doctor API returns correct doctor details.

## Negative Test Cases

- Register should fail if email already exists.
- Register should fail if required fields are missing.
- Login should fail with wrong password.
- Create doctor should fail if email already exists.

## Security Checks

- Password should be stored in hashed form.
- Password should not appear in API responses.
- JWT token should be required for protected routes.
- Role-based access should be applied for admin and patient routes.
