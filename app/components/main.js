import React, { Component } from 'react';
import * as firebase from 'firebase'; 
import { isMobile } from '../modules/isMobile';
import Init from '../modules/init';
import * as THREE from 'three';
import RandomColor from '../modules/randomColor';
import RenderingLoop from './renderingLoop';
import AudioPlayer from '../modules/audioPlayer';
import HighScore from './highScore';

const renderScene = new Init();
const randomColor = new RandomColor();
let color;

const cubeH = 4; 
const cubeW = 20;

class Main extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            showData: false,
            detectHardware: '',
            gameStarted: false,
            isActiv: false,
            cubes: [],
            animateEnabledR: true,
            counter: 0
        };

        this.audioPlayer = new AudioPlayer();

        this.firebase = new firebase.initializeApp({
            apiKey: 'AIzaSyAdUAf6cclWK5ldCHTTNhS59RN3H1YXRiI',
            authDomain: 'fb-login-64f2b.firebaseapp.com',
            databaseURL: 'https://fb-login-64f2b.firebaseio.com',
            projectId: 'fb-login-64f2b',
            storageBucket: 'fb-login-64f2b.appspot.com',
            messagingSenderId: '658548494421'
        });

        this.provider = new firebase.auth.FacebookAuthProvider();
        

    }

    componentDidMount() {
        this.setState({
            detectHardware: isMobile() == true ? 'touchstart' : 'click'
        }, () => {
            document.querySelector('canvas').addEventListener(this.state.detectHardware, () => {});
        });
        
        renderScene.init();
        // odniesienie przez this bo jestesmy w klasie
        this._initGameState();

        firebase.auth().onAuthStateChanged(user => {
            console.log(user);
            this.setState({
                user
            });
        });
    }
    
    _startGame() {
        // reset stack 
        while (renderScene.scene.children.length > 0) {
            renderScene.scene.remove(renderScene.scene.children[0]);
        }

        renderScene.setLights();

        this.setState({
            gameStarted: true,
            isActiv: true,
            animateEnabledR: true,
            counter: 0
        }, () => {
            this._initGameState();
        });

        this.audioPlayer.play('start');
    }

    _stopGame() {

        if (this.state.user && this.state.counter > 0) {
            this.firebase.database().ref('highscore').push({
                name: this.state.user.displayName,
                score: this.state.counter
            }); 
        }

        this.setState({
            gameStarted: false
        });
    }

    _initGameState() {
        color = randomColor.generate();
        const cubes = [];
        cubes[0] = new THREE.Mesh(new THREE.CubeGeometry(cubeW, 5, cubeW), 
                   new THREE.MeshLambertMaterial({ color, shading: THREE.FlatShading }));

        cubes[0].position.y = -34;
        renderScene.scene.add(cubes[0]);

        cubes[1] = new THREE.Mesh(new THREE.CubeGeometry(cubeW, 4, cubeW), 
                   new THREE.MeshLambertMaterial({ color, shading: THREE.FlatShading }));

        cubes[1].position.y = -30;
        renderScene.scene.add(cubes[1]);

        cubes[2] = new THREE.Mesh(new THREE.CubeGeometry(cubeW, 4, cubeW), 
                   new THREE.MeshLambertMaterial({ color, shading: THREE.FlatShading }));

        cubes[2].position.y = -26;
        cubes[2].position.x = 85;
        renderScene.scene.add(cubes[2]);

        // this odniesie sie do obiektu przez instancje klasy
        renderScene.renderer.render(renderScene.scene, renderScene.camera);

        this.setState({
            cubes
        });
    }

    _addPoints(counter, addPoints) {
        if (addPoints === 1) {
            this.audioPlayer.play('crop');
        } else {
            this.audioPlayer.play('winPoint');
        }

        this.setState({
            counter,
            animateEnabledR: !this.state.animateEnabledR
        });
    }

    _logIn() {
        firebase.auth().signInWithPopup(this.provider);
    }

    _logOut() {
        firebase.auth().signOut();
    }

    _showData() {
        this.setState({
            showData: true
        });
    }

    _hideData() {
        this.setState({
            showData: false
        });
    }

    render() {   
        console.log(this.state);
        return (
            <div> 
                <div id="container" className={this.state.gameStarted ? 'isActive' : ''}>
                    <span className="__span" onClick={this._startGame.bind(this)}>
                        <p>{this.state.counter ? 'ACTUAL SCORE' : 'STACK'}</p>   
                    </span>
                </div>

                {this.state.user === null
                    ? <button className={this.state.gameStarted ? 'hideButtons' : 'login'} 
                              onClick={this._logIn.bind(this)}>log in
                      </button> 
                    : (
                        <div>
                        <div className="user">
                            {this.state.user.displayName}
                            <button className={this.state.gameStarted ? 'hideButtons' : 'logout'} 
                                    onClick={this._logOut.bind(this)}>log out
                            </button>
                            <button className={this.state.gameStarted ? 'hideButtons' : 'database'} 
                                    onClick={this._showData.bind(this)}>high score
                            </button>
                            {this.state.showData 
                               ? (
                                    <HighScore
                                        hide={this._hideData.bind(this)}
                                        firebase={this.firebase}
                                    />
                                 )
                               : null
                            }
                        </div>
                        </div>
                    )
                }

                 <div id="counter-wrapper" className={this.state.gameStarted ? 'isActive' : ''}>
                    <span id="counter">{this.state.counter}</span>
                </div>

                <div id="stopGame-wrapper" className={!this.state.gameStarted ? 'actualScore' : ''}>
                    <span>{this.state.counter ? this.state.counter : ''}</span>
                </div>

                <RenderingLoop
                    cubes={this.state.cubes}
                    gameStarted={this.state.gameStarted}
                    animateEnabledR={this.state.animateEnabledR}
                    renderScene={renderScene}
                    counter={this.state.counter}
                    click={this._addPoints.bind(this)}
                    stopGame={this._stopGame.bind(this)}
                    randomColor={randomColor}
                />
            </div>
        );
    };
}

export default Main;
