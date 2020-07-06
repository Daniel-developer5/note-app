// Appearance of the hint on hover on start-writing-btn

const startButtons = document.querySelectorAll('.start-btn'),
label = document.querySelector('.label-box')

startButtons[0].addEventListener('mouseover', () => {
    label.classList.add('label-open')
})

startButtons[0].addEventListener('mouseout', () => {
    label.classList.remove('label-open')
})

// Toggle of initBox & noteBox

const appInnerBox = document.querySelector('.inner-box'),
initBox = document.querySelector('.init-box'),
noteWritingBox = document.querySelector('.note-box'),
noteField = document.querySelector('.note'),
boxTitle = document.querySelector('header div span'),
toggleContent = document.querySelector('.fa-sticky-note'),
searchBox = document.querySelector('.search-box'),
bgList = document.querySelector('.bg-list')
let bg = '#fff'
let isNoteOpen = false
let currentNote

function changeContent(className, value) {
    appInnerBox.style.transform = 'rotateX(90deg)'
    
    setTimeout(() => {
        initBox.classList.toggle('open')
        noteWritingBox.classList.toggle('open')
        toggleContent.setAttribute('class', `fas fa-${className}`)
        searchBox.classList.toggle('close')
        appInnerBox.style.transform = 'scale(0)'
        appInnerBox.style.transform = 'scale(1)'
    }, 300)

    isNoteOpen = value
    if (isNoteOpen) {
        toggleContent.addEventListener('click', saveNote)
        boxTitle.textContent = ''
    } else {
        toggleContent.removeEventListener('click', saveNote)
        boxTitle.textContent = 'Note List'
    }
}

startButtons.forEach(elem => {
    elem.addEventListener('click', () => { 
        noteField.innerHTML = ''
        noteField.style.backgroundColor = bg = '#fff'
        bgList.classList.remove('bg-list-open')
        changeContent('check', true)
        currentNote = null
    })
})

// The note writing

let isNewNote

noteField.addEventListener('input', e => {
    // Remove the last <br> tag
    if (noteField.textContent === '') {
        if (noteField.children[0] != undefined) {
            noteField.children[0].remove()
        }
    } 

    boxTitle.textContent = noteField.textContent

    isNewNote = true
})

// The note adding

const emptyBlock = document.querySelector('.empty-block'),
fillBlock = document.querySelector('.fill-block'),
noteList = document.querySelector('.note-list'),
alertBox = document.querySelector('.alert-box'),
warning = document.querySelector('.warning'),
alertBtns = document.querySelectorAll('.btns button'),
notes = JSON.parse(localStorage.getItem('notes')) || []
let noteListElems, removeIndex

if (notes.length != 0) {
    window.addEventListener('load', () => {
        emptyBlock.classList.add('close')
        fillBlock.classList.remove('close')
        addNote()
        appInnerBox.style.transition = 'none'
        startButtons[1].click()
        toggleContent.click()
        setTimeout(() => {
            appInnerBox.style.transition = 'ease .5s'
        }, 500)
    })
}

function openNote() {
    changeContent('check', true)
    noteField.innerHTML = notes[this.order].content
    noteField.style.backgroundColor = notes[this.order].background
    boxTitle.textContent = notes[this.order].title
    bgList.classList.remove('bg-list-open')
    isNewNote = false
    currentNote = this.order
}

function closeAlert() {
    alertBox.classList.remove('alert-active')
    warning.classList.remove('active')
}

function removeNote() {
    setTimeout(() => {
        noteListElems[removeIndex].style.transform = 'translateX(-1000px)'
        setTimeout(() => {
            noteListElems[removeIndex].style.height = 0
            setTimeout(() => {
                notes.splice(removeIndex, 1)
                noteListElems.splice(removeIndex, 1)
                addNote()
                if (!noteList.children.length) openEmptyBox()
            }, 500)
        }, 500)
    }, 300)
}

function openEmptyBox() {
    emptyBlock.classList.remove('close')
    fillBlock.classList.add('close')
}

function saveNote() {
    changeContent('sticky-note', false)

    if (noteField.innerHTML) {
        emptyBlock.classList.add('close')
        fillBlock.classList.remove('close')

        if (currentNote != null && isNewNote) {
            notes.splice(currentNote, 1)
        }

        if (isNewNote) {
            if (!noteField.textContent && noteField.innerHTML) {
                notes.unshift( new NoteObj('img') ) 
            } else {
                notes.unshift( new NoteObj(noteField.textContent) )
            }
        }
    
        addNote()
    } else {
        if (currentNote != null) {
            removeIndex = currentNote
            removeNote()
        }
    }
}

function saveInStorage() {
    localStorage.setItem('notes', JSON.stringify(notes))
}

function NoteObj(value) {
    this.title = value
    this.content = noteField.innerHTML
    this.background = bg
    this.date = `${moment().format('L')} ${moment().format('LT')}`
}

function addNote() {
    noteList.innerHTML = ''
    noteListElems = []
    
    notes.forEach((el, index) => {
        let note

        el = note = document.createElement('li')
        noteList.append(note)

        noteListElems.push(note)

        const openNoteBox = document.createElement('div')
        note.appendChild(openNoteBox)

        openNoteBox.innerHTML = `
            <div class="info-box">
                <span>${notes[index].title}</span>
                <span class="date">${notes[index].date}</span>
            </div>
        `

        openNoteBox.order = index
        openNoteBox.addEventListener('click', openNote)

        const deleteBtn = document.createElement('i')
        note.appendChild(deleteBtn)
        deleteBtn.setAttribute('class', 'fas fa-times')

        deleteBtn.addEventListener('click', () => {
            removeIndex = index
            alertBox.classList.add('alert-active')
            setTimeout(() => {
                warning.classList.add('active')
            }, 200)
        })
    })

    saveInStorage()
}

alertBtns.forEach((elem, index) => {
    elem.addEventListener('click', () => {
        switch (index) {
            case 0:
                closeAlert()
                removeNote()
                break
            case 1:
                closeAlert()
                break
        }
    })
})

// Tools action

const tools = document.querySelectorAll('.tools li'),
fileInput = document.querySelector('.file')

tools.forEach((elem, index) => {
    elem.addEventListener('click', () => {
        switch (index) {
            case 0:
                noteField.innerHTML += '<div>&bull;&nbsp;&nbsp;</div>'
                break
            case 1:
                fileInput.click()
                break
            case 2:
                bgList.classList.toggle('bg-list-open')
                bgList.addEventListener('click', e => {
                    if (e.target.tagName === 'LI') {
                        noteField.style.backgroundColor = bg = getComputedStyle(e.target).backgroundColor
                        if (currentNote != null) {
                            notes[currentNote].background = bg
                        }
                    }
                })
                break
        }
    })
})

fileInput.addEventListener('change', () => {
    const img = document.createElement('img')
    noteField.appendChild(img)

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader()

        reader.addEventListener('load', e => {
            img.src = e.target.result
        })

        reader.readAsDataURL(fileInput.files[0])
    }

    isNewNote = true
})

//Searching

const searchBtn = document.querySelector('.fa-search'),
searchInput = document.querySelector('.search-input')

searchBtn.addEventListener('click', () => {
    searchInput.classList.add('open-input')
    searchInput.focus()
    searchBtn.classList.add('close')
})

document.addEventListener('click', e => {
    if (
        e.target.className != 'fas fa-search close' && 
        e.target.tagName != 'INPUT'
    ) {
        searchInput.classList.remove('open-input')
        searchBtn.classList.remove('close')
    }
})

function markLi(ind, color) {
    noteListElems[ind].style.backgroundColor = color
}

searchInput.addEventListener('input', () => {
    let regExp = new RegExp(`${searchInput.value}`, 'gi')

    if (searchInput.value) {
        notes.forEach((elem, index) => {
            if (elem.content.match(regExp) != null) {
                markLi(index, '#f1b544')
            } else {
                markLi(index, '#fff')
            }
        })
    } else {
        noteListElems.forEach(elem => { 
            elem.style.backgroundColor = '#fff' 
        })
    }
})