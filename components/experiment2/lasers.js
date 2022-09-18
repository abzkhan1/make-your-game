import { laserSettings, gameViewSettings } from "./globalsettings.js"
import { checkCollision } from "./collision.js";
import { levels, currentLevel } from "./levels.js"

let gameView = document.querySelector(".gameView");

let laserStartingPosition = [],
    laserPositions = [],
    laser_cooldown = Math.floor(Math.random() * 100)

function createLasers() {
    let aliens = document.querySelectorAll('.alien')
    let random = Math.floor(Math.random() * aliens.length)
    for (let i = 0; i < aliens.length; i++) {
        if (i === random) {
            let alien = aliens[i]
            const laser = document.createElement('img')
            laser.classList.add('laser')
            laser.src = laserSettings.image
            gameView.appendChild(laser)
            laser.style.width = laserSettings.width + 'px'
            laser.style.height = laserSettings.height + 'px'
            laser.style.position = 'absolute'
            laserStartingPosition[0] = parseInt(alien.style.left) + (alien.getBoundingClientRect().width / 2)
                - (laserSettings.width / 2)
            laserStartingPosition[1] = alien.getBoundingClientRect().top + alien.getBoundingClientRect().height
            laserPositions.push([laserStartingPosition[0], laserStartingPosition[1]])
        }
    }
}

function drawLasers() {
    let laser = document.querySelectorAll('.laser')
    for (let i = 0; i < laser.length; i++) {
        laser[i].style.left = laserPositions[i][0] + 'px'
        laser[i].style.top = laserPositions[i][1] + 'px'
    }
}

export function laserMovement() {
    //remove lasers when they are at the bottom of game view
    let laserArr = document.querySelectorAll('.laser')
    for (let i = 0; i < laserPositions.length; i++) {
        laserPositions[i][1] += levels[currentLevel].aliens.laserSpeed
        if (laserPositions[i][1] >= gameViewSettings.gameViewHeight - (laserSettings.height - gameViewSettings.borderWidth)) {
            laserArr[i].remove()
            laserPositions.splice(i, 1)
        }
    }

    //collision of lasers
    let paddleSizeAndPos = document.querySelector('.paddle').getBoundingClientRect()
    for (let i = 0; i < laserArr.length; i++) {
        let laserSizeAndPos = laserArr[i].getBoundingClientRect()
        if (checkCollision(laserSizeAndPos, paddleSizeAndPos)) {
            laserArr[i].remove()
            laserPositions.splice(i, 1)
        }
    }
    drawLasers()
    updateLasers()
}

//the frequency of lasers shot by invaders
function updateLasers() {
    if (laser_cooldown === 0) {
        createLasers()
        drawLasers()
        laser_cooldown = Math.floor(Math.random() * 100)
        return
    }
    laser_cooldown -= 0.5
}