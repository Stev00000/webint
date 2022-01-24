var audio_player = new Vue({
    el: "#audio_player",
    data: {
        word: "hello",
        audio: "//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",
        phonetic_script: 'həˈləʊ'
    }
})

var audio_input = new Vue({
    el: '#audio_input',
    data: {
        msg: ''
    },
    methods: {
        onEnter: function () {
            fetchWord(audio_input.msg);
            audio_input.msg = ""
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

    console.log(audio_player.audio)
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

