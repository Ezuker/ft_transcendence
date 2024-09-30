import { autretruc } from "@components/test-components/autretruc";
import { truc } from "@components/test-components/truc";
import { NavBar } from "@components/navbar/navbar";
import { NotFound } from "@components/404";
import { Auth42 } from "@components/login/auth42";
import { Pong } from "@components/pong/pong";
import { Connect4 } from "@components/connect4/connect4";

window.customElements.define('truc-component', truc);
window.customElements.define('autretruc-component', autretruc);
window.customElements.define('navbar-component', NavBar);
window.customElements.define('not-found', NotFound);
window.customElements.define('auth42-component', Auth42);
window.customElements.define('pong-component', Pong);
window.customElements.define('connect4-component', Connect4);

export default {
    truc,
    autretruc,
    NavBar,
    NotFound,
    Auth42,
    Pong
};