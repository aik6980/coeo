
export default class SmokeEmitter extends Phaser.Particles.Arcade.Emitter {
    constructor( game, x, y ) {
        super(game, x, y)

        // create a bitmap data, if there isn't one
        //if (this.game.cache.checkImageKey('smoke') == false) {
        //    this.game.load.image('smoke', 'public/game_assets/images/smoke.png');
        //}

        this.scale.set(0.5);

        this.makeParticles('smoke');
        this.setAlpha(0.1, 1.0, Phaser.Timer.SECOND);
        this.setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
        this.setXSpeed(-50, 50);
        this.setYSpeed(-10, -15);
        this.gravity = -25;
    }

    begin()
    {
        this.flow(2000, 200);
    }
}