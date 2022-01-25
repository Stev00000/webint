var current_user = null
var current_lections = null
var current_number = null

var random_words = null
var current_random_number = 0

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
            after_login_area.in_lection = false
        }
    }
});

var side_area = new Vue({
    el: '.side_area',
    data: {
        input: '',
        hide_logout: true,
        hide_register: false,
        level: 0

    },
    methods: {
        clickRegister: function () {
            current_user = side_area.input
            if (current_user == "") {
                return
            }
            if (localStorage.getItem(current_user + "_lections") === null) {
                fetchAllWords(current_user, false)
            } else {
                current_lections = JSON.parse(localStorage.getItem(current_user + "_lections"))
                current_number = localStorage.getItem(current_user + "_number")
            }
            after_login_area.hidden = false
            side_area.hide_logout = false
            side_area.hide_register = true
            side_area.input = ""
            after_login_area.in_lection = false
            side_area.level = Math.floor(current_number / 10) + 1;
        },
        clickLogout: function () {
            after_login_area.logout()
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
        audio: '',
        disabled: true
    },
    methods: {
        record: function () {
            recordAudio()
        },

        pass: function () {
            console.log(current_number + " " + after_login_area.in_lection)

            if (after_login_area.in_lection) {
                current_number++
                localStorage.setItem(current_user + "_number", current_number)
                audio_recorder.disabled = true
                side_area.level = Math.floor(current_number / 10) + 1;
                after_login_area.progress = "width:" + ((current_number % 10) * 10) + "%"
                fetchWord(current_lections[current_number])
            } else {
                current_random_number++
                audio_recorder.disabled = true
                fetchWord(random_words[current_random_number])
            }

        }
    }
});


var after_login_area = new Vue({
    el: '.after_login_area',
    data: {
        hidden: true,
        in_lection: false,
        progress: "width:0%"
    },
    methods: {
        clickResume: function () {
            after_login_area.in_lection = true
            fetchWord(current_lections[current_number])
            after_login_area.progress = "width:" + ((current_number % 10) * 10) + "%"
        },
        clickStop: function () {
            after_login_area.in_lection = false
        },
        logout: function () {
            after_login_area.hidden = true
            after_login_area.in_lection = false
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
    } catch (e) {
        console.error("Error occured while fetching");
        console.error(e);
    }

}


async function fetchAllWords(email = null, random = true) {
    const response = await fetch("important_words.txt")
    const data = await response.text()
    complete_word_array = data.split("\r\n")

    if (random) {
        random_words = await complete_word_array.sort(() => 0.5 - Math.random())
    } else {
        current_lections = await complete_word_array.sort(() => 0.5 - Math.random())
        current_number = 0
    }


    if (email !== null) {
        localStorage.setItem(email + "_lections", JSON.stringify(store));
        localStorage.setItem(email + "_number", 0);
    }
}

fetchAllWords()

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
    audio_recorder.disabled = false
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

