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
        msg: ''
    },
    methods: {
        onEnter: function () {
            fetchWord(audio_search.msg);
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

var pass_button = new Vue({
    el: '#pass_button',
    data: {
        disabled: true
    },
    methods: {
        onClick: function () {
            fetchWord("Pass")
        }
    }
});


async function fetchWord(word) {
    const response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
    const data = await response.json()
    // waits until the request completes...
    //const response = await JSON.parse(response_json)

    audio_player.word = data[0]["word"]
    audio_player.phonetic_script = data[0]["phonetics"][0]["text"];
    audio_player.audio = data[0]["phonetics"][0]["audio"];

    audio_search.url = ""
    audio_recorder.audio = ""
    pass_button.disabled = true
}


async function fetchAllWords(all_words = false) {
    if (all_words) {
        var response = await fetch("all_words.txt")
    } else {
        var response = await fetch("important_words.txt")
    }

    const data = await response.text()
    complete_word_array = data.split("\n")
    console.log(complete_word_array.length)
    // waits until the request completes...
    //const response = await JSON.parse(response_json)

}

fetchAllWords()


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
    pass_button.disabled = false
}






