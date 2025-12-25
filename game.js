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
let guesses = []; // each guess: { word: "ABCDE", tiles: ["green","red",...]}
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
// =====================================================

const WORDS = [
"BRINK","SLOPE","MIRTH","CLOVE","PUNCH","GRAZE","FROTH","WIDEN","SCARF","PLUCK",
"JELLY","TOWER","BRISK","MANGO","FABLE","CRATE","SWEAR","GIDDY","TRAIL","NOBLE",
"FROST","QUILT","SPARK","DODGE","BLUNT","HONEY","CRISP","WALTZ","RUMOR","GROVE",
"PATCH","SMOKE","BRAWL","TUNIC","FLEET","MOUND","PRISM","SHORE","GRIND","TANGO",
"VAPOR","SNAKE","BERRY","CARGO","DWELL","MOTTO","SWEET","PLANT","GHOST","BRAVE",
"CHALK","FLOCK","TWEAK","MERCY","SPOON","GRASS","TWIRL","HUMID","CROWD","SPILL",
"KNACK","FUDGE","WHALE","CROWN","BLAST","MIRTH","SLOTH","GRAPE","TROOP","FLAIR",
"CRANK","SWORD","MELON","PRONE","STORM","BLISS","CHIME","FROGS","WOVEN","GRANT",
"PLAIN","SCOUR","TREAT","MIGHT","SPORE","BRACE","CLOUD","DWARF","MUSIC","SHINY",
"FABLE","TULIP","SWEPT","GROAN","PLUSH","CRUSH","SMACK","WIDER","GRIMY","TAPER",
"FROZE","SPOOK","BRINE","CLOVE","MIRTH","STEEP","PLUCK","GRAIL","TWIST","SHORE",
"FLESH","CROOK","DWELT","MANGO","SPARK","BRINK","TOWER","GIDDY","CRATE","SWEAR",
"PLANT","GHOST","BRAWL","TUNIC","FLEET","MOUND","PRISM","SHORE","GRIND","TANGO",
"VAPOR","SNAKE","BERRY","CARGO","DWELL","MOTTO","SWEET","PLANT","GHOST","BRAVE",
"CHALK","FLOCK","TWEAK","MERCY","SPOON","GRASS","TWIRL","HUMID","CROWD","SPILL",
"KNACK","FUDGE","WHALE","CROWN","BLAST","SLOTH","GRAPE","TROOP","FLAIR","CRANK",
"STORM","BLISS","CHIME","FROGS","WOVEN","GRANT","PLAIN","SCOUR","TREAT","MIGHT",
"SPORE","BRACE","CLOUD","DWARF","MUSIC","SHINY","FABLE","TULIP","SWEPT","GROAN",
"RIPEN","SLOOP","MIRTH","GROUT","PLIER","SHACK","TWINE","FORGE","BLUER","CRUMB",
"STING","WAVER","PLAZA","GUSTO","BRIAR","MOTIF","SLOSH","GRUEL","TWEED","HATCH",
"PRIME","SCOOP","FLUTE","GRASP","TROVE","SMIRK","DWELT","MASON","SWEPT","GROIN",
"PLUCK","FROZE","BRINK","TAPER","GIDDY","SCOUT","WREAK","MOUND","SPOIL","BRACE",
"TWIRL","FLESH","CROWD","GRAIL","PLANT","SHORE","MERCY","STEEP","GHOST","BRAWL",
"TRICK","SPORE","FLAIR","GRIND","TANGO","VAPOR","SNAKE","BERRY","CARGO","DWELL",
"MOTTO","SWEET","TWIST","HUMID","CROOK","SPILL","KNACK","FUDGE","WHALE","CROWN",
"BLAST","SLOTH","GRAPE","TROOP","FLAKE","CRANK","STORM","BLISS","CHIME","WOVEN",
"GRANT","PLAIN","SCOUR","TREAT","MIGHT","SPOOK","BRINE","CLOVE","MIRTH","TULIP",
"SMACK","GROAN","PLUSH","CRUSH","WIDER","GRIMY","TWEAK","SHINY","FABLE","TOWER",
"PATCH","SWEAR","GRAZE","FROTH","WIDEN","SCARF","PLUCK","JELLY","BRISK","MANGO",
"FABLE","CRATE","SWEAR","GIDDY","TRAIL","NOBLE","FROST","QUILT","SPARK","DODGE",
"BLUNT","HONEY","CRISP","WALTZ","RUMOR","GROVE","PATCH","SMOKE","BRAWL","TUNIC",
"FLEET","MOUND","PRISM","SHORE","GRIND","TANGO","VAPOR","SNAKE","BERRY","CARGO",
"DWELL","MOTTO","SWEET","PLANT","GHOST","BRAVE","CHALK","FLOCK","TWEAK","MERCY",
"SPOON","GRASS","TWIRL","HUMID","CROWD","SPILL","KNACK","FUDGE","WHALE","CROWN",
"BLAST","SLOTH","GRAPE","TROOP","FLAIR","CRANK","STORM","BLISS","CHIME","FROGS",
"WOVEN","GRANT","PLAIN","SCOUR","TREAT","MIGHT","SPORE","BRACE","CLOUD","DWARF",
"ABYSS","BROOM","CUMIN","DROOP","ELATE","FROCK","GAUZE","HITCH","IVORY","JOKER",
"KNEEL","LATCH","MAMBO","NERVE","OZONE","PIVOT","QUARK","RHYME","SALSA","TWEAK",
"ULCER","VIXEN","WIDOW","YACHT","ZESTY","AMBLE","BURLY","CADDY","DINGO","EPOCH",
"FABLE","GROUT","HUSKY","INFER","JUMBO","KHAKI","LUNGE","MOLDY","NINJA","OPERA",
"PRONG","QUAIL","RIPER","SABLE","TANGO","UNIFY","VAPID","WOOZY","YOUTH","ZONED",
"ALGAE","BISON","CLOVE","DROVE","ENVOY","FROZE","GIDDY","HONEY","INLET","JAZZY",
"KIOSK","LEMON","MIRTH","NOBLE","OASIS","PRAWN","QUILT","RAVEN","SCOUT","TULIP",
"UPPER","VIGOR","WREAK","YIELD","ZEBRA","AMBER","BLAZE","CARGO","DRAFT","ELBOW",
"FLEET","GROVE","HUMID","INNER","JELLY","KNOCK","LATCH","MANGO","NURSE","OCTAL",
"PLUSH","QUAKE","ROVER","SMACK","TWEED","URBAN","VOUCH","WOVEN","YODEL","ZONAL",
"ALERT","BRINE","CROWD","DROOP","EAGER","FROTH","GRAIL","HATCH","INPUT","JOKED",
"KNEAD","LUNAR","MELON","NORTH","OPINE","PRIME","QUARK","RIPEN","SCARF","TWEET",
"ULTRA","VAPOR","WIDEN","YOUNG","ZESTS","AMUSE","BLUFF","CROWN","DROOL","ELDER",
"FROGS","GRIND","HUMOR","INDEX","JOLLY","KNIFE","LURCH","MOOSE","NIGHT","OMEGA",
"PLIER","QUILL","ROBIN","SMOKE","TUNIC","USING","VOWEL","WORTH","YUMMY","ZIPPY",
"ALIVE","BRISK","CUMIN","DWELL","ELOPE","FUDGE","GRASS","HOUND","ISSUE","JUMPY",
"KRAUT","LEVER","MOUND","NUTTY","ONION","PRISM","QUOTA","RUSTY","SHINY","TRUCE",
"ABHOR","ABIDE","ABLAZE","ABRID","ACRID","ADORN","AFFIX","AGAPE","AGATE","AGLOW",
"AGONY","AIDER","AIMED","AISLE","ALIBI","ALLOT","ALOOF","ALTER","AMISS","AMITY",
"AMPLE","ANGST","ANNEX","ANTIC","APART","APING","ARBOR","ARGON","AROMA","ASCEND",
"ASHEN","ASKEW","ATOLL","AUDIO","AUGUR","AURAL","AVIAN","AVOID","AWOKE","AXIOM",
"AZURE","BADLY","BAGEL","BALMY","BANDY","BANJO","BARON","BASIN","BATCH","BATON",
"BAWDY","BEFIT","BEGUN","BELCH","BELIE","BILGE","BINGE","BISON","BLARE","BLEAK",
"BLEND","BLIMP","BLITZ","BLOAT","BLURB","BOAST","BOBBY","BOLTS","BONED","BONUS",
"BOOTH","BORAX","BOSOM","BOTCH","BOUGH","BOUND","BRACE","BRAID","BRASH","BRAVO",
"BRIAR","BRINE","BRINK","BROIL","BROOD","BRUNT","BRUSH","BUCKS","BUDGE","BUGLE",
"BUILT","BULGE","BURLY","BURNt","BURST","BUSTS","CABAL","CACHE","CAIRN","CALVE",
"CANAL","CANNY","CAPER","CARAT","CARVE","CASTE","CATER","CAVIL","CEDAR","CHAFE",
"CHAOS","CHARD","CHEEK","CHEST","CHIDE","CHIRP","CHOCK","CHOIR","CHOMP","CHORD",
"CHUCK","CHURN","CIDER","CINCH","CIVIC","CLACK","CLANG","CLANK","CLASH","CLASP",
"CLEFT","CLERK","CLING","CLINK","CLOAK","CLOUT","CLOVE","CLOWN","CLUMP","COAST",
"COBRA","COCOA","COLON","COMET","COMFY","CONCH","COPSE","CORAL","CORER","COVEN",
"COWER","COYLY","CRANE","CRANK","CRATE","CRAZE","CREAK","CREED","CREPE","CREST",
"CRONE","CROOK","CROSS","CROWD","CROWN","CRUDE","CRUEL","CRUMB","CRUST","CRYPT"


];


// =====================================================
//  DICTIONARY API VALIDATION
// =====================================================

async function isRealWord(word) {
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=PUT_YOUR_API_KEY_HERE`;

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
        // If the API fails, we allow the word so the game isn't blocked
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
    Object.values(screens).forEach(s => (s.style.display = "none"));
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
    letterUsage = {};
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

    console.log("SECRET WORD (debug):", secretWord); // remove this line in production

    renderBoard();
    showScreen("game");
    guessInput.focus();
}

// =====================================================
//  RENDERING
// =====================================================

function renderBoard() {
    gameBoard.innerHTML = "";

    // Existing guesses
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

            const type = tiles[i]; // "green","yellow","overused","red"
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
//       * first time overall:   +2 (green)
//       * second time overall:  +1 (yellow)
//       * 3rd+ time overall:    0 (overused / blue-gray)
//   - If IN secret word:
//       * each time:           -2 (red)
//

function scoreGuessAndClassify(guessWord) {
    const tiles = [];
    let delta = 0;

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guessWord[i];
        const inSecret = secretWord.includes(letter);

        if (inSecret) {
            // BAD letter → -2 points → RED
            delta -= 2;
            tiles.push("red");
        } else {
            const usedBefore = letterUsage[letter] || 0;

            if (usedBefore === 0) {
                // First safe use → +2 → GREEN
                delta += 2;
                tiles.push("green");
            } else if (usedBefore === 1) {
                // Second safe use → +1 → YELLOW
                delta += 1;
                tiles.push("yellow");
            } else {
                // Third+ safe use → 0 → BLUE-GRAY
                tiles.push("overused");
            }

            letterUsage[letter] = usedBefore + 1;
        }
    }

    score += delta;
    return tiles;
}

// =====================================================
//  GUESS HANDLING
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

    // Score this guess and set tile colors
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


