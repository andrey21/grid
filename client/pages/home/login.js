let template;

Template.login.onRendered( () => {
  login( { form: '#login', template: Template.instance() } );
});

Template.login.events({
  'submit form': ( event ) => event.preventDefault()
});

let _handleLogin = () => {
  let email    = template.find( '[name="emailAddress"]' ).value,
      password = template.find( '[name="password"]' ).value;

  Meteor.loginWithPassword( email, password, ( error ) => {
    if ( error ) {
      Bert.alert( error.reason, 'warning' );
    } else {
      Bert.alert( 'Logged in!', 'success' );
    }
  });
};

let validation = () => {
  return {
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true
      }
    },
    messages: {
      emailAddress: {
        required: 'Need an email address here.',
        email: 'Is this email address legit?'
      },
      password: {
        required: 'Need a password here.'
      }
    },
    submitHandler() { _handleLogin(); }
  };
};

let _validate = ( form ) => {
  $( form ).validate( validation() );
};

let login = ( options ) => {
  template = options.template;
  _validate( options.form );
}