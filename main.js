// -1 - no input, 0 - rock, 1 - paper, 2 - scissors
const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

// global variables (bruh), maybe pack them into a global Game class instance
let player_move = -1;
let bot_move = -1;
let has_won = false;

function moveToString(move) {
    let result = document.createElement('img');
    switch (move) {
        case 0:
            result.src = "svg_icons/rock.svg";
            result.alt = "Rock";
            break;
        case 1:
            result.src = "svg_icons/paper.svg";
            result.alt = "Paper";
            break;
        case 2:
            result.src = "svg_icons/scissors.svg";
            result.alt = "Scissors";
            break;
        default:
            result = "Not a move";
            break;
    }
    return result;
}

function clearButtonInfoStyle() {
    for (const elem of choice_area.querySelectorAll("button")) {
        elem.classList.remove("won", "lost", "tied");
    }

    for (const elem of bot_area.querySelectorAll("button")) {
        elem.classList.remove("won", "lost", "tied");
    }

    info.classList.remove("won", "lost", "tied");
    info.textContent = "";
}

function confirmMove(selected_item) {
    for (const elem of player_buttons) {
        if (elem != selected_item) {
            elem.dataset.confirmation = 0;
            elem.replaceChildren(moveToString(parseInt(elem.dataset.value)));
            continue;
        }

        if (selected_item.dataset.confirmation == 0) {
            selected_item.dataset.confirmation = 1;
            selected_item.replaceChildren(confirmIcon);
        } else {
            selected_item.dataset.confirmation = 0;
            selected_item.replaceChildren(moveToString(parseInt(elem.dataset.value)));
        }

    }
}

// -----------------------------------------------------------
// entry point of the game cycle, starts on every button click
// -----------------------------------------------------------

function handlePlayerMove(event) {
    clearButtonInfoStyle();

    player_move = parseInt(event.currentTarget.dataset.value);

    // return early if no button was clicked (placeholder)
    if (Number.isNaN(player_move)) {
        return;
    }

    confirmMove(event.currentTarget);

    // return early if move is not confirmed
    if (event.currentTarget.dataset.confirmation == 1) {
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
    info.textContent = "Your move is: " + moveToString(player_move).alt +  ", bot move is: " + moveToString(bot_move).alt + ". "; 

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

const choice_area = document.querySelector(".choice_area.player");

// add callbacks for each button individually because of nested elements
const player_buttons = choice_area.querySelectorAll("button");
for (const btn of player_buttons) {
    console.log(btn);
    btn.addEventListener("click", handlePlayerMove);
}

const bot_area = document.querySelector(".choice_area.bot");
const info = document.getElementById("info_label");

const confirmIcon = document.createElement('img');
confirmIcon.src = "svg_icons/confirm.svg";
confirmIcon.alt = "Confirm Move";
