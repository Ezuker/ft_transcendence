import { Component } from "@js/component";

export class PongMain extends Component{
    constructor(){
        super();
    }

    render(){
        return`
            <div id="overlay">
                <div id="overlay-title">PONG</div>
                <div id="overlay-text">Choose your game</div>
                <button id="pong-ai">Pong against AI</button>
                <button id="pong-local">Pong 1v1 Local</button>
                <button id="pong-remote">Pong 1v1 Remote</button>
                <button id="reset-button">Quit</button>
                <div id="overlay-remote">
                    <div id="overlay-title">PONG</div>
                    <div id="overlay-text">Choose your room</div>
                    <button id="pong-remote-create">Create Room</button>
                    <div class="join-room">
                        <input id="pong-remote-room" type="text" placeholder="Room ID">
                        <button id="pong-remote-join">Join Room</button>
                    </div>
                    <button id="pong-remote-back">Back</button>
                </div>
            </div>
        `;
    }

    style(){
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
                font-size: 30px;
                color: white;
                // display: none;
                user-select: none;
            }

            #overlay-title {
                font-size: 50px;
                margin-bottom: 100px;
                border-bottom: 5px solid white;
            }
            #overlay-text {
                margin-bottom: 20px;
            }

            #overlay button {
                margin-bottom: 10px;
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
            }

            #overlay button:hover {
                background: white;
                color: black;
                transition: 0.3s;
                transform: scale(1.1);
            }

            #overlay-remote {
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: absolute;
                width: 100%;
                height: 100%;
                background: black;
                font-family: 'Press Start 2P', cursive;
                font-size: 30px;
                color: white;
                user-select: none;
            
            }

            #overlay-remote button {
                margin-bottom: 10px;
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
            }
            
            #pong-remote-back {
                margin-top: 50px;
            }

            #pong-remote-room {
                margin-bottom: 20px;
                padding: 10px;
                font-size: 20px;
                background: black;
                color: white;
                border: 2px solid white;
                width: 200px;

            }

            #pong-remote-join {
                margin-bottom: 20px;
                padding: 10px;
                font-size: 20px;
                background: black;
                color: white;
                border: 2px solid white;
                outline: none;
            }

            #pong-remote-join.shake {
                animation: shake 0.5s;
            }

            @keyframes shake {
                0% { transform: translateX(0); }
                10% { transform: translateX(-10px); }
                20% { transform: translateX(10px); }
                30% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                50% { transform: translateX(-10px); }
                60% { transform: translateX(10px); }
                70% { transform: translateX(-10px); }
                80% { transform: translateX(10px); }
                90% { transform: translateX(-10px); }
                100% { transform: translateX(0); }
            }

            .shake {
    animation: shake 0.5s;
}

        </style>
        `;
        
    }

    CustomDOMContentLoaded(){
        document.addEventListener("click", (e) => {
            if (e.target.id === "pong-local") {
                window.router.navigate("/pong/local");
            }
            // if (e.target.id === "pong-ai") {
                // window.router.navigate("/pong/ai");
            // }
            if (e.target.id === "reset-button") {
            }

            if (e.target.id === "pong-remote") {
                document.getElementById("overlay-remote").style.display = "flex";
            }

            if (e.target.id === "pong-remote-back") {
                document.getElementById("overlay-remote").style.display = "none";
            }

            if (e.target.id === "pong-remote-join") {
                const room = document.getElementById("pong-remote-room").value;
                if (room) {
                    window.router.navigate(`/pong/remote/${room}`);
                } else {
                    const joinButton = document.getElementById('pong-remote-join');
                    joinButton.classList.add('shake');
                    joinButton.style.border = '2px solid red';
            
                    setTimeout(() => {
                        joinButton.classList.remove('shake');
                        joinButton.style.border = '2px solid white';
                    }, 500);
                }
            }

            if (e.target.id === "pong-remote-create") {
                // create an ID for the room 7 characters long numbers and letters caps onyl
                const room = Math.random().toString(36).substring(2, 9).toUpperCase();
                window.router.navigate(`/pong/remote?id=${room}`);
            }
            
        });

    }

    CustomDOMContentUnload(){
        console.log("DOM CONTENT UNLOAD.");
    }
}