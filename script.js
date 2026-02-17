const size = [30, 15]
const colors = ['rgb(240, 12, 0)', 'rgb(240, 108, 0)', 'rgb(236, 240, 0)', 'rgb(3, 209, 0)', 'rgb(29, 39, 177)', 'rgb(153, 0, 209)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(105, 105, 105)']

let grid = document.querySelector('.grid')
let tools = document.querySelector('.tools')
let rubber = document.querySelector('.rubber')
let save = document.querySelector('.save')
let pen = document.querySelector('.pen')
let fill = document.querySelector('.fill')
let download = document.querySelector('.download')
let cookie = document.querySelector('.cookie')

let penColor = colors[0]
let PENDOWN = false
let FILL = false
let RUBBER = false
function createGrid(size) {
    grid.style.gridTemplateRows = `repeat(${size[1]}, 1fr)`
    grid.style.gridTemplateColumns = `repeat(${size[0]}, 0.6fr)`
    for (let i = 0; i < size[1]; i += 1) {
        for (let a = 0; a < size[0]; a += 1) {
            let square = document.createElement('div')
            square.classList.add('square')
            square.id = `square${i}-${a}`
            square.addEventListener('click', function () {
                if (!FILL) {
                    square.style.backgroundColor = penColor
                }
            })
            square.addEventListener('mouseover', function () {
                if (PENDOWN) {
                    square.style.backgroundColor = penColor
                }
            })
            grid.appendChild(square)
        }
    }
}

function saveCookie() {
    let result = ''
    let squares = document.querySelectorAll('.square')
    for (let square of squares) {
        // let colorNumber = colors.indexOf(square.style.backgroundColor)
        let colorNumber = colors.indexOf(getComputedStyle(square).backgroundColor)
        // if (colorNumber == -1) {
        //     colorNumber = 9
        // }
        result += `${colorNumber} `
        // console.log(colorNumber)
        // console.log(getComputedStyle(square).backgroundColor)
    }
    // console.log(result)
    document.cookie = `colors=${result}`
}

function loadCookie() {
    let cookies = document.cookie.split('; ')
    for (let cookie of cookies) {
        cookie = cookie.split('=')
        if (cookie[0]=='colors') {
            return cookie[1]
        }
    }
    return 'null'
}

createGrid(size)
let cookies = loadCookie()
if (cookies != 'null') {
    cookies = cookies.split(' ')
    let squareAll = document.querySelectorAll('.square')
    for (let i = 0; i < squareAll.length; i += 1) {
        let color = cookies[i]
        if (color != '-1') {
            squareAll[i].style.backgroundColor = colors[+color]
        }
    }
}

for (let color of colors) {
    // console.log(color)
    let square = document.createElement('div')
    square.classList.add('color')
    square.style.backgroundColor = color
    square.addEventListener('click', function () {
        penColor = square.style.backgroundColor
    })
    tools.appendChild(square)
}

grid.addEventListener('mousedown', function () {
    PENDOWN = true
})

grid.addEventListener('mouseup', function () {
    PENDOWN = false
})

grid.addEventListener('click', function () {
    if (FILL) {
        let squares = document.querySelectorAll('.square')
        for (let square of squares) {
            square.style.backgroundColor = penColor
        }
    }
})
save.addEventListener('click', saveCookie)

rubber.addEventListener('click', function () {
    penColor = 'rgb(10, 10, 10)'
    RUBBER = !RUBBER
    if (RUBBER) {
        rubber.style.backgroundColor = 'green'
    }
    else {
        rubber.style.backgroundColor = 'rgb(10, 10, 10)'
    }
})

fill.addEventListener('click', function () {
    FILL = !FILL
    if (FILL) {
        fill.style.backgroundColor = 'green'
    }
    else {
        fill.style.backgroundColor = 'rgb(10, 10, 10)'
    }
})
download.addEventListener('click', function() {
    domtoimage.toPng(grid)
        .then(function (dataUrl) {
            let img = new Image();
            img.src = dataUrl;
            let link = document.createElement('a')
            link.download = 'pixel.png'
            link.href = dataUrl
            link.click()
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
})

setInterval(saveCookie, 30000)