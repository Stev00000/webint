var current_user = null
var current_lections = null
var current_number = null
var increase_count = false

var audio_player = new Vue({
    el: "#audio_player",
    data: {
        word: "hello",
        audio: "//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",
        phonetic_script: 'həˈləʊ'
    }
})

var audio_search = new Vue({
    el: '#audio_search',
    data: {
        input: ''
    },
    methods: {
        onEnter: function () {
            fetchWord(audio_search.input);
            increase_count = false
        }
    }
});

var side_area = new Vue({
    el: '.side_area',
    data: {
        input: '',
        hide_logout: true,
        hide_register: false

    },
    methods: {
        clickRegister: function () {
            current_user = side_area.input
            if (localStorage.getItem(current_user + "_lections") === null) {
                fetchAllWords(current_user)
            } else {
                current_lections = JSON.parse(localStorage.getItem(current_user + "_lections"))
                current_number = localStorage.getItem(current_user + "_number")
            }
            after_login_area.hidden = false
            side_area.hide_logout = false
            side_area.hide_register = true
            side_area.input = ""
            increase_count = false
        },
        clickLogout: function () {
            after_login_area.hidden = true
            side_area.hide_logout = true
            side_area.hide_register = false
            current_user = null
            current_lections = null
            current_number = null
        }
    }
});



var audio_recorder = new Vue({
    el: '#audio_recorder',
    data: {
        audio: ''
    },

});

var record_button = new Vue({
    el: '#record_button',
    methods: {
        onClick: function () {
            recordAudio()
        }
    }
});

var after_login_area = new Vue({
    el: '.after_login_area',
    data: {
        disabled: true,
        hidden: true
    },
    methods: {
        onClick: function () {
            console.log(current_number + " " + increase_count)

            if (increase_count) {
                current_number++
                localStorage.setItem(current_user + "_number", current_number)
                fetchWord(current_lections[current_number])
            } else {
                fetchWord(current_lections[current_number])
                increase_count = true
            }

        }
    }
});


async function fetchWord(word) {
    try {
        console.log("fetch word: " + word)
        const response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
        const data = await response.json()
        // waits until the request completes...
        //const response = await JSON.parse(response_json)

        audio_player.word = data[0]["word"]
        audio_player.phonetic_script = data[0]["phonetics"][0]["text"];
        audio_player.audio = data[0]["phonetics"][0]["audio"];

        audio_search.input = ""
        audio_recorder.audio = ""
        after_login_area.disabled = true
    } catch (e) {
        console.error("Error occured while fetching");
        console.error(e);
    }

}


async function fetchAllWords(email) {
    const response = await fetch("important_words.txt")
    const data = await response.text()
    complete_word_array = data.split("\r\n")

    current_lections = await complete_word_array.sort(() => 0.5 - Math.random())
    current_number = 0

    localStorage.setItem(email + "_lections", JSON.stringify(current_lections));
    localStorage.setItem(email + "_number", 0);
}

async function getLection() {
    const response = await fetch("important_words.txt")
    const data = await response.text()
    complete_word_array = data.split("\r\n")
    const shuffled = complete_word_array.sort(() => 0.5 - Math.random());
    var selected = shuffled.slice(0, 10);
    return selected
}

async function recordAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
    });
    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        audio_recorder.audio = audioUrl

    });
    mediaRecorder.start()
    await sleep(2000);
    mediaRecorder.stop()
    after_login_area.disabled = false
}


function empty_storage() {
    localStorage.clear()
}


function allStorage() {

    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
        archive.push(key + '=' + localStorage.getItem(key));
    }

    return archive;
}

