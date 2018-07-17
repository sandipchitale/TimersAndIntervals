(function() {
    document.addEventListener('.', function(e) {
        chrome.runtime.sendMessage(null, e.detail);
    })
    let s = document.createElement('script');
    s.src = chrome.extension.getURL('monkeypatch.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})();