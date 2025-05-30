const squares = document.querySelectorAll('.square');
const score = document.querySelector('#score');
const timeLeft = document.querySelector('#time-left');
const difficultyMenu = document.querySelector('#difficulty-menu');
const gameContainer = document.querySelector('#game-container');
const easyButton = document.querySelector('#easy');
const normalButton = document.querySelector('#normal');
const hardButton = document.querySelector('#hard');

let emojiSpeed;
let result = 0;
let currentTime = 60;
let isHardMode = false;
let hitPosition;
let timerId;
let countdownTimerId;
let squarePositions = Array.from({ length: squares.length }, (_, i) => i);
let lastSquareIndex;
let badHitPosition;
let lastBadSquareIndex;
let badEmojiTimerId;

// Gestione difficoltà
easyButton.addEventListener('click', () => {
    emojiSpeed = 1000; 
    startGame();
});

normalButton.addEventListener('click', () => {
    emojiSpeed = 500;
    startGame();
});

hardButton.addEventListener('click', () => {
    emojiSpeed = 1000;
    isHardMode = true; 
    startGame();
});

function randomSquare() {
    // Puliamo tutti i quadrati
    squares.forEach((square) => {
        square.classList.remove('emoji');
        square.classList.remove('emoji-bad');
    });

    // Creiamo un array temporaneo che esclude l'indice precedente
    const availableIndices = squarePositions.filter((index) => index !== lastSquareIndex);

    // Seleziona un indice casuale dall'array temporaneo
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

    // Ottieniamo il quadrato corrispondente
    const randomSquare = squares[randomIndex];

    // Aggiungiamo la classe 'emoji'
    randomSquare.classList.add('emoji');
    // Salviamo la posizione del quadrato giusto
    hitPosition = randomSquare.id;
    // Aggiorniamo l'ultimo indice selezionato
    lastSquareIndex = randomIndex;

    // Creiamo un array per l'emoji cattiva che esclude sia il suo ultimo indice che la posizione attuale dell'emoji buona
    const availableIndicesForBad = squarePositions.filter((index) => 
        index !== lastBadSquareIndex && index !== randomIndex
    );

    // Seleziona un indice casuale per l'emoji cattiva
    // Seguendo le stessa logica di assegnazione dell'emoji buona
    const randomBadIndex = availableIndicesForBad[Math.floor(Math.random() * availableIndicesForBad.length)];
    const randomBadSquare = squares[randomBadIndex];
    randomBadSquare.classList.add('emoji-bad');
    badHitPosition = randomBadSquare.id;
    lastBadSquareIndex = randomBadIndex;
}

function moveEmoji() {
    // Sposta l'emoji su un quadrato casuale
    randomSquare();

    // Se siamo in modalità difficile, aumentiamo la difficoltà:
    if (isHardMode) {
        emojiSpeed -= 9; // Rende il gioco più veloce riducendo il tempo tra i movimenti

        // Impediamo che emojiSpeed scenda sotto un certo limite (100ms)
        if (emojiSpeed < 100) emojiSpeed = 100;

        // Mostriamo la nuova velocità nella console per debugging
        console.log("Nuova velocità:", emojiSpeed);
    }

    // Usiamo setTimeout per richiamare questa funzione dopo 'emojiSpeed' millisecondi
    // In questo modo, la velocità può cambiare ad ogni iterazione
    timerId = setTimeout(moveEmoji, emojiSpeed);
}

function countdown() {
    // Decrementa il tempo rimanente di un secondo
    currentTime--;
    timeLeft.textContent = currentTime; // Aggiorna il tempo rimanente sullo schermo

    // Se il tempo è scaduto, ferma il gioco
    if (currentTime === 0) {
        clearTimeout(timerId); // Ferma il timer dell'emoji
        clearTimeout(badEmojiTimerId); // Ferma il timer dell'emoji cattiva
        clearInterval(countdownTimerId); // Ferma il timer del countdown
        alert('Game Over! Your score is ' + result); // Mostra il punteggio finale
    }
}

squares.forEach((square) => {
    // Aggiungi un evento di ascolto per il click su ogni quadrato
    square.addEventListener('mousedown', () => {
        // Se il quadrato cliccato è quello giusto
        if (square.id === hitPosition) {
            result++; // Incrementa il punteggio
            score.textContent = result; // Aggiorna il punteggio sullo schermo
            hitPosition = null; // Resetta l'indice dell'emoji
        } else if (square.id === badHitPosition) {
            result--; // Decrementa il punteggio
            score.textContent = result;
            badHitPosition = null;
        }
    });
});

function startGame() {
    difficultyMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    moveEmoji();
    countdownTimerId = setInterval(countdown, 1000);
}