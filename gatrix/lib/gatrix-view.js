'use babel';

export default class GatrixView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('gatrix');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Welcome to Gatrix Atom Package.';
    message.classList.add('message');
    this.element.appendChild(message);

    // Create message2 element
    const message2 = document.createElement('div');
    message2.textContent = 'Welcome to Gatrix Atom Package 2.';
    message2.classList.add('message');
    this.element.appendChild(message2);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  setContent(content) {
    // const displayText = `There are ${count} words.`;
    this.element.children[1].textContent = content;
  }

}
