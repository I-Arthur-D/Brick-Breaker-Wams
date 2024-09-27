const barGameElement = document.getElementById('barGame');
const gameScreenElement = document.getElementById('gameScreen');
const ballElement = document.getElementById('ballGame');
const screenGameOverElement = document.getElementById('screenGameOver');
const resetGameElement = document.getElementById('resetGame');

let bricksList = []

const bricksColors = [
    {border: 'blue', backgroundColor: 'lightBlue'},
    {border: 'green', backgroundColor: 'lightGreen'},
    {border: 'deeppink', backgroundColor: 'lightPink'},
    {border: 'orange', backgroundColor: 'lightYellow'},
    {border: 'purple', backgroundColor: 'mediumpurple'}
]

let point = 0;

let finished = false;

for (let line = 1; line <= 5; line++) {
    for (let colunm = 1; colunm <= 18; colunm++) {
        const sortedColorIndex = Math.floor(Math.random() * 5)
        
        const newDiv = document.createElement('div');
        newDiv.classList.add('newDiv');
        newDiv.style.border = 'solid';
        newDiv.style.borderColor = bricksColors[sortedColorIndex].border;
        newDiv.style.borderWidth = '2px';
        newDiv.style.backgroundColor = bricksColors[sortedColorIndex].backgroundColor;
        newDiv.style.width = '40px';
        newDiv.style.height = '40px';
        newDiv.style.position = 'absolute';
        newDiv.style.left = colunm * 39 + 'px';
        newDiv.style.top = line * 39 + 'px';

        document.getElementById("bricksContainer").appendChild(newDiv);
        bricksList.push(newDiv)
    }
}

// Define a velocidade de movimento da barra do jogo
const barGameSpeed = 10;

const ballGameSpeed = 10;

const initialBarPosition = barGameElement?.getBoundingClientRect();
const initialBallPosition = ballElement?.getBoundingClientRect();
const initialGameScreenPosition = gameScreenElement?.getBoundingClientRect();
let ballPositionX = initialBallPosition.left - initialGameScreenPosition.left;
let ballPositionY = initialBallPosition.top - initialGameScreenPosition.top;

const initialBallSpeedX = 7
const initialBallSpeedY = -7

let ballSpeedX = initialBallSpeedX;
let ballSpeedY = initialBallSpeedY;

// Define a margem mínima em relação às bordas da tela de jogo
const barGameMargin = 8;

// Variáveis para armazenar os intervalos de movimento da barra
let barSetIntervalLeft;
let barSetIntervalRight;

// Objeto para armazenar os intervalos de movimento da barra
const intervals = {
    intervalLeft: undefined,  // Para o movimento à esquerda
    intervalRight: undefined,  // Para o movimento à direita
}

// Adiciona um ouvinte de eventos para detectar quando uma tecla é pressionada
document.addEventListener('keydown', function (event) {
    var key = event.key; // Captura a tecla pressionada

    if (!finished) {
        // Se a tecla for a seta para a esquerda
        if (key === 'ArrowLeft') {
            // Se o intervalo para mover à esquerda ainda não foi iniciado
            if (intervals.intervalLeft == undefined)
                intervals.intervalLeft = moveBar(key);  // Inicia o movimento à esquerda
        }
        // Se a tecla for a seta para a direita
        else if (key === 'ArrowRight') {
            // Se o intervalo para mover à direita ainda não foi iniciado
            if (intervals.intervalRight == undefined)
                intervals.intervalRight = moveBar(key);  // Inicia o movimento à direita
        }
    } else {
        location.reload();
    }
});

// Adiciona um ouvinte de eventos para detectar quando uma tecla é solta
document.addEventListener('keyup', function (event) {
    var key = event.key; // Captura a tecla solta

    // Se a tecla solta for a seta para a esquerda
    if (key === 'ArrowLeft') {
        // Limpa o intervalo de movimento à esquerda
        clearInterval(intervals.intervalLeft);
        intervals.intervalLeft = undefined;  // Redefine o intervalo para indefinido
        // Se a tecla solta for a seta para a direita
    } else if (key === 'ArrowRight') {
        // Limpa o intervalo de movimento à direita
        clearInterval(intervals.intervalRight);
        intervals.intervalRight = undefined;  // Redefine o intervalo para indefinido
    }
});

// Função para mover a barra com base na tecla pressionada
function moveBar(key) {
    // Retorna um intervalo que move a barra em uma direção específica a cada 10ms (ou barGameSpeed)
    return setInterval(() => {
        // Obtém a posição atual da barra do jogo e da tela do jogo
        const barGamePosition = barGameElement?.getBoundingClientRect();
        const gameScreenPosition = gameScreenElement?.getBoundingClientRect();

        // Calcula a nova posição da barra em relação à tela do jogo
        let newLeftPosition = barGamePosition.left - gameScreenPosition.left;

        // Se a seta para a esquerda estiver sendo pressionada, move a barra para a esquerda
        if (key === 'ArrowLeft') {
            newLeftPosition -= barGameSpeed;
        }
        // Se a seta para a direita estiver sendo pressionada, move a barra para a direita
        else if (key === 'ArrowRight') {
            newLeftPosition += barGameSpeed;
        }

        // Atualiza a posição da barra com base na nova posição calculada
        barGameElement.style.left = `${newLeftPosition}px`;


        // Verifica se a barra colidiu com asballGameSpeed bordas horizontais da tela do jogo
        const checkCollision = checkInternalBorderCollision(barGameElement, gameScreenElement);

        // Se houver colisão
        if (checkCollision.isColliding) {
            // Se a colisão for na borda esquerda, reposiciona a barra com base na margem
            if (checkCollision.side == "left") {
                barGameElement.style.left = `${barGameMargin}px`;
            }
            // Se a colisão for na borda direita, reposiciona a barra com base na largura da tela
            else {
                barGameElement.style.left = (gameScreenPosition.width - barGamePosition.width - barGameMargin) + 'px';
            }
        }

    }, barGameSpeed);
}

// Função que verifica se a barra colidiu com as bordas horizontais da tela do jogo
function checkInternalBorderCollision(childElement, parentElement) {
    // Obtém a posição da barra e da tela do jogo
    const childElementPosition = childElement?.getBoundingClientRect();
    const parentPosition = parentElement?.getBoundingClientRect();

    // Verifica se a barra tocou ou ultrapassou a borda esquerda da tela do jogo
    if (childElementPosition.left <= parentPosition.left) {
        return { isColliding: true, side: 'left' };  // Colisão na borda esquerda
    }
    // Verifica se a barra tocou ou ultrapassou a borda direita da tela do jogo
    else if (childElementPosition.right >= parentPosition.right) {
        return { isColliding: true, side: 'right' };  // Colisão na borda direita
    }

    else if (childElementPosition.top <= parentPosition.top) {
        return { isColliding: true, side: 'top' };
    }

    else if (childElementPosition.bottom >= parentPosition.bottom) {
        return { isColliding: true, side: 'bottom' };
    }

    // Se não houver colisão, retorna false
    return { isColliding: false, side: undefined };
}

function checkObjectsExternalCollision(firstElement, secondElement) {
    const firstElementPosition = firstElement?.getBoundingClientRect();
    const secondElementPosition = secondElement?.getBoundingClientRect();

    if (firstElementPosition.bottom >= secondElementPosition.top
        && firstElementPosition.top <= secondElementPosition.top
        && firstElementPosition.left >= secondElementPosition.left
        && firstElementPosition.right <= secondElementPosition.right) {
        return { isColliding: true, side: 'top' };

    } else if (firstElementPosition.left <= secondElementPosition.right
        && firstElementPosition.right >= secondElementPosition.right
        && firstElementPosition.top >= secondElementPosition.top
        && firstElementPosition.bottom <= secondElementPosition.bottom) {
        return { isColliding: true, side: 'right' };

    } else if (firstElementPosition.right >= secondElementPosition.left
        && firstElementPosition.left <= secondElementPosition.right
        && firstElementPosition.top >= secondElementPosition.top
        && firstElementPosition.bottom <= secondElementPosition.bottom) {
        return { isColliding: true, side: 'left' };

    } else if (firstElementPosition.top <= secondElementPosition.bottom
        && firstElementPosition.bottom >= secondElementPosition.bottom
        && firstElementPosition.left >= secondElementPosition.left
        && firstElementPosition.right <= secondElementPosition.right) {
        return { isColliding: true, side: 'bottom' };
    }

    return { isColliding: false, side: undefined };
}

function updatePoint() {
    const pointElement = document.getElementById('point');

    let number = parseInt(pointElement.textContent);

    number += 1;

    pointElement.textContent = number;
}

function moveBallGame() {
    const moveBallInterval = setInterval(() => {
        ballPositionX += ballSpeedX;
        ballPositionY += ballSpeedY;

        if(bricksList.length <= 0) {
            document.getElementById('gameStatus').innerText = 'YOU WIN';
            screenGameOverElement.style.display = 'flex';
            clearInterval(moveBallInterval)
            finished = true
        }

        // Atualiza a posição da bola no DOM
        ballElement.style.left = `${ballPositionX}px`;
        ballElement.style.top = `${ballPositionY}px`;

        const checkInternalCollisionBall = checkInternalBorderCollision(ballElement, gameScreenElement);


        if (checkInternalCollisionBall.isColliding) {
            if (checkInternalCollisionBall.side === "left" || checkInternalCollisionBall.side === "right") {
                ballSpeedX = -ballSpeedX;
            } else if (checkInternalCollisionBall.side === "top") {
                ballSpeedY = -ballSpeedY;
            } else if (checkInternalCollisionBall.side === "bottom") {
                finished = true
                ballSpeedX = 0;
                ballSpeedY = 0;
                screenGameOverElement.style.display = 'flex';
            }
        }

        const checkExternalCollisionBall = checkObjectsExternalCollision(ballElement, barGameElement);

        if (checkExternalCollisionBall.isColliding) {
            // Inverte a direção da velocidade se houver colisão
            if (checkExternalCollisionBall.side === "left" || checkExternalCollisionBall.side === "right") {
                ballSpeedX = - ballSpeedX - 10;
                ballSpeedX = initialBallSpeedX;
            } else if (checkExternalCollisionBall.side === "top" || checkExternalCollisionBall.side === "bottom") {
                ballSpeedY = - ballSpeedY - 10;
                ballSpeedY = initialBallSpeedY;
            }
        }

        bricksList.forEach((brick, index) => {
            const checkCollisioWithBrick = checkObjectsExternalCollision(ballElement, brick);
            if (checkCollisioWithBrick.isColliding) {
                // Inverte a direção da velocidade se houver colisão
                if (checkCollisioWithBrick.side === "left" || checkCollisioWithBrick.side === "right") {
                    ballSpeedX = - ballSpeedX;
                    brick.remove()
                    bricksList.splice(index, 1)
                    updatePoint();

                } else if (checkCollisioWithBrick.side === "top" || checkCollisioWithBrick.side === "bottom") {
                    ballSpeedY = - ballSpeedY;
                    brick.remove()
                    bricksList.splice(index, 1)
                    updatePoint();
                }
            }
        })

    }, 10);
}

moveBallGame();

