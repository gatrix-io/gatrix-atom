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
    this.gatrixView = new GatrixView(state.gatrixViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gatrixView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gatrix:toggle': () => this.toggle()
    }));
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
    console.log('Gatrix was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  inverseSelectedText() {
    console.log('Gatrix was toggled!');
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let reversed = selection.split('').reverse().join('')
      editor.insertText(reversed)
    }
  },

  fetchData() {
    console.log('fetchData called');
    let url = 'https://staging.gatrix.io/jimdou.json'
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log('# Data fetched!');
        console.log(body)
        // this.togglePanel();
        this.displayFlashMessage();
      }
    })
  },

  fetchUser() {
    let url = 'https://staging.gatrix.io/jimdou.json'
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(body)
        } else {
          reject({
            reason: 'Unable to download page'
          })
        }
      })
    })
  },

  displayFlashMessage() {
    this.modalPanel.show()
    setTimeout(() => {
      this.modalPanel.hide()
    }, 3000);
  },

  toggle() {
    // this.togglePanel();
    // this.inverseSelectedText();
    // this.fetchData();

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      this
        .fetchUser()
        .then((content) => {
          editor.insertText(content)
          this.gatrixView.setContent(JSON.parse(content));
          this.displayFlashMessage();
        })
        .catch((error) => {
          atom.notifications.addWarning(error.reason)
        })
    }



    // this
    //   .fetchUser()
    //   .then((content) => {
    //     // editor.insertText(content)
    //     this.gatrixView.setCount(content);
    //     this.displayFlashMessage();
    //   })
    //   .catch((error) => {
    //     atom.notifications.addWarning(error.reason)
    //   })

  }


};
