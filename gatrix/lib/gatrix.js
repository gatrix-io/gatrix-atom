'use babel';

import GatrixView from './gatrix-view';
import { CompositeDisposable } from 'atom';

export default {

  gatrixView: null,
  modalPanel: null,
  subscriptions: null,

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

  toggle() {
    this.togglePanel();
    // this.inverseSelectedText();
  }


};
