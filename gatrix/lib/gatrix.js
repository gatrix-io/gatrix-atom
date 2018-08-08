'use babel';

import GatrixView from './gatrix-view';
import { CompositeDisposable } from 'atom';
import request from 'request';
import fs from 'fs';
import os from 'os';

const API_BASE_URL = 'https://api.gatrix.io/';

export default {

  gatrixView: null,
  modalPanel: null,
  subscriptions: null,

  modalTitle: 'Modal Title',
  modalBody: 'Modal Body',

  activate(state) {

    console.log('Gatrix started');

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

  fetchUser(username) {
    // let url = 'https://api.gatrix.io/jimdou.json';
    const url = `${API_BASE_URL}/${username}.json`;
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

  fetchUserRepositories(username) {
    // let url = 'https://api.gatrix.io/jimdou/repositories.json'
    const url = `${API_BASE_URL}/${username}/repositories.json`;
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

  displayWelcomeMessage(user) {
    this.gatrixView.setContent(user)
    this.displayFlashMessage()
  },

  init() {
    console.log('init called');
    const homedir = os.homedir();
    const usernameDir = path.join(homedir, '/.gatrix/refs/user')
    try {
      const username = fs.readFileSync(usernameDir, 'utf8').replace(/\r?\n|\r/g, '');
      console.log('username', username);
      this.fetchUser(username)
        .then((user) => {
          this.displayWelcomeMessage(user)
          // this.fetchUserRepositories(username)
        })
        // .then((repositories) => this.gatrixView.setRepositories(repositories))
        // .then(() => this.displayFlashMessage())
        .catch((error) => {
          console.log(error)
          // atom.notifications.addWarning()
        })
    } catch (e) {
      console.log('No Gatrix user info.', e)
    }
  },

  toggle() {
    this.inverseText();
  }


};
