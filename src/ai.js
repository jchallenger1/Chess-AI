// Determines the optimal move for the agent using minimax and alpha-beta pruning

function makeRandomMove() {
    var possibleMoves = game.moves()

    // game over
    if (possibleMoves.length === 0) return

    let bestMove = "";
    let bestMoveEvaluation = -999999;
    let depth = 3;

    // retrieve the move with the best outcome for black
    let move = max_value(game, depth);

    var randomIdx = Math.floor(Math.random() * possibleMoves.length)
    game.move(possibleMoves[randomIdx])
    let fen = game.fen()
    board.position(fen)

    makeEvaluation(fen);
}

// chess piece evaluations
const evaluations = {
    'p':  1,
    'P': -1,
    'n':  3,
    'N': -3,
    'b':  3,
    'B': -3,
    'r':  5,
    'R': -5,
    'q':  9,
    'Q': -9,
    'k':  200,
    'K': -200
}

// Evaluate the position in terms of material
function makeEvaluation(f) {
    let fen = f.split(' ')[0];
    console.log(fen)
    let sum = 0;
    for (letter of fen) {
        if (letter in evaluations)
            sum += evaluations[letter]
    }
    console.log(sum);
    return sum;
}

// function max_value(game, depth) {
//     let values = []
//     let possibleMoves = game.moves();

//     // Terminal state
//     if (depth === 0) return 

//     if ()
//     for (move of possibleMoves) {
//         game.move(move);
//         let evaluation = makeEvaluation(game.fen());
//         game.undo();
//     }
// }

// function min_value(game, depth) {
//     if (game.game_over()) return false
    
// }