
"use strict";

/* =====================================================
   SECUREGEN PASSWORD GENERATOR
   ===================================================== */


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const passwordOutput = document.getElementById("passwordOutput");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

const entropyText = document.getElementById("entropyText");
const crackText = document.getElementById("crackText");

const scoreElement = document.getElementById("score");
const scoreTitle = document.getElementById("scoreTitle");
const scoreDescription = document.getElementById("scoreDescription");

const scoreCircle = document.querySelector(".score-circle");

const checkLength = document.getElementById("checkLength");
const checkVariety = document.getElementById("checkVariety");
const checkRandom = document.getElementById("checkRandom");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

const themeToggle = document.getElementById("themeToggle");

const toast = document.getElementById("toast");


/* =====================================================
   CHARACTER SETS
   ===================================================== */

const CHARACTER_SETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};


/* =====================================================
   APPLICATION STATE
   ===================================================== */

let currentPassword = "";

let passwordHistory = loadHistory();


/* =====================================================
   SECURE RANDOM NUMBER
   Uses Web Crypto API
   ===================================================== */

function secureRandom(max) {

    if (max <= 0) {
        return 0;
    }

    const randomValues = new Uint32Array(1);

    window.crypto.getRandomValues(randomValues);

    return randomValues[0] % max;
}


/* =====================================================
   GET SELECTED CHARACTER GROUPS
   ===================================================== */

function getSelectedGroups() {

    const groups = [];

    if (uppercaseCheckbox.checked) {
        groups.push(CHARACTER_SETS.uppercase);
    }

    if (lowercaseCheckbox.checked) {
        groups.push(CHARACTER_SETS.lowercase);
    }

    if (numbersCheckbox.checked) {
        groups.push(CHARACTER_SETS.numbers);
    }

    if (symbolsCheckbox.checked) {
        groups.push(CHARACTER_SETS.symbols);
    }

    return groups;
}


/* =====================================================
   GET ALL SELECTED CHARACTERS
   ===================================================== */

function getAllCharacters(groups) {

    let characters = "";

    groups.forEach(function(group) {
        characters += group;
    });

    return characters;
}


/* =====================================================
   SHUFFLE PASSWORD CHARACTERS
   ===================================================== */

function secureShuffle(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const randomIndex = secureRandom(i + 1);

        const temporary = result[i];

        result[i] = result[randomIndex];

        result[randomIndex] = temporary;
    }

    return result;
}


/* =====================================================
   GENERATE PASSWORD
   ===================================================== */

function generatePassword() {

    const length = Number(lengthSlider.value);

    const groups = getSelectedGroups();

    if (groups.length === 0) {

        showToast(
            "Please select at least one character type."
        );

        return;
    }


    if (length < groups.length) {

        showToast(
            "Increase the password length."
        );

        return;
    }


    const allCharacters =
        getAllCharacters(groups);

    const passwordCharacters = [];


    /*
       Add at least one character from
       every selected character group.
    */

    groups.forEach(function(group) {

        const index =
            secureRandom(group.length);

        passwordCharacters.push(
            group[index]
        );
    });


    /*
       Fill remaining positions.
    */

    while (passwordCharacters.length < length) {

        const index =
            secureRandom(allCharacters.length);

        passwordCharacters.push(
            allCharacters[index]
        );
    }


    /*
       Securely shuffle the characters.
    */

    const shuffledPassword =
        secureShuffle(passwordCharacters);


    currentPassword =
        shuffledPassword.join("");


    passwordOutput.value =
        currentPassword;


    /*
       Analyze password.
    */

    analyzePassword(currentPassword);


    /*
       Save password to history.
    */

    addToHistory(currentPassword);


    /*
       Animation.
    */

    passwordOutput.classList.remove(
        "generated"
    );

    void passwordOutput.offsetWidth;

    passwordOutput.classList.add(
        "generated"
    );
}


/* =====================================================
   GET CHARACTER POOL SIZE
   ===================================================== */

function getCharacterPoolSize(password) {

    let poolSize = 0;

    if (/[A-Z]/.test(password)) {
        poolSize += 26;
    }

    if (/[a-z]/.test(password)) {
        poolSize += 26;
    }

    if (/[0-9]/.test(password)) {
        poolSize += 10;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        poolSize += 32;
    }

    return poolSize;
}


/* =====================================================
   CALCULATE ENTROPY
   ===================================================== */

function calculateEntropy(password) {

    if (!password) {
        return 0;
    }

    const poolSize =
        getCharacterPoolSize(password);

    if (poolSize === 0) {
        return 0;
    }

    const entropy =
        password.length *
        Math.log2(poolSize);

    return Math.round(entropy);
}


/* =====================================================
   CALCULATE PASSWORD SCORE
   ===================================================== */

function calculateScore(password) {

    if (!password) {
        return 0;
    }

    let result = 0;

    const length = password.length;

    const entropy =
        calculateEntropy(password);


    /*
       Password length.
    */

    if (length >= 8) {
        result += 15;
    }

    if (length >= 12) {
        result += 15;
    }

    if (length >= 16) {
        result += 10;
    }

    if (length >= 24) {
        result += 10;
    }


    /*
       Character variety.
    */

    if (/[A-Z]/.test(password)) {
        result += 10;
    }

    if (/[a-z]/.test(password)) {
        result += 10;
    }

    if (/[0-9]/.test(password)) {
        result += 10;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        result += 10;
    }


    /*
       Entropy bonus.
    */

    if (entropy >= 60) {
        result += 5;
    }

    if (entropy >= 80) {
        result += 5;
    }


    return Math.min(result, 100);
}


/* =====================================================
   GET STRENGTH INFORMATION
   ===================================================== */

function getStrengthInfo(score) {

    if (score < 30) {

        return {
            name: "Very Weak",
            width: 20,
            color: "var(--danger)"
        };
    }


    if (score < 50) {

        return {
            name: "Weak",
            width: 40,
            color: "var(--warning)"
        };
    }


    if (score < 70) {

        return {
            name: "Moderate",
            width: 60,
            color: "var(--warning)"
        };
    }


    if (score < 90) {

        return {
            name: "Strong",
            width: 80,
            color: "var(--success)"
        };
    }


    return {
        name: "Excellent",
        width: 100,
        color: "var(--success)"
    };
}


/* =====================================================
   ANALYZE PASSWORD
   ===================================================== */

function analyzePassword(password) {

    const passwordScore =
        calculateScore(password);

    const entropy =
        calculateEntropy(password);

    const strength =
        getStrengthInfo(passwordScore);


    /*
       Strength bar.
    */

    strengthFill.style.width =
        strength.width + "%";

    strengthFill.style.background =
        strength.color;

    strengthText.textContent =
        strength.name;

    strengthText.style.color =
        strength.color;


    /*
       Entropy.
    */

    entropyText.textContent =
        "Entropy: " + entropy + " bits";


    /*
       Crack difficulty.
    */

    crackText.textContent =
        getCrackMessage(entropy);


    /*
       Score.
    */

    scoreElement.textContent =
        passwordScore;


    scoreTitle.textContent =
        getScoreTitle(passwordScore);


    scoreDescription.textContent =
        getScoreDescription(passwordScore);


    /*
       Score circle.
    */

    const degrees =
        passwordScore * 3.6;


    scoreCircle.style.background =
        "radial-gradient(circle, var(--bg2) 59%, transparent 60%), " +
        "conic-gradient(" +
        strength.color +
        " " +
        degrees +
        "deg, var(--input) " +
        degrees +
        "deg)";


    /*
       Security checks.
    */

    updateSecurityChecks(password);
}


/* =====================================================
   CRACK DIFFICULTY MESSAGE
   ===================================================== */

function getCrackMessage(entropy) {

    if (entropy < 30) {
        return "Easily guessable";
    }

    if (entropy < 40) {
        return "Could be cracked quickly";
    }

    if (entropy < 60) {
        return "Potentially crackable";
    }

    if (entropy < 80) {
        return "Very difficult to crack";
    }

    if (entropy < 100) {
        return "Extremely difficult";
    }

    return "Very high complexity";
}


/* =====================================================
   SCORE TITLE
   ===================================================== */

function getScoreTitle(score) {

    if (score < 30) {
        return "Very weak password";
    }

    if (score < 50) {
        return "Needs improvement";
    }

    if (score < 70) {
        return "Reasonably secure";
    }

    if (score < 90) {
        return "Strong password";
    }

    return "Excellent security";
}


/* =====================================================
   SCORE DESCRIPTION
   ===================================================== */

function getScoreDescription(score) {

    if (score < 30) {
        return "Increase the password length and character variety.";
    }

    if (score < 50) {
        return "Add more characters and use multiple character types.";
    }

    if (score < 70) {
        return "This password has reasonable complexity.";
    }

    if (score < 90) {
        return "This password provides strong protection.";
    }

    return "This password has excellent complexity.";
}


/* =====================================================
   COUNT CHARACTER TYPES
   ===================================================== */

function countCharacterTypes(password) {

    let count = 0;

    if (/[A-Z]/.test(password)) {
        count++;
    }

    if (/[a-z]/.test(password)) {
        count++;
    }

    if (/[0-9]/.test(password)) {
        count++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        count++;
    }

    return count;
}


/* =====================================================
   UPDATE SECURITY CHECKS
   ===================================================== */

function updateSecurityChecks(password) {

    const goodLength =
        password.length >= 12;

    const characterTypes =
        countCharacterTypes(password);

    const goodVariety =
        characterTypes >= 3;

    const generated =
        password.length > 0;


    setCheckState(
        checkLength,
        goodLength
    );

    setCheckState(
        checkVariety,
        goodVariety
    );

    setCheckState(
        checkRandom,
        generated
    );
}


/* =====================================================
   SET SECURITY CHECK STATE
   ===================================================== */

function setCheckState(element, active) {

    if (!element) {
        return;
    }

    const icon =
        element.querySelector("span");

    if (!icon) {
        return;
    }


    if (active) {

        element.classList.remove(
            "inactive"
        );

        icon.textContent =
            "✓";

    } else {

        element.classList.add(
            "inactive"
        );

        icon.textContent =
            "−";
    }
}


/* =====================================================
   COPY PASSWORD
   ===================================================== */

async function copyPassword() {

    if (!currentPassword) {

        showToast(
            "Generate a password first."
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(
            currentPassword
        );

        showToast(
            "Password copied!"
        );

    } catch (error) {

        /*
           Fallback method.
        */

        passwordOutput.select();

        document.execCommand("copy");

        showToast(
            "Password copied!"
        );
    }
}


/* =====================================================
   CLEAR PASSWORD
   ===================================================== */

function clearPassword() {

    currentPassword = "";

    passwordOutput.value = "";

    resetAnalysis();

    showToast(
        "Password cleared."
    );
}


/* =====================================================
   LOAD HISTORY
   ===================================================== */

function loadHistory() {

    try {

        const stored =
            localStorage.getItem(
                "secureGenHistory"
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;

    } catch (error) {

        return [];
    }
}


/* =====================================================
   ADD PASSWORD TO HISTORY
   ===================================================== */

function addToHistory(password) {

    /*
       Remove duplicate passwords.
    */

    passwordHistory =
        passwordHistory.filter(
            function(item) {

                return item.password !== password;
            }
        );


    /*
       Add newest password at beginning.
    */

    passwordHistory.unshift({
        password: password,
        time: new Date().toLocaleString()
    });


    /*
       Keep only latest 8 passwords.
    */

    passwordHistory =
        passwordHistory.slice(0, 8);


    localStorage.setItem(
        "secureGenHistory",
        JSON.stringify(passwordHistory)
    );


    renderHistory();
}


/* =====================================================
   RENDER HISTORY
   ===================================================== */

function renderHistory() {

    if (!historyList) {
        return;
    }


    if (passwordHistory.length === 0) {

        historyList.innerHTML =
            `
            <div class="empty-history">
                <span>🕘</span>
                <p>No passwords generated yet.</p>
            </div>
            `;

        return;
    }


    historyList.innerHTML =
        passwordHistory
            .map(function(item, index) {

                return `
                    <div class="history-item">

                        <div>

                            <div class="history-password">
                                ${escapeHTML(item.password)}
                            </div>

                            <small style="
                                display:block;
                                margin-top:4px;
                                color:var(--muted);
                                font-size:9px;
                            ">
                                ${escapeHTML(item.time)}
                            </small>

                        </div>

                        <div class="history-actions">

                            <button
                                type="button"
                                class="history-copy"
                                data-index="${index}"
                                title="Copy password"
                            >
                                📋
                            </button>

                            <button
                                type="button"
                                class="history-delete"
                                data-index="${index}"
                                title="Delete password"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>
                `;

            })
            .join("");
}


/* =====================================================
   HISTORY COPY / DELETE
   ===================================================== */

historyList.addEventListener(
    "click",
    async function(event) {

        const copyButton =
            event.target.closest(
                ".history-copy"
            );

        const deleteButton =
            event.target.closest(
                ".history-delete"
            );


        /*
           Copy history password.
        */

        if (copyButton) {

            const index =
                Number(copyButton.dataset.index);

            const item =
                passwordHistory[index];

            if (!item) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    item.password
                );

                showToast(
                    "Password copied!"
                );

            } catch (error) {

                showToast(
                    "Unable to copy password."
                );
            }

            return;
        }


        /*
           Delete history password.
        */

        if (deleteButton) {

            const index =
                Number(deleteButton.dataset.index);

            if (
                index < 0 ||
                index >= passwordHistory.length
            ) {
                return;
            }


            passwordHistory.splice(
                index,
                1
            );


            localStorage.setItem(
                "secureGenHistory",
                JSON.stringify(passwordHistory)
            );


            renderHistory();


            showToast(
                "Password removed."
            );
        }
    }
);


/* =====================================================
   CLEAR ALL HISTORY
   ===================================================== */

function clearAllHistory() {

    if (passwordHistory.length === 0) {

        showToast(
            "History is already empty."
        );

        return;
    }


    const confirmed =
        window.confirm(
            "Clear all generated password history?"
        );


    if (!confirmed) {
        return;
    }


    passwordHistory = [];


    localStorage.removeItem(
        "secureGenHistory"
    );


    renderHistory();


    showToast(
        "History cleared."
    );
}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   RESET ANALYSIS
   ===================================================== */

function resetAnalysis() {

    strengthFill.style.width =
        "0%";

    strengthFill.style.background =
        "var(--muted)";


    strengthText.textContent =
        "Not generated";

    strengthText.style.color =
        "var(--muted)";


    entropyText.textContent =
        "Entropy: 0 bits";


    crackText.textContent =
        "—";


    scoreElement.textContent =
        "0";


    scoreTitle.textContent =
        "Generate a password";


    scoreDescription.textContent =
        "Your password security analysis will appear here.";


    scoreCircle.style.background =
        "radial-gradient(circle, var(--bg2) 59%, transparent 60%), " +
        "conic-gradient(var(--primary) 0deg, var(--input) 0deg)";


    setCheckState(
        checkLength,
        false
    );

    setCheckState(
        checkVariety,
        false
    );

    setCheckState(
        checkRandom,
        false
    );
}


/* =====================================================
   TOAST
   ===================================================== */

let toastTimer = null;


function showToast(message) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    if (toastTimer !== null) {

        clearTimeout(
            toastTimer
        );
    }


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );
}


/* =====================================================
   THEME
   ===================================================== */

function setTheme(theme) {

    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

        themeToggle.textContent =
            "☀️";

    } else {

        document.body.classList.remove(
            "light"
        );

        themeToggle.textContent =
            "🌙";
    }


    localStorage.setItem(
        "secureGenTheme",
        theme
    );
}


/* =====================================================
   THEME TOGGLE
   ===================================================== */

themeToggle.addEventListener(
    "click",
    function() {

        const isLight =
            document.body.classList.contains(
                "light"
            );


        if (isLight) {

            setTheme("dark");

        } else {

            setTheme("light");
        }
    }
);


/* =====================================================
   LENGTH SLIDER
   ===================================================== */

lengthSlider.addEventListener(
    "input",
    function() {

        lengthValue.textContent =
            lengthSlider.value;
    }
);


/* =====================================================
   BUTTON EVENTS
   ===================================================== */

generateBtn.addEventListener(
    "click",
    generatePassword
);


copyBtn.addEventListener(
    "click",
    copyPassword
);


clearBtn.addEventListener(
    "click",
    clearPassword
);


clearHistoryBtn.addEventListener(
    "click",
    clearAllHistory
);


/* =====================================================
   KEYBOARD SHORTCUT
   Ctrl + Enter = Generate
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            generatePassword();
        }
    }
);


/* =====================================================
   INITIALIZE THEME
   ===================================================== */

const savedTheme =
    localStorage.getItem(
        "secureGenTheme"
    ) || "dark";

setTheme(savedTheme);


/* =====================================================
   INITIALIZE LENGTH
   ===================================================== */

lengthValue.textContent =
    lengthSlider.value;


/* =====================================================
   INITIALIZE HISTORY
   ===================================================== */

renderHistory();


/* =====================================================
   INITIALIZE ANALYSIS
   ===================================================== */

resetAnalysis();
