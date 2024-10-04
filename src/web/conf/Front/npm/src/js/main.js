import { Router } from "@js/router";
import { Route } from "@js/routes";

//Sert a appele export_components.js
import "@components/export_components";

const target = document.getElementById('main-content')
const router = new Router(target, {
  '/': new Route('/', 'index-component'),
  '/truc/': new Route('/truc/', 'truc-component'),
  '/autretruc/': new Route('/autretruc/', 'autretruc-component'),
  '/pong/': new Route('/pong/', 'pong-main-component'),
  '/pong/local': new Route('/pong/local', 'pong-local-component'),
  // '/pong/ai': new Route('/pong/ai', 'pong-ai-component'),
  '/404/': new Route('/404/', 'not-found'),
  '/auth42/': new Route('/auth42/', 'auth42-component'),
  '/tournament/': new Route(`/tournament/`, 'tournament-component'),
});

router.init();
window.router = router;
