'use babel';

import QRCode from 'qrcode';
const API_BASE_URL = 'https://staging.gatrix.io';

export default class GatrixView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('modalContent');

    // Create modalImage element
    const modalImage = document.createElement('img');
    modalImage.src = 'https://staging.gatrix.io/images/gatrix-logo-white.png';
    modalImage.classList.add('modalImage');
    this.element.appendChild(modalImage);

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



    // Create modalQRCode element
    // const modalQRCode = document.createElement('img');
    // modalQRCode.src = '';
    // modalQRCode.classList.add('modalQRCode');
    // this.element.appendChild(modalQRCode);

    //
    // const that = this;
    // QRCode.toDataURL('I am a pony!', function (err, url) {
    //   console.log(url)
    //
    //   // Create modalQRCode element
    //   const modalQRCode = document.createElement('img');
    //   modalQRCode.src = url;
    //   modalQRCode.classList.add('modalQRCode');
    //   that.element.appendChild(modalQRCode);
    // })


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

  setUser(user) {
    console.log('setUser', user)
    const displayText = `Welcome to Gatrix, ${user.username}.`;
    this.element.children[1].textContent = displayText;
  }

  setRepositories(repositories) {
    console.log('setRepositories', repositories)
    let displayText
    if (repositories.length > 0) {
      displayText = `You have ${repositories.length} repositories: `;
      repositories.map((repository, index) => {
        displayText += ' - '
        displayText += repository.name
      })
    } else {
      displayText = `You have no repository yet.`;
    }
    this.element.children[2].textContent = displayText;
  }


  setQRCode(repository) {
    console.log('setQRCode', repository)
    const src = `${API_BASE_URL}/${repository.uuid}/${repository.slug}/authorize`;
    const that = this;
    QRCode.toDataURL(src, function (err, url) {
      console.log(url)
      // Create modalQRCode element
      // that.element.children[3].src = displayText;

      // Create modalQRCode element
      const modalQRCode = document.createElement('img');
      modalQRCode.src = url;
      modalQRCode.classList.add('modalQRCode');
      that.element.appendChild(modalQRCode);

    })
  }

}
