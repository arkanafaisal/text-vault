# Textvault API Documentation

## Overview

This documentation contains the data contract specifications for the Frontend and Backend integration of the **Textvault** application. All requests to the server and responses from the server use the JSON format.

* **Base URL (Development):** http://localhost:3000
* **Base URL (Production):** [https://api.textvault.arkanafaisal.my.id](https://api.textvault.arkanafaisal.my.id) *(The /api prefix applies to functional routes)*

---

## 🔒 Authentication & Headers

Most endpoints are private and require authentication. The Textvault backend uses a JWT approach sent directly via the Header (not Bearer format).

* **Header Key:** accessToken
* **Header Value:** <jwt_token_string>
* **Content-Type:** application/json

**Refresh Token Note:**
In addition to the access token, authentication endpoints (/login, /register) will set an httpOnly refreshToken cookie. The frontend must allow credentials (withCredentials: true in Axios or credentials: 'include' in Fetch) for the refresh token mechanism to work.

---

## 🚦 Global Status Codes & Errors

All endpoints can respond with the following standard status codes:

* **200 OK / 201 Created:** Request successful.
* **400 Bad Request:** Joi validation failed or incorrect data format. Example response:

    { "error": "password is required" }

* **401 Unauthorized:** Access token is missing, expired, or invalid.
* **403 Forbidden:** Attempting to modify/delete another user's data.
* **404 Not Found:** Data not found.
* **409 Conflict:** Data already exists (e.g., email is already registered).
* **429 Too Many Requests:** Rate limit exceeded. (Empty body).
* **500 Internal Server Error:** Server/database disruption.

---

## 1. 🩺 Server Health

### Check Server Health

Checks the availability status of the server, database, and redis cache.

* **Method:** GET
* **Path:** /health
* **Auth Required:** No

**Success Response (200 OK):**

    {
      "status": "ok",
      "uptime": 145020,
      "timestamp": 1715012345678,
      "environment": "development",
      "services": {
        "db": "ok",
        "redis": "ok"
      }
    }

---

## 2. 🔐 Authentication ( /api/auth )

### 2.1 Register

Register a new account. Will immediately receive an access token and a refresh token cookie.

* **Method:** POST
* **Path:** /api/auth/register
* **Auth Required:** No
* **Body Payload:**
  * username (string, required): Max 30 chars, alphanumeric only.
  * password (string, required): Min 6, Max 255 chars.

**Success Response (201 Created):**

    {
      "accessToken": "eyJhbGciOiJIUz..."
    }

### 2.2 Login

Login using username or email.

* **Method:** POST
* **Path:** /api/auth/login
* **Auth Required:** No
* **Body Payload:**
  * identifier (string, required): Can be either email or username.
  * password (string, required): User's password.

**Success Response (200 OK):**

    {
      "accessToken": "eyJhbGciOiJIUz..."
    }

### 2.3 Refresh Token

Request a new access token using the refreshToken inside the cookie.

* **Method:** POST
* **Path:** /api/auth/refresh
* **Auth Required:** No (Requires refreshToken Cookie)

**Success Response (200 OK):**

    {
      "accessToken": "eyJhbGciOiJIUz..."
    }

### 2.4 Logout

Delete the refresh token session on the server and clear the cookie on the client.

* **Method:** POST
* **Path:** /api/auth/logout
* **Auth Required:** No (Requires refreshToken Cookie)

**Success Response (200 OK):** *(Empty Body)*

### 2.5 Verify Email

Verify email using the token sent via email.

* **Method:** POST
* **Path:** /api/auth/verify-email/:token
* **Auth Required:** No
* **Path Parameters:**
  * token (string, required): 64 char hex string.

**Success Response (200 OK):** *(Empty Body)*

### 2.6 Forgot Password

Request a password reset link to the registered email.

* **Method:** POST
* **Path:** /api/auth/forgot-password
* **Auth Required:** No
* **Body Payload:**
  * email (string, required): Valid user email.

**Success Response (200 OK):** *(Empty Body)*

### 2.7 Reset Password

Reset the password using the reset token.

* **Method:** POST
* **Path:** /api/auth/reset-password/:token
* **Auth Required:** No
* **Path Parameters:**
  * token (string, required): 64 char hex string.
* **Body Payload:**
  * password (string, required): New password (Min 6, Max 255 chars).

**Success Response (200 OK):** *(Empty Body)*

---

## 3. 👤 Users ( /api/users )

### 3.1 Get My Profile

Fetch the profile data of the currently logged-in user.

* **Method:** GET
* **Path:** /api/users/me
* **Auth Required:** Yes (accessToken in Header)

**Success Response (200 OK):**

    {
      "displayName": "arkana",
      "email": "user@example.com",
      "publicKey": "pub_key_string"
    }

### 3.2 Update Username

Change username and displayName.

* **Method:** PATCH
* **Path:** /api/users/me/username
* **Auth Required:** Yes
* **Body Payload:**
  * username (string, required): Max 30 chars, alphanumeric.

**Success Response (200 OK):** *(Empty Body)*

### 3.3 Update Public Key

Change the user's public key.

* **Method:** PATCH
* **Path:** /api/users/me/public-key
* **Auth Required:** Yes
* **Body Payload:**
  * publicKey (string, required): Max 255 chars.

**Success Response (200 OK):** *(Empty Body)*

### 3.4 Request Email Verification

Request a verification token to be sent to a new email address.

* **Method:** PATCH
* **Path:** /api/users/me/email
* **Auth Required:** Yes
* **Body Payload:**
  * email (string, required): User's new email.

**Success Response (200 OK):** *(Empty Body)*

### 3.5 Update Password

Change the user's password (requires current password).

* **Method:** PATCH
* **Path:** /api/users/me/password
* **Auth Required:** Yes
* **Body Payload:**
  * oldPassword (string, required): Current password.
  * newPassword (string, required): New password (Min 6 chars).

**Success Response (200 OK):** *(Empty Body)*

### 3.6 Delete Account

Delete user account along with all associated data.

* **Method:** DELETE
* **Path:** /api/users/me
* **Auth Required:** Yes
* **Body Payload:**
  * username (string, required): Confirm username for deletion.

**Success Response (200 OK):** *(Empty Body)*

---

## 4. 📝 Data Vault ( /api/data )

*Note: All text data (content) is encrypted on the database side, but is automatically decrypted by the backend before being sent to the frontend.*

### 4.1 Get My Data (List)

Fetch the user's list of notes. Supports search, sort, and pagination.

* **Method:** GET
* **Path:** /api/data/me
* **Auth Required:** Yes
* **Query Parameters:**
  * sort (string, optional): 'newest' (default), 'oldest', or 'updated'.
  * visibility (string, optional): 'private' or 'public'.
  * search (string, optional): Max 128 chars. Searches in title or tags.
  * page (number, optional): Default 1.

**Success Response (200 OK):**

    [
      {
        "id": 1,
        "title": "Secret Note",
        "visibility": "private"
      }
    ]

### 4.2 Get Data By ID

Fetch the details of a specific note.

* **Method:** GET
* **Path:** /api/data/:id
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required): Data ID.

**Success Response (200 OK):**

    {
      "id": 1,
      "title": "Secret Note",
      "content": "Decrypted text content...",
      "tags": ["important", "secret"],
      "visibility": "private",
      "updatedAt": "2026-05-04T14:09:55.000Z"
    }

### 4.3 Create Data

Create a new note in the vault.

* **Method:** POST
* **Path:** /api/data/
* **Auth Required:** Yes
* **Body Payload:**
  * title (string, required): Max 31 chars.
  * content (string, required): Max 1000 chars.
  * tags (array of strings, optional): Max 5 items. Max 12 chars each.

**Success Response (201 Created):**

    {
      "id": 5,
      "visibility": "private",
      "title": "New Note",
      "tags": ["idea"]
    }

### 4.4 Update Data (Common)

Modify the title, content, and/or tags of a note. At least one field must be sent.

* **Method:** PUT
* **Path:** /api/data/:id
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required)
* **Body Payload (Send only what you want to change):**
  * title (string, optional)
  * content (string, optional)
  * tags (array, optional)

**Success Response (200 OK):** *(Empty Body)*

### 4.5 Update Visibility Status

Change the note's status to public or private.

* **Method:** PATCH
* **Path:** /api/data/:id/status
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required)
* **Body Payload:**
  * visibility (string, required): Must be 'private' or 'public'.

**Success Response (200 OK):** *(Empty Body)*

### 4.6 Delete Data

Delete a note.

* **Method:** DELETE
* **Path:** /api/data/:id
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required)

**Success Response (200 OK):** *(Empty Body)*

---

## 5. 🌍 Public Access ( /api/public )

### 5.1 Get Public Data

Fetch a user's list of notes with public status based on matching username and publicKey.

* **Method:** POST
* **Path:** /api/public/data
* **Auth Required:** No
* **Query Parameters:**
  * page (number, optional): Default 1.
* **Body Payload:**
  * username (string, required): Target username.
  * publicKey (string, required): Target public key.

**Success Response (200 OK):**

    [
      {
        "title": "Public Information",
        "content": "Decrypted text content...",
        "tags": ["info"]
      }
    ]

---

## 6. 📢 Feedback ( /api/feedback )

### 6.1 Submit Feedback

Send a feedback message to the system.

* **Method:** POST
* **Path:** /api/feedback/
* **Auth Required:** No
* **Body Payload:**
  * message (string, required): Feedback text (Min 10, Max 300 chars).

**Success Response (200 OK):** *(Empty Body)*