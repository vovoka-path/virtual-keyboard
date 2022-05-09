export default class Key {
  constructor(keyObj) {
    this.type = keyObj.type;
    this.code = keyObj.code;
    this.width = keyObj.width;

    const [ en, enUp, ru, ruUp ] = keyObj.symbols;

    this.en = { 'false': en, 'true': enUp };
    this.ru = { 'false': ru, 'true': ruUp };
  }

  getSymbol(lang, isShift = false) {
    return this[lang][isShift];
  }

  renderKeyNode(lang, isShift = false) {
    // key-container
    const keyNode = document.createElement('div');
    
    keyNode.classList.add('key-container');
    keyNode.classList.add(`${this.type}`);
    keyNode.classList.add(`${this.width}`);
    keyNode.classList.add(`${this.code}`);

    // key
    const letter = this[lang][!!isShift];
    const key = document.createElement('div');
    
    key.classList.add('key');
    key.classList.add(`code-${this.code}`);
    key.textContent = letter;

    keyNode.append(key);

    return keyNode;
  }
}
