var app2 = new Vue({
    el: '#bind-attribute',
    data: {
        message: 'You loaded this page on ' + new Date().toLocaleString()
    }
})


var audio_player = new Vue({
    el: "#audio_player",
    data: {
        audio: "//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3"
    }
})


async function fetchWord(word) {
    const response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
    const data = await response.json()
    // waits until the request completes...
    //const response = await JSON.parse(response_json)
    audio_link = data[0]["phonetics"][0]["audio"]
    console.log(audio_link)
    audio_player.audio = data[0]["phonetics"][0]["audio"];
    console.log(audio_player.audio)
}

fetchWord("bye")

async function fetchAllWords() {
    const response = await fetch("english.txt");
    console.log(response)
    const data = await response.text()
    complete_word_array = data.split("\n")
    console.log(complete_word_array.length)
    // waits until the request completes...
    //const response = await JSON.parse(response_json)

}

fetchAllWords()

document.getElementById('file').onchange = function () {

    var file = this.files[0];
    console.log(this.files)
    console.log(typeof file)
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        // Entire file
        //console.log(this.result);

        // By lines
        var lines = this.result.split('\n');
        for (var line = 0; line < lines.length; line++) {
            //console.log(lines[line]);
        }
    };
    reader.readAsText(file);
};


//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3