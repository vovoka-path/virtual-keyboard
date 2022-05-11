import Keyboard from './scripts/classKeyboard.js';
import KEYS from './scripts/data/keys.js';

// --- start render nodes ---

const body = document.body;

// header

const header = document.createElement('header');
header.classList.add('header');

const headerContainer = document.createElement('div');
headerContainer.classList.add('header-container');
header.append(headerContainer);

const h1 = document.createElement('h1');
h1.classList.add('h1');
h1.innerText = 'Virtual keyboard';
headerContainer.append(h1);

body.append(header);

// main

const main = document.createElement('main');
main.classList.add('main');

// textarea

const sectionTextarea = document.createElement('section');
sectionTextarea.classList.add('section');
sectionTextarea.classList.add('section-textarea');
main.append(sectionTextarea);

const textareaContainer = document.createElement('div');
textareaContainer.classList.add('textarea-container');
sectionTextarea.append(textareaContainer);

const textarea = document.createElement('textarea');
textarea.rows = 6;
textarea.classList.add('textarea');
textareaContainer.append(textarea);

// keyboard

const sectionKeyboard = document.createElement('section');
sectionKeyboard.classList.add('section');
sectionKeyboard.classList.add('section-keyboard');
main.append(sectionKeyboard);

const KEYBOARD = new Keyboard(KEYS);

let lang = KEYBOARD.lang;
let isShift = KEYBOARD.isShift;

const keyboard = KEYBOARD.render();
sectionKeyboard.append(keyboard);

if (isShift) {
  const key = keyboard.querySelector('.CapsLock');
  key.classList.toggle('shift');
}

// help

const sectionHelp = document.createElement('section');
sectionHelp.classList.add('section');
sectionHelp.classList.add('section-help');
main.append(sectionHelp);

const helpContainer = document.createElement('div');
helpContainer.classList.add('help-container');
sectionHelp.append(helpContainer);

const help = document.createElement('div');
help.classList.add('help');
help.innerText = 'Windows! Switch the language: <Shift + Ctrl>.';
helpContainer.append(help);

body.append(main);

// footer

const footer = document.createElement('footer');
footer.classList.add('footer');

const footerContainer = document.createElement('div');
footerContainer.classList.add('footer-container');
footer.append(footerContainer);

const author = document.createElement('div');
author.classList.add('author');
author.innerHTML = '2022 © Designed by <a href="https://github.com/vovoka-path">vovoka-path</a>';
footerContainer.append(author);

body.append(footer);

// --- end render nodes ---

// --- start handle actions ---
// set always focus on textarea

textarea.focus();

textarea.onblur = function() {
  textarea.focus();
}

// listeners

addEventListener("keydown", handleKeydownKey);
addEventListener("keyup", handleKeyupKey);

// handle physical keyboard

function handleKeydownKey(event) {
  const keyCode = event.code;

  if (KEYBOARD.allKeyCodes.includes(keyCode)) {
    const key = body.querySelector('.' + keyCode);

    addClassKeydown(key);
    
    if (keyCode === 'CapsLock') {
      isShift = !isShift;
      KEYBOARD.toogleLayout(lang, isShift);
      key.classList.toggle('shift');
    }

    if (keyCode.includes('Shift')) {
      if (KEYBOARD.ShiftOn === false) {
        isShift = !isShift;
        KEYBOARD.toogleLayout(lang, isShift);
      }
      KEYBOARD.ShiftOn = true;
    }

    if (keyCode.includes('Control')) {
      KEYBOARD.ControlOn = true;
    }

    if (keyCode.includes('Alt')) {
      event.preventDefault();
    }

    if (keyCode.includes('Tab')) {
      textarea.value = textarea.value + '\t';
    }

    if (keyCode.includes('Arrow')) {
      event.preventDefault();
      textarea.value = textarea.value + KEYBOARD.allArrows[keyCode];
    }

    if (KEYBOARD.ControlOn && KEYBOARD.ShiftOn) {
      lang = lang === 'en' ? 'ru' : 'en';
      KEYBOARD.toogleLayout(lang, isShift);
    }
  }
}

function handleKeyupKey(event) {
  const keyCode = event.code;
  const key = body.querySelector('.' + keyCode);

  if (keyCode.includes('Shift')) {
    isShift = !isShift;
    KEYBOARD.toogleLayout(lang, isShift);
    KEYBOARD.ShiftOn = false;
  }

  if (keyCode.includes('Control')) {
    KEYBOARD.ControlOn = false;
  }
  
  removeClassKeydown(key);
  textarea.focus();
}

// handle virtual keyboard

const virtualKeys = body.querySelector('.keyboard');

virtualKeys.addEventListener('click', clickOnKey);

function clickOnKey(event) {
  const clickedNode = event.target;
  const isKey = clickedNode.classList[0] === 'key';
  let keyCode = clickedNode.classList[1].replace('code-', '');
  let key = body.querySelector('.' + keyCode);

  if (isKey || clickedNode.classList[3] === 'Space') {
    if (clickedNode.parentNode.classList[1] === 'standart') {
      const keySymbol = KEYBOARD.allCurrentKeys[keyCode];

      textarea.focus();
      textarea.value = textarea.value + keySymbol;
    } else {
      if (keyCode === 'CapsLock') {
        isShift = !isShift;
        KEYBOARD.toogleLayout(lang, isShift);
        key.classList.toggle('shift');
      }
  
      if (keyCode.includes('Shift')) {
        isShift = !isShift;
        KEYBOARD.toogleLayout(lang, isShift);

        setTimeout(() => {
          isShift = !isShift;
          KEYBOARD.toogleLayout(lang, isShift);
        }, 200);
      }
  
      if (keyCode.includes('Control')) {
        KEYBOARD.ControlOn = true;
        setTimeout(() => KEYBOARD.ControlOn = false, 200);
      }
  
      if (keyCode.includes('Alt')) {
        event.preventDefault();
      }
  
      if (keyCode.includes('Tab')) {
        textarea.value = textarea.value + '\t';
      }
  
      if (keyCode.includes('Arrow')) {
        event.preventDefault();
        textarea.value = textarea.value + KEYBOARD.allArrows[keyCode];
      }

      if (keyCode === 'Enter') {
        textarea.value = textarea.value + '\n';
      }

      if (keyCode === 'Delete') {
        const position = getCursorPosition(textarea);
        const text = textarea.value;
        const textStart = text.slice(0, position);
        const textEnd = text.slice(position + 1);

        textarea.value = textStart + textEnd;
        textarea.setSelectionRange(position, position);
      }

      if (keyCode === 'Backspace') {
        const position = getCursorPosition(textarea);
        const text = textarea.value;
        const newPosition = position - 1;
        const textStart = text.slice(0, newPosition);
        const textEnd = text.slice(position);

        textarea.value = textStart + textEnd;
        textarea.setSelectionRange(newPosition, newPosition);
      }

    }

    if (clickedNode.classList[3] === 'Space') {
      keyCode = 'Space';
      key = body.querySelector('.' + keyCode);

      const keySymbol = KEYBOARD.allCurrentKeys[keyCode];

      textarea.focus();
      textarea.value = textarea.value + keySymbol;
    }
    
      addClassKeydown(key);
      setTimeout(removeClassKeydown, 200, key);
  } 

  textarea.focus();
}

// --- additional functions ---

function addClassKeydown(key) {
  key.classList.add('keydown');
}

function removeClassKeydown(key) {
  if (key) {
    key.classList.remove('keydown');
  }
}

function getCursorPosition(textarea) {
  const selectionStart = textarea.selectionStart;
  let position;

  if (document.selection) {
    let selection = document.selection.createRange();

    selection.moveStart('character', -textarea.value.length);
    position = selection.text.length;
  } else if (selectionStart || selectionStart === 0) {
    position = selectionStart;
  }

  return position;
}

// --- end handle actions ---
