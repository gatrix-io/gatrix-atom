'use babel';

export default class GatrixView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('modalContent');

    // Create message element
    const modalTitle = document.createElement('div');
    modalTitle.textContent = 'Welcome to Gatrix.';
    // modalTitle.textContent = 'Welcome to Gatrix Atom Package.';
    modalTitle.classList.add('modalTitle');
    this.element.appendChild(modalTitle);

    // Create message2 element
    const modalBody = document.createElement('div');
    modalBody.textContent = '';
    modalBody.classList.add('modalBody');
    this.element.appendChild(modalBody);

    // Create modalImage element
    // const modalImage = document.createElement('img');
    // modalImage.src = 'Loading, please wait...';
    // modalImage.classList.add('modalImage');
    // this.element.appendChild(modalImage);
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
    this.element.children[0].textContent = displayText;
  }

  setRepositories(repositories) {
    let displayText
    if (repositories.length > 0) {
      displayText = `You have ${repositories.length} repositories: `;
      repositories.map((repository, index) => {
        displayText += '  - '
        displayText += repository.name
      })
    } else {
      displayText = `You have no repository yet.`;
    }
    this.element.children[1].textContent = displayText;
  }

}
