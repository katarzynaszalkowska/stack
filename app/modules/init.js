import * as THREE from 'three';

export default class Init {
    setLights() {
        let light = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(light);

        light = new THREE.DirectionalLight(0xdfebff, 1.75);
        light.position.set(100, 120, 50);
        
        this.scene.add(light);
        this.renderer.render(this.scene, this.camera);
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ alpha:true, canvas: document.getElementById('canvas') });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera = new THREE.OrthographicCamera( 
                window.innerWidth / - 16, window.innerWidth / 16,
                window.innerHeight / 16, window.innerHeight / - 16,
                -200, 200);

        this.scene = new THREE.Scene();

        this.camera.position.y = 10;
        this.camera.position.z = 10;
        this.camera.position.x = 10;
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.setLights();

        window.addEventListener('resize', () => {
            this.camera.left = window.innerWidth / - 16;
            this.camera.right = window.innerWidth / 16;
            this.camera.top = window.innerHeight / 16;
            this.camera.bottom = window.innerHeight / - 16;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

