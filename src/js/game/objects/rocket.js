
export class Rocket extends Phaser.Bullet {
    owner;

    constructor( game, x, y, key, frame) {
        super(game, x, y, key, frame);
    }
}