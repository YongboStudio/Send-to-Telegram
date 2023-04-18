var $ = function(id) {
    return document.getElementById(id);
},

show_message = function(message, hide_in_seconds) {
    $('message').innerHTML = message;
    if (hide_in_seconds) {
        setTimeout(function() {
            $('message').innerHTML = '&nbsp;';
        }, hide_in_seconds * 1000);
    }
},
reload_contextmenus = function() {
    chrome.runtime.sendMessage({
        action: 'reload-contextmenus'
    });
},
split_by_comma_list = function(value) {
    if (!value) {
        return [];
    }
    return value.split(',');
},
validate = function() {
    var token = localStorage.token || '',
        userkey = localStorage.userkey || '';

    if (!userkey || !token) {
        show_message('Please fill both fields!');
        return;
    }

    var req = new XMLHttpRequest();
    var url = 'https://api.telegram.org/bot' + token + '/sendMessage';
    url += '?chat_id=' + encodeURIComponent(userkey);
    url += '&text=' + encodeURIComponent('Setting for "Send-to-Telegram" successfully.');
    req.open('GET', url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send();

    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            var response = JSON.parse(req.responseText);
            console.log(response);            
            if (req.status === 200) {
                localStorage.valid = token + userkey;
            } else {
                localStorage.valid = '';
                if (response.errors) {
                    show_message('Error: ' + response.errors);
                } else {
                    show_message('Something is fishy: ' + req.responseText);
                }
            }
        }
    };
},
save = function() {
    localStorage.userkey = $('userkey').value;
    localStorage.token = $('token').value;
    show_message('Saved!');
    validate();
},
load = function() {
    $('userkey').value = localStorage.userkey || '';
    $('token').value = localStorage.token || '';

    if(localStorage._options_msg) {
        show_message(localStorage._options_msg);
        localStorage.removeItem('_options_msg');
    }
};

$('save').addEventListener('click', save);
window.addEventListener("load", load);