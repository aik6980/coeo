
//export interface HealthBarCreateInfo {
//    dimension : Phaser.Point;
//}

export default class HealthBar extends Phaser.Sprite {
    
    background;
    foreground;

    constructor( game ) {
        super( game, 0, 0 );

        // create a bitmap data, if there isn't one
        if (this.game.cache.checkBitmapDataKey('white_1px') == false) {
            let bmd = this.game.add.bitmapData(1, 1);
            bmd.context.fillStyle = 'rgb(255,255,255)';
            bmd.context.fillRect(0,0,1,1);
            this.game.cache.addBitmapData('white_1px', bmd);
        }   
        this.anchor.setTo(0.5);

        var dim = new Phaser.Point( 1, 1);

        this.background = this.game.make.sprite(0,0,this.game.cache.getBitmapData('white_1px'));
        this.background.tint = Phaser.Color.getColor(32, 32, 32);
        this.background.anchor.set(0.0, 0.5);
        this.addChild(this.background);

        this.foreground = this.game.make.sprite(0,0,this.game.cache.getBitmapData('white_1px'));
        this.foreground.tint = Phaser.Color.getColor( 196, 0, 0);
        this.foreground.anchor.set(0.0, 0.5);
        this.addChild(this.foreground);

        this.set_dimension(dim);
    }

    set_dimension( dim ) {
        this.background.position.set(-dim.x/2, 0);
        this.background.scale.set(dim.x, dim.y);

        this.foreground.position.set(-dim.x/2, 0);
        this.foreground.scale.set(dim.x, dim.y);
    }

    set_curr_health_scale( scale) {
        this.foreground.scale.set( scale, 1.0 );
    }
}