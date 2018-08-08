'use babel';

import GatrixView from './gatrix-view';
import { CompositeDisposable } from 'atom';
import request from 'request';
import path from 'path';
import fs from 'fs';
import os from 'os';
import QRCode from 'qrcode';

const API_BASE_URL = 'https://api.gatrix.io';

export default {

  // Default
  gatrixView: null,
  modalPanel: null,
  subscriptions: null,

  // Added
  modalTitle: 'Modal Title',
  modalBody: 'Modal Body',

  user: null,
  repository: null,
  file: null,

  filePath: null,

  repositories: [],


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


    // atom.workspace.observeTextEditors((res) => {
    //   console.log('$$$$$ observeTextEditors $$$$$ ', res)
    // }, );
    //
    // atom.workspace.observePaneItems((res) => {
    //   console.log('$$$$$ observePaneItems $$$$$ ', res)
    // });
    //
    // atom.workspace.onDidChangeActivePaneItem((res) => {
    //   console.log('$$$$$ onDidChangeActivePaneItem $$$$$ ', res)
    // });
    //
    // atom.workspace.onDidStopChangingActivePaneItem((res) => {
    //   console.log('$$$$$ onDidStopChangingActivePaneItem $$$$$ ', res)
    // });
    //
    // atom.workspace.observeActivePaneItem((res) => {
    //   console.log('$$$$$ observeActivePaneItem $$$$$ ', res)
    // });
    //
    // atom.workspace.onDidChangeActiveTextEditor((res) => {
    //   console.log('$$$$$ onDidChangeActiveTextEditor $$$$$ ', res)
    // });
    //
    // atom.workspace.onDidChangeActiveTextEditor((res) => {
    //   console.log('$$$$$ onDidChangeActiveTextEditor $$$$$ ', res)
    // });
    //
    // atom.workspace.onDidChangeActiveTextEditor((editor) => {
    //   console.log('$$$$$ onDidChangeActiveTextEditor $$$$$ ', editor)
    //   // editor.insertText('Hello World')
    // });
    //
    // atom.workspace.onDidOpen((editor) => {
    //   console.log('$$$$$ onDidOpen $$$$$ ', editor)
    //   // editor.insertText('Hello World')
    // });


    // Init app
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

  displayLockedRepositoryMessage(repository) {
    // this.gatrixView.setUser(repository.user)
    this.gatrixView.setQRCode(repository)
    this.modalPanel.show()
  },


  displayFlashMessage() {
    this.modalPanel.show()
    setTimeout(() => {
      this.modalPanel.hide()
    }, 3000);
  },

  displayWelcomeMessage(user) {
    this.gatrixView.setUser(user)
    this.displayFlashMessage()
  },

  getLocalUsername() {
    const localUsernamePath = `/.gatrix/refs/user`;
    const homedir = os.homedir();
    const usernameDir = path.join(homedir, localUsernamePath)
    try {
      const username = fs.readFileSync(usernameDir, 'utf8').replace(/\r?\n|\r/g, '');
      console.log('username', username);
      return username;
    } catch (e) {
      console.log('No Gatrix user info.', e);
      return false;
    }
  },

  init() {
    console.log('init called');
    const username = this.getLocalUsername();
    console.log('username 2', username);
    this.fetchUser(username)
      .then((user) => {
        this.gatrixView.setUser(user)
        this.fetchUserRepositories(username)
          .then((repositories) => {
            this.gatrixView.setRepositories(repositories)
            if (repositories.length > 0) {
              this.welcomeUserOrlockScreen(user, repositories[0])
            }
          })
      })
      .catch((error) => {
        console.log(error)
        // atom.notifications.addWarning()
      })
  },


  welcomeUserOrlockScreen(user, repository) {
    console.log('welcomeUserOrlockScreen called');
    const currentFilePath = atom.workspace.getActiveTextEditor().getPath()
    console.log('currentFilePath', currentFilePath);
    if (repository.has_encryption) {
      console.log('§§§ repository has encryption', repository);
      this.displayLockedRepositoryMessage(repository);
    } else {
      console.log('§§§ repository doesn\'t have encryption', repository);
      this.displayWelcomeMessage(user);
    }
  },


  lockScreenIfNeeded(user, repository) {
    console.log('lockScreenIfNeeded called');
    const currentFilePath = atom.workspace.getActiveTextEditor().getPath()
    console.log('currentFilePath', currentFilePath);
    if (repository.has_encryption) {
      console.log('§§§ repository has encryption', repository);
      this.displayLockedRepositoryMessage(repository);
    } else {
      console.log('§§§ repository doesn\'t have encryption', repository);
      this.displayWelcomeMessage(user);
    }
  },


  toggle() {
    this.inverseText();
  }


};
