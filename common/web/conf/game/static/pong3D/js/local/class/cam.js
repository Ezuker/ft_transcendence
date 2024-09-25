import * as THREE from 'three';

class Cam {
    constructor(position) {
        this.start_pos = position;
        this.camera3D = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        this.camera3D.position.set(position.x, position.y, position.z);
        this.camera3D.lookAt(0, 0, 0);
        this.focus_ball = false;
    }
}

export {
    Cam
}
