import React, { Component } from 'react';
import * as THREE from 'three';
import  { isMobile } from '../modules/isMobile';

let speed = 1;
let moveY = false;
let moveYEasing = [];
let moveYIndex = 0;
const _moveYEasing = [0.01, 0.01, 0.02, 0.06, 0.2, 0.3, 0.4, 0.4, 0.6, 0.6, 0.4, 0.4, 0.3, 0.2, 0.03, 0.03, 0.01, 0.01, 0.01, 0.005, 0.005];
for (let i = 0; i < _moveYEasing.length; i++) {
    moveYEasing = [...moveYEasing, _moveYEasing[i] / 2, _moveYEasing[i] / 2];
}
// let container = document.getElementById('container');
const detectHardware = (isMobile() == true ? 'touchstart' : 'click');
const cubeH = 4; 

class RenderingLoop extends Component {
    constructor() {
        super();
        this.state = {
            counter: 0
        };
    }

    componentDidMount() {
        this.refs.canvas.addEventListener(detectHardware, () => {

            let changeDimension;
            let changeAxis;

            const newDimensions = {
                depth: this.props.cubes[this.props.cubes.length - 1].geometry.parameters.depth,
                width: this.props.cubes[this.props.cubes.length - 1].geometry.parameters.width,
                x: this.props.cubes[this.props.cubes.length - 1].position.x,
                z: this.props.cubes[this.props.cubes.length - 1].position.z
            };

            let addPoints = 1;

            if (this.props.animateEnabledR) {
                changeDimension = 'width';
                changeAxis = 'x';
            } else {
                changeDimension = 'depth';
                changeAxis = 'z';
            }

            if (this.props.cubes[this.props.cubes.length - 1].position[changeAxis] - 
                this.props.cubes[this.props.cubes.length - 1].geometry.parameters[changeDimension] > 
                this.props.cubes[this.props.cubes.length - 2].position[changeAxis] ||

                this.props.cubes[this.props.cubes.length - 1].position[changeAxis] + 
                this.props.cubes[this.props.cubes.length - 1].geometry.parameters[changeDimension] < 
                this.props.cubes[this.props.cubes.length - 2].position[changeAxis]               
            ) {
                this.props.stopGame(false);
                return;
            }
            
            if (this.props.gameStarted) {

                if (this.props.cubes[this.props.cubes.length - 1].position[changeAxis] < this.props.cubes[this.props.cubes.length - 2].position[changeAxis]) {

                    let diff = this.props.cubes[this.props.cubes.length - 2].position[changeAxis] - this.props.cubes[this.props.cubes.length - 1].position[changeAxis];

                    if (diff <= 0.5) {
                        addPoints = 3;
                        diff = 0;
                        this.props.cubes[this.props.cubes.length - 1].position[changeAxis] = this.props.cubes[this.props.cubes.length - 2].position[changeAxis];
                    }

                    newDimensions[changeDimension] = this.props.cubes[this.props.cubes.length - 1].geometry.parameters[changeDimension] - diff;

                    const newScale = newDimensions[changeDimension] / this.props.cubes[this.props.cubes.length - 1].geometry.parameters[changeDimension];
                    this.props.cubes[this.props.cubes.length - 1].scale[changeAxis] = newScale;
                    this.props.cubes[this.props.cubes.length - 1].position[changeAxis] += (diff / 2);
                    newDimensions[changeAxis] = this.props.cubes[this.props.cubes.length - 1].position[changeAxis];

                } else {
                    let diff = this.props.cubes[this.props.cubes.length - 1].position[changeAxis] - this.props.cubes[this.props.cubes.length - 2].position[changeAxis];

                    if (diff <= 0.5) {
                        addPoints = 3;
                        diff = 0;
                        this.props.cubes[this.props.cubes.length - 1].position[changeAxis] = this.props.cubes[this.props.cubes.length - 2].position[changeAxis];
                    }

                    newDimensions[changeDimension] = this.props.cubes[this.props.cubes.length - 1].geometry.parameters[changeDimension] - diff;

                    const newScale = newDimensions[changeDimension] / this.props.cubes[this.props.cubes.length - 1].geometry.parameters[changeDimension];
                    this.props.cubes[this.props.cubes.length - 1].scale[changeAxis] = newScale;
                    this.props.cubes[this.props.cubes.length - 1].position[changeAxis] -= (diff / 2);
                    newDimensions[changeAxis] = this.props.cubes[this.props.cubes.length - 1].position[changeAxis];
                }
            }

            this.props.cubes.push(new THREE.Mesh(new THREE.CubeGeometry(newDimensions.width, cubeH, newDimensions.depth), 
                                new THREE.MeshLambertMaterial({ color: this.props.randomColor.generate(), shading: THREE.FlatShading })));
            this.props.cubes[this.props.cubes.length - 1].position.y = this.props.cubes[this.props.cubes.length - 2].position.y + cubeH;
       
            this.props.cubes[this.props.cubes.length - 1].position.x = newDimensions.x; 
            this.props.cubes[this.props.cubes.length - 1].position.z = newDimensions.z; 

            if (this.props.animateEnabledR) {
                this.props.cubes[this.props.cubes.length - 1].position.z = -50;
            } else {
                this.props.cubes[this.props.cubes.length - 1].position.x = -50;
            }

            this.props.renderScene.scene.add(this.props.cubes[this.props.cubes.length - 1]);  

            if (this.props.cubes.length >= 12) {
                moveY = true;
                moveYIndex = 0;
            }

            this.props.click(this.props.counter + addPoints, addPoints);
           
            this.props.renderScene.renderer.render(this.props.renderScene.scene, this.props.renderScene.camera); 

        });
        requestAnimationFrame(this.renderingLoop.bind(this));
    }
   
    renderingLoop() {
        if (this.props.gameStarted) {
            if (this.props.animateEnabledR) {
                this.props.cubes[ this.props.cubes.length - 1].position.x += speed;
                
                if (this.props.cubes[this.props.cubes.length - 1].position.x >  50) speed = -.7; 
                if (this.props.cubes[this.props.cubes.length - 1].position.x < -50) speed =  .7;
            } else {
                this.props.cubes[ this.props.cubes.length - 1].position.z += speed;

                if (this.props.cubes[this.props.cubes.length - 1].position.z >  50) speed = -.7; 
                if (this.props.cubes[this.props.cubes.length - 1].position.z < -50) speed =  .7;
            }

            if (moveY) {
                for (let i = 0; i < this.props.cubes.length; i++) {
                    this.props.cubes[i].position.y -= moveYEasing[moveYIndex];
                }

                moveYIndex++;

                if (moveYIndex >= moveYEasing.length) {
                    moveY = false;
                }
            } 
        }

        this.props.renderScene.renderer.render(this.props.renderScene.scene, this.props.renderScene.camera);
        requestAnimationFrame(this.renderingLoop.bind(this));
    }

    render() {
        return (
            <div>
                <canvas ref="canvas" id="canvas" className="cube-canvas"/>
            </div>
        );
    };
}

export default RenderingLoop;
