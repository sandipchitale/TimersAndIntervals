(function(w, st, ct, si, ci) {
  function tic(ae) {
    if (ae) {
      ae.at = Date.now();
    }
    document.dispatchEvent(new CustomEvent('.', { detail: ae }));
  }

  w.setTimeout = function (fn, ...args) {
    let id;
    var idArray = [null];
    id = st(function(...cba) {
      try {
        if (typeof fn === 'string') {
          (new Function(fn))();
        } else {
          fn(...cba);
        }
      } finally {
        let timeoutId = idArray[0];
        if (timeoutId !== null) {
          tic({
            type: 'ft',
            id: timeoutId
          });
        }
      }
    }, ...args);
    idArray[0] = id;
    if (id && typeof args[0] === 'number') {
      tic({
        type: 'st',
        id: id,
        delay: args[0]
      });
    }
    return id;
  };
  w.clearTimeout = function (timeoutId) {
    if (timeoutId !== true) {
      tic({
        type: 'ct',
        id: timeoutId
      });
    }
    return ct(timeoutId);
  };
  w.setInterval = function (fn, ...args) {
    let id;
    var idArray = [null];
    id = si(function(...cba) {
      let intervalId = idArray[0];
      if (intervalId !== null) {
        tic({
          type: 'fi',
          id: intervalId,
          trigeredAt: Date.now()
        });
      }
      if (typeof fn === 'string') {
        (new Function(fn))();
      } else {
        fn(...cba);
      }
    }, ...args);
    idArray[0] = id;
    if (id && typeof args[0] === 'number') {
      tic({
        type: 'si',
        id: id,
        delay: args[0]
      });
    }
    return id;
  };
  w.clearInterval = function (intervalId) {
    if (intervalId !== true) {
      tic({
        type: 'ci',
        id: intervalId
      });
    }
    return ci(intervalId);
  };
  tic({
    type: '.'
  });
})(window, window.setTimeout, window.clearTimeout, window.setInterval, window.clearInterval);