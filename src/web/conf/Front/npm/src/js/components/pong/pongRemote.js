import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";

export class PongRemote extends Component {
    constructor() {
        super();
        this.ws = null;
    }

    render() {
        return `
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
            margin-right: 5px; /* Adjust margin for smaller size */
        }

        </style>
        `;
    }

    CustomDOMContentLoaded() {
        this.ws = new WebSocket("wss://" + window.location.host + ":" + window.location.port + "/wss-game/pong/");
        this.user = getCookie("user42");
        this.interval = null;

        this.ws.onopen = () => {
            console.log("WS OPEN");
            const searchParams = new URLSearchParams(window.location.search);
            const gameId = searchParams.get("id");
            this.ws.send(JSON.stringify({ type: "join", game_uuid: gameId, player: this.user }));
            this.counter();
        }

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            if (data.type === "game_joined") {
                this.updateUIForOpponent(data.player1 === this.user ? data.player2 : data.player1);
            } else if (data.type === "game_not_found") {
                this.ws.send(JSON.stringify({ type: "create", player1: this.user }));
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
    }

    updateUIForOpponent(opponent) {
        document.getElementById("overlay").innerHTML = `
            <div id="overlay-title">PONG</div>
            <div id="overlay-remote">
                <div id="overlay-text">Your opponent is ${opponent}</div>
            </div>
        `;
        clearInterval(this.interval);
    }

    CustomDOMContentUnload() {
        console.log("DOM CONTENT UNLOAD.");
        if (this.ws) {
            this.ws.close();
        }
        clearInterval(this.interval);
    }

    counter() {
        let i = 0;
        this.interval = setInterval(() => {
            i++;
            document.getElementById("waiting-text").innerText = `Waiting for an opponent${".".repeat(i % 4)}`;
        }, 750);
    }
}
