// Determines the optimal move for the agent using minimax and alpha-beta pruning

let numEvaluations = 0;

function makeRandomMove() {
    var possibleMoves = game.moves()

    numEvaluations = 0;
    $("#numOfevals").text('0');

    // game over
    if (possibleMoves.length === 0) return

    // maximum search depth
    let depth = 3;

    // retrieve the move with the best outcome for black
    let move = getBestMove(game, depth);
    console.log('best move ' + move);

    game.move(move);
    
    board.position(game.fen());

    $("#numOfevals").text(numEvaluations);
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
    let sum = 0;
    for (letter of fen) {
        if (letter in evaluations)
            sum += evaluations[letter]
    }
    if (sum === NaN) {
        console.log("evaluation for board \"" + f + "\" returned a NaN.");
    }
    ++numEvaluations;
    return sum;
}

// Function that determines the best move through comparing minimax values
function getBestMove(game, depth) {
    let possibleMoves = game.moves();
    let bestMove = possibleMoves[0];
    let bestMoveEvaluation = -999999;
    let commonBestMoves = [];
    
    for (i in possibleMoves) {
        let move = possibleMoves[i];
        game.move(move);

        // Calculate minimum evaluation for the player
        let eval = minValue(game, depth-1);

        // Update best move
        if (eval > bestMoveEvaluation) {
            bestMove = move;
            bestMoveEvaluation = eval;
            commonBestMoves = [];
            commonBestMoves.push(move);
        }
        else if (eval === bestMoveEvaluation) {
            commonBestMoves.push(move);
        }

        console.log('move ' + move + ' evaluation: ' + eval + ' currentBestMove: ' + bestMove);

        game.undo();
    }

    console.log(commonBestMoves);
    // Select random move if all have the same evaluation
    // if (commonBestMoves.length > 1) {
    //     let randomIdx = Math.floor(Math.random() * commonBestMoves.length)
    //     bestMove = commonBestMoves[randomIdx];
    // }

    return bestMove;
}

// Return the maximum evaluation for game - represents the agent's move
function maxValue(game, depth) {
    let values = [];
    let possibleMoves = game.moves();

    // Maximum depth achieved
    if (depth === 0) return makeEvaluation(game.fen());

    // Terminal state
    if (possibleMoves.length === 0) return makeEvaluation(game.fen());
    
    for (move of possibleMoves) {
        game.move(move);
        
        // Calculate minimum evaluation 
        let eval = minValue(game, depth-1);
        values.push(eval);

        game.undo();
    }
    // console.log(values)
    return Math.max(...values);
}

// Return the minimum evaluation for game - represents the player's move
function minValue(game, depth) {
    let values = []
    let possibleMoves = game.moves();

    // Maximum depth achieved
    if (depth === 0) return makeEvaluation(game.fen());

    // Terminal state
    if (possibleMoves.length === 0) return makeEvaluation(game.fen());

    for (move of possibleMoves) {
        game.move(move);
        
        // Calculate maximum evaluation 
        let eval = maxValue(game, depth-1);
        values.push(eval);

        game.undo();
    }

    return Math.min(...values);
}