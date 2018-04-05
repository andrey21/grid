let template;

Template.signup.onRendered( () => {
    signup({ form: '#signup', template: Template.instance() });
  });
  
  Template.signup.events({
    'submit form': ( event ) => event.preventDefault(),
    'keyup [name="username"]' ( event ) {
      let value     = event.target.value,
          formatted = sanitizeUsername( value );
      event.target.value = formatted;
    }
  });

let _handleSignup = () => {
  let user = {
    username: template.find( '[name="username"]').value,
    email: template.find( '[name="emailAddress"]' ).value,
    password: template.find( '[name="password"]' ).value,
    profile: {
      name: {
        first: template.find( '[name="firstName"]' ).value,
        last: template.find( '[name="lastName"]' ).value
      }
    }
  };

  Accounts.createUser( user, ( error ) => {
    if ( error ) {
      Bert.alert( error.reason, 'danger' );
    } else {
      Bert.alert( 'Welcome!', 'success' );
    }
  });
};

let validation = () => {
  return {
    rules: {
      firstName: {
        required: true
      },
      lastName: {
        required: true
      },
      username: {
        required: true,
        minlength: 6,
        maxlength: 20
      },
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      firstName: {
        required: 'What is your first name?'
      },
      lastName: {
        required: 'How about a second name?'
      },
      username: {
        required: 'What username would you like?'
      },
      emailAddress: {
        required: 'Need an email address here.',
        email: 'Is this email address legit?'
      },
      password: {
        required: 'Need a password here.',
        minlength: 'Use at least six characters, please.'
      }
    },
    errorPlacement( error, element ) {
      if ( element.attr( 'name' ) === 'username' ) {
        error.insertAfter( '.input-group.username' );
      }
    },
    submitHandler() { _handleSignup(); }
  };
};

let _validate = ( form ) => {
  $( form ).validate( validation() );
};

let signup = ( options ) => {
  template = options.template;
  _validate( options.form );
}

let sanitizeUsername = ( value ) => {
    return value.replace( /[^A-Za-z0-9\s]/g, '' ).toLowerCase().trim();
}