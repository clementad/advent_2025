import './style.css'
import { messages } from './messages.js'

const app = document.querySelector('#app')
const body = document.body

// Create Modal Elements
const modalOverlay = document.createElement('div')
modalOverlay.className = 'modal-overlay'
const modalContent = document.createElement('div')
modalContent.className = 'modal-content'
const modalType = document.createElement('div')
modalType.className = 'modal-type'
const modalText = document.createElement('div')
modalText.className = 'modal-text'
const modalGame = document.createElement('div') // Container for games
modalGame.className = 'game-container'
const modalSource = document.createElement('div')
modalSource.className = 'modal-source'
const modalClose = document.createElement('button')
modalClose.className = 'modal-close'
modalClose.textContent = 'Close'

modalContent.appendChild(modalType)
modalContent.appendChild(modalText)
modalContent.appendChild(modalGame)
modalContent.appendChild(modalSource)
modalContent.appendChild(modalClose)
modalOverlay.appendChild(modalContent)
body.appendChild(modalOverlay)

// Persistence Logic
const STORAGE_KEY = 'advent_opened_doors'
const getOpenedDoors = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

const markDoorAsOpened = (day) => {
    const opened = getOpenedDoors()
    if (!opened.includes(day)) {
        opened.push(day)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(opened))
    }
}

// Game Logic
let elfScore = 0

const initCatchElf = () => {
    modalGame.innerHTML = ''
    elfScore = 0

    const elf = document.createElement('div')
    elf.className = 'elf-target'
    elf.textContent = '🧝'
    modalGame.appendChild(elf)

    const moveElf = () => {
        const maxLeft = 250
        const maxTop = 100
        const left = Math.random() * maxLeft - 125
        const top = Math.random() * maxTop - 50

        elf.style.transform = `translate(${left}px, ${top}px)`
    }

    elf.addEventListener('click', () => {
        elfScore++
        if (elfScore >= 5) {
            modalGame.innerHTML = '<div class="modal-text" style="color: green">You caught the elf! Christmas is saved! 🎁</div>'
        } else {
            moveElf()
        }
    })

    moveElf()
}

const initTrivia = (question, options, answer) => {
    modalGame.innerHTML = ''

    const qDiv = document.createElement('div')
    qDiv.className = 'modal-text'
    qDiv.textContent = question
    modalGame.appendChild(qDiv)

    const optionsDiv = document.createElement('div')
    optionsDiv.className = 'trivia-options'

    options.forEach(opt => {
        const btn = document.createElement('button')
        btn.className = 'trivia-btn'
        btn.textContent = opt
        btn.addEventListener('click', () => {
            const allBtns = optionsDiv.querySelectorAll('button')
            allBtns.forEach(b => b.disabled = true)

            if (opt === answer) {
                btn.classList.add('correct')
                modalGame.insertAdjacentHTML('beforeend', '<div style="margin-top:1rem; color:green">Correct! 🎄</div>')
            } else {
                btn.classList.add('wrong')
                allBtns.forEach(b => {
                    if (b.textContent === answer) b.classList.add('correct')
                })
                modalGame.insertAdjacentHTML('beforeend', '<div style="margin-top:1rem; color:red">Oops! The answer was ' + answer + '</div>')
            }
        })
        optionsDiv.appendChild(btn)
    })

    modalGame.appendChild(optionsDiv)
}

const initDecorateTree = () => {
    modalGame.innerHTML = ''

    const tree = document.createElement('div')
    tree.className = 'tree-container'
    modalGame.appendChild(tree)

    const colors = ['#ef4444', '#fbbf24', '#3b82f6', '#a855f7', '#fff']

    tree.addEventListener('click', (e) => {
        const rect = tree.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const ornament = document.createElement('div')
        ornament.className = 'ornament'
        ornament.style.left = x + 'px'
        ornament.style.top = y + 'px'
        ornament.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]

        tree.appendChild(ornament)
    })
}

const initMemory = () => {
    modalGame.innerHTML = ''

    const items = ['🎅', '🎄', '🎁', '⛄', '🦌', '🔔']
    const cards = [...items, ...items] // Pairs
    // Shuffle
    cards.sort(() => Math.random() - 0.5)

    const grid = document.createElement('div')
    grid.className = 'memory-grid'

    let flippedCards = []
    let matchedPairs = 0

    cards.forEach((item, index) => {
        const card = document.createElement('div')
        card.className = 'memory-card'
        card.dataset.value = item
        card.dataset.index = index
        card.textContent = item // Hidden by CSS color: transparent

        card.addEventListener('click', () => {
            if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) return

            card.classList.add('flipped')
            flippedCards.push(card)

            if (flippedCards.length === 2) {
                const [c1, c2] = flippedCards
                if (c1.dataset.value === c2.dataset.value) {
                    c1.classList.add('matched')
                    c2.classList.add('matched')
                    matchedPairs++
                    flippedCards = []

                    if (matchedPairs === items.length) {
                        setTimeout(() => {
                            modalGame.innerHTML = '<div class="modal-text" style="color: green">You matched them all! Merry Christmas! 🎄</div>'
                        }, 500)
                    }
                } else {
                    setTimeout(() => {
                        c1.classList.remove('flipped')
                        c2.classList.remove('flipped')
                        flippedCards = []
                    }, 1000)
                }
            }
        })

        grid.appendChild(card)
    })

    modalGame.appendChild(grid)
}

// Modal Logic
const openModal = (messageData) => {
    const { type, text, source, gameType } = messageData

    modalType.textContent = type
    modalText.textContent = text
    modalSource.textContent = source || ''
    modalGame.innerHTML = '' // Clear previous game

    if (type === 'Mini Game') {
        if (gameType === 'catch-elf') {
            initCatchElf()
        } else if (gameType === 'trivia') {
            initTrivia(messageData.question, messageData.options, messageData.answer)
        } else if (gameType === 'decorate-tree') {
            initDecorateTree()
        } else if (gameType === 'memory') {
            initMemory()
        }
    }

    modalOverlay.classList.add('active')
}

const closeModal = () => {
    modalOverlay.classList.remove('active')
    modalGame.innerHTML = '' // Reset game
}

modalClose.addEventListener('click', closeModal)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal()
})

// Date Logic
const getToday = () => {
    const params = new URLSearchParams(window.location.search)
    const debugDate = params.get('debug_date')
    if (debugDate) {
        return new Date(debugDate)
    }
    return new Date()
}

const today = getToday()
const currentMonth = today.getMonth() // 0-indexed, Dec is 11
const currentDay = today.getDate()

const isDoorVisible = (day) => {
    if (currentMonth < 11) return false; // Before Dec
    if (currentMonth > 11) return true; // After Dec
    return day <= currentDay;
}

const createDoor = (messageData) => {
    const { day } = messageData

    if (!isDoorVisible(day)) return null;

    const container = document.createElement('div')
    container.className = 'door-container'

    const door = document.createElement('div')
    door.className = 'door'

    const openedDoors = getOpenedDoors()
    if (openedDoors.includes(day)) {
        door.classList.add('opened')
    }

    const number = document.createElement('span')
    number.textContent = day
    door.appendChild(number)

    container.appendChild(door)

    container.addEventListener('click', () => {
        openModal(messageData)
        door.classList.add('opened')
        markDoorAsOpened(day)
    })

    return container
}

const init = () => {
    let hasVisibleDoors = false
    messages.forEach(msg => {
        const door = createDoor(msg)
        if (door) {
            app.appendChild(door)
            hasVisibleDoors = true
        }
    })

    if (!hasVisibleDoors) {
        const message = document.createElement('div')
        message.style.textAlign = 'center'
        message.style.color = 'var(--gold)'
        message.style.marginTop = '2rem'
        message.innerHTML = `
      <h2>Coming Soon! 🎄</h2>
      <p style="margin-top: 1rem; font-size: 1.2rem;">The Advent Calendar begins on December 1st.</p>
      <p style="margin-top: 0.5rem; color: #94a3b8;">Come back tomorrow to open the first door!</p>
    `
        app.appendChild(message)
        // Remove grid layout for this message
        app.style.display = 'flex'
        app.style.flexDirection = 'column'
        app.style.alignItems = 'center'
    }
}

init()
