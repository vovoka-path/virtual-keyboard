import Key from './classKey.js';


export default class Keyboard {
  constructor(KEYS) {
    const storage = this.getLocalStorage();

    this.lang = storage.lang;
    this.isShift = storage.isShift;
    this.keys = KEYS;

    this.ShiftOn = false;
    this.ControlOn = false;

    this.allCurrentKeys = this.getAllCurrentKeys();
    this.allArrows = this.getAllArrows();
    this.allKeyCodes = this.getAllKeyCodes();
  }

    getAllCurrentKeys() {
      let allCurrentKeys = {};
    
      this.keys.map(row => {
        row.map( keyObj => {
          const key = new Key(keyObj);

          if (key.type === 'standart') {
            allCurrentKeys[key.code] = key[this.lang][this.isShift];
          }
        })
      });
    
      return allCurrentKeys;
    }
  
    getAllKeyCodes() {
      let allKeyCodes = [];
    
      this.keys.map(row => {
        row.map( key => {
          allKeyCodes.push(key.code);
        })
      });
    
      return allKeyCodes;
    }
  
    getAllArrows() {
      let allArrows = {};
    
      this.keys.map(row => {
        row.map( key => {
          if (key.type === 'arrow') {
            allArrows[key.code] = key.symbols[0];
          }
        })
      });
    
      return allArrows;
    }

  toogleLayout(lang, isShift = false) {
    this.lang = lang;
    this.isShift = isShift;

    this.setLocalStorage();

    // change symbols
    for (let i = 0; i < this.keys.length; i++) {
      const row = this.keys[i];
      const rowClass = `row${i}`;
      const rowNode = document.querySelector('.' + rowClass);

      row.map(keyObj => {
        const KEY = new Key(keyObj);
        const symbol = KEY.getSymbol(lang, isShift);
        const keyNode = rowNode.querySelector('.code-' + KEY.code);
        
        keyNode.innerText = symbol;
      });
    }
  }

  render() {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');

    for (let i = 0; i < this.keys.length; i++) {
      // row node
      const row = this.keys[i];
      const rowDiv = document.createElement('div');

      rowDiv.classList.add('row');
      rowDiv.classList.add(`row${i}`);
      keyboard.append(rowDiv);

      row.map(keyObj => {
        // key node
        const KEY = new Key(keyObj);

        rowDiv.append(KEY.renderKeyNode(this.lang, this.isShift));
      });
    }

    return keyboard;
  }

  getLocalStorage() {
    this.lang = localStorage.getItem("lang") 
      ? localStorage.getItem("lang") 
      : "en";

    this.isShift = localStorage.getItem("isShift") 
      ? localStorage.getItem("isShift") 
      : 'false';
      
    return {
      lang: this.lang,
      isShift: this.isShift === 'false' ? false : true
    }
  }

  setLocalStorage() {
    localStorage.setItem("lang", this.lang);
    localStorage.setItem("isShift", this.isShift);
  }
}
