// Determines the optimal move for the agent using minimax and alpha-beta pruning


// SETTINGS

let searchDepth = 3;
let mobilitySearch = true;

// END SETTINGS

let numEvaluations = 0;
let moveSet = [];


function changeSettings() {
    let newSearchDepth = document.querySelector("#depth").selectedOptions[0].value;
    let newMobility = document.querySelector("#mobilitySearch").selectedOptions[0].value === "true";
    console.log("Depth: " + newSearchDepth);
    console.log("Mobility: " + newMobility);
    searchDepth = newSearchDepth;
    mobilitySearch = newMobility;
}


function makeAgentMove() {
    changeSettings();
    var possibleMoves = game.moves()

    numEvaluations = 0;
    $("#numOfevals").text('0');

    // game over
    if (possibleMoves.length === 0) return

    // retrieve the move with the best outcome for black
    let move = getBestMove(game);
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
function makeEvaluation(game) {
    let fen = game.fen().split(' ');
    
    let gameboard = fen[0];
    let isBlackTurn = fen[1] == 'b';

    // Special case if we can get into a checkmate, we should obviously get to that state
    if (game.in_checkmate()) {
        console.log("checkmate case " + gameboard);
        if (isBlackTurn) {  // white checkmated black
            return -1000; 
        } else {
            return 1000;   // black checkmated white
        }
    }

    // Get the weighted material calculation
    let sum = 0;
    for (letter of gameboard) {
        if (letter in evaluations)
            sum += evaluations[letter]
    }
    
    // Update number of evaluations
    ++numEvaluations;        

    // Returns the material sum evaluation
    if (!mobilitySearch) return sum
    
    // Get mobility calculation
    let mobility = 0;
    if (moveSet) {
        mobility = moveSet.length;
        if (isBlackTurn) mobility = -mobility;
    }

    // Return the material sum with added mobility multiplier
    return sum + mobility * 0.01;
}

// Function that determines the best move through comparing minimax values
function getBestMove(game) {
    let possibleMoves = game.moves();
    let bestMove = possibleMoves[0];
    let bestMoveEvaluation = -999999;
    let alpha = -9999999;
    let beta = 99999999

    for (i in possibleMoves) {
        let move = possibleMoves[i];
        game.move(move);

        // Calculate minimum evaluation for the player
        let eval = minValue(game, searchDepth-1, alpha, beta);
        
        game.undo();

        // Update alpha
        alpha = Math.max(alpha, eval);

        // Update best move
        if (eval > bestMoveEvaluation) {
            bestMove = move;
            bestMoveEvaluation = eval;
            console.log('move ' + move + ' evaluation: ' + eval + ' currentBestMove: ' + bestMove);
        }
    }

    return bestMove;
}

// Return the maximum evaluation for game - represents the agent's move
function maxValue(game, depth, alpha, beta) {
    // Maximum depth achieved
    if (depth === 0) return makeEvaluation(game);

    moveSet = game.moves();

    // Terminal state
    if (moveSet.length === 0) return makeEvaluation(game);

    for (move of moveSet) {
        game.move(move);
        
        // Calculate minimum evaluation 
        let eval = minValue(game, depth-1, alpha, beta);

        game.undo();
        
        // Stop search
        if (eval >= beta) {
            return eval;
        }

        // Update alpha
        alpha = Math.max(alpha, eval);
    }

    return alpha;
}

// Return the minimum evaluation for game - represents the player's move
function minValue(game, depth, alpha, beta) {
    // Maximum depth achieved
    if (depth === 0) return makeEvaluation(game);

    moveSet = game.moves();
    
    // Terminal state
    if (moveSet.length === 0) return makeEvaluation(game);

    for (move of moveSet) {
        game.move(move);
        
        // Calculate maximum evaluation 
        let eval = maxValue(game, depth-1, alpha, beta);

        game.undo();

        // Stop search
        if (eval <= alpha) {
            return eval;
        }

        // Update beta
        beta = Math.min(beta, eval);
    }

    return beta;
}
