// =====================================================
// UNWORDLE NES - game.js (letter-based scoring + 4th color)
// =====================================================

// ---------- BASIC STATE ----------

const screens = {
    username: document.getElementById("username-screen"),
    menu: document.getElementById("menu-screen"),
    game: document.getElementById("game-screen"),
    leaderboard: document.getElementById("leaderboard-screen"),
    instructions: document.getElementById("instructions-screen"),
};

let currentUser = null;
let currentPassword = null;
let currentMode = null; // "daily" or "endless"
let secretWord = "";
const WORD_LENGTH = 5;
let maxGuesses = 6;
let guesses = []; // each guess: { word: "ABCDE", tiles: ["red","yellow",...]}
let score = 0;

// Tracks how many times each letter (A-Z) has been used
// *only counting letters that are NOT in the secret word*
let letterUsage = {}; // { 'A': count, 'B': count, ... }

// ---------- ELEMENTS ----------

// Username / profile
const usernameInput = document.getElementById("username-input");
const usernameConfirmBtn = document.getElementById("username-confirm-btn");
const usernameError = document.getElementById("username-error");
const welcomeText = document.getElementById("welcome-text");

// Main menu buttons
const dailyModeBtn = document.getElementById("daily-mode-btn");
const endlessModeBtn = document.getElementById("endless-mode-btn");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const instructionsBtn = document.getElementById("instructions-btn");
const changeUserBtn = document.getElementById("change-user-btn");

// Game UI
const gameModeLabel = document.getElementById("game-mode-label");
const scoreDisplay = document.getElementById("score-display");
const gameBoard = document.getElementById("game-board");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const gameMessage = document.getElementById("game-message");
const backToMenuBtn = document.getElementById("back-to-menu-btn");

// Leaderboard UI
const tabDaily = document.getElementById("tab-daily");
const tabAllTime = document.getElementById("tab-alltime");
const lbModeDaily = document.getElementById("lb-mode-daily");
const lbModeEndless = document.getElementById("lb-mode-endless");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardBackBtn = document.getElementById("leaderboard-back-btn");

// Instructions
const instructionsBackBtn = document.getElementById("instructions-back-btn");

// Leaderboard state
let lbType = "daily"; // "daily" or "allTime"
let lbMode = "daily"; // "daily" or "endless"

// =====================================================
//  WORD GENERATION (TEMP: 10 WORDS FOR DAILY/ENDLESS)
//  These are used only as secret words.
// =====================================================

const WORDS = [
    "APPLE",
    "ROBOT",
    "SNAKE",
    "TIGER",
    "PIZZA",
    "GHOST",
    "LEMON",
    "NINJA",
    "WATER",
    "ZEBRA"
];

// =====================================================
//  DICTIONARY API VALIDATION
//  (Still used to ensure guesses are real words)
// =====================================================

async function isRealWord(word) {
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=abff2896-0554-4d68-abd0-e9fd058521ec`;

    try {
        const res = await fetch(url);
        if (!res.ok) return false;

        const data = await res.json();

        // Merriam-Webster returns:
        // - array of objects if valid
        // - array of strings if invalid
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
            return true;
        }

        return false;
    } catch (err) {
        console.error("Dictionary API error:", err);
        // If dictionary fails, we could allow the word or reject it.
        // Here we choose to allow, to avoid breaking the game.
        return true;
    }
}

// =====================================================
//  PROFILE SYSTEM (LOCAL STORAGE)
// =====================================================

const STORAGE_KEY_PROFILE = "unwordle_profile";

function hashPassword(pw) {
    let h = 0;
    for (let i = 0; i < pw.length; i++) {
        h = (h * 31 + pw.charCodeAt(i)) >>> 0;
    }
    return h.toString(16);
}

function saveProfile(username, password) {
    const profile = {
        username,
        passwordHash: hashPassword(password)
    };
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
}

function loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

async function ensurePasswordForUser(username) {
    const profile = loadProfile();
    const existingUser = profile?.username;

    if (!existingUser || existingUser !== username) {
        const pw = prompt("Create a password for your profile:");
        if (!pw || pw.trim().length < 3) {
            alert("Password must be at least 3 characters.");
            return false;
        }
        currentPassword = pw.trim();
        saveProfile(username, currentPassword);
        return true;
    } else {
        const pw = prompt("Enter your password:");
        if (!pw) {
            alert("Password required.");
            return false;
        }
        if (hashPassword(pw.trim()) !== profile.passwordHash) {
            alert("Incorrect password.");
            return false;
        }
        currentPassword = pw.trim();
        return true;
    }
}

// =====================================================
//  UTILS
// =====================================================

function showScreen(name) {
    Object.values(screens).forEach(s => s.style.display = "none");
    screens[name].style.display = "block";
}

function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function getDailyWord() {
    const key = todayKey();
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return WORDS[hash % WORDS.length];
}

function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function clearBoard() {
    gameBoard.innerHTML = "";
    guesses = [];
    letterUsage = {}; // reset letter usage each game
}

function updateScoreDisplay() {
    scoreDisplay.textContent = "SCORE: " + score;
}

// =====================================================
//  GAME SETUP
// =====================================================

function startMode(mode) {
    currentMode = mode;
    clearBoard();
    gameMessage.textContent = "";
    guessInput.value = "";
    score = 0;
    updateScoreDisplay();

    if (mode === "daily") {
        secretWord = getDailyWord();
        gameModeLabel.textContent = "DAILY MODE";
    } else {
        secretWord = getRandomWord();
        gameModeLabel.textContent = "ENDLESS MODE";
    }

    console.log("SECRET WORD (debug):", secretWord); // remove in production

    renderBoard();
    showScreen("game");
    guessInput.focus();
}

// =====================================================
//  RENDERING (COLORS COME FROM STORED TILES)
// =====================================================

function renderBoard() {
    gameBoard.innerHTML = "";

    // Render existing guesses
    for (const guess of guesses) {
        const row = document.createElement("div");
        row.className = "row";

        const guessStr = guess.word;
        const tiles = guess.tiles;

        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";

            const letter = guessStr[i];
            tile.textContent = letter || "";

            const type = tiles[i]; // "red","yellow","overused","green"
            if (type) {
                tile.classList.add(type);
            }

            row.appendChild(tile);
        }

        gameBoard.appendChild(row);
    }

    // Empty rows
    for (let r = guesses.length; r < maxGuesses; r++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            row.appendChild(tile);
        }
        gameBoard.appendChild(row);
    }
}

// =====================================================
//  LETTER-BASED SCORING LOGIC
// =====================================================
//
// Per letter in the guess:
//   - If NOT in secret word:
//       * first time overall:   +2 (red)
//       * second time overall:  +1 (yellow)
//       * 3rd+ time overall:    0 (overused color)
//   - If IN secret word:
//       * each time:           -2 (green)
//

function scoreGuessAndClassify(guessWord) {
    const tiles = [];
    let delta = 0;

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guessWord[i];
        const inSecret = secretWord.includes(letter);

        if (inSecret) {
            // BAD: letter is in the secret word → -2
            delta -= 2;
            tiles.push("green");
        } else {
            const usedBefore = letterUsage[letter] || 0;

            if (usedBefore === 0) {
                // First time using this safe letter → +2, red
                delta += 2;
                tiles.push("red");
            } else if (usedBefore === 1) {
                // Second time using this safe letter → +1, yellow
                delta += 1;
                tiles.push("yellow");
            } else {
                // 3rd+ time using this safe letter → 0, overused
                tiles.push("overused");
            }

            letterUsage[letter] = usedBefore + 1;
        }
    }

    score += delta;
    return tiles;
}

// =====================================================
//  GUESS HANDLING (WITH DICTIONARY API)
// =====================================================

async function handleGuess() {
    const raw = guessInput.value.toUpperCase().trim();
    if (!raw) return;

    if (raw.length !== WORD_LENGTH) {
        gameMessage.textContent = `WORD MUST BE ${WORD_LENGTH} LETTERS.`;
        return;
    }

    // Validate using dictionary API
    const valid = await isRealWord(raw);
    if (!valid) {
        gameMessage.textContent = "NOT A REAL WORD.";
        return;
    }

    if (guesses.length >= maxGuesses) {
        gameMessage.textContent = `OUT OF GUESSES. WORD WAS: ${secretWord}`;
        return;
    }

    // Score this guess and determine tile colors
    const tiles = scoreGuessAndClassify(raw);
    updateScoreDisplay();

    guesses.push({ word: raw, tiles });
    renderBoard();
    guessInput.value = "";
    gameMessage.textContent = "";

    if (guesses.length >= maxGuesses) {
        gameMessage.textContent = `GAME OVER. WORD WAS: ${secretWord}`;
        submitScore(currentMode, score);
    }
}

// =====================================================
//  LEADERBOARD
// =====================================================

async function loadLeaderboard() {
    leaderboardList.textContent = "LOADING...";

    const params = new URLSearchParams({
        type: lbType,
        mode: lbMode
    });

    try {
        const res = await fetch(`/.netlify/functions/getLeaderboard?${params.toString()}`);
        if (!res.ok) {
            leaderboardList.textContent = "ERROR LOADING LEADERBOARD.";
            return;
        }
        const data = await res.json();
        renderLeaderboard(data);
    } catch (err) {
        leaderboardList.textContent = "NETWORK ERROR.";
    }
}

function renderLeaderboard(entries) {
    if (!entries || entries.length === 0) {
        leaderboardList.textContent = "NO SCORES YET.";
        return;
    }

    leaderboardList.innerHTML = "";
    entries.forEach((row, idx) => {
        const div = document.createElement("div");
        div.className = "lb-row";

        const rank = document.createElement("span");
        rank.className = "lb-rank";
        rank.textContent = (idx + 1) + ".";

        const name = document.createElement("span");
        name.className = "lb-name";
        name.textContent = row.username || "PLAYER";

        const scoreSpan = document.createElement("span");
        scoreSpan.className = "lb-score";
        scoreSpan.textContent = row.score;

        div.appendChild(rank);
        div.appendChild(name);
        div.appendChild(scoreSpan);
        leaderboardList.appendChild(div);
    });
}

async function submitScore(mode, score) {
    if (!currentUser) return;

    const payload = {
        username: currentUser,
        mode,
        score
    };

    try {
        await fetch("/.netlify/functions/addScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error("Error submitting score:", err);
    }
}

// =====================================================
//  EVENT LISTENERS
// =====================================================

// Username / profile screen
usernameConfirmBtn.addEventListener("click", async () => {
    const name = usernameInput.value.toUpperCase().trim();
    if (!name) {
        usernameError.textContent = "ENTER A NAME.";
        return;
    }
    if (name.length < 3) {
        usernameError.textContent = "NAME TOO SHORT.";
        return;
    }

    const ok = await ensurePasswordForUser(name);
    if (!ok) return;

    currentUser = name;
    usernameError.textContent = "";
    welcomeText.textContent = `WELCOME, ${currentUser}!`;
    showScreen("menu");
});

usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") usernameConfirmBtn.click();
});

// Menu
dailyModeBtn.addEventListener("click", () => startMode("daily"));
endlessModeBtn.addEventListener("click", () => startMode("endless"));
leaderboardBtn.addEventListener("click", () => {
    showScreen("leaderboard");
    loadLeaderboard();
});
instructionsBtn.addEventListener("click", () => showScreen("instructions"));
changeUserBtn.addEventListener("click", () => {
    currentUser = null;
    currentPassword = null;
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    usernameInput.value = "";
    usernameError.textContent = "";
    showScreen("username");
});

// Game
guessBtn.addEventListener("click", handleGuess);
guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleGuess();
});

backToMenuBtn.addEventListener("click", () => showScreen("menu"));

// Leaderboard controls
tabDaily.addEventListener("click", () => {
    lbType = "daily";
    tabDaily.classList.add("active");
    tabAllTime.classList.remove("active");
    loadLeaderboard();
});

tabAllTime.addEventListener("click", () => {
    lbType = "allTime";
    tabAllTime.classList.add("active");
    tabDaily.classList.remove("active");
    loadLeaderboard();
});

lbModeDaily.addEventListener("click", () => {
    lbMode = "daily";
    lbModeDaily.classList.add("active");
    lbModeEndless.classList.remove("active");
    loadLeaderboard();
});

lbModeEndless.addEventListener("click", () => {
    lbMode = "endless";
    lbModeEndless.classList.add("active");
    lbModeDaily.classList.remove("active");
    loadLeaderboard();
});

leaderboardBackBtn.addEventListener("click", () => showScreen("menu"));

// Instructions
instructionsBackBtn.addEventListener("click", () => showScreen("menu"));

// =====================================================
//  INIT
// =====================================================

(function init() {
    const profile = loadProfile();
    if (profile && profile.username) {
        currentUser = profile.username.toUpperCase();
        usernameInput.value = currentUser;
        welcomeText.textContent = `WELCOME, ${currentUser}!`;
        showScreen("menu");
    } else {
        showScreen("username");
    }
})();

