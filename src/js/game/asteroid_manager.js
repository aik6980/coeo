import Asteroid from './objects/asteroid.js';

export class SpawnPoint {
    ref_point;
    spawn_circle = new Phaser.Circle(0,0,1); 
    target_area;
}

export default class AsteroidManager {
    game;
    asteroid_group;

    static explosion_scale = 2.0;
    static explosion_scale_sm = 1.0;

    // spawn System
    spawn_area_list;

    constructor (game) {
        this.game = game;
        this.asteroid_group = game.add.group();
    }

    mul_add(a, b, c) {
        var o = new Phaser.Point();
        Phaser.Point.multiply(a, b, o);
        o.add(c.x, c.y);
        return o;
    }

    init() {
        var scale   = new Phaser.Point(this.game.width, this.game.height);
        var offset  = scale.clone(); 
        offset.multiply(0.5, 0.5);
        // init spawn point in pair
        this.spawn_area_list = new Array(8);
        for(var i=0; i<this.spawn_area_list.length; ++i) {
            this.spawn_area_list[i] = new SpawnPoint();
        }

        {
            var a = this.spawn_area_list[0];
            var b = this.spawn_area_list[1];
            a.target_area = b;
            b.target_area = a;
            a.ref_point = this.mul_add(new Phaser.Point(-1, -1), scale, offset);
            b.ref_point = this.mul_add(new Phaser.Point( 1,  1), scale, offset);
        }
        {
            var a = this.spawn_area_list[2];
            var b = this.spawn_area_list[3];
            a.target_area = b;
            b.target_area = a;
            a.ref_point = this.mul_add(new Phaser.Point( 0, -1), scale, offset);
            b.ref_point = this.mul_add(new Phaser.Point( 0,  1), scale, offset);
        }
        {
            var a = this.spawn_area_list[4];
            var b = this.spawn_area_list[5];
            a.target_area = b;
            b.target_area = a;
            a.ref_point = this.mul_add(new Phaser.Point( 1, -1), scale, offset);
            b.ref_point = this.mul_add(new Phaser.Point(-1,  1), scale, offset);
        }
        {
            var a = this.spawn_area_list[6];
            var b = this.spawn_area_list[7];
            a.target_area = b;
            b.target_area = a;
            a.ref_point = this.mul_add(new Phaser.Point(-1, 0), scale, offset);
            b.ref_point = this.mul_add(new Phaser.Point( 1, 0), scale, offset);
        }
    }

    begin_spawn_asteroid() {
        this.spawn_asteroid();
        var spawn_timer = 2;
        this.game.time.events.loop(Phaser.Timer.SECOND * spawn_timer, this.spawn_asteroid, this);
    }

    spawn_asteroid() {
        //console.log('spawn an asteroid');
        // pick a random area
        var area_id = this.game.rnd.integerInRange(0, 7);
        var frame_id = this.game.rnd.integerInRange(0, 3);

        var radius = this.game.width * 0.25;
        // spawn position
        var circle_a = this.spawn_area_list[area_id].spawn_circle;
        var circle_b = this.spawn_area_list[area_id].target_area.spawn_circle;
        var rnd_a = circle_a.random().setMagnitude(radius);
        var rnd_b = circle_b.random().setMagnitude(radius);
        var x = this.spawn_area_list[area_id].ref_point.x + rnd_a.x;
        var y = this.spawn_area_list[area_id].ref_point.y + rnd_a.y;
        var asteroid = this.create_asteroid(x, y, frame_id);
        // calculate veloctiy
        var tx = this.spawn_area_list[area_id].target_area.ref_point.x + rnd_b.x;
        var ty = this.spawn_area_list[area_id].target_area.ref_point.y + rnd_b.y;

        var v = this.game.rnd.realInRange(100, 250);
        asteroid.body.velocity = new Phaser.Point(tx - x, ty - y).setMagnitude(100);
        
        return asteroid; 
    }

    spawn_small_asteroids( a ) {
        // spawn new asteroids
        let num_spawn = 2;
    
        let body = a.body;
        // change velocity of these new asteroids by 45 degrees
        let init_angle = [45, -45];
        // new asteroid size;
        let scale = 0.5; 

        for(let i=0; i<num_spawn; ++i)
        {
            var frame_id = this.game.rnd.integerInRange(0, 3);
            let sm = this.create_asteroid(a.x, a.y, frame_id);

            body.velocity.clone(sm.body.velocity);
            sm.body.velocity.rotate(0,0,init_angle[i],true);
            sm.scale.setTo(scale);
        }
    }

    create_asteroid(x, y, id) {
        let asteroid = new Asteroid(this.game, x, y);
        asteroid.frameName = "asteroid" + id;
        this.asteroid_group.add(asteroid);

        return asteroid;
    }
}
