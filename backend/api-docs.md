```markdown
# API Documentation

## 1. API Overview

### Base URLs
- **Development:** `http://localhost:3000`
- **Production:** `https://databox.arkanafaisal.my.id`

### Authentication Mechanism
- **Type:** JWT (JSON Web Token) stored in **HttpOnly Cookies**.
- **Cookies:**
  - `accessToken`: Short-lived (10 minutes). Used for authorization.
  - `refreshToken`: Long-lived (7 days). Used to regenerate access tokens.
- **Frontend Requirement:** All requests must include `credentials: true` (or `withCredentials: true` in axios/fetch) to send cookies.

### Global Headers
- `Content-Type`: `application/json` (Required for POST/PATCH/PUT requests with body)

### Standard Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "message": string,
  "data": any | null, // Optional
  "code": number // Optional, specific error codes (e.g., 40101)
}

```

---

## 2. Authentication & Authorization

| Feature | Details |
| --- | --- |
| **Auth Type** | Cookie-based JWT + Redis State Management |
| **Access Token** | JWT (Expires: 10 mins). Contains `user.id`. |
| **Refresh Token** | UUID (Expires: 7 days). Stored in Redis with rotation. |
| **Security** | HttpOnly, Secure, SameSite (Lax/None depending on env). |

---

## 3. Endpoint Specifications

### A. Authentication Module (`/auth`)

#### 1. Register

* **Method:** `POST`
* **Path:** `/auth/register`
* **Rate Limit:** 20 req / 10 min
* **Auth Required:** No
* **Body:**
```json
{
  "username": "user123", // Required, alphanumeric, max 32
  "email": "user@example.com", // Optional, valid email
  "password": "securePassword123" // Required, max 255
}

```


* **Response:**
* `200 OK`: `{"success": true, "message": "register success"}`
* `400 Bad Request`: `{"success": false, "message": "username or email is already taken"}`



#### 2. Login

* **Method:** `POST`
* **Path:** `/auth/login`
* **Rate Limit:** 20 req / 5 min
* **Auth Required:** No
* **Body:**
```json
{
  "identifier": "user123", // Required (Username OR Email)
  "password": "securePassword123" // Required
}

```


* **Response:**
* `200 OK`: `{"success": true, "message": "login success"}` (Sets `accessToken` & `refreshToken` cookies)
* `400 Bad Request`: `{"success": false, "message": "wrong username, email or password"}`



#### 3. Refresh Token

* **Method:** `POST`
* **Path:** `/auth/refresh`
* **Rate Limit:** 30 req / 1 min
* **Auth Required:** Yes (via `refreshToken` cookie)
* **Description:** Generates a new `accessToken` cookie.
* **Response:**
* `200 OK`: `{"success": true, "message": "new access token created"}`
* `401 Unauthorized`: `{"success": false, "message": "please login"}`



#### 4. Logout

* **Method:** `DELETE`
* **Path:** `/auth/logout`
* **Rate Limit:** 15 req / 1 min
* **Auth Required:** No (uses cookies if present)
* **Description:** Invalidates refresh token in Redis and clears cookies.
* **Response:**
* `200 OK`: `{"success": true, "message": "logout success"}`



---

### B. User Module (`/users`)

#### 1. Get My Profile

* **Method:** `POST`
* **Path:** `/users/me`
* **Rate Limit:** 120 req / 1 min
* **Auth Required:** Yes
* **Response:**
```json
{
  "success": true,
  "message": "profile retrieved",
  "data": {
    "username": "user123",
    "email": "user@example.com",
    "publicKey": "somePublicKeyString"
  }
}

```



#### 2. Search Username

* **Method:** `GET`
* **Path:** `/users/search/:username`
* **Rate Limit:** 60 req / 1 min
* **Auth Required:** No
* **Path Params:** `username` (string)
* **Response:**
* `200 OK`: `{"success": true, "message": "user found", "data": "username"}`
* `400 Bad Request`: `{"success": false, "message": "user not found"}`



#### 3. Edit Username

* **Method:** `PATCH`
* **Path:** `/users/username`
* **Rate Limit:** 40 req / 5 min
* **Auth Required:** Yes
* **Body:**
```json
{
  "newUsername": "newUser123", // Required
  "password": "currentPassword" // Required for verification
}

```


* **Response:**
* `200 OK`: `{"success": true, "message": "username changed", "data": "newUser123"}`



#### 4. Edit Public Key

* **Method:** `PATCH`
* **Path:** `/users/public-key`
* **Rate Limit:** 20 req / 1 min
* **Auth Required:** Yes
* **Body:**
```json
{
  "newPublicKey": "newKeyString" // Required, max 255 chars
}

```


* **Response:**
* `200 OK`: `{"success": true, "message": "public key changed", "data": "newKeyString"}`



#### 5. Edit Email (Request)

* **Method:** `PATCH`
* **Path:** `/users/email`
* **Rate Limit:** 10 req / 15 min
* **Auth Required:** Yes
* **Description:** Sends a verification email to the new address. Does not change email immediately.
* **Body:**
```json
{
  "newEmail": "new@example.com", // Required
  "password": "currentPassword" // Required
}

```


* **Response:**
* `200 OK`: `{"success": true, "message": "verification email has been sent to new@example.com"}`



#### 6. Verify Email Change

* **Method:** `GET`
* **Path:** `/users/verify-email`
* **Rate Limit:** 10 req / 15 min
* **Auth Required:** No
* **Query Params:** `token` (Required, 64-char hex string)
* **Example:** `/users/verify-email?token=abcdef...`
* **Response:**
* `200 OK`: `{"success": true, "message": "success, your account email changed to..."}`



#### 7. Request Password Reset

* **Method:** `POST`
* **Path:** `/users/reset-password`
* **Rate Limit:** 5 req / 15 min
* **Auth Required:** Yes (Note: Code logic requires `req.user.id`, implying user must be logged in to reset password via this route, or middleware is misconfigured for a "forgot password" flow. Strictly documenting code behavior: **Auth IS Required**).
* **Response:**
* `200 OK`: `{"success": true, "message": "verification email has been sent to..."}`



#### 8. Verify Reset Password

* **Method:** `POST`
* **Path:** `/users/verify-reset-password`
* **Rate Limit:** 10 req / 15 min
* **Auth Required:** No
* **Query Params:** `token` (Required)
* **Body:**
```json
{
  "newPassword": "newSecurePassword" // Required
}

```


* **Response:**
* `200 OK`: `{"success": true, "message": "password changed"}`



---

### C. Data Module (`/data`)

#### 1. Add Data

* **Method:** `POST`
* **Path:** `/data/add`
* **Rate Limit:** 30 req / 1 min
* **Auth Required:** Yes
* **Body:**
```json
{
  "title": "My Note", // Required, max 16 chars
  "body": "Content here..." // Required, max 1024 chars
}

```


* **Response:**
* `200 OK`:
```json
{
  "success": true,
  "message": "data added successfully",
  "data": { "id": 1, "title": "My Note", "body": "...", "access": "private" }
}

```





#### 2. Get My Data

* **Method:** `GET`
* **Path:** `/data/me`
* **Rate Limit:** 120 req / 1 min
* **Auth Required:** Yes
* **Description:** Returns all data belonging to the authenticated user.
* **Response:**
* `200 OK`: `{"success": true, "data": [{ "id": 1, "title": "...", "body": "...", "access": "public/private" }]}`



#### 3. Delete Data

* **Method:** `DELETE`
* **Path:** `/data/delete/:id`
* **Rate Limit:** 30 req / 1 min
* **Auth Required:** Yes
* **Path Params:** `id` (integer)
* **Response:**
* `200 OK`: `{"success": true, "message": "data deleted successfully"}`



#### 4. Update Access (Toggle)

* **Method:** `POST`
* **Path:** `/data/update/access/:id`
* **Rate Limit:** 60 req / 1 min
* **Auth Required:** Yes
* **Description:** Toggles visibility between 'public' and 'private'.
* **Path Params:** `id` (integer)
* **Response:**
* `200 OK`: `{"success": true, "message": "access updated successfully", "data": "public"}`



#### 5. Edit Data Content

* **Method:** `PATCH`
* **Path:** `/data/edit/:id`
* **Rate Limit:** 30 req / 1 min
* **Auth Required:** Yes
* **Path Params:** `id` (integer)
* **Body:**
```json
{
  "title": "Updated Title", // Required
  "body": "Updated Body" // Required
}

```


* **Response:**
* `200 OK`: `{"success": true, "message": "successfully edit data"}`



#### 6. Get Public Profile Data

* **Method:** `POST`
* **Path:** `/data/profile/:username`
* **Rate Limit:** 120 req / 1 min
* **Auth Required:** No
* **Path Params:** `username` (Target user)
* **Body:**
```json
{
  "publicKey": "targetUserPublicKey" // Required matching the target user's public key (if they have one set).
}

```


* **Response:**
* `200 OK`: Returns array of data items where `access = 'public'`.
* `400 Bad Request`: `{"success": false, "message": "permission denied"}` (If public key mismatch).



---

## 4. Data Models

### User Entity

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | Integer | Primary Key | Auto-increment |
| `username` | String | Unique, Max 32 | Alphanumeric only |
| `email` | String | Unique, Max 64 | Valid email format |
| `password` | String | Max 255 | Hashed (Bcrypt) |
| `publicKey` | String | Max 255 | Optional security key |

### UserData Entity

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | Integer | Primary Key | Auto-increment |
| `user_id` | Integer | Foreign Key | Owner of data |
| `title` | String | Max 16 | Required |
| `body` | String | Max 1024 | Required |
| `access` | Enum | 'public', 'private' | Defaults to 'private' |

---

## 5. Error Handling & Codes

### HTTP Status Codes

* `200`: Success.
* `400`: Bad Request (Validation failure, logic error).
* `401`: Unauthorized (Missing or invalid token).
* `429`: Too Many Requests (Rate limit exceeded).
* `500`: Internal Server Error.

### Custom App Codes (`code` field in response)

* `40101`: Specific token error (Token Invalid, Token Expired, or User mismatch).
* **Action:** Frontend should trigger a logout or refresh flow immediately.



---

## 6. Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development` or `production` (affects CORS/Cookies) |
| `JWT_SECRET` | Yes | Secret key for signing Access Tokens |
| `DB_HOST` | Yes | Database Host (Implied config) |
| `DB_USER` | Yes | Database User |
| `DB_PASS` | Yes | Database Password |
| `DB_NAME` | Yes | Database Name |
| `REDIS_HOST` | Yes | Redis Host (Implied config) |
| `REDIS_PORT` | Yes | Redis Port |

```

```