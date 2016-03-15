document.addEventListener('DOMContentLoaded', function() {

  var element = document.querySelector('.demo-container');
  var config = {
    session: 'session',
		user: { givenName: 'XXXXXXXXXXXXXXXX' },
		mode: 'Basic',
		onLogin: function () {
			alert('You signed in');
		},
		onLogout: function () {
			alert('You signed out');}
  };

  console.info(config);

  document.dispatchEvent(new CustomEvent('o.DOMContentLoaded', {
    detail: {
      element: element,
      config: config
    }
  }));

	config.user = { givenName: 'Bender' };

  document.dispatchEvent(new CustomEvent('o.DOMContentLoaded', {
    detail: {
      element: element,
      config: config
    }
  }));

	// Event Listeners

  // Help menu
	document.addEventListener('oAppHeader.help.toggle', function () {
		alert('You toggled help');
		console.log('oAppHeader.help.toggle');
	});

  // Sign out event
  document.addEventListener('oAppHeader.logout', function () {
		console.log('oAppHeader.logout');
	});

});
