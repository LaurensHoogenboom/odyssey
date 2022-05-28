//#region Controls

const POSITION_X_LEFT = -0.5
const POSITION_X_CENTER = 0
const POSITION_X_RIGHT = 0.5

//0 = left, 1 = center, 2 = right
let player_position_index = 1

//move player to provided index @param {int} lane
function movePlayerTo(position_index) {
    player_position_index = position_index

    var position = { x: 0, y: 0, z: 0 }

    if (position_index == 0) position.x = POSITION_X_LEFT
    else if (position_index == 1) position.x = POSITION_X_CENTER
    else position.x = POSITION_X_RIGHT

    document.getElementById('player').setAttribute('position', position)
}

function setupControls() {
    AFRAME.registerComponent('lane-controls', {
        tick: function (time, timeDelta) {
            if (currentChapter == chapters.running) {
                var rotation = this.el.object3D.rotation

                if (rotation.y > 0.1) movePlayerTo(0)
                else if (rotation.y < -0.1) movePlayerTo(2)
                else movePlayerTo(1)
            } else {
                movePlayerTo(1)
            }
        },
    })
}

//#endregion

//#region Trees

const obstacleTypes = ['experience', 'feedback', 'imagination', 'mirror']
let obstacleTypesLeft = ['experience', 'feedback', 'imagination', 'mirror']
let templateTreeLeft
let templateTreeCenter
let templateTreeRight

let numberOfTrees = 0

let RUNNING_BEFORE_REAL_OBSTACLES = 5000

function setupTrees() {
    templateTreeLeft = document.getElementById('template-tree-left')
    templateTreeCenter = document.getElementById('template-tree-center')
    templateTreeRight = document.getElementById('template-tree-right')
    treeContainer = document.getElementById('tree-container')
    templates = [templateTreeLeft, templateTreeCenter, templateTreeRight]

    removeTree(templateTreeLeft)
    removeTree(templateTreeCenter)
    removeTree(templateTreeRight)
}

let treeTimer
let intervalLength = 2000

function addTreesRandomlyLoop() {
    runningTime += intervalLength

    setTimeout(() => {
        addTreesRandomly()

        if (intervalLength > 500) {
            intervalLength = 0.98 * intervalLength
        }

        if (isGameRunning && currentChapter == chapters.running)
            addTreesRandomlyLoop()
    }, intervalLength)
}

function removeTree(tree) {
    tree.parentNode.removeChild(tree)
}

function addTree(el, position_index) {
    numberOfTrees += 1

    if (runningTime > RUNNING_BEFORE_REAL_OBSTACLES) {
        let volumes = [1.3, 1.6, 1.9]
        let obstacleType =
            obstacleTypesLeft[
                Math.floor(Math.random() * obstacleTypesLeft.length)
            ]

        shuffle(volumes)

        el.id = `tree-${numberOfTrees}`
        el.setAttribute('data-obstacle-type', obstacleType)
        el.setAttribute('sound', {
            src: `#${obstacleType}-thought`,
            autoplay: true,
            loop: true,
            volume: volumes[position_index],
        })
    }

    treeContainer.appendChild(el)
}

function addTreeTo(position_index) {
    let template = templates[position_index]
    addTree(template.cloneNode(true), position_index)
}

function addTreesRandomly({
    propTreeLeft = 0.5,
    propTreeCenter = 0.5,
    propTreeRight = 0.5,
    maxNumberTrees = 2,
} = {}) {
    let trees = [
        { propability: propTreeLeft, position_index: 0 },
        { propability: propTreeCenter, position_index: 1 },
        { propability: propTreeRight, position_index: 2 },
    ]

    shuffle(trees)

    var numberOfTreesAdded = 0

    trees.forEach((tree) => {
        if (
            Math.random() < tree.propability &&
            numberOfTreesAdded < maxNumberTrees
        ) {
            addTreeTo(tree.position_index)
            numberOfTreesAdded += 1
        }
    })

    return numberOfTreesAdded
}

const muteAllTrees = () => {
    const treeList = document.querySelectorAll('.tree')

    treeList.forEach((tree) => {
        fadeAudioOut(tree, 0, 500)
    })
}

//#endregion

//#region Collision

let POSITION_Z_OUT_OF_SIGHT = 1.9
let POSITION_Z_LINE_START = 0.6
let POSITION_Z_LINE_END = 0.7

const setupCollision = () => {
    AFRAME.registerComponent('player', {
        tick: () => {
            document.querySelectorAll('.tree').forEach((tree) => {
                position = tree.getAttribute('position')
                tree_position_index = tree.getAttribute(
                    'data-tree-position-index'
                )
                tree_id = tree.getAttribute('id')

                if (position.z > POSITION_Z_OUT_OF_SIGHT) {
                    removeTree(tree)
                }

                if (!isGameRunning || currentChapter != chapters.running) return

                if (
                    POSITION_Z_LINE_START < position.z &&
                    position.z < POSITION_Z_LINE_END &&
                    tree_position_index == player_position_index
                ) {
                    if (tree.hasAttribute('data-obstacle-type')) {
                        startConfrontation(tree)
                    } else {
                        shakePathAndSea()
                    }
                }
            })
        },
    })
}

//#endregion

//#region Game

let isGameRunning = false
const chapters = Object.freeze({
    running: 'running',
    confrontation: 'confrontation',
    relieve: 'relieve',
})

let currentChapter = chapters.running
let bluetooth
let sensorConfiguration
let playerSphere
let playerCamera
let runningTime = 0

setupControls()
setupCollision()

const init = () => {
    btNotificationMessageHandlers.push(handleConnectionConfirmation)
    bluetooth = new BluetoothController(handleReceivedBluetoothData)
    sensorConfiguration = new SensorConfiguration()
    playerSphere = document.getElementById('player-sphere')
    cameraContainer = document.getElementById('camera-container')
    setupAllMenus()
    setupInstruction()
    setupTrees()
    setupEnvironment()
    bindToggleVRModeEventSettings()
}

const enterGame = () => {
    hideBluetoothMenu()
    showStartMenu()
    setupSound()
    oceanNormal.emit('play')
}

function startGame() {
    if (isGameRunning) return
    isGameRunning = true

    setupInstruction()
    setInstruction(' ')
    addTreesRandomlyLoop()
    hideAllMenus()
    obstacleTypesLeft = obstacleTypes
}

function gameOver() {
    isGameRunning = false
    runningTime = 0
    intervalLength = 2000
    currentChapter = chapters.running
    obstacleTypesLeft = obstacleTypes

    muteAllTrees()
    hideInstruction()
}

const bindToggleVRModeEventSettings = () => {
    document.querySelector('a-scene').addEventListener('enter-vr', function () {
        cameraContainer.setAttribute('position', {
            x: 0,
            y: 0,
            z: 3
        })

        document.getElementById('player-camera').setAttribute('fov', 120)
    })

    document.querySelector('a-scene').addEventListener('exit-vr', function () {
        cameraContainer.setAttribute('position', {
            x: 0,
            y: 0,
            z: 0
        })

        document.getElementById('player-camera').setAttribute('fov', 80)
    })
}

//#endregion

//#region Audio

const fadeAudioIn = (element, max, length) => {
    element.setAttribute('animation__fadeSoundIn', {
        easing: 'linear',
        property: 'sound.volume',
        autoplay: true,
        to: max,
        dur: length,
    })
}

const fadeAudioOut = (element, min, length) => {
    element.setAttribute('animation__fadeSoundOut', {
        easing: 'linear',
        property: 'sound.volume',
        autoplay: true,
        to: min,
        dur: length,
    })
}

//#endregion

//#region Bluetooth

let isConnectedToDevice = false
let btDataMessageHandlers = []
let btNotificationMessageHandlers = []

const handleReceivedBluetoothData = (data) => {
    const messageType = data.includes(':') ? 'data' : 'notification'

    if (messageType == 'data') {
        for (i = 0; i < btDataMessageHandlers.length; i++) {
            btDataMessageHandlers[i](data)
        }
    }

    if (messageType == 'notification') {
        for (i = 0; i < btNotificationMessageHandlers.length; i++) {
            btNotificationMessageHandlers[i](data)
        }
    }
}

const removeBtMessageHandler = (handlerToRemove) => {
    const dataHandlerIndex = btDataMessageHandlers.findIndex(
        (handler) => handler.name == handlerToRemove.name
    )
    const notifcationHandlerIndex = btNotificationMessageHandlers.findIndex(
        (handler) => handler.name == handlerToRemove.name
    )

    if (dataHandlerIndex > -1) {
        btDataMessageHandlers.splice(dataHandlerIndex, 1)
    }

    if (notifcationHandlerIndex < -1) {
        btNotificationMessageHandlers.splice(notifcationHandlerIndex, 1)
    }
}

const handleConnectionConfirmation = (data) => {
    if (data == 'CONNECTED!') {
        console.log('Connected! Ready to start.')
        isConnectedToDevice = true
        showBluetoothMenu()
        removeBtMessageHandler(handleConnectionConfirmation)
    }
}

const getLabelFromBtMessage = (data) => {
    const messageArray = data.split(': ')
    return messageArray[0]
}

const getDataFromBtMessage = (data) => {
    const messageArray = data.split(': ')
    return parseInt(messageArray[1])
}

//#endregion

//#region utilities

const shuffle = (a) => {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

function makeid(length) {
    var result = ''
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

function calculateAverageFromArray(array) {
    var total = 0;
    var count = 0;

    array.forEach(function(item, index) {
        total += item;
        count++;
    });

    return total / count;
}

//#endregion