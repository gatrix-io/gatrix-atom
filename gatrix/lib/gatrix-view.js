'use babel';

export default class GatrixView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('modalContent');

    // Create message element
    const modalTitle = document.createElement('div');
    modalTitle.textContent = 'Welcome to Gatrix Atom Package.';
    // modalTitle.textContent = 'Welcome to Gatrix Atom Package.';
    modalTitle.classList.add('modalTitle');
    this.element.appendChild(modalTitle);

    // Create message2 element
    const modalBody = document.createElement('div');
    modalBody.textContent = 'Loading, please wait...';
    modalBody.classList.add('modalBody');
    this.element.appendChild(modalBody);
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
    const displayText = `Welcome to Gatrix, ${content.username}`;
    this.element.children[1].textContent = displayText;
  }

}
