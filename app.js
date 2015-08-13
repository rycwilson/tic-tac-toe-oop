// TODO:
// check for consecutive wins
// lock out the board after someone wins

// Objects defined below:
// Game
// Board
// View
// Square
// Player

function Game (existingPlayer1, existingPlayer2) {
  this.board = new Board();
  this.view = new View();
  this.playerX = existingPlayer1 || new Player('X');
  this.playerO = existingPlayer2 || new Player('O');
  this.turn = 'X';
  this.consecWins = 0;
}

Game.prototype.reset = function () {
  this.board.clear();
  this.toggleTurn('X');
};

Game.prototype.toggleTurn = function (turn) {
  if (turn || this.turn === 'O') {
    this.turn = 'X';
    this.view.$playerX.html('Player X &diams; ');
    this.view.$playerO.html('Player O ');
  }
  else {
    this.turn = 'O';
    this.view.$playerX.html('Player X ');
    this.view.$playerO.html('Player O &diams; ');
  }
};

Game.prototype.updateStatus = function () {
  var winner;
  // is there a winner?
  if (winner = this.board.getWinner()) {
    debugger;
    this.gameOver(winner);
  }
  else if (++this.board.markedSquares === this.board.squares.length)
    this.gameOver('tie');
  else
    this.toggleTurn();
};

Game.prototype.gameOver = function (winner) {
  if (winner === 'tie') {
    alert("Tie!");
  }
  else {
    this.view.highlightBorders(winner);
    // winner[0] is 'X' or 'O'
    alert(winner[0] + ' wins!');
    // check for consecutive wins
    this.checkConsecWins(winner[0]);
  }
  turn = 'game_over';
};

Game.prototype.checkConsecWins = function (winner) {

};

function Board () {
  // the board consists of an array of Square objects
  this.squares = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
  for (var i = 0; i < this.squares.length; i++) {
    this.squares[i] = new Square();
  }
  this.markedSquares = 0;
}

Board.prototype.clear = function () {
  for (var i = 0; i < this.squares.length; i++) {
    this.squares[i].value = '';
    this.squares[i].marked = false;
  }
  this.markedSquares = 0;
};

// getWinner will return a win in the form of a string denoting
// the winning player and winning squares, e.g. 'X048'
// if no win, return null
Board.prototype.getWinner = function () {
  var _this = this;

  if (winnerIs('X')) {
    return 'X' + winnerIs('X');
  }
  else if (winnerIs('O')) {
    return 'O' + winnerIs('O');
  }
  else
    return null;

  function winnerIs(player) {
    return allThree(player, squareValue(0), squareValue(1), squareValue(2)) ||
           allThree(player, squareValue(3), squareValue(4), squareValue(5)) ||
           allThree(player, squareValue(6), squareValue(7), squareValue(8)) ||
           allThree(player, squareValue(0), squareValue(3), squareValue(6)) ||
           allThree(player, squareValue(1), squareValue(4), squareValue(7)) ||
           allThree(player, squareValue(2), squareValue(5), squareValue(8)) ||
           allThree(player, squareValue(0), squareValue(4), squareValue(8)) ||
           allThree(player, squareValue(2), squareValue(4), squareValue(6));
  }

  // returns the combo of winning rows, e.g. '345'
  function allThree(player, squareOne, squareTwo, squareThree) {
    if ((squareOne[0] === player) && (squareTwo[0] === player) && (squareThree[0] === player))
      return squareOne[1] + squareTwo[1] + squareThree[1];
  }

  function squareValue(key) {
    switch(key) {
      case 0: return _this.squares[0].value + '0';
      case 1: return _this.squares[1].value + '1';
      case 2: return _this.squares[2].value + '2';
      case 3: return _this.squares[3].value + '3';
      case 4: return _this.squares[4].value + '4';
      case 5: return _this.squares[5].value + '5';
      case 6: return _this.squares[6].value + '6';
      case 7: return _this.squares[7].value + '7';
      case 8: return _this.squares[8].value + '8';
      default : console.log('Something went wrong');
    }
  }
};

function View () {
  this.$squares = $('.square p');
  this.$squareBorders = $('.square');
  this.$reset = $('.reset');
  this.$playerX = $('#player-X');
  this.$playerO = $('#player-O');
}

View.prototype.attachListeners = function () {
  var _this = this;
  this.$squares.each(function(index) {
    // $(this) now refers to the current square
    $(this).on('click', function() {
      if ($(this).html() === '' && game.turn !== 'game_over') {
        // mark the square
        _this.markSquare($(this), game.turn);
        // update the game board
        game.board.squares[index].mark(game.turn);
        game.updateStatus();
      }
      else if (game.turn === 'game_over') {
        alert("The game is over!  Click 'reset' to play again.");
      }
      else {
        alert('That square has already been played!');
    }
    });
  });

  this.$reset.on('click', function() {
    _this.$squares.each(function(index) {
      $(this).html('');
      $(this).removeClass().addClass('blank');
      // update the game board
      game.board.squares[index].clear();
    });
    this.$squareBorders.each(function() {
      $(this).removeClass().addClass('square');
    });
    game.reset();
  });
};

View.prototype.markSquare = function ($square, symbol) {
  console.log($square);
  console.log(game.turn);
  $square.html(game.turn);
  $square.removeClass().addClass(game.turn);
};

View.prototype.highlightBorders = function (winningSquares) {
  this.$squareBorders.eq(parseInt(winningSquares[1])).removeClass().addClass('win');
  this.$squareBorders.eq(parseInt(winningSquares[2])).removeClass().addClass('win');
  this.$squareBorders.eq(parseInt(winningSquares[3])).removeClass().addClass('win');
};

function Square () {
  this.value = '';
  this.marked = false;
}

Square.prototype.mark = function (symbol) {
  this.value = symbol;
  this.marked = true;
};

Square.prototype.clear = function () {
  this.value = '';
  this.marked = false;
};

function Player (symbol) {
  this.symbol = symbol;
  this.record = [];
}