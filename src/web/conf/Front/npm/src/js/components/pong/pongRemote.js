import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";
import { sleep } from "@js/utils/sleep";

export class PongRemote extends Component {
    constructor() {
        super();
        this.ws = null;
        this.gameReset = null;
        this.initGame = null;
    }

    render() {
        return `
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
                <div id="overlay-pong">
                    <div id="overlay-title">PONG</div>
                    <div id="overlay-text"></div>
                    <div id="overlay-score"></div>
                </div>
            </div>
            <div id="overlay">
                <div id="overlay-remote">
                    <div id="waiting-text">Waiting for an opponent</div>
                    <div id="overlay-copy">
                        <div>Send this link to your friend:</div>
                        <button id="pong-remote-copy">Copy</button>
                    </div>
                    <button id="reset-button">Quit</button>
                </div>
            </div>
        `;
    }

    style() {
        return `
        <style>

            /* PONG */
            #basePong {
                height: 600px; /* If you modify the size, you have to modify the condition in JS */
                width: 800px;
                position: absolute; /* Use absolute positioning */
                top: 50%; /* Center vertically */
                left: 50%; /* Center horizontally */
                transform: translate(-50%, -50%); /* Offset by half of its own size */
                background: black;
                font-family: 'Press Start 2P', cursive;
                user-select: none;
                display: none;
                overflow: hidden;
            }


            .paddle_1,
            .paddle_2 {
                height: 100px;
                width: 18px;
                position: absolute;
                background: red;
            }

            .paddle_1 {
                top: calc(50% - 50px);
                left: 40px;
            }

            .paddle_2 {
                top: calc(50% - 50px); 
                right: 40px;
            }

            .ball {
                height: 15px;
                width: 15px;
                background: white;
                position: absolute;
                top: 50%;
                left: calc(50% - 7.5px);
            }

            .score_1,
            .score_2,
            .tild,
            #message {
                color: grey;
                position: absolute;
                font-weight: 500px;
                top: 10%;
                font-size: 50px;
            }

            #middleLine {
                position: absolute;
                width: 0;
                height: 100%;
                left: 50%;
                border-left: 10px dashed grey;
                transform: translateX(-50%);
            }   

            .score_1 {
                left: 35%; 
            }

            .tild {
                left: 50%;
            }

            .score_2 {
                left: 65%;
            }

            #message {
                color: white;
                left: 50%;
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
            }

            #start-button {
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
                position: absolute;
                top: 50%;
                left: calc(50% - 50px);
            }

            #start-button:hover {
                background: white;
                color: black;
                transition: 0.3s;
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

            .player-controls div {
                margin: 5px 0;
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
            }

            .text-before {
                font-size: 30px;
                margin-bottom: 20px;
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
            }
            
            #overlay-pong {
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
            }

            #overlay-message {
                margin-bottom: 20px; 
            }

            #overlay-title {
                font-size: 50px;
                margin-bottom: 100px;
                border-bottom: 5px solid white;
            }

            /* Before start */

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
                font-size: 20px;
                color: white;
                user-select: none;
            }

            #overlay-remote {
                background: black;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 30px;
                color: white;
            }

            #waiting-text {
                margin-bottom: 50px;
            }

            #reset-button {
                position: absolute;
                bottom: 10px;
                right: 10px;
            }

            #overlay button {
                margin: 5px 0;
                font-size: 20px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
                padding: 10px;
            }

            #overlay button:hover {
                background: white;
                color: black;
                transition: 0.3s;
                transform: scale(1.1);
            }

            #overlay-copy {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 20px;
                font-size: 15px;
            }

            .shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
                100% { transform: translateX(0); }
            }

            #pong-remote-copy {
                background-color: #ffcc00;
                border: 2px solid #000;
                color: #000;
                padding: 5px 10px; /* Smaller padding */
                font-family: 'Press Start 2P', cursive;
                font-size: 12px; /* Smaller font size */
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            #pong-remote-copy::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.2);
                transition: transform 0.3s ease;
                transform: scaleX(0);
                transform-origin: left;
            }

            #pong-remote-copy:hover::before {
                transform: scaleX(1);
            }

            #pong-remote-copy:active {
                transform: scale(0.95);
            }

            #pong-remote-copy i {
                margin-right: 5px;
            }

        </style>
        `;
    }

    sendMessage(direction, isKeyDown, player, uuid) {
        if (this.ws) {
            this.ws.send(JSON.stringify({ 
                type: "move", 
                direction: direction, 
                isKeyDown: isKeyDown, 
                player: player,
                game_uuid: uuid}));
        }
    }

    CustomDOMContentLoaded() {
        this.ws = new WebSocket("wss://" + window.location.host + "/wss-game/pong/");
        this.user = getCookie("user42");
        let intervalTimer = null;
        this.interval = null;
        let hisPaddle = 2;
        let oppsPaddle = 1;
        let oppsUp = false;
        let oppsDown = false;
        const PADDLE_SPEED = 7;
        const WINNING_SCORE = 5;
        const OVERLAY_DISPLAY_TIME = 3000;

        const ball = document.getElementById("ball");
        const paddle_1 = document.getElementById("player_1_paddle");
        const paddle_2 = document.getElementById("player_2_paddle");

        let ballScored = false;
        let ballSpeedX = null; 
        let ballSpeedY = null;
    
        let ballPositionX = null;
        let ballPositionY = null;
        
        let score_1 = 0;
        let score_2 = 0;
    
        let wPressed = false, sPressed = false;
        let intervalGameStart = null;

        this.ws.onopen = () => {
            console.log("WS OPEN");
            const searchParams = new URLSearchParams(window.location.search);
            const gameId = searchParams.get("id");
            this.ws.send(JSON.stringify({ type: "join", game_uuid: gameId, player: this.user }));
            let i = 0;
            intervalTimer = setInterval(() => {
                i++;
                document.getElementById("waiting-text").innerText = `Waiting for an opponent${".".repeat(i % 4)}`;
            }, 750);
            this.interval = intervalTimer;
        }

        function updateUIForOpponent(opponent) {
            document.getElementById("overlay").innerHTML = `
                <div id="overlay-title">PONG</div>
                <div id="overlay-remote">
                    <div id="overlay-text">Your opponent is ${opponent}</div>
                </div>
            `;
            clearInterval(intervalTimer);
            // after 3 seconds, start the game
            setTimeout(() => {
                document.getElementById("overlay").style.display = "none";
                document.getElementById("basePong").style.display = "block";
                // initGame();
            }, 1); // TO CHANGE 3000
        }
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log(data);
            if (data.type === "game_joined") {
                updateUIForOpponent(data.player1 === this.user ? data.player2 : data.player1);
                // Check if the player1 is the current user or not and give him the control of the correct paddle
                if (data.player1 === this.user)
                {
                    hisPaddle = 1;
                    oppsPaddle = 2;
                }
                initGame();
            } else if (data.type === "game_not_found") {
                this.ws.send(JSON.stringify({ type: "create", player1: this.user }));
            } else if (data.type === "game_move" && data.player !== this.user) {
                if (data.direction === "up") {
                    oppsUp = data.isKeyDown;
                } else if (data.direction === "down") {
                    oppsDown = data.isKeyDown;
                }
            } else if (data.type === "game_started") {
                ball.style.background = "green";
                ballPositionX = data.ball.x;
                ball.style.left = ballPositionX + "px" - 10;
                ballPositionY = data.ball.y;
                ball.style.top = ballPositionY + "px" - 10;
                ballSpeedX = data.ball.dx;
                ballSpeedY = data.ball.dy;
                paddle_1.style.top = data.player1_paddle + "px" - 50;
                paddle_2.style.top = data.player2_paddle + "px" - 50;
            }
            else if (data.type === "update")
            {
                paddle_1.style.top = data.player1_paddle + "px";
                paddle_2.style.top = data.player2_paddle + "px";
            }
            else if (data.type === "update_ball")
            {
                console.log(data);
                ballPositionX = data.ball.x;
                ball.style.left = ballPositionX + "px";
                ballPositionY = data.ball.y;
                ball.style.top = ballPositionY + "px";
                ballSpeedX = data.ball.dx;
                ballSpeedY = data.ball.dy;

            }
        }

        document.getElementById("pong-remote-copy").addEventListener("click", () => {
            const url = new URL(window.location.href);
            navigator.clipboard.writeText(url.href);
            const button = document.getElementById("pong-remote-copy");
            button.classList.add("shake");
            const originalText = button.innerText;
            button.innerText = "Copied!";
            setTimeout(() => {
                button.classList.remove("shake");
                button.innerText = originalText;
            }, 2000);
        });
        
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
                // if (newTop >= 0 && newTop < maxBottom - 10) {
                    paddle.style.top = newTop + "px";
                // }
            }
        }
        
        let previousWState = false;
        let previousSState = false;

        function handleKey(event, isKeyDown) {
            const searchParams = new URLSearchParams(window.location.search);
            const gameId = searchParams.get("id");
            const keyMap = {
                "KeyW": () => {
                    if (previousWState !== isKeyDown) {
                        previousWState = isKeyDown;
                        this.sendMessage("up", isKeyDown, this.user, gameId);
                        wPressed = isKeyDown;
                        console.log(paddle_1.style.top);
                    }
                },
                "KeyS": () => {
                    if (previousSState !== isKeyDown) {
                        previousSState = isKeyDown;
                        this.sendMessage("down", isKeyDown, this.user, gameId);
                        sPressed = isKeyDown;
                        console.log(paddle_1.style.top);
                    }
                }
            };
            if (keyMap[event.code]) keyMap[event.code]();
        }

        handleKey = handleKey.bind(this);

        function handleKeyUp(e) {
            handleKey(e, false);
        }
        
        function handleKeyDown(e) {
            handleKey(e, true);
        }
        
        // Event listeners for key presses
        // Dont forget to remove the event listeners when the game is over for performance reasons and for SPA
        document.addEventListener("keyup", handleKeyUp, true);
        document.addEventListener("keydown", handleKeyDown, true);
        
        function resetGame() {
            clearInterval(intervalGameStart);
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            ballSpeedX = BALL_SPEED_X;
            ballSpeedY = BALL_SPEED_Y;
            score_1 = 0;
            score_2 = 0;
            wPressed = false;
            sPressed = false;
            upPressed = false;
            downPressed = false;
            document.removeEventListener("keyup", handleKeyUp, true);
            document.removeEventListener("keydown", handleKeyDown, true);
            cancelAnimationFrame(gameLoop);
            cancelAnimationFrame(moveBall);
        }
    
        this.gameReset = resetGame;
        
        function getBallPosition() {
            const ball = document.getElementById('ball');
            const ballWidth = ball.offsetWidth;
            const ballHeight = ball.offsetHeight;
        
            return {
                top: (836 / 2) - (ballHeight / 2),
                left: (1920 / 2) - (ballWidth / 2),
                width: ballWidth,
                height: ballHeight
            };
        }
        
        function resetBall() {
            const initialBallPos = getBallPosition();
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            ballSpeedX = ballSpeedX > 0 ? -BALL_SPEED_X : BALL_SPEED_X;
            ballSpeedY = BALL_SPEED_Y;
        }
        
        function showOverlay(message, score1, score2) {
            const overlay = document.getElementById("overlay-pong");
            document.getElementById("overlay-text").textContent = message;
            document.getElementById("overlay-score").textContent = `Score: ${score1}-${score2}`;
            overlay.style.display = "block";
        }
        
        function hideOverlay() {
            document.getElementById("overlay-pong").style.display = "none";
        }
        
        function checkCollision() {
            const ballRect = ball.getBoundingClientRect();
            const paddle1Rect = paddle_1.getBoundingClientRect();
            const paddle2Rect = paddle_2.getBoundingClientRect();
            
            const paddles = [
                { rect: paddle1Rect, speedMultiplier: -1, positionX: paddle1Rect.right },
                { rect: paddle2Rect, speedMultiplier: -1, positionX: paddle2Rect.left - ballRect.width }
            ];

            for (const paddle of paddles) {
                if (ballRect.left < paddle.rect.right && ballRect.right > paddle.rect.left &&
                    ballRect.top < paddle.rect.bottom && ballRect.bottom > paddle.rect.top) {
                    
                    ballSpeedX *= paddle.speedMultiplier;
                    ballPositionX = paddle.positionX;
            
                    let relativeIntersectY = (ballRect.top + (ballRect.height / 2)) - (paddle.rect.top + (paddle.rect.height / 2));
                    let normalizedRelativeIntersectionY = (relativeIntersectY / (paddle.rect.height / 2)) * 10;
                    
                    ballSpeedY = normalizedRelativeIntersectionY;
            
                    const paddleElement = paddle.rect === paddle1Rect ? paddle_1 : paddle_2;
                    paddleElement.style.transform = "scale(1.1)";
            
                    setTimeout(() => {
                        paddleElement.style.transform = "scale(1)";
                    }, 100);
                }
            }
            
            if (ballRect.left < 1 && !ballScored) {
                score_2 += 1;
                ballScored = true;
                var score = document.getElementById("player_2_score");
                if (score !== null) score.textContent = score_2;
                
                showOverlay("Player 2 scores!", score_1, score_2);
                setTimeout(function() {
                    hideOverlay();
                    resetBall();
                    ballScored = false;
                }, OVERLAY_DISPLAY_TIME);
            }
            
            if (ballRect.right > 1920 && !ballScored) {
                score_1 += 1;
                ballScored = true;
                var score = document.getElementById("player_1_score");
                if (score !== null) score.textContent = score_1;
                
                showOverlay("Player 1 scores!", score_1, score_2);
                setTimeout(function() {
                    hideOverlay();
                    resetBall();
                    ballScored = false;
                }, OVERLAY_DISPLAY_TIME);
            }
        }
    
        function counter(text) {
            var message = document.getElementById("message");
            if (text == 0) text = "GO!";
            if (text == -1) text = "";
            if (message !== null) message.textContent = text;
        }
        
        function startGame() {
            return new Promise((resolve) => {
                let i = 0;
                intervalGameStart = setInterval(() => {
                    counter(3 - i);
                    if (i === 4) {
                        clearInterval(intervalGameStart);
                        resolve();
                    }
                    i++;
                }, 1000);
            });
        }
        
        let previousTimestamp = performance.now();

        async function moveBall(currentTimestamp) {
            console.log("moveBall");

            // Calculate delta time
            let deltaTime = currentTimestamp - previousTimestamp;
            previousTimestamp = currentTimestamp;

            // Update ball position based on delta time
            ballPositionX += ballSpeedX * (deltaTime / 16.67); // Assuming 60 FPS, 16.67ms per frame
            ballPositionY += ballSpeedY * (deltaTime / 16.67);

            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";

            requestAnimationFrame(moveBall);
        }
        
        async function gameLoop() {
            // if (wPressed) movePaddle(hisPaddle, -1);
            // if (sPressed) movePaddle(hisPaddle, 1);
            // if (oppsUp)   movePaddle(oppsPaddle, -1);
            // if (oppsDown) movePaddle(oppsPaddle, 1);
            
            if (!ballScored && (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE)) {
                showOverlay(`Player ${score_1 === WINNING_SCORE ? "1" : "2"} wins!`, score_1, score_2);
                setTimeout(() => {
                    resetGame();
                    window.router.navigate("/pong/");
                }, OVERLAY_DISPLAY_TIME);
                return;
            }
            requestAnimationFrame(gameLoop);
        }
        
        async function initGame() {
            // await startGame();
        let current = performance.now();
        // gameLoop();
            moveBall(current);
        }
    }

    

    CustomDOMContentUnload() {
        console.log("DOM CONTENT UNLOAD.");
        if (this.ws) {
            this.ws.close();
        }
        clearInterval(this.interval);
        this.gameReset();
    }
}
