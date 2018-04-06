import handleChannelSwitch from './handle-channel-switch.js';
import sortMessages from './sort-messages.js';

import handleMessageInsert from './handle-message-insert.js';

Template.channel.onCreated( () => {
  let template = Template.instance();
  handleChannelSwitch( template );
});

Template.channel.helpers({
  isLoading() {
    return Template.instance().loading.get();
  },
  isDirect() {
    return Template.instance().isDirect.get();
  },
  username() {
    return FlowRouter.getParam( 'channel' );
  },
  messages() {
    let messages = Messages.find( {}, { sort: { timestamp: 1 } } );
    if ( messages ) {
      return sortMessages( messages );
    }
  }
});

Template.channel.events({
  'keyup [name="message"]' ( event, template ) {
    handleMessageInsert( event, template );
  }
});