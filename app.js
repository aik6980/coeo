var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var games = {};

app.set('view engine', 'pug');
app.set('views', __dirname + '/src/views');

app.use(bodyParser());
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('stage');
});

app.post('/', function(req, res) {
    if (req.body.game_name) {
        var game_name = req.body.game_name.trim().toLowerCase();
    }

    if (req.body.player_name) {
        var player_name = req.body.player_name.trim().toLowerCase();
    }

    if (req.body.requestingFor === "newGame") {
        if (games.hasOwnProperty(game_name)) {
            res.render('stage', {error: "The game name '" + game_name + "' is in use.", new_game_name: game_name});
        } else {
            var game = {
                'game_name': req.body.game_name,
                'players': []
            };
            games[game_name] = {players: {}};
            res.render('game', {game_name: game_name});
        }
    } else if (req.body.requestingFor === "controller") {
        if (!(games.hasOwnProperty(game_name))) {
            res.render('stage', {error: "No game named " + game_name, game_name: game_name, player_name: player_name});
        } else {
            if (games[game_name].players.hasOwnProperty(player_name)) {
                res.render('stage', {error: "Name already in use!", game_name: game_name, player_name: player_name});
            } else {
                games[game_name].players[player_name] = {};
                res.render('controller', {game_name: game_name, player_name: player_name});
            }
        }
    }
});

var port = process.env.PORT || 3000;

var server = server.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

io.on('connection', function (socket) {
    socket.on('gameConnect', function (data) {
        games[data.game_name].socket = socket;
    });

    socket.on('controlGame', function (data) {
        games[data.game_name].players[data.player_name].socket = socket;
        games[data.game_name].socket.emit('newShip', {player_name: data.player_name});
    });
	
	// send player_stats data to all players in the room
	socket.on('update_player_stats', function (data) {
		var game = games[data.game_name];
		if(!game) return;
		
		for(var obj of data.player_stats){
			if(game.hasOwnProperty('players') &&
				game.players[obj.player_name] != null &&
				game.players[obj.player_name].hasOwnProperty('socket')){
				
				var client_socket = game.players[obj.player_name].socket;
				client_socket.volatile.emit('update_player_stats_client', obj);
			}
		}
    });

    socket.on('controller', function (data) {
        if ( !(games.hasOwnProperty(data.game_name)) || !(games[data.game_name].hasOwnProperty("socket")) ) {
            socket.emit('redirect', {location: "home"});
        } else {
            games[data.game_name].socket.volatile.emit('instruction', data);
        }
    });

    socket.on('disconnect', function() {
        console.log("Client disconnected");
        removePlayerFromGameFromSocket(socket);
    });
});

function removePlayerFromGameFromSocket(socket) {
    for (var gameName in games) {
        if (games[gameName].socket === socket) {
            delete games[gameName];
            return;
        }
        for (var playerName in games[gameName].players) {
            if (games[gameName].players[playerName].socket === socket) {
                delete games[gameName].players[playerName];
                games[gameName].socket.emit('destroyShip', {player_name: playerName});
                return;
            }
        }
    }
}