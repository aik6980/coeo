import {} from '../shared/objects/healthbar'

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-example');

class PhaserGame extends Phaser.State {
    sprite;
    activate_weapon = false;
    thrust;
    pad;
    stick;
    buttonA;
    buttonB;
    buttonLeft;
    buttonRight;
    rotation;
    background;

    buttonPadding = 60;

    // health bar
    healthbar;

    init() {
        this.game.renderer.renderSession.roundPixels = true;
        //this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    preload() {
        // tell the game to keep running, even the browser losing focus (so we can test locally)
        game.stage.disableVisibilityChange = true;
        this.load.atlas('arcade', 'public/game_assets/virtualjoystick/skins/arcade-joystick.png', 'public/game_assets/virtualjoystick/skins/arcade-joystick.json');
        this.load.image('background', 'public/game_assets/images/background.jpg');
    }

    create() {
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

        this.stick = this.pad.addStick(100, 100, 200, 'arcade');

        this.stick.motionLock = Phaser.VirtualJoystick.HORIZONTAL;

        this.buttonA = this.pad.addButton(0, 0, 'arcade', 'button1-up', 'button1-down');

        this.buttonB = this.pad.addButton(0, 0, 'arcade', 'button2-up', 'button2-down');

        this.buttonLeft = this.pad.addButton(0, 0, 'arcade', 'buttonLeft-up', 'buttonLeft-down');

        this.buttonRight = this.pad.addButton(0, 0, 'arcade', 'buttonRight-up', 'buttonRight-down');

        this.healthbar = new HealthBar(this.game);
        this.healthbar.position.set(this.game.width/2, this.game.height/2);
        this.healthbar.scale.set(this.game.width/2, this.game.height*0.1);
        this.game.add.existing(this.healthbar);

        this.resize();
    }

    update() {

        this.rotation = 0;
        if (this.buttonRight.isDown || this.buttonLeft.isDown) {
            this.rotation += this.buttonRight.isDown;
            this.rotation -= this.buttonLeft.isDown;
        } else if (this.stick.isDown) {
            this.rotation = this.stick.forceX;
        }

        this.thrust = this.buttonA.isDown;
        this.activate_weapon = this.buttonB.isDown;

        socket.emit('controller', {game_name: game_name, thrust: this.thrust, activate_weapon: this.activate_weapon,
            rotation: this.rotation, player_name: player_name});
    }

    resize() {
        var buttonSize = 32;
        var padding = 60;

        game.scale.setGameSize(window.innerWidth, window.innerHeight);

        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;

        this.buttonRight.posX = this.buttonPadding + buttonSize;
        this.buttonRight.posY = this.buttonPadding + buttonSize;
        // this.buttonRight.scale(1.5);


        this.buttonB.posX = game.width - padding - buttonSize;
        this.buttonB.posY = padding + buttonSize;

        this.buttonLeft.posX = padding + buttonSize;
        this.buttonLeft.posY = game.height - padding - buttonSize;

        this.buttonA.posX = game.width - padding - buttonSize;
        this.buttonA.posY = game.height - padding - buttonSize;

        this.stick.posX = game.width / 8;
        this.stick.posY = game.height / 2;

        this.healthbar.position.set(this.game.width/2, this.game.height/2);
        this.healthbar.scale.set(this.game.width/2, this.game.height*0.1);
    }
}

let client_game_state = new PhaserGame();
game.state.add('Game', client_game_state, true);

var socket = io.connect();

socket.emit('controlGame', {
    'game_name': game_name,
    'player_name': player_name
});

socket.on('redirect', function (data) {
    if (data.location === "home") {
        window.location.href = '/';
    }
});

socket.on('update_player_stats_client', function(data){
    client_game_state.healthbar.set_curr_health_scale(data.curr_health/data.max_health);
});
