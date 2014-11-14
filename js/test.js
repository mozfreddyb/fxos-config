

  function init() {
    let self = this;
    let settingsRequest = navigator.mozSettings.createLock().get('*');
    settingsRequest.onsuccess = function (e) {
      self.allSettings = event.target.results; // probably sorted already.
    };
  }

