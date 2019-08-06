let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let displayPoints = document.querySelector('span');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const defaultRects = () => [{
    x: canvas.width / 2 - 100,
    y: canvas.height - 30 - 50,
    width: 200,
    height: 30
}, {
    x: canvas.width,
    y: canvas.height - 60 - 50,
    width: 200,
    height: 30
}];

let points = 0;
displayPoints.innerText = points;
let rects = defaultRects();

ctx.fillStyle = '#fff';
ctx.strokeStyle = '#000';
ctx.lineWidth = 2;

let moveSpeed = 5;
let moveX = -moveSpeed;
let moveY = false;
let moveYAnimation = [0.1, 0.3, 0.6, 1, 1, 3, 4, 5, 5, 4, 3, 1, 1, 0.6, 0.3, 0.1];
let moveYAnimationIndex = 0;

let render = () => {
    if (moveY) {
        for (let i = 0; i < rects.length; i++) {
            rects[i].y = rects[i].y + moveYAnimation[moveYAnimationIndex];
        }

        moveYAnimationIndex++;

        if (moveYAnimationIndex > moveYAnimation.length - 1) {
            moveY = false;
        }
    }

    for (let i = 0; i < rects.length; i++) {
        ctx.beginPath();
        ctx.rect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
        ctx.stroke();
    }

    if (rects[rects.length - 1].x < canvas.width / 2 - 250 - 100) moveX = moveSpeed;
    if (rects[rects.length - 1].x > canvas.width / 2 + 250 - 100) moveX = -moveSpeed;

    rects[rects.length - 1].x = rects[rects.length - 1].x + moveX;
}

canvas.addEventListener('click', () => {
    let gameOver = false;

    const movingRect = rects[rects.length - 1];
    const prevRect = rects[rects.length - 2];

    let newWidth;
    let newX;

    if (
        movingRect.x + movingRect.width < prevRect.x
        || movingRect.x > prevRect.x + prevRect.width
    ) {
        gameOver = true;
    }

    if (movingRect.x >= prevRect.x) {
        if (movingRect.x - prevRect.x <= 3) {
            movingRect.width = prevRect.width;
            movingRect.x = prevRect.x;
        } else {
            movingRect.width = prevRect.x + prevRect.width - movingRect.x;
        }
    }

    if (movingRect.x < prevRect.x) {
        if (prevRect.x - movingRect.x <= 3) {
            movingRect.width = prevRect.width;
            movingRect.x = prevRect.x;
        } else {
            movingRect.width = movingRect.x + movingRect.width - prevRect.x;   
            movingRect.x = prevRect.x;
        }
    }

    newWidth = movingRect.width;


    if (gameOver) {
        alert(`game over :( you score: ${points}`);
        rects = defaultRects();
        moveX = -moveSpeed;
        points = 0;
        displayPoints.innerText = points;
    } else {
        points++;
        displayPoints.innerText = points;

        if (moveX < 0) {
            moveX = moveSpeed;
            newX = 0 - newWidth;
        } else {
            moveX = -moveSpeed;
            newX = canvas.width;
        };

        if (rects.length >= 8) {
            moveY = true;
            moveYAnimationIndex = 0;
        }

        rects.push({
            width: newWidth,
            height: 30,
            x: newX,
            y: rects[rects.length - 1].y - 30
        });        
    }
});



let renderLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    requestAnimationFrame(renderLoop);
};
requestAnimationFrame(renderLoop);
