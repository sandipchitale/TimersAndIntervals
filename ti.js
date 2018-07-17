
(function() {
    function ci(id) {
        chrome.devtools.inspectedWindow.eval('clearInterval(' + id + ');');
    }
    function ct(id) {
        chrome.devtools.inspectedWindow.eval('clearTimeout(' + id + ');');
    }

    let nowSpan = document.getElementById("now");
    let timersTable = document.getElementById("timers");
    var timers = {};
    let intervalsTable = document.getElementById("intervals");
    var intervals = {};

    var ae;
    var aes = [];
    chrome.runtime.onMessage.addListener(function(ae, sender, sendResponse) {
        if (ae) {
            if (ae.type === '.') {
                // Clear
                timersTable.innerHTML = '';
                timers = {};
                intervalsTable.innerHTML = '';
                intervals = {};
                aes = [];
            } else if (ae.type === 'st' || ae.type === 'si' || ae.type === 'fi') {
                // queue for update every second;
                aes.push(ae);
            } else if (ae.type === 'ft' || ae.type === 'ct') {
                let index = aes.findIndex(i => i.id === ae.id);
                if (index === -1) {
                    // Timer fired or cleared
                    let timerTr = timers[ae.id].timerTr;
                    if (timerTr) {
                        timerTr.parentNode.removeChild(timerTr);
                    }
                    delete timers[ae.id];
                } else {
                    // clear outstanding updates
                    aes.splice(index, 1);
                }
            }  else if (ae.type === 'ci') {
                let index = aes.findIndex(i => i.id === ae.id);
                if (index === -1) {
                    // Interval cleared
                    let intervalTr = intervals[ae.id].intervalTr;
                    if (intervalTr) {
                        intervalTr.parentNode.removeChild(intervalTr);
                    }
                    delete intervals[ae.id];
                } else {
                    // clear outstanding updates
                    aes = aes.filter(i => i.id === ae.id);
                }
            }
        }
    });

    function update() {
        let ae;
        let nowDate = new Date();
        let now = Date.now();
        nowSpan.innerText = 
            ('' + nowDate.getHours()).padStart(2, '0') 
            + ':' 
            + ('' + nowDate.getMinutes()).padStart(2, '0')
            + ':'
            + ('' + nowDate.getSeconds()).padStart(2, '0')
            + ' '
            + ('' + nowDate.getMilliseconds()).padStart(3, '\u2003');
        while (ae = aes.shift()) {
            if (ae.type === 'st') {
                // Timer started
                let timerTr = document.createElement('tr');
                timerTr.id = 'timer-tr-' + ae.id;

                let clearTimerTd = document.createElement('td');
                clearTimerTd.innerHTML = '<button>&#10799;</button>';
                clearTimerTd.onclick = ct.bind(null, ae.id);
                timerTr.appendChild(clearTimerTd);

                let timerIdTd = document.createElement('td');
                timerIdTd.id = 'timer-id-td-' + ae.id;
                timerIdTd.innerHTML = '' + ae.id;
                timerTr.appendChild(timerIdTd);

                let date = new Date(ae.at);
                let timerAtTd = document.createElement('td');
                timerAtTd.id = 'timer-at-td-' + ae.id;
                timerAtTd.innerText = 
                    ('' + date.getHours()).padStart(2, '0') 
                    + ':' 
                    + ('' + date.getMinutes()).padStart(2, '0')
                    + ':'
                    + ('' + date.getSeconds()).padStart(2, '0')
                    + ' '
                    + ('' + date.getMilliseconds()).padStart(3, '\u2003');
                timerTr.appendChild(timerAtTd);

                let timerDelayTd = document.createElement('td');
                timerDelayTd.id = 'timer-delay-td-' + ae.id;
                timerDelayTd.innerText = '' + ae.delay;
                timerTr.appendChild(timerDelayTd);

                let blankTd = document.createElement('td');
                timerTr.appendChild(blankTd);

                timers[ae.id] = {
                    timerTr: timerTr,
                    timerIdTd: timerIdTd,
                    timerAtTd: timerAtTd,
                    timerDelayTd: timerDelayTd,
                };
                timersTable.appendChild(timerTr);
            } else if (ae.type === 'si') {
                // Interval started
                let intervalTr = document.createElement('tr');
                intervalTr.id = 'interval-tr-' + ae.id;

                let clearIntervalTd = document.createElement('td');
                clearIntervalTd.innerHTML = '<button>&#10799;</button>'
                clearIntervalTd.onclick = ci.bind(null, ae.id);
                intervalTr.appendChild(clearIntervalTd);

                let intervalIdTd = document.createElement('td');
                intervalIdTd.id = 'interval-id-td-' + ae.id;
                intervalIdTd.innerText = '' + ae.id;
                intervalTr.appendChild(intervalIdTd);

                let date = new Date(ae.at);
                let intervalAtTd = document.createElement('td');
                intervalAtTd.id = 'interval-at-td-' + ae.id;
                intervalAtTd.innerText = 
                    ('' + date.getHours()).padStart(2, '0') 
                    + ':' 
                    + ('' + date.getMinutes()).padStart(2, '0')
                    + ':'
                    + ('' + date.getSeconds()).padStart(2, '0')
                    + ' '
                    + ('' + date.getMilliseconds()).padStart(3, '\u2003');
                intervalTr.appendChild(intervalAtTd);

                let intervalDelayTd = document.createElement('td');
                intervalDelayTd.id = 'interval-delay-td-' + ae.id;
                intervalDelayTd.innerText = '' + ae.delay;
                intervalTr.appendChild(intervalDelayTd);

                let intervalTimesTd = document.createElement('td');
                intervalTimesTd.id = 'interval-times-td-' + ae.id;
                intervalTimesTd.innerText = '0';
                intervalTr.appendChild(intervalTimesTd);

                intervals[ae.id] = {
                    intervalTr: intervalTr,
                    intervalIdTd: intervalIdTd,
                    intervalAtTd: intervalAtTd,
                    intervalDelayTd: intervalDelayTd,
                    intervalTimesTd: intervalTimesTd
                };
                intervalsTable.appendChild(intervalTr);
            } else if (ae.type === 'fi') {
                let intervalTimesTd = intervals[ae.id].intervalTimesTd;
                if (intervalTimesTd) {
                    intervalTimesTd.innerText = '' + (parseInt(intervalTimesTd.innerText) + 1);
                }
            }
        }
    }

    setInterval(update, 1000);
})();
