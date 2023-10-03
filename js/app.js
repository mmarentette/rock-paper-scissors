/*----- constants -----*/
const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');
const RPS_LOOKUP = {
    r: {img: 'imgs/rock.png', beats: 's'},
    p: {img: 'imgs/paper.png', beats: 'r'},
    s: {img: 'imgs/scissors.png', beats: 'p'}
};

/*----- app's state (variables) -----*/
let scores; // Object key of 'p' -> Player Score; 't' -> Tie; 'c' -> Computer Score;
let results; // Object key of 'p' for Player result, etc.
// Values of 'r' -> Rock, 'p' -> Paper, 's' -> Scissors
let winner; // String 'p' if player wins, 't' for tie, 'c' if computer wins

/*----- cached element references -----*/
const pResultEl = document.getElementById('p-result');
const cResultEl = document.getElementById('c-result');
const countdownEl = document.getElementById('countdown');

/*----- event listeners -----*/
document.querySelector('main')
    .addEventListener('click', handleChoice);

/*----- functions -----*/
init();

// Initialize all state, then call render();
function init() {
    scores = {
        p: 0,
        t: 0,
        c: 0
    };
    results = { // The initial values should load in the way we've been asked in our spec doc/the wireframe (given by designer, boss, etc.)
        p: 'r',
        c: 'r'
    };
    winner = 't';
    render();
}

// In response to user interaction (player makes a move), we update all impacted state, then finally, call render()
function handleChoice(evt) {
    // Guards (do nothing unless one of the three buttons were clicked)
    if (evt.target.tagName !== 'BUTTON') return;
    // Player has made a choice
    results.p = evt.target.innerText.toLowerCase();
    // Compute a random choice for the computer
    results.c = getRandomRPS();
    winner = getWinner();
    scores[winner] += 1; 
    render();
}

function getWinner() {
    if (results.p === results.c) return 't';
    return RPS_LOOKUP[results.p].beats === results.c ? 'p' : 'c'; 
}

function getRandomRPS() {
    const rps = Object.keys(RPS_LOOKUP);
    const rndIdx = Math.floor(Math.random() * rps.length);
    return rps[rndIdx];
}

function renderScores() {
    for (let key in scores) {
        const scoreEl = document.getElementById(`${key}-score`);
        scoreEl.innerText = scores[key];
    };
}

function renderResults() {
    pResultEl.src = RPS_LOOKUP[results.p].img;
    cResultEl.src = RPS_LOOKUP[results.c].img;
    pResultEl.style.borderColor = winner === 'p' ? 'grey' : 'white';
    cResultEl.style.borderColor = winner === 'c' ? 'grey' : 'white';
}

// Transfer/visualize all state to the DOM
function render() {
    renderCountdown(function() {
        renderScores();
        renderResults();  
    });
}

function renderCountdown(cb) {
    let count = 3;
    AUDIO.currentTime = 0;
    AUDIO.play();
    countdownEl.style.visibility = 'visible';
    countdownEl.innerText = count;
    const timerId = setInterval(function() {
        count --;
        if (count) {
            countdownEl.innerText = count;
        } else {
            clearInterval(timerId);
            countdownEl.style.visibility = 'hidden';
            cb();
        };
    }, 1000);
}