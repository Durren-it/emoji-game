const squares = document.querySelectorAll('.square');
const score = document.querySelector('#score');
const timeLeft = document.querySelector('#time-left');
const difficultyMenu = document.querySelector('#difficulty-menu');
const gameContainer = document.querySelector('#game-container');
const easyButton = document.querySelector('#easy');
const normalButton = document.querySelector('#normal');
const hardButton = document.querySelector('#hard');

let emojiSpeed = 500; // Velocità default
let result = 0;
let currentTime = 60;
let isHardMode = false;
let hitPosition;
let timerId;
let countdownTimerId;

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
    });
    // Prendiamo un quadrato casuale
    let randomSquare = squares[Math.floor(Math.random() * 9) + 1];
    // Aggiungiamo la classe 'emoji'
    randomSquare.classList.add('emoji');
    // Salviamo la posizione del quadrato giusto
    hitPosition = randomSquare.id;
}

function moveEmoji() {
    clearInterval(timerId); // Reset timer
    timerId = setInterval(randomSquare, emojiSpeed);
}

function countdown() {
    // Decrementa il tempo rimanente di un secondo
    currentTime--;
    timeLeft.textContent = currentTime; // Aggiorna il tempo rimanente sullo schermo

    // REMINDER: Se durata gioco verrà modificata, aggiungere un limite ad emojiSpeed per modalità hard
    if (isHardMode) {
        emojiSpeed -= 14; // Riduci la velocità di 14ms ogni secondo
    }

    clearInterval(timerId); // Resetta il timer precedente
    timerId = setInterval(randomSquare, emojiSpeed); // Applica la nuova velocità

    // Se il tempo è scaduto, ferma il gioco
    if (currentTime === 0) {
        clearInterval(timerId); // Ferma il timer dell'emoji
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
        }
    });
});

function startGame() {
    difficultyMenu.style.display = 'none'
    gameContainer.style.display = 'block'
    moveEmoji();
    countdownTimerId = setInterval(countdown, 1000);
}