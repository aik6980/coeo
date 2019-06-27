import SmokeEmitter from '../../shared/objects/smoke_vfx.js'
import Rocket from './rocket.js'

export default class Ship extends Phaser.Sprite {
    name;
    thrust_amount = 0.0;
    angular_accel_amount = 0.0;
    activate_weapon = false;

    ship;
    weapon;
    healthbar;

    smoke_vfx;

    // unique texture for player's ship
    bmd;

    break_down = false;

    constructor( game_state ) {
        super(game_state.game, 0, 0, 'ship');

        this.anchor.setTo(0.5);
        this.scale.setTo(0.03);
        this.game.physics.arcade.enable(this);

        this.body.mass = 1;
        this.body.bounce = 0.9;
        this.health = this.maxHealth;
        // Ship Rotation
        this.body.maxAngular = 300;
        this.body.angularDrag = 350;

        // Ship Movement
        this.body.drag.set(10);
        this.body.maxVelocity.set(100);

        // add weapon
        this.weapon = this.game.add.weapon(10, 'bullet');
        this.weapon.bulletClass = Rocket;
        this.weapon.createBullets(10, "bullet");
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 250;
        this.weapon.fireRate = 1000; // fire rate in milliseconds
        this.weapon.onFire.add(this.on_rocket_fire, this);

        this.weapon.trackSprite(this, 10, 0, true);

        // add UI
        //this.healthbar = new Objects.HealthBar(this.game);
        //this.game.add.existing(this.healthbar);

        this.bmd = this.game.make.bitmapData();
        this.bmd.load('ship');

        this.smoke_vfx = new SmokeEmitter(this.game, 0, 0);
        this.game.add.existing(this.smoke_vfx);
        
        // emiting thruster
        //this.smoke_vfx.emitY = -32;
    }

    destroy() {
        this.smoke_vfx.destroy();
    }

    on_rocket_fire( a, b ) {
        a.owner = this;
    }

    set_texture_color_shift( val ) {
        // shift value can be between 0...1
        this.bmd.shiftHSL(val);
        this.setTexture(this.bmd.texture);
    }

    update() {
        //this.healthbar.position.set(this.x, this.y);

        if(this.health <= 0.0) {
            this.break_down = true;
            this.smoke_vfx.on = true;
            this.smoke_vfx.begin();
        }
        else {
            this.smoke_vfx.on = false;
        }
        this.smoke_vfx.position.set(this.x, this.y);
        //this.smoke_vfx.rotation = this.rotation - Phaser.Math.degToRad(90);
    }
}