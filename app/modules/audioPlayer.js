import crop from '../sounds/crop.wav';
import start from '../sounds/start.wav';
import winpoints from '../sounds/winpoints.wav';

export default class AudioPlayer {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.gameSounds = {
            crop: {
                url: crop
            },
            start: {
                url: start
            },
            winPoint: {
                url: winpoints
            }  
        };
 
        this._loadAudioBuffers();
    }

    _decodeAudioData(buffer) {
        return new Promise((resolve, reject) => {
             this.audioCtx.decodeAudioData(buffer, decoded => resolve(decoded));
        });
    }

    // async  public funcion return promice
    async _loadBuffer(url) {
        try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            return await this._decodeAudioData(buffer);
        } catch(e) {
            console.log('fetch error', Error);
        }        
    }

    _loadAudioBuffers() {
        const promises = Object.keys(this.gameSounds).map(key => this._loadBuffer(this.gameSounds[key].url));
        console.log('promises', promises);

        Promise.all(promises).then(buffers => {
            console.log('buffers', buffers);
            Object.keys(this.gameSounds).map((key, index) => {
                this.gameSounds[key].buffer = buffers[index];
                console.log('this.gameSounds[key].buffer', this.gameSounds);
            });
            console.log(this.gameSounds);
        });
    }

    play(soundId) {
        if (!this.gameSounds[soundId] || !this.gameSounds[soundId].buffer) return;

        this.gameSounds[soundId].source = this.audioCtx.createBufferSource();
        this.gameSounds[soundId].source.connect(this.audioCtx.destination);
        this.gameSounds[soundId].source.buffer = this.gameSounds[soundId].buffer;
        console.log('this.gameSounds[soundId].source.buffer', this.gameSounds[soundId].source.buffer);
        this.gameSounds[soundId].source.start(0);
    }
};