// -1 - no input, 0 - rock, 1 - paper, 2 - scissors
const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

// global variables (bruh), maybe pack them into a global Game class instance
let player_move = -1;
let bot_move = -1;
let has_won = false;

function moveToString(move) {
    let result = "";
    switch (move) {
        case 0:
            result = "Rock";
            break;
        case 1:
            result = "Paper";
            break;
        case 2:
            result = "Scissors";
            break;
        default:
            result = "Not a move";
            break;
    }
    return result;
}

function clearButtonInfoStyle() {
    choice_area.querySelectorAll("button").forEach(elem => {
        elem.classList.remove("won", "lost", "tied");
    });

    bot_area.querySelectorAll("button").forEach(elem => {
        elem.classList.remove("won", "lost", "tied");
    });

    info.classList.remove("won", "lost", "tied");
    info.textContent = "";
}

function confirmMove(element) {
    choice_area.querySelectorAll("button").forEach(elem => {
        if (elem != element) {
            elem.dataset.confirmation = 0;
            elem.textContent = moveToString(parseInt(elem.dataset.value));
            return;
        }
        
        if (element.dataset.confirmation == 0) {
            element.dataset.confirmation = 1;
            element.textContent = moveToString(parseInt(element.dataset.value)) + "\u{2705}";
        } else {
            element.dataset.confirmation = 0;
            element.textContent = moveToString(parseInt(element.dataset.value));
        }
    });
}

// -----------------------------------------------------------
// entry point of the game cycle, starts on every button click
// -----------------------------------------------------------

function handlePlayerMove(event) {
    // console.log(`button value : ${event.target.dataset.value}\n`);
    clearButtonInfoStyle();
    player_move = parseInt(event.target.dataset.value);

    // return early if no button was clicked (placeholder)
    if (Number.isNaN(player_move)) {
        return;
    }

    confirmMove(event.target);

    // return early if move is not confirmed
    if (event.target.dataset.confirmation == 1) {
        return;
    }

    // get player move
    // console.log(`player_move: ${player_move}`);


    // get bot move
    handleBotMove();

    // check for win
    gameUpdate();

    // update information label
    infoUpdate();
}

function handleBotMove() {
    // random value in [0, 3) range rounded down to the nearest integer 
    bot_move = Math.floor(Math.random() * 3);
    // console.log(`bot_move: ${bot_move}`);
}

function gameUpdate() {
    has_won = false;

    if ((player_move === ROCK && bot_move === SCISSORS) ||
        (player_move === PAPER && bot_move == ROCK) ||
        (player_move === SCISSORS && bot_move === PAPER)) {
            has_won = true;
    }
 

    console.log(`has_won value: ${has_won}`);
}

function infoUpdate() {
    // console.log(`TEST: pl: ${player_move} ${typeof(player_move)}, bt: ${bot_move} ${typeof(bot_move)}`);

    info.textContent = "Your move is: " + moveToString(player_move) +  ", bot move is: " + moveToString(bot_move) + ". "; 

    // hacky tie check
    if (player_move == bot_move) {
        choice_area.querySelector(`[data-value="${player_move}"]`).classList.add("tied");
        bot_area.querySelector(`[data-value="${bot_move}"]`).classList.add("tied");
        info.classList.add("tied");
        info.textContent += "It's a tie!";
        return;
    }

    if (has_won) {
        choice_area.querySelector(`[data-value="${player_move}"]`).classList.add("won");
        bot_area.querySelector(`[data-value="${bot_move}"]`).classList.add("lost");
        info.classList.add("won");
        info.textContent += "You win! :)";
    } 
    else {
        choice_area.querySelector(`[data-value="${player_move}"]`).classList.add("lost");
        bot_area.querySelector(`[data-value="${bot_move}"]`).classList.add("won");
        info.classList.add("lost");
        info.textContent += "You lose! :(";
    }
}

// callback to the whole choice_area, should be more flexible than adding a callback for each button
const choice_area = document.querySelector(".choice_area.player");
choice_area.addEventListener("click", handlePlayerMove);

const bot_area = document.querySelector(".choice_area.bot");
const info = document.getElementById("info_label");
