// Constantes Globais:

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game-board");

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

context.fillStyle = "yellow";

// Variáveis Globais:
var isPressed = false;
var mxCurrent = false;

var MatrixSizeX, MatrixSizeY, MatrixSize,
    CanvasSizeX, CanvasSizeY, CellSize = 10;

/** @type {Array<Array<Number>>} */
var matrix0;

/** @type {Array<Array<Number>>} */
var matrix1;


// Redimensionamento do Canvas:
canvas.addEventListener("resize", () => {

    CanvasSizeX = (canvas.clientWidth  -= canvas.clientWidth  % CellSize);
    CanvasSizeY = (canvas.clientHeight -= canvas.clientHeight % CellSize);

    MatrixSizeX = Math.floor(CanvasSizeX / CellSize);
    MatrixSizeY = Math.floor(CanvasSizeY / CellSize);

    // Inicialização das Matrizes:
    matrix0 = [];
    matrix1 = [];

    for (let i=0; i < MatrixSizeY; i++) {
        let row0 = [];
        let row1 = [];

        for (let j = 0; j < MatrixSizeX; j++) {
            row0.push(0);
            row1.push(0);
        }
        matrix0.push(row0);
        matrix1.push(row1);
    }

    }
)
canvas.dispatchEvent(new Event("resize"));


function getOffsetPosition(evt, parent){
    var position = {
        x: (evt.targetTouches) ? evt.targetTouches[0].pageX : evt.clientX,
        y: (evt.targetTouches) ? evt.targetTouches[0].pageY : evt.clientY
    };

    while(parent.offsetParent){
        position.x -= parent.offsetLeft - parent.scrollLeft;
        position.y -= parent.offsetTop - parent.scrollTop;

        parent = parent.offsetParent;
    }

    return position;
}

// Manipuladores de Eventos:
canvas.addEventListener("mousedown", 
    () => { isPressed = true; })

canvas.addEventListener("mouseup", 
    () => { isPressed = false; })

canvas.addEventListener("mousemove", (event) => {
    if(isPressed){
        let matrix = mxCurrent? matrix1 : matrix0;
        let x = Math.floor(event.offsetX * canvas.width  / canvas.offsetWidth  / CellSize);
        let y = Math.floor(event.offsetY * canvas.height / canvas.offsetHeight / CellSize);
        matrix[y][x] = 1;
    }
})

canvas.addEventListener("touchstart", 
    () => { isPressed = true; })

canvas.addEventListener("touchend", 
    () => { isPressed = false; })

canvas.addEventListener("touchmove", (event) => {
    console.log(event.touches)
    let touch = event.touches[0];
    if(isPressed){
        let matrix = mxCurrent? matrix1 : matrix0;
        let x = Math.floor((touch.pageX - canvas.offsetLeft) * canvas.width  / canvas.offsetWidth  / CellSize);
        let y = Math.floor((touch.pageY - canvas.offsetTop) * canvas.height / canvas.offsetHeight / CellSize);
        matrix[y][x] = 1;
    }
})


// Game Loop:
function loopGame() {
    
    // Pagar Estado Atual:
    let matrix     = mxCurrent? matrix1 : matrix0;
    let matrixTemp = mxCurrent? matrix0 : matrix1;
    
    // Limpar Tela:
    context.clearRect(0, 0, CanvasSizeX, CanvasSizeY);

    // Itera Sobre a Matriz Atual:
    for (let i = 0; i < MatrixSizeY; i++) {
        for (let j = 0; j < MatrixSizeX; j++) {

            // Desenhar Células Vivas:
            let cellIsLife = Boolean(matrix[i][j]);

            if(cellIsLife){
                context.fillRect(j*CellSize, i*CellSize, CellSize, CellSize);
            }

            // Computar Novo Estado:

            // Encontra todos os Vizinhos:
            let neighbors_number = 0;
            let neighborsMap = [
                [i, j-1],   [i, j+1],
                [i-1, j],   [i+1, j],
                [i-1, j+1], [i+1, j-1],
                [i-1, j-1], [i+1, j+1]
            ];

            for (let e = 0; e < neighborsMap.length; e++) {
                let _i = neighborsMap[e][0];
                let _j = neighborsMap[e][1];

                if ( 
                    MatrixSizeY > _i && _i > 0 &&
                    MatrixSizeX > _j && _j > 0
                ) {
                    neighbors_number += matrix[_i][_j];
                }
            }

            // Computa o Estado Atual da Célula:
            matrixTemp[i][j] = (!cellIsLife && neighbors_number == 3) || (cellIsLife && (neighbors_number < 4) && (neighbors_number > 1) );    
        }
    }

    // Troca as Matrizes:
    mxCurrent = !mxCurrent;

    setTimeout(() => {
        window.requestAnimationFrame(loopGame);
    }, 150)
}


loopGame();