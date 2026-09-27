# 🔐 SecureGen — Password Generator & Security Tool

SecureGen is a modern, responsive password generator and security analysis tool built using **HTML5, CSS3, and JavaScript**. It generates strong random passwords using the **Web Crypto API** and provides real-time password strength, entropy, and security analysis.

---

## ✨ Features

* 🔐 Secure password generation
* 🛡️ Web Crypto API for cryptographically stronger random values
* 📏 Adjustable password length from 6–64 characters
* 🔠 Uppercase character support
* 🔡 Lowercase character support
* 🔢 Number support
* 🔣 Symbol support
* 💪 Real-time password strength meter
* 📊 Security score from 0–100
* 🧮 Password entropy calculation
* 🔍 Character variety analysis
* 📋 Copy password to clipboard
* 🕘 Password generation history
* 💾 LocalStorage support
* 🗑️ Delete individual history items
* 🧹 Clear complete password history
* 🌙 Dark mode
* ☀️ Light mode
* 📱 Fully responsive design
* ✨ Modern glassmorphism interface
* ⚡ Keyboard shortcut for quick generation

---

## 🛠️ Tech Stack

| Technology      | Purpose                                     |
| --------------- | ------------------------------------------- |
| HTML5           | Application structure                       |
| CSS3            | UI design, responsive layout and animations |
| JavaScript ES6+ | Application logic                           |
| Web Crypto API  | Secure random number generation             |
| LocalStorage    | Theme and password history storage          |
| Clipboard API   | Copy generated passwords                    |

---

## 🔐 Security Approach

SecureGen uses the browser's **Web Crypto API** instead of relying solely on `Math.random()`.

The application uses:

```javascript
crypto.getRandomValues()
```

to obtain random values for password generation.

The generated password is constructed from the character categories selected by the user:

```text
Uppercase
    +
Lowercase
    +
Numbers
    +
Symbols
    ↓
Secure Password
```

---

## 📊 Password Analysis

SecureGen analyzes the generated password using several factors.

### Password Length

Longer passwords receive a higher security score.

### Character Variety

The application checks for:

* Uppercase letters
* Lowercase letters
* Numbers
* Symbols

### Entropy

Password entropy is estimated using the character pool and password length.

Conceptually:

```text
Entropy ≈ Length × log₂(Character Pool Size)
```

### Security Score

The application calculates a score between:

```text
0 ───────────────────────── 100
Weak                       Excellent
```

---

## 🖥️ Application Preview

The dashboard contains:

```text
┌─────────────────────────────────────────────┐
│ 🔐 SecureGen                         🌙     │
│ Password Security Tool                     │
├─────────────────────────────────────────────┤
│                                             │
│       Create stronger passwords.            │
│                                             │
├───────────────────────┬─────────────────────┤
│ PASSWORD GENERATOR    │ SECURITY ANALYSIS   │
│                       │                     │
│ [ Generated Password ]│       85 / 100      │
│                       │                     │
│ Strength ██████████   │ Strong Password     │
│                       │                     │
│ Length ─────●────     │ ✓ Good Length       │
│                       │ ✓ Character Variety │
│ ☑ Uppercase           │ ✓ Randomized        │
│ ☑ Lowercase           │                     │
│ ☑ Numbers             │                     │
│ ☑ Symbols             │                     │
│                       │                     │
│ [Generate Password]   │                     │
├───────────────────────┴─────────────────────┤
│ Recently Generated                          │
└─────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
SecureGen-Password-Tool/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🚀 How to Run

### Method 1 — VS Code Live Server

1. Clone the repository:

```bash
git clone https://github.com/Umeshyuvaraj-web/Securegen-Password-Tool.git
```

2. Open the project in VS Code.

3. Install the **Live Server** extension.

4. Right-click:

```text
index.html
```

5. Select:

```text
Open with Live Server
```

6. The application will open in your browser.

---

## 💻 Method 2 — Direct Browser

You can also open:

```text
index.html
```

directly in a modern browser.

However, **Live Server is recommended** for development and testing.

---

## 🎯 How to Use

### Step 1

Select the desired password length using the slider.

### Step 2

Choose the character types:

* Uppercase
* Lowercase
* Numbers
* Symbols

### Step 3

Click:

```text
⚡ Generate Password
```

### Step 4

Review the security analysis:

* Strength
* Entropy
* Security score
* Character variety
* Password complexity

### Step 5

Click:

```text
📋
```

to copy the password.

---

## 💾 LocalStorage

SecureGen uses browser LocalStorage to store:

* Generated password history
* Theme preference

The application does not require a backend or external database.

---

## 🌙 Theme System

SecureGen supports:

### Dark Mode

Designed for comfortable use in low-light environments.

### Light Mode

Provides a brighter interface for daytime use.

The selected theme is stored using LocalStorage.

---

## 📱 Responsive Design

The application adapts to:

```text
Desktop 💻
     ↓
Laptop
     ↓
Tablet
     ↓
Mobile 📱
```

CSS media queries automatically adjust the dashboard, cards, controls, and buttons for smaller screens.

---

## 🧠 Concepts Learned

This project demonstrates practical knowledge of:

* DOM Manipulation
* JavaScript Event Handling
* Functions
* Arrays
* Objects
* Regular Expressions
* ES6+ JavaScript
* Web Crypto API
* Clipboard API
* LocalStorage
* JSON
* Password entropy
* Password strength analysis
* Responsive CSS
* CSS Grid
* CSS Flexbox
* CSS animations
* Glassmorphism UI
* Theme switching
* Client-side security concepts

---

## 🔮 Future Improvements

Future versions could include:

* 🔑 Password manager integration
* 📈 Advanced password analytics
* 🧠 Dictionary-word detection
* 🚫 Common-password detection
* 🔎 Have I Been Pwned API integration
* 📥 Export password history
* 🔐 Master password protection
* 📱 Progressive Web App support
* 🌐 Multi-language support
* ⚙️ Custom symbol sets

---

## ⚠️ Security Note

SecureGen is an educational and portfolio project.

Generated passwords should be handled carefully. Avoid storing highly sensitive production passwords in browser history or LocalStorage.

For real-world password management, use a trusted password manager designed for secure credential storage.

---

## 🎓 Project Objective

The objective of SecureGen is to demonstrate how modern JavaScript browser APIs can be combined with security concepts to create a practical password generation and analysis application.

The project focuses on:

```text
Secure Randomness
       +
Password Complexity
       +
Entropy Analysis
       +
Modern UI
       +
Browser Storage
       ↓
SecureGen
```

---

## 👨‍💻 Author

**G. Umesh Yuvaraj**

B.Tech — Computer Science & Engineering
AI & ML Specialization

---

## 📌 Project Status

🟢 **Completed**

SecureGen is fully functional and can be extended with additional password-security features.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

### 📄 License

This project is created for educational and portfolio purposes.
