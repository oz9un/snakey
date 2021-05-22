window.addEventListener('load', function () {
 
let gs = document.getElementById('game-screen')

var pixelw, pixelh;


const chg = () => {
    pixelw = window.innerWidth - ( window.innerWidth % 50) - 300
    pixelh = window.innerHeight - ( window.innerHeight % 50) - 100
    
    document.getElementById('game-screen').style.width = pixelw + 'px';
    document.getElementById('game-screen').style.height = `${pixelh}px`;
}


const createSquares = () => {
    while(gs.firstChild) {
        gs.removeChild(gs.lastChild)
    }
    console.log(document.getElementById('game-screen').getBoundingClientRect())
    let pixelCount = (pixelw / 25) * (pixelh / 25);

    for(let x=0; x<pixelCount; x++){
        let square = document.createElement('div');
        square.classList.add('square');
        square.style.height = `25px`;
        square.style.width = `25px`;
        gs.appendChild(square);
    }
}

chg()
createSquares()
window.addEventListener('resize', () => {
    chg()
    createSquares()
})

})