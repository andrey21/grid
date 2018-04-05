Template.channel.onRendered( () => {
    let template = Template.instance();
    handleChannelSwitch( template );
  });

let _establishSubscription = ( template, isDirect, channel ) => {
  template.subscribe( 'channel', isDirect, channel, () => {
    setScroll( 'messages' );
    setTimeout( () => { template.loading.set( false ); }, 300 );
  });
};

let _handleSwitch = ( template ) => {
  let channel = FlowRouter.getParam( 'channel' );

  if ( channel ) {
    let isDirect = channel.includes( '@' );
    template.isDirect.set( isDirect );
    template.loading.set( true );
    _establishSubscription( template, isDirect, channel );
  }
};

let _setupReactiveVariables = ( template ) => {
  template.isDirect = new ReactiveVar();
  template.loading  = new ReactiveVar( true );
};

let handleChannelSwitch = ( template ) => {
  _setupReactiveVariables( template );
  Tracker.autorun( () => { _handleSwitch( template ); } );
}

let setScroll = ( containerId ) => {
    let messages = document.getElementById( containerId );
    setTimeout( () => { messages.scrollTop = messages.scrollHeight; }, 300 );
}

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

let _getTimeDifference = ( previousTime, currentTime ) => {
    let previous   = moment( previousTime ),
        current    = moment( currentTime );
    return moment( current ).diff( previous, 'minutes' );
  }
  
  let _checkIfOwner = ( previousMessage, message ) => {
    return typeof previousMessage !== 'undefined' && previousMessage.owner === message.owner;
  };
  
  let _decideIfShowHeader = ( previousMessage, message ) => {
    if ( _checkIfOwner( previousMessage, message ) ) {
      message.showHeader = _getTimeDifference( previousMessage.timestamp, message.timestamp ) >= 5;
    } else {
      message.showHeader = true;
    }
  };
  
  let _mapMessages = ( messages ) => {
    let previousMessage;
    return messages.map( ( message ) => {
      _decideIfShowHeader( previousMessage, message );
      previousMessage = message;
      return message;
    });
  };
  
  let sortMessages = ( messages ) => {
    return _mapMessages( messages );
  }

Template.channel.events({
  'keyup [name="message"]' ( event, template ) {
    handleMessageInsert( event, template );
  }
});


let _getMessage = ( template ) => {
  let message = template.find( '[name="message"]' ).value;
  return message.trim();
};

let _checkIfCanInsert = ( message, event ) => {
  return message !== '' && event.keyCode === 13;
};

let _buildMessage = ( template ) => {
  return {
    destination: FlowRouter.getParam( 'channel' ).replace( '@', '' ),
    isDirect: template.isDirect.get(),
    message: template.find( '[name="message"]' ).value
  };
};

let _handleInsert = ( message, event, template ) => {
  Meteor.call( 'insertMessage', message, ( error ) => {
    if ( error ) {
      Bert.alert( error.reason, 'danger' );
    } else {
      event.target.value = '';
    }
  });
};

let handleMessageInsert = ( event, template ) => {
  let text      = _getMessage( template ),
      canInsert = _checkIfCanInsert( text, event );

  if ( canInsert ) {
    setScroll( 'messages' );
    _handleInsert( _buildMessage( template ), event, template );
  }
}