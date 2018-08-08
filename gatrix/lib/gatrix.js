'use babel';

import GatrixView from './gatrix-view';
import { CompositeDisposable } from 'atom';
import request from 'request';

export default {

  gatrixView: null,
  modalPanel: null,
  subscriptions: null,

  modalTitle: 'Modal Title',
  modalBody: 'Modal Body',

  activate(state) {

    console.log('Gatrix APM started');

    this.gatrixView = new GatrixView(state.gatrixViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gatrixView.getElement(),
      visible: false
    });


    // Trigger to lazy start app
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gatrix:toggle': () => this.toggle()
    }));



    // Start app at launch
    this.init()




  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gatrixView.destroy();
  },

  serialize() {
    return {
      gatrixViewState: this.gatrixView.serialize()
    };
  },

  togglePanel() {
    console.log('togglePanel called');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  inverseText() {
    console.log('inverseAllText called');
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getText()
      let reversed = selection.split('').reverse().join('')
      editor.setText(reversed)
    }
  },

  inverseSelectedText() {
    console.log('inverseSelectedText called');
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let reversed = selection.split('').reverse().join('')
      editor.insertText(reversed)
    }
  },

  fetchUser() {
    let url = 'https://api.gatrix.io/jimdou.json'
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log('# fetchUser', body)
          // resolve(body)
          resolve(JSON.parse(body))
        } else {
          reject({
            reason: 'Unable to complete operation.'
          })
        }
      })
    })
  },

  fetchUserRepositories() {
    let url = 'https://api.gatrix.io/jimdou/repositories.json'
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log('# fetchUserRepositories', body)
          resolve(JSON.parse(body))
        } else {
          reject({
            reason: 'Unable to complete operation.'
          })
        }
      })
    })
  },

  displayMessage() {
    this.modalPanel.show()
  },

  displayFlashMessage() {
    this.modalPanel.show()
    setTimeout(() => {
      this.modalPanel.hide()
    }, 3000);
  },

  init() {
    console.log('init called');
    this.fetchUser()
      .then((user) => {
        this.gatrixView.setContent(user)
        this.displayFlashMessage()
        // this.fetchUserRepositories(user)
      })
      // .then((repositories) => this.gatrixView.setRepositories(repositories))
      // .then(() => this.displayFlashMessage())
      .catch((error) => {
        console.log(error)
        // atom.notifications.addWarning()
      })
  },

  toggle() {
    this.inverseText();
  }


};
