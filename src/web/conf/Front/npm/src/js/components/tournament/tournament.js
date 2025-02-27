import { Component } from "@js/component";

let BALL_SPEED_X = 5;
let BALL_SPEED_Y = 1;
let PADDLE_SPEED = 5;

export class Tournament extends Component {
    constructor() {
        super();
        this.players = [];
        this.player1 = null;
        this.player2 = null;
        this.currentMatch = 0;
        this.jump = 0;
        this.winner = null;
        this.winners = [];
        this.end = false;
        this.start = false;
        this.isGameRunning = false;
    }

    render() {
        return `
        <h2 id="hd">Mode Tournoi</h2>
        <div id="tournament-container">
                <div id="player-registration">
                    <div id="player-inputs"></div>
                    <button id="start-tournament-button">Démarrer le tournoi</button>
                    </div>
                    <div id="tournament-progress" style="display: none;">
                    <h2>Tournoi en cours</h2>
                    <button id="start-pong-button">Lancer la partie</button>
                    <button id="toggle-settings">Options</button>
                    <div id="options-container" class="hidden">
                        <button id="settings-option1" class="off">X2 (Off)</button>
                        <label for="color-picker" >Choose Color for map:</label>
                        <input type="color" id="color-picker" name="color-picker">
                    </div>
                    <button id="reset-tournament">Nouveau tournoi</button>
                    <div id="current-match"></div>
                    <div id="tournament-bracket"></div>
                    <div id="control" class="controls">
                        <div id="control1" class="player-controls">
                            <div class="player-name">Player 1</div>
                            <div class="key">W</div>
                            <div class="key">S</div>
                        </div>
                        <div id="control2" class="player-controls">
                            <div class="player-name">Player 2</div>
                            <div class="key">ArrowUp</div>
                            <div class="key">ArrowDown</div>
                        </div>
                    </div>
                    </div>
                    <div id="tournament-result" style="display: none;">
                    <h2>Résultat du tournoi</h2>
                    <div id="winner-display"></div>
                    <button id="reset-end">Nouveau tournoi</button>
                    </div>
            </div>

            <div id="pong-container" style="display: none;">
                <div id="basePong">
                    <div id="middleLine"></div>
                    <div class="ball" id="ball">
                        <div class="ballstyle"></div>
                    </div>
                    <div id="player_1_paddle" class="paddle_1"></div>
                    <div id="player_2_paddle" class="paddle_2"></div>
                    <div class="text">
                        <div id="player_1_score" class="score_1">0</div>
                        <div id="player_2_score" class="score_2">0</div>
                        <div id="message"></div>
                    </div>
                    <div id="overlay-before-start">
                    </div>
                    <div id="overlay">
                        <div id="overlay-title">PONG</div>
                        <div id="overlay-text"></div>
                        <div id="overlay-score"></div>
                    </div>
                </div>
            </div>
    `;
    }

    style() {
        return `
        <style>
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                background: rgb(115,115,115);
                background: radial-gradient(circle, rgba(115,115,115,1) 10%, rgba(0,0,0,1) 80%);
                color: #ffffff;
                font-family: 'Press Start 2P', cursive;
                user-select: none;
                overflow: hidden;
            }

            #hd {
                color: #ffffff;
                text-align: center;
                padding: 20px;
                background-color: rgba(0, 0, 0, 0.8);
                border-bottom: 2px solid #333;
                letter-spacing: 2px;
            }

            #hd {
                animation: slideDown 0.8s ease-out forwards;
            }

            @keyframes slideDown {
                0% {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            #player-registration,
            #tournament-container {
                background-color: #1f1f1f;
                padding: 20px;
                text-align: center;
                justify-content: center;
                display: flex;
                margin-top: 10px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }

            button {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            button:hover {
                background-color: #3700b3;
                transform: scale(1.05);
            }

            input {
                margin: 5px;
                padding: 10px;
                border: 2px solid #333;
                border-radius: 5px;
                background-color: #2c2c2c;
                color: #ffffff;
                transition: border-color 0.3s ease;
            }

            input:focus {
                border-color: #6200ea;
                outline: none;
            }

            #tournament-bracket {
                margin-top: 20px;
            }

            .match {
                margin: 10px 0;
                padding: 10px;
                background-color: #333;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }


        


            /* Pong */

            #control1 {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            #control2 {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            .hidden {
                display: none !important;
            }
            
            #options-container {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            #hd {
                color: #ffffff;
                text-align: center;
                padding: 20px;
                background-color: black;
                border-bottom: 2px solid #333;
            }
            #basePong {
                height: 700px;
                width: 1480px;
                position: relative;
                background: black;
                user-select: none;
                overflow: hidden;
                left: 50%;
                margin-top: 420px;
                transform: translate(-50%, -50%);
                border: 2px solid white;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
            }

            .paddle_1,
            .paddle_2 {
                height: 100px;
                width: 18px;
                position: absolute;
                background: linear-gradient(180deg, #ffffff, #cccccc);
                border-radius: 5px;
                transition: transform 0.2s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            }

            .paddle_1 {
                top: calc(50% - 50px);
                left: 40px;
            }

            .paddle_2 {
                top: calc(50% - 50px); 
                right: 40px;
            }

            .paddle_1, .paddle_2 {
                transition: transform 0.1s ease-out;
            }

            .paddle_1:hover,
            .paddle_2:hover {
                transform: scale(1.1);
            }

            .ball {
                height: 15px;
                width: 15px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: calc(50% - 7.5px);
                transition: transform 0.1s ease-out;
            }

            .ball {
                transition: transform 0.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            }
            .score_1,
            .score_2,
            #message {
                color: grey;
                position: absolute;
                font-weight: 500;
                top: 10%;
                font-size: 50px;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }

            #middleLine {
                position: absolute;
                width: 0;
                height: 100%;
                left: 50%;
                border-left: 10px dashed grey;
                transform: translateX(-50%);
                opacity: 0.5;
            }   

            .score_1 {
                left: 35%; 
            }

            .score_2 {
                left: 65%;
            }

            #message {
                color: white;
                left: 49%;
                top: 30%;
            }

            #overlay-before-start {
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'Press Start 2P', cursive;
                font-size: 30px;
                color: white;
                user-select: none;
                animation: fadeIn 0.5s ease;
            }

            @keyframes fadeIn {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            #start-button{
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
                position: absolute;
                transition: 0.3s;
                transform: scale(1);
            }

            #start-button {
                top: 50%;
                left: calc(50% - 62px);
            }


            #start-button:hover{
                background: white;
                color: black;
                transform: scale(1.1);
            }

            .controls {
                display: flex;
                justify-content: space-around;
                width: 100%;
                margin-bottom: 20px;
            }

            .player-controls {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .player-name {
                font-size: 40px;
                margin-bottom: 5px;
                border-bottom: 5px solid white;
                padding-bottom: 5px;
            }

            .key {
                font-size: 24px;
                border: 1px solid white;
                padding: 10px;
                margin: 20px;
                text-align: center;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                color: white;
                transition: background-color 0.3s;
            }

            .key:hover {
                background-color: rgba(255, 255, 255, 0.3);
            }

            .text-before {
                font-size: 30px;
                margin-bottom: 20px;
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
            }
            
            #overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                background: black;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'Press Start 2P', cursive;
                font-size: 30px;
                color: white;
                display: none;
                user-select: none;
                text-align: center;
                animation: fadeIn 0.5s ease;
            }

            #overlay-title {
                font-size: 50px;
                margin-bottom: 100px;
                border-bottom: 5px solid white;
            }
        </style>
        `;
    }

    escape(event) {
        if (event.key === 'Escape')
            window.router.navigate('/');
    }

    CustomDOMContentLoaded() {

        document.addEventListener('keydown', this.escape);

        const check = document.getElementById('settings-option1');
        const basePong = document.getElementById("basePong");
        BALL_SPEED_X = check.classList.contains('on') ? 10 : 5;
        let ballSpeedX = BALL_SPEED_X;
        let ballSpeedY = 0;

        if (check.classList.contains('on')) {
            PADDLE_SPEED = 10;
        }

        document.getElementById('toggle-settings').addEventListener('click', function() {
            document.getElementById('options-container').classList.toggle('hidden');
        });

        document.getElementById('settings-option1').addEventListener('click', function() {
            const button = this;
            const isOff = button.classList.contains('off');
            button.classList.toggle('off', !isOff);
            button.classList.toggle('on', isOff);
            button.textContent = `X2 (${isOff ? 'On' : 'Off'})`;
            
            BALL_SPEED_X = isOff ? 10 : 5;
            ballSpeedX = BALL_SPEED_X;
            PADDLE_SPEED = isOff ? 10 : 5;
        });
    
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        document.getElementById('color-picker').addEventListener('input', debounce(function(event) {
            var chosenColor = event.target.value;
            document.getElementById('basePong').style.backgroundColor = chosenColor;
        }, 1));


        this.setupEventListeners();
        this.renderPlayerInputs();

        const savedPlayers = JSON.parse(localStorage.getItem('players'));
        if (savedPlayers) {
            this.players = savedPlayers;
            this.renderPlayerInputs();
        }

       if (this.loadFullState()) {
            this.updateUIWithTournamentState();
       }

       const WINNING_SCORE = 3;
       const OVERLAY_DISPLAY_TIME = 3000;
  
       
       const ball = document.getElementById("ball");
       const paddle_1 = document.getElementById("player_1_paddle");
       const paddle_2 = document.getElementById("player_2_paddle");
       
       let ballScored = false;
   
       let ballPositionX = 732.5;
       let ballPositionY = 350;
       const initialBallPos = { left:  732.5, top:  350 };
       
       let score_1 = 0;
       let score_2 = 0;

   
       let upPressed = false, downPressed = false, wPressed = false, sPressed = false;
       let intervalGameStart = null;
       
       function handleKey(event, isKeyDown) {
           const keyMap = {
               "ArrowUp": () => upPressed = isKeyDown,
               "ArrowDown": () => downPressed = isKeyDown,
               "KeyW": () => wPressed = isKeyDown,
               "KeyS": () => sPressed = isKeyDown
           };
           if (keyMap[event.code]) keyMap[event.code]();
       }

       function handleKeyUp(e) {
           handleKey(e, false);
       }
       
       function handleKeyDown(e) {
           handleKey(e, true);
       }
        function handleClick(e) {
            const overlay = document.getElementById("overlay-before-start");
            if (e.target.id === "start-pong-button") {
                document.getElementById('tournament-container').style.display = 'none';
                document.getElementById('pong-container').style.display = 'block';
                overlay.style.display = "none";
                initGame();
            }
        }
        
        // Event listeners for key presses
        // Dont forget to remove the event listeners when the game is over for performance reasons and for SPA
        document.addEventListener("click", handleClick);
        document.addEventListener("keyup", handleKeyUp, true);
        document.addEventListener("keydown", handleKeyDown, true);
        
        function resetGame() {
            clearInterval(intervalGameStart);
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            ballSpeedX = 0;
            ballSpeedY = 0;
            score_1 = 0;
            score_2 = 0;
            wPressed = false;
            sPressed = false;
            upPressed = false;
            downPressed = false;
            document.removeEventListener("keyup", handleKeyUp, true);
            document.removeEventListener("keydown", handleKeyDown, true);
            document.removeEventListener("click", handleClick);
            resetBall();
            cancelAnimationFrame(moveBall);
            cancelAnimationFrame(gameLoop);
        }
    
        this.gameReset = resetGame;
        
        function resetBall() {
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            if (ball)
            {
                ball.style.left = ballPositionX + "px";
                ball.style.top = ballPositionY + "px";
            }
            ballSpeedX = ballSpeedX > 0 ? -BALL_SPEED_X : BALL_SPEED_X;
            ballSpeedY = 0;
        }
        
        function showOverlay(message, score1, score2) {
            const overlay = document.getElementById("overlay");
            document.getElementById("overlay-text").textContent = message;
            document.getElementById("overlay-score").textContent = `Score: ${score1}-${score2}`;
            overlay.style.display = "block";
        }
        
        function updateScore(score, scoreElementId, message, updatedScore1, updatedScore2) {
            score += 1;
            ballScored = true;
            const scoreElement = document.getElementById(scoreElementId);
            if (scoreElement) scoreElement.textContent = score;
        
            showOverlay(message, updatedScore1, updatedScore2);
            setTimeout(() => {
                document.getElementById("overlay").style.display = "none";
                resetBall();
                ballScored = false;
            }, OVERLAY_DISPLAY_TIME);
            return score;
        }

        function movePaddle(which, direction) {
            const paddle = document.getElementById(`player_${which}_paddle`);
            if (paddle) {
                let currentTop = parseFloat(window.getComputedStyle(paddle).top);
                const parent = paddle.parentElement;
                const maxBottom = parent.clientHeight - paddle.clientHeight;
                let newTop = currentTop + direction * PADDLE_SPEED;
                if (newTop < 0)
                    newTop = 0;
                else if (newTop > maxBottom)
                    newTop = maxBottom;
                paddle.style.top = newTop + "px";
            }
        }

        function checkCollision() {
            if (!this.isGameRunning) return;
            const ballRect = ball.getBoundingClientRect();
            const paddle1Rect = paddle_1.getBoundingClientRect();
            const paddle2Rect = paddle_2.getBoundingClientRect();
            const paddles = [
                { rect: paddle1Rect, element: paddle_1 },
                { rect: paddle2Rect, element: paddle_2 }
            ];
            for (const { rect, element } of paddles) {
                if (ballRect.left < rect.right && ballRect.right > rect.left &&
                    ballRect.top < rect.bottom && ballRect.bottom > rect.top) {                  
                    ballSpeedX *= -1;
                    const relativeIntersectY = (ballRect.top + ballRect.height / 2) - (rect.top + rect.height / 2);
                    const normalizedRelativeIntersectionY = (relativeIntersectY / (rect.height / 2)) * 5;
                    ballSpeedY = normalizedRelativeIntersectionY;
                    element.style.transform = "scale(1.1)";      
                    setTimeout(() => {
                        element.style.transform = "scale(1)";
                    }, 100);
                }
            }
            const basePongRect = basePong.getBoundingClientRect();
            if (ballRect.left <= basePongRect.left + 5 && !ballScored) score_2 = updateScore(score_2, "player_2_score", "Player 2 scores!", score_1, score_2 + 1);
            if (ballRect.right >= basePongRect.right - 5 && !ballScored) score_1 = updateScore(score_1, "player_1_score", "Player 1 scores!", score_1 + 1, score_2);
        }

        checkCollision = checkCollision.bind(this);

        function moveBall() {
            ballPositionX += ballSpeedX;
            ballPositionY += ballSpeedY;
    
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            if (basePong === null) return;
            checkCollision();
            if (ballPositionY >= basePong.clientHeight - ball.offsetHeight - 1 || ballPositionY <= 0) ballSpeedY *= -1;
            if (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE) return;
            requestAnimationFrame(moveBall);
        }
        
        function gameLoop() {
            if (upPressed) movePaddle('2', -1);
            if (downPressed) movePaddle('2', 1);
            if (wPressed) movePaddle('1', -1);
            if (sPressed) movePaddle('1', 1);
            
            if (!ballScored && (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE)) {
                showOverlay(`Player ${score_1 === WINNING_SCORE ? this.player1 : this.player2} wins!`, score_1, score_2);
                this.handleMatchResult(score_1 === WINNING_SCORE ? 0 : 1);
                this.isGameRunning = false;
                setTimeout(() => {
                    resetGame();
                    window.router.navigate("/tournament");
                }, OVERLAY_DISPLAY_TIME);
                return;
            }
            requestAnimationFrame(gameLoop);
        }

        gameLoop = gameLoop.bind(this);

        function counter(text) {
            const message = document.getElementById("message");
            if (message) message.textContent = text === 0 ? "GO!" : text === -1 ? "" : text;
        }

        
        function startGame() {
            return new Promise((resolve) => {
                let i = 0;
                intervalGameStart = setInterval(() => {
                    counter(3 - i);
                    if (++i > 4) {
                        clearInterval(intervalGameStart);
                        resolve();
                    }
                }, 1000);
            });
        }
        
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function initGame() {
            await startGame();
            gameLoop();
            this.isGameRunning = true;
            await sleep(300);
            moveBall();
        };
        initGame = initGame.bind(this);
    }


    setupEventListeners() {
        document.getElementById('start-tournament-button').addEventListener('click', () => this.startTournament());
        document.getElementById('reset-tournament').addEventListener('click', () => this.resetTournament());
        document.getElementById('reset-end').addEventListener('click', () => this.resetTournament());
    }

    renderPlayerInputs() {
        const container = document.getElementById('player-inputs');
        container.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            container.innerHTML += `<input type="text" id="player${i}" value="${this.players[i] || ''}" placeholder="Nom du joueur ${i + 1}">`;
        }
    }

    startTournament() {
        this.players = Array.from(document.querySelectorAll('#player-inputs input')).map(input => input.value).filter(name => name.trim() !== '');
        if (this.players.length !== 4) {
            alert("Veuillez entrer 4 noms de joueurs pour démarrer le tournoi");
            return;
        }
        if (!this.areNamesUnique(this.players)) {
            alert("Les noms des joueurs doivent être différents");
            return;
        }
        this.initializeTournament();
        document.getElementById('player-registration').style.display = 'none';
        document.getElementById('tournament-progress').style.display = 'block';
    }
    
    areNamesUnique(names) {
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                if (names[i] === names[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    initializeTournament() {
        this.player1 = this.players[this.currentMatch]
        this.player2 = this.players[this.currentMatch + 1];
        this.start = true;
        this.saveFullState();
        this.Match();
        this.saveFullState();
    }

    showTournamentProgress() {
        document.getElementById('player-registration').style.display = 'none';
        document.getElementById('tournament-progress').style.display = 'block';
        this.updateTournamentBracket();
    }

    Match() {
        if (this.currentMatch < this.players.length - 1) {
            document.getElementById('current-match').textContent = `Match en cours : ${this.player1} vs ${this.player2}`;
        }
        else {
            this.winner = (this.winners[0] == this.winners[1] || this.winners[0] == this.winners[2]) ? this.winners[1] : this.winners[0];
            this.finishTournament();
        }
    }

    handleMatchResult(winnerIndex) {
        this.updateTournamentBracket(winnerIndex);
        this.Match();
        this.currentMatch++;
        this.jump += 2;

        if (this.jump < this.players.length - 1) {
            this.player1 = this.players[this.jump];
            this.player2 = this.players[this.jump + 1];
        }
        else {
            this.player1 = this.winners[0];
            this.player2 = this.winners[1];
            this.end = true;
        }
        this.saveFullState();
    }

    updateTournamentBracket(winnerIndex) {
        const bracketElement = document.getElementById('tournament-bracket');
        if (!this.end) {
            this.winners[this.currentMatch] = this.players[this.jump + winnerIndex];
            let html = `<div class="match">Match ${this.currentMatch + 1}: winner ${this.winners[this.currentMatch]}</div>`;
            bracketElement.innerHTML += html;
        }
        else {
            let html = `<div class="match">Match ${this.currentMatch + 1}: winner ${this.winners[winnerIndex]}</div>`;
            bracketElement.innerHTML += html;
        }
        this.saveFullState();
    }

    updateUIBracket() {
        const bracketElement = document.getElementById('tournament-bracket');
        let html = '';
        for (let i = 0; i < this.currentMatch; i++) {
            html += `<div class="match">Match ${i + 1}: winner ${this.winners[i]}</div>`;
        }
        bracketElement.innerHTML = html;
    }

    finishTournament() {
        document.getElementById('tournament-progress').style.display = 'none';
        document.getElementById('tournament-result').style.display = 'block';
        document.getElementById('winner-display').textContent = `Le gagnant du tournoi est : ${this.winner} bien joué !`;
        this.saveFullState();
    }

    resetTournament() {
        this.players = [];
        this.currentMatch = 0;
        this.winner = null;
        this.winners = [];
        this.player1 = null;
        this.player2 = null;
        this.jump = 0;
        this.end = false;
        this.start = false;
        document.getElementById('tournament-bracket').innerHTML = '';
        document.getElementById('tournament-result').style.display = 'none';
        document.getElementById('player-registration').style.display = 'block';
        document.getElementById('tournament-progress').style.display = 'none';
        this.renderPlayerInputs();
        localStorage.removeItem('fullTournamentState');
    }

    
    updateUIWithTournamentState() {
        this.renderPlayerInputs();
        if (this.winner) {
            document.getElementById('tournament-progress').style.display = 'none';
            document.getElementById('tournament-result').style.display = 'block';
            document.getElementById('player-registration').style.display = 'none';
            document.getElementById('winner-display').textContent = `Le gagnant du tournoi est : ${this.winner} bien joué !`;
        } else if (this.start) {
            document.getElementById('tournament-progress').style.display = 'block';
            document.getElementById('tournament-result').style.display = 'none';
            this.showTournamentProgress();
            this.updateTournamentBracket();
            this.Match();
            this.updateUIBracket();
        }
    }
    
    loadFullState() {
        const savedState = localStorage.getItem('fullTournamentState');
        if (savedState) {
            const fullState = JSON.parse(savedState);
            this.players = fullState.players ?? [];
            this.player1 = fullState.player1 ?? null;
            this.player2 = fullState.player2 ?? null;
            this.currentMatch = fullState.currentMatch ?? 0;
            this.jump = fullState.jump ?? 0;
            this.winners = fullState.winners ?? [];
            this.winner = fullState.winner ?? null;
            this.end = fullState.end ?? false;
            this.start = fullState.start ?? false;
            return true;
        }
        return false;
    }

    saveFullState() {
        const fullState = {
            players: this.players ?? [],
            player1: this.player1 ?? null,
            player2: this.player2 ?? null,
            currentMatch: this.currentMatch ?? 0,
            jump: this.jump ?? 0,
            winners: this.winners ?? [],
            winner: this.winner ?? null,
            end: this.end ?? false,
            start: this.start ?? false,
        };
        localStorage.setItem('fullTournamentState', JSON.stringify(fullState));
    }

    CustomDOMContentUnload() {
        this.gameReset();
        this.isGameRunning = false;
        document.removeEventListener('keydown', this.escape);
    }
}
