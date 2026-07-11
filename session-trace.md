# USSD Session Trace

**KEY**

```text
ussd:session:<sessionId>
```

### 1. User dials USSD

```
text = ""
```

Redis:

```text
(No session exists)
```

---

### 2. User selects **Add Lead**

```
text = "1"
```

Redis:

```json
{
  "state": "AWAITING_NAME",
  "data": {}
}
```

---

### 3. User enters name

```
Mohamed
```

Redis:

```json
{
  "state": "AWAITING_PHONE",
  "data": {
    "name": "Mohamed"
  }
}
```

---

### 4. User enters phone

```
0728051253
```

Redis:

```json
{
  "state": "CONFIRM",
  "data": {
    "name": "Mohamed",
    "phone": "0728051253"
  }
}
```

---

### 5. User saves or cancels

Redis:

```text
(No session exists)
```

The session is deleted after completion or automatically expires after **180 seconds** of inactivity.
