document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------
    // WORD LIST
    // ---------------------------

    const words = [
        "ACROSS","ACTION","ADVENT","ADVICE","ALMOND","ANCHOR","ANIMAL","ANSWER","ANYONE","APPEAL",
        "APPLES","ARCHER","ARMORY","AROUND","ARTIST","ASCEND","ATTACK","AUBURN","AUTHOR","BALLET",
        "BANNER","BARREL","BEACON","BEFORE","BELONG","BENEATH","BESIDE","BETTER","BINARY","BISHOP",
        "BLAZER","BLENDS","BLOOMS","BOTTLE","BRANCH","BRIDGE","BRIGHT","BROKEN","BUCKET","BUTTON",
        "CANDLE","CANYON","CARBON","CARTON","CASTLE","CENTER","CHANCE","CHANGE","CHARGE","CHARMS",
        "CHERRY","CHOICE","CIRCLE","CLIMAX","CLOVER","COASTS","COFFEE","COLONY","COMBAT","COMICS",
        "COMMON","COMPASS","CONVEY","CORNER","COSMIC","COTTON","COUNTRY","COURAGE","CRATER","CREATE",
        "CREDIT","CRISIS","CUSTOM","DANGER","DEMAND","DESERT","DETAIL","DEVICE","DIFFER","DINNER",
        "DIRECT","DOMAIN","DOUBLE","DRAGON","DRIVER","EAGLES","ECHOES","EDITOR","EMPIRE","ENERGY",
        "ENGINE","ENJOYED","ESCAPE","ESSENCE","EVOLVE","EXPERT","FABLES","FAMILY","FARMER","FASHION",
        "FATHER","FIBERS","FINDER","FLIGHT","FLOWER","FOREST","FORGOT","FORMAL","FOSSIL","FREELY",
        "FRIEND","FUTURE","GALAXY","GARDEN","GATHER","GENTLE","GHOSTS","GLIDER","GLOBAL","GOLDEN",
        "GRAVEL","GROUND","GROWTH","HARBOR","HARMON","HEALTH","HEAVEN","HIDDEN","HUNTER","IMPACT",
        "INSIDE","INSPIRE","ISLAND","JOURNEY","JUSTICE","KINDLE","KINGDOM","KNIGHT","LANTERN","LEGEND",
        "LIBERTY","LIGHTER","LITTLE","LOCATE","MAGNET","MARKET","MEADOW","MEMORY","MERELY","MIRROR",
        "MOTION","MOUNTS","MYSTIC","NATURE","NEARBY","NOBODY","OBJECT","OCEANS","ORANGE","ORIGIN",
        "OUTLET","PALACE","PARADE","PEOPLE","PHRASE","PLANET","POCKET","POTION","PRAISE","PRISON",
        "PUZZLE","QUARTZ","RANDOM","READER","REASON","RECALL","REFORM","REGION","REWARD","RHYTHM",
        "RIDDLE","RISING","ROCKET","SACRED","SAFELY","SANDAL","SCARCE","SCENIC","SEASON","SECRET",
        "SHADOW","SHIELD","SIGNAL","SILENT","SILVER","SKETCH","SMOOTH","SPARKS","SPIRIT","SPRING",
        "STABLE","STARRY","STREAM","STRIKE","SUMMER","SWEETS","TARGET","TEMPLE","THEORY","THRIVE",
        "THUNDER","TICKET","TIMBER","TRAVEL","UNION","VALLEY","VISION","VOYAGE","WANDER","WARMTH",
        "WATERFALL","WEAPON","WILDER","WINDOW","WINTER","WONDER","WORTHY","YELLOW","ZENITH"
    ];

    // ---------------------------
    // DAILY WORD
    // ---------------------------

    function getTodayString() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    }

    function getDailyWord() {
        const today = getTodayString();
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = (hash * 31 + today.charCodeAt(i)) % words.length;
        }
        return words[hash];
    }

    // ---------------------------
    // ACCOUNT SYSTEM (LOCAL ONLY)
    // ---------------------------

    const loginScreen = document.getElementById("login-container");
    const createScreen = document.getElementById("create-container");
    const menuScreen = document.getElementById("menu-container");
    const instructionsScreen = document.getElementById("instructions-container");
    const leaderboardScreen = document.getElementById("leaderboard-container");
    const gameScreen = document.getElementById("game-container");

    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");
    const loginBtn = document.getElementById("login-btn");
    const loginMessage = document.getElementById("login-message");

    const createUsername = document.getElementById("create-username");
    const createPassword = document.getElementById("create-password");
    const createBtn = document.getElementById("create-btn");
    const createMessage = document.getElementById("create-message");

    const menuWelcome = document.getElementById("menu-welcome");

    const dailyModeBtn = document.getElementById("daily-mode-btn");
    const endlessModeBtn = document.getElementById("endless-mode-btn");
    const instructionsBtn = document.getElementById("instructions-btn");
    const instructionsBackBtn = document.getElementById("instructions-back-btn");
    const instructionsText = document.getElementById("instructions-text");

    const gotoLeaderboardBtn = document.getElementById("goto-leaderboard-btn");
    const leaderboardList = document.getElementById("leaderboard-list");
    const leaderboardBackBtn = document.getElementById("leaderboard-back-btn");

    const backMenuBtn = document.getElementById("back-menu-btn");

    let currentUser = null;
    let totalScore = 0;
    let dailyAvailable = true;
    let currentMode = null;

    function hash(str) {
        return btoa(str);
    }

    function getAccounts() {
        return JSON.parse(localStorage.getItem("unwordle-accounts") || "{}");
    }

    function saveAccounts(accounts) {
        localStorage.setItem("unwordle-accounts", JSON.stringify(accounts));
    }

    function showScreen(screen) {
        loginScreen.style.display = "none";
        createScreen.style.display = "none";
        menuScreen.style.display = "none";
        instructionsScreen.style.display = "none";
        leaderboardScreen.style.display = "none";
        gameScreen.style.display = "none";
        screen.style.display = "block";
    }

    function showMenu() {
        showScreen(menuScreen);
        menuWelcome.innerHTML = `
            Welcome, <b>${currentUser}</b>!<br>
            Total Score: <b>${totalScore}</b><br>
            ${dailyAvailable ? "Daily word available." : "Daily word already played."}
        `;
    }

    // Create account
    createBtn.addEventListener("click", () => {
        const user = createUsername.value.trim();
        const pass = createPassword.value.trim();

        if (!user || !pass) {
            createMessage.textContent = "Please fill all fields.";
            return;
        }

        let accounts = getAccounts();

        if (accounts[user]) {
            createMessage.textContent = "Username already exists.";
            return;
        }

        accounts[user] = {
            password: hash(pass),
            score: 0,
            lastDailyPlayed: null
        };

        saveAccounts(accounts);
        createMessage.textContent = "Account created!";
    });

    // Login
    loginBtn.addEventListener("click", () => {
        const user = loginUsername.value.trim();
        const pass = loginPassword.value.trim();

        let accounts = getAccounts();

        if (!accounts[user]) {
            loginMessage.textContent = "User does not exist.";
            return;
        }

        if (accounts[user].password !== hash(pass)) {
            loginMessage.textContent = "Incorrect password.";
            return;
        }

        currentUser = user;
        totalScore = accounts[user].score || 0;

        const today = getTodayString();
        dailyAvailable = accounts[user].lastDailyPlayed !== today;

        showMenu();
    });

    document.getElementById("goto-create-btn").addEventListener("click", () => showScreen(createScreen));
    document.getElementById("goto-login-btn").addEventListener("click", () => showScreen(loginScreen));

    document.getElementById("logout-btn").addEventListener("click", () => {
        currentUser = null;
        totalScore = 0;
        dailyAvailable = true;
        showScreen(loginScreen);
    });

    // ---------------------------
    // INSTRUCTIONS
    // ---------------------------

    instructionsBtn.addEventListener("click", () => {
        showScreen(instructionsScreen);

        instructionsText.innerHTML = `
            <h3>Goal of the Game</h3>
            Score as many points as possible by guessing words that <b>do NOT</b> share letters with the secret word.<br><br>

            <h3>Color Meanings</h3>
            <span style="color:green;font-weight:bold;">Green</span> – Letter is NOT in the secret word (first time used): <b>+2</b><br>
            <span style="color:gold;font-weight:bold;">Yellow</span> – Letter is NOT in the secret word (used before): <b>+1</b><br>
            <span style="color:red;font-weight:bold;">Red</span> – Letter <b>is</b> in the secret word: <b>-2</b><br>
            <span style="color:black;font-weight:bold;">Black</span> – Letter used too many times: <b>0</b><br><br>

            <h3>Game Modes</h3>
            <b>Daily Mode:</b> One word per day, score goes to leaderboard.<br>
            <b>Endless Mode:</b> Unlimited rounds, no leaderboard impact.<br><br>

            <h3>Leaderboard</h3>
            Your total score from Daily Mode is added to the leaderboard.
        `;
    });

    instructionsBackBtn.addEventListener("click", showMenu);

    // ---------------------------
    // ONLINE LEADERBOARD FUNCTIONS
    // ---------------------------

    async function saveScoreOnline(username, score) {
        try {
            await fetch("/.netlify/functions/addScore", {
                method: "POST",
                body: JSON.stringify({ username, score })
            });
        } catch (err) {
            console.error("Error saving score:", err);
        }
    }

    async function loadLeaderboardOnline() {
        try {
            const res = await fetch("/.netlify/functions/getLeaderboard");
            return await res.json();
        } catch (err) {
            console.error("Error loading leaderboard:", err);
            return [];
        }
    }

    // ---------------------------
    // LEADERBOARD (ONLINE)
    // ---------------------------

    gotoLeaderboardBtn.addEventListener("click", async () => {
        const data = await loadLeaderboardOnline();

        leaderboardList.innerHTML = "";
        data.forEach((entry, index) => {
            const div = document.createElement("div");
            div.innerHTML = `<b>${index + 1}. ${entry.username}</b>: ${entry.score}`;
            leaderboardList.appendChild(div);
        });

        showScreen(leaderboardScreen);
    });

    leaderboardBackBtn.addEventListener("click", showMenu);

    // ---------------------------
    // GAME LOGIC
    // ---------------------------

    const gameArea = document.getElementById("game-area");
    const input = document.getElementById("player-input");
    const submitBtn = document.getElementById("submit-btn");
    const message = document.getElementById("message");
    const history = document.getElementById("guess-history");

    let secretWord = "";
    let wordLength = 0;
    let guessesLeft = 5;
    let roundScore = 0;
    let guessedLetters = {};

    function resetRoundDisplay(modeLabel) {
        history.innerHTML = "";
        message.textContent = "";
        gameArea.innerHTML = `
            <b>${modeLabel}</b><br>
            Player: <b>${currentUser}</b><br>
            The word has <b>${wordLength}</b> letters.<br>
            You have <b>${guessesLeft}</b> guesses.
        `;
    }

    function startDailyGame() {
        if (!dailyAvailable) {
            alert("You already played today's word.");
            return;
        }

        secretWord = getDailyWord();
        wordLength = secretWord.length;
        guessesLeft = 5;
        roundScore = 0;
        guessedLetters = {};

        currentMode = "daily";
        showScreen(gameScreen);
        resetRoundDisplay("DAILY MODE");
    }

    function startEndlessGame() {
        secretWord = words[Math.floor(Math.random() * words.length)];
        wordLength = secretWord.length;
        guessesLeft = 5;
        roundScore = 0;
        guessedLetters = {};

        currentMode = "endless";
        showScreen(gameScreen);
        resetRoundDisplay("ENDLESS MODE");
    }

    dailyModeBtn.addEventListener("click", startDailyGame);
    endlessModeBtn.addEventListener("click", startEndlessGame);
    backMenuBtn.addEventListener("click", showMenu);

    function addGuessRow(letters, colors) {
        const row = document.createElement("div");
        row.classList.add("guess-row");

        for (let i = 0; i < letters.length; i++) {
            const box = document.createElement("div");
            box.classList.add("guess-box", colors[i]);
            box.textContent = letters[i];
            row.appendChild(box);
        }

        history.appendChild(row);
    }

    submitBtn.addEventListener("click", async () => {
        let guess = input.value.toUpperCase().trim();
        input.value = "";

        if (guess.length !== wordLength) {
            message.textContent = `Word must be ${wordLength} letters.`;
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 300);
            return;
        }

        if (!guess.match(/^[A-Z]+$/)) {
            message.textContent = "Letters only.";
            return;
        }

        let letters = guess.split("");
        let colors = [];

        for (let i = 0; i < letters.length; i++) {
            let letter = letters[i];

            if (secretWord.includes(letter)) {
                colors.push("red");
                roundScore -= 2;
            } else {
                if (!guessedLetters[letter]) {
                    guessedLetters[letter] = 1;
                    colors.push("green");
                    roundScore += 2;
                } else {
                    guessedLetters[letter]++;
                    colors.push("yellow");
                    roundScore += 1;
                }
            }

            if (guessedLetters[letter] > 3) {
                colors[i] = "black";
            }
        }

        addGuessRow(letters, colors);

        guessesLeft--;

        if (guessesLeft <= 0) {
            message.innerHTML = `Round Over! Score: <b>${roundScore}</b>`;

            if (currentMode === "daily") {
                await saveScoreOnline(currentUser, roundScore);

                let accounts = getAccounts();
                accounts[currentUser].lastDailyPlayed = getTodayString();
                saveAccounts(accounts);
                dailyAvailable = false;
            }

            setTimeout(showMenu, 2000);
        }
    });

});

