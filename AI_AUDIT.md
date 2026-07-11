# Day 1

## Protocol quirks log

### 1. Every response starts with CON or END

- `CON` keeps the session alive and shows the next screen.
- `END` closes the session and shows a final message.

### 2. Sessions expire after ~180 seconds

- If the user doesn't interact for 3 minutes, the carrier kills the session.
- The user must re-dial to start over.

### 3. The `text` field is cumulative, not the latest input

- Example: If the user picks 1, then 2, then 3, AT sends `text = "1*2*3"`.
- Your server receives the _entire_ history, not just "3".

### 4. Character budget is ~182 per screen

- USSD screens are limited to ~182 characters (some phones less).
- Menus longer than that get truncated mid-line.

### 5. Invalid menu options should re-render with CON, never END

- If the user types a wrong number, show the menu again with "Invalid. Try again."
- Ending the session on a bad keystroke is bad UX — feature-phone users will hang up and not re-dial.

# Day 2

## Missing try/catch if Redis goes down - Fixed

- Wrapped Redis operations and the USSD handler in `try/catch`.
- If Redis becomes unavailable or another unexpected error occurs, the application returns:
