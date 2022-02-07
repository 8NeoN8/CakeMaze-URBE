//Definiendo las bases del canvas
let canvas = document.getElementById("mainScreen");
let ctx = canvas.getContext("2d");
let size = 600;

canvas.width = size;
canvas.height = size;


// Clase de vectores
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Clase para cada elemento dibujable del juego
class Element {
    constructor(point, image, width, height) {
        this.point = point;
        this.image = image;
        this.width = width;
        this.height = height;
    }
}

// Clase para botones que extiende de Element porque también se dibuja
class Button extends Element {
    constructor(point, image, width, height, doors) {
        super(point, image, width, height);
        this.doors = doors;
        this.pressed = false;
    }

    // Cuando se presiona el botón se cambia la imagen y se cambia el estado del botón
    press() {
        this.pressed = true;
        this.image = loadImage('./images/button-pressed.png');
        btnAudio.play();
    }
}

// Clase para los corazones que representan las vidas del jugador
class Heart{
    constructor(){
        this.image = loadImage('./images/heart.png');
        this.size = new Point(30,30);
    }

    break(){
        this.image = loadImage('./images/brokenHeart.png');
    }
}



// Dibuja el jugador
function drawCharacter() {

    ctx.drawImage(player.image, player.point.x - playerSize / 2 + hitbox / 2, player.point.y - playerSize + hitbox, playerSize, playerSize);

    // Muestra la hitbox del personaje
    // ctx.fillStyle = 'black';
    // ctx.fillRect(player.point.x, player.point.y, player.width, player.height);
}



//Crear el tileMap

let mapArray = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 5, 0, 0, 2, 0, 0, 0, 5, 5, 0, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0],
    [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 5, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 5, 5, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 5, 0, 0, 2, 0, 0, 5, 0, 0, 5, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 5, 0, 0],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 1, 0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 5, 5, 0],
    [0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 5, 5, 0, 0, 0, 1, 0, 0, 0, 5, 5, 0, 0, 5, 0],
    [0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0],
    [0, 5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 5, 5, 5, 0, 0, 5, 5, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 5, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 5, 0, 0, 0],
    [0, 0, 3, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 0, 3, 0, 0],
    [0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Función para crear una imagen
function loadImage(src) {
    let image = new Image();
    image.src = src;
    return image;
}

// Imagenes
let wall = loadImage('./images/wall.png');
let door = loadImage('./images/door.png');
let button = loadImage('./images/button.png');
let cakeSpr = loadImage('./images/cake.png');
let pits = loadImage('./images/pit.png');
let gameOver = loadImage('./images/gameover.jpg');
let sprite = loadImage('./images/char.png');

//Música

let happyEnding = new Audio('./assets/beatbox.mp3');
let gameOverAudio = new Audio('./assets/gameover.mp3');
let bgAudio = new Audio('./assets/BGMain.mp3');
let btnAudio = new Audio('./assets/btn.mp3');
let trueEnding = new Audio('./assets/ending.mp3'); 
let hitSound = new Audio('./assets/hurt.wav');
let BGMusic = bgAudio;

// Variables del jugador
let hitbox = 10;
let playerSize = 35;    
let speed = 2.6;
let isMoving = false;
let dir = new Point(0, 0);
const startPoint = new Point(330, 550);
let player = new Element(startPoint, sprite, hitbox, hitbox);

let maxLives = 3;
let lives = maxLives;
let hearts = [];
for (let i = 0; i < maxLives; i++) hearts.push(new Heart());

// No cambiar
let memefy = false;

// Este valor enviará el jugador al pastel
//player.point = new Point(200,200); 




// Tamaño de los elementos y del mapa
const TILE_SIZE = size / 30;
const LEVEL_WIDTH = mapArray[0].length;
const LEVEL_HEIGHT = mapArray.length;

// Arrays para los elementos (y el pastel)
let walls = [];
let doors = [];
let buttons = [];
let cake = null;
let holes = [];


// Función que va a leer el array del tilemap y va a crear los elementos en su posición
function loadMap() {

    // For que pasa por cada elemento del array
    for (let i = 0; i < mapArray.length; i++) {
        for (let j = 0; j < mapArray.length; j++) {
            let posElement = new Point(j * TILE_SIZE, i * TILE_SIZE);

            // Determina cual elemento debe crearse 
            switch (mapArray[i][j]) {
                case 1:
                    walls.push(new Element(posElement, wall, TILE_SIZE, TILE_SIZE));
                    break;
                case 2:
                    doors.push(new Element(posElement, door, TILE_SIZE, TILE_SIZE));
                    doors[doors.length - 1].isOpen = false;
                    break;
                case 3:
                    buttons.push(new Button(posElement, button, TILE_SIZE, TILE_SIZE, []));
                    break;
                case 4:
                    cake = new Element(posElement, cakeSpr, TILE_SIZE, TILE_SIZE);
                    break;
                case 5:                    
                    holes.push(new Element(posElement, pits, TILE_SIZE, TILE_SIZE));
                    break;
            }
        }
    }

    // Ordena las puertas y los botones por su posición para poder seleccionaras más fácilmente
    doors = sortByPosition(doors);
    buttons = sortByPosition(buttons);

    // Indica que el pastel no se ha conseguido
    cake.gotten = false;

    // Diciéndo cuales puertas pertenecen a cada botón
    buttons[2].doors = [6, 7];
    buttons[4].doors = [0, 1];
    buttons[1].doors = [8, 9];
    buttons[0].doors = [4, 5]
    buttons[3].doors = [2, 3];

    // El botón 3 deberá estar oculto
    buttons[3].isOpen = true;
}


// Función que va a ordenar los elementos de un array por su posición
const sortByPosition = (array) => {
    return array.sort((a, b) => {
        if (a.point.y == b.point.y) {
            return a.point.x - b.point.x;
        }
        else return a.point.y - b.point.y;
    });
}

// Cargar el mapa
loadMap();


// Función que va a dibujar los elementos
function drawMap() {

    // Determina qué color usar en el piso
    let type = 0;

    // Colores del piso
    let darkBlue = '#003366';
    let whiteBlue = '#336699';

    // Dibujar el piso. En cada iteración se va a cambiar el tipo de piso
    for (let i = 0; i < LEVEL_WIDTH; i++) {
        for (let j = 0; j < LEVEL_HEIGHT; j++) {

            // Si el tipo es par, dibujar el piso azul de lo contrario dibujar el piso azul claro
            if (type % 2 == 0) ctx.fillStyle = darkBlue;
            else ctx.fillStyle = whiteBlue;

            ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            type++;
        }
        type++;
    }

    // Se combinan todos los array de los elementos para poder dibujarlos en un mismo for
    let elements = walls.concat(doors).concat(buttons).concat(holes);

    // Se dibujan los elementos que no tengan el atributo isOpen como true
    elements.forEach(element => {
        if (!element.isOpen) ctx.drawImage(element.image, element.point.x, element.point.y, TILE_SIZE, TILE_SIZE);
    })

    // Se dibuja el pastel 
    ctx.drawImage(cake.image, cake.point.x, cake.point.y, TILE_SIZE + 20, TILE_SIZE + 20);
}

// Esta función dibuja los corazones
function drawHearts(){
    for(let i = 0; i < hearts.length; i++){
        // Opacidad
        ctx.globalAlpha = 0.8;
        ctx.drawImage(hearts[i].image, i * 35, 0, 35, 35);
        ctx.globalAlpha = 1;
    }
}

// Esta función determina si dos elementos se tocan
function collisionCheck(element1, element2) {
    return (element1.point.x < element2.point.x + element2.width &&
        element1.point.x + element1.width > element2.point.x &&
        element1.point.y < element2.point.y + element2.height &&
        element1.point.y + element1.height > element2.point.y);
}



// Función que limpia el canvas
function clearScreen() {
    ctx.clearRect(0, 0, size, size);
}


// Función del daño del jugador
function hitPlayer(){
    // Quitar una vida
    lives--;
    // Si las vidas son cero,  se llama la función GameOver
    if(lives == 0) GameOver();
    else hitSound.play();

    // Se rompen todos los corazones
    hearts.map(heart => heart.break());

    // Si activan los corazones que no están rotos
    for(let i = 0; i < lives; i++) hearts[i] = new Heart();
}

// Colisión con las paredes y puertas
function collideWalls() {

    // Combinación del array de paredes con el array de puertas
    let elements = walls.concat(doors);

    // Se comprueba si el jugador choca con alguna de las paredes o puertas
    for (let i = 0; i < elements.length; i++) {
        if (collisionCheck(player, elements[i]) && !elements[i].isOpen) {
            isMoving = false;
            return elements[i];
        }
    }
    return null;
}

// Colisión con el pastel
function collideCake(){

    // Si el pastel ya se obtuvo, return
    if(cake.gotten) return;

    // Si colisiona 
    if(collisionCheck(player, cake)){

        // Tocar canción
        playBGM(memefy ? happyEnding : trueEnding);
        document.getElementById("place").innerHTML = "<h1>HAS CONSEGUIDO EL PASTEL</h1>";

        // Cerrar todas las puertas
        doors.map(door => door.isOpen = false);
        cake.gotten = true; // Se obtiene el pastel
        return cake;
    }
    return null;
}

// Colisión con los botones
function collideButtons() {
    for (let i = 0; i < buttons.length; i++) {
        // Si se pulsa el botón y este no está presionado y el atributo isOpen es false
        if (collisionCheck(player, buttons[i]) && !buttons[i].pressed && !buttons[i].isOpen) {
            
            // Si el botón 0 se presiona, aparece el botón 3
            if (i == 0) buttons[3].isOpen = false;

            // Presionar el botón y abrir sus respectivsas puertas
            buttons[i].press();
            buttons[i].doors.forEach(door => {
                // Se obtiene el indice de la puerta y se abre
                doors[door].isOpen = true;
            });

        }
    }
}

// Colisión con los agujeros
function collidePits(){
    for (let i = 0; i < holes.length; i++) {
        // Si el jugador choca con alguno de los agujeros se deja de mover, regresa al inicio y pierde una vida
        if (collisionCheck(player, holes[i])) {
            isMoving = false;          
            player.point = new Point(330,550);
            hitPlayer();
            return holes[i];
        }
    }
    return null;
}

let monkee = false;


// Movimiento del jugador
function movement() {

    // Si se está moviendo
    if (isMoving) {

        // Se guarda la posición anterior
        let prevPoint = { ...player.point };

        // Se suma la velocidad a la posición actual a partir del valor de dir. Que está entre -1, 0 y 1
        player.point.x += dir.x * speed;
        player.point.y += dir.y * speed;

        // Se obtiene la pared que se choca con el jugador si es que existe
        let wall = collideWalls();
        // Si existe...
        if (wall) {
            
            if(cake.gotten && (doors[2] == wall || doors[3] == wall) && memefy && !monkee){
                document.getElementById('place').innerHTML += "<img src='https://c.tenor.com/sfjmw3A0qjUAAAAd/monkey-door-jumping.gif' style='position:absolute; top:0; right:0;'/>";
                monkee = true;
            }

            // Si choca se queda en la posición anterior
            player.point = prevPoint;
        }


        // Dejar de moverse si toca un borde
        if (player.point.x < 0) {
            player.point.x = 0;
        }
        if (player.point.x > size - hitbox) {
            player.point.x = size - hitbox;
        }

        if (player.point.y < 0) {
            player.point.y = 0;
        }

        if (player.point.y > size - hitbox) {
            player.point.y = size - hitbox;
        }
    }

}


// Función para el game over
function GameOver(){
    if (lives<=0){
        if(memefy) new Audio('./assets/death.mp3').play();
        playBGM(gameOverAudio);
        clearScreen();
        ctx.drawImage(gameOver, 0, 0, size, size);
        shouldRun = false;

        // Recargar en 5 segundos la página
        setTimeout(() => {
            location.reload();
        },5000);
    }
}


// Cambiar la música de fondo
function playBGM(audio){
    if(!BGMusic.paused){
        BGMusic.pause();
        BGMusic.currentTime = 0;
    }
    BGMusic = audio;
    BGMusic.play();
    BGMusic.loop = true;
}


let shouldRun = true; // Debe correr el juego
const gameLoop = () => {
    
    // si no debe correr el juego, return
    if(!shouldRun) return;
    

    // Se ejecutan los procesos del juego
    clearScreen();
    drawMap();
    drawCharacter();
    movement();
    collideButtons();
    collideCake();
    collidePits();
    drawHearts();

    // Se ejecuta el game loop
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);


// Movimiento del jugador

// Indican qué botones se están presionando
let inputs = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Eventos de teclado
document.addEventListener('keydown', (e) => {

    if(BGMusic.paused) playBGM(bgAudio);

    // Si se presiona una flecha, se cambia la posición respectiva, isMoving cambia a true y el input se pone en true

    // Izquierda
    if (e.keyCode === 37 && !inputs.left) {
        dir.x = -1;
        isMoving = true;
        inputs.left = true;
    }

    // Derecha
    if (e.keyCode === 39 && !inputs.right) {
        dir.x = 1;
        isMoving = true;
        inputs.right = true;
    }

    // Arriba

    if (e.keyCode === 38 && !inputs.up) {
        dir.y = -1;
        isMoving = true;
        inputs.up = true;
    }

    // Abajo
    if (e.keyCode === 40 && !inputs.down) {
        dir.y = 1;
        isMoving = true;
        inputs.down = true;
    }

});


// Si se suelta una tecla y no se presiona su contraria la dirección respectiva pasa a 0
document.addEventListener('keyup', (e) => {
    if (e.keyCode === 37) {
        inputs.left = false;

        // Si no está presionando la tecla contraria
        if (!inputs.right) {
            dir.x = 0;
        }
    }

    if (e.keyCode === 39) {
        inputs.right = false;
        if (!inputs.left) {
            dir.x = 0;
        }
    }


    if (e.keyCode === 38) {
        inputs.up = false;
        if (!inputs.down) {
            dir.y = 0;
        }
    }

    if (e.keyCode === 40) {
        inputs.down = false;
        if (!inputs.up) {
            dir.y = 0;
        }
    }

    // Si no se toca ninguna flecha, se deja de mover
    if (!inputs.up && !inputs.down && !inputs.left && !inputs.right) isMoving = false;
});


