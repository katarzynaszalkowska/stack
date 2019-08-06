export default class RandomColor {
    constructor() {
        this.r = parseInt(Math.random() * 256);
        this.g = parseInt(Math.random() * 256);
        this.b = parseInt(Math.random() * 256);

        this.channels = ['r', 'g', 'b'];
        this.currentChannel = this.channels[parseInt(Math.random() * 3)];
        this.dirUp = !!parseInt(Math.random() * 2);
    }

    generate() {
        this.dirUp ? this[this.currentChannel] += 25 : this[this.currentChannel] -= 25;

        if (this[this.currentChannel] > 200 ||  this[this.currentChannel] < 60) {
            this[this.currentChannel] = this[this.currentChannel] > 200 ? 200 : 60;
            this.dirUp = !!parseInt(Math.random() * 2);

            const lastChannel = this.currentChannel;
            let newChannel = lastChannel;

            while (lastChannel === newChannel) {
                newChannel = this.channels[parseInt(Math.random() * 3)];
            }

            this.currentChannel = newChannel;
        }

        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}
