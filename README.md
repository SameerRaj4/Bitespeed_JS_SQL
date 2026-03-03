# 🚀 Bitespeed Identity Reconciliation API

A backend service built for Bitespeed's identity reconciliation task.  
This service consolidates multiple contact entries (email & phoneNumber) into a single customer identity.

---

## 📌 Features

- ✅ **POST /identify** endpoint
- ✅ Links contacts sharing same email or phone number
- ✅ Maintains one **primary** contact
- ✅ Converts overlapping primaries into secondaries
- ✅ Returns consolidated identity response

---
## 🧠 API Specification

### 🔹 POST `/identify`

---

### Request Body

```json
{
  "email": "morpheus@matrix.com",
  "phoneNumber": "101101"
}
