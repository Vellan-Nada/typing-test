let Ccount = 5
let capital = 0
let currentIndex = 0
let correct = 0
let wrong = 0
let final = 0
let timer = 0
let sett = 0
let wstarted = 0
let start
let end
let totalTime
let length
let accuracy
let sentence
let sentenceRequestId = 0
let isLoading = 0

$(".point").click(function(){
    if (sett===0 || final===1){
        $(".options").toggle()
    }
})

$(".capital").change(function(){
    capital = $(this).prop("checked") ? 1:0
    generateSentence(Ccount)
})

$(".five").click(function(){
    wstarted = 1
    $(".cb").not(this).prop("checked",false)
    $(this).prop("checked",true)
    generateSentence(5)
})

$(".ten").click(function(){
    wstarted = 1
    $(".cb").not(this).prop("checked",false)
    $(this).prop("checked",true)
    generateSentence(10)
})

$(".twenty").click(function(){
    wstarted = 1
    $(".cb").not(this).prop("checked",false)
    $(this).prop("checked",true)
    generateSentence(20)
})

const WORDS = [
    "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he",
    "as","you","do","at","this","but","his","by","from","they","we","say","her","she","or",
    "an","will","my","one","all","would","there","their","what","so","up","out","if","about","who",
    "get","which","go","me","when","make","can","like","time","no","just","him","know","take","people",
    "into","year","your","good","some","could","them","see","other","than","then","now","look","only","come",
    "its","over","think","also","back","after","use","two","how","our","work","first","well","way","even",
    "new","want","because","any","these","give","day","most","us","is","was","are","been","has","had",
    "were","said","did","made","find","here","thing","many","long","down","very","still","own","should","never",
    "world","life","hand","part","child","eye","woman","place","week","case","point","number","group","problem","fact",
    "house","water","light","river","mountain","garden","window","paper","music","story","friend","family","school","city","country",
    "money","night","morning","dream","color","table","chair","phone","book","letter","road","train","plane","ocean","forest",
    "happy","quick","bright","quiet","strong","small","large","early","late","simple","clear","warm","cold","green","blue",
    "open","close","write","read","speak","listen","learn","teach","build","break","carry","change","follow","start","finish",
    "run","walk","jump","swim","play","sing","dance","smile","laugh","travel","answer","question","remember","believe","create",
    "always","often","sometimes","together","again","around","between","under","before","above","maybe","really","almost","enough","later"
]

function generateSentence(count){
    Ccount = count
    ++sentenceRequestId
    isLoading = 1
    try {
        let words = Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)])
        if (capital===1){
            words[0] = words[0][0].toUpperCase()+words[0].slice(1)
        }
        sentence = words.join(" ")+"."     
        $(".sentence").text(sentence)
        const Sentence = $(".sentence").text()
        const wordList = Sentence.split(" ")
        const changedWords = wordList
        .map((word, index) => {
            const wordText = index < wordList.length - 1 ? `${word} ` : word
            const letters = wordText
                .split("")
                .map(letter => `<span class="char">${letter}</span>`)
                .join("")
            return `<span class="word-span">${letters}</span>`
        })
        .join("")
        $(".sentence").html(changedWords);
        currentIndex = 0
        correct = 0
        wrong = 0
        final = 0
        timer = 0
        start = undefined
        end = undefined
        $(".accuracy").text("Typing Accuracy")
        $(".speed").text("Typing Speed")
        $(".wpm").text("WPM")
        isLoading = 0

    } catch (error) {
        $(".sentence").text("Error loading sentence")
        console.error("Sentence error:",error)
        isLoading = 0
        $(".wpm").text("WPM")
    }
}

$(document).keydown(function(event) {
    if (wstarted===1){
        if (event.target && event.target.tagName === "BUTTON") {
            event.preventDefault()
            $(event.target).blur()
        }
        if (isLoading===1){
            return
        }
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return
        }
        if (event.key.length !== 1) {
            return
        }
        sett=1
        $(".options").hide()
        if (final===0){
            if (timer===0){
                start = new Date().getTime()
            }
            timer = timer+1
            let spans = $(".sentence .char")
            if (spans.length === 0) {
                return
            }
            if (currentIndex < spans.length) {
                let currentSpan = $(spans[currentIndex])
                let expectedChar = currentSpan.text()

                if (event.key === expectedChar) {
                    currentSpan.css("color", "rgba(9, 196, 68, 1)")
                    correct=correct+1
                } else {
                    currentSpan.css("color", "red")
                    wrong = wrong+1
                }
                currentIndex++
            }
            if(currentIndex>=spans.length){
                final=1
                sett=0
                end = new Date().getTime()
                totalTime = Math.round((end-start)/1000)
                accuracy = Math.round((correct / spans.length) * 100)
                const wpm = totalTime > 0
                    ? Math.round((correct / 5) / (totalTime / 60))
                    : 0

                $(".accuracy").text(`Typing Accuracy : ${accuracy}%`)
                $(".speed").text(`Typing Speed : ${totalTime}s`)
                $(".wpm").text(`WPM : ${wpm}`)
            }
        }
    }
})

$(".start").click(function(){
    $(this).find("button").blur()
    sett=0
    final=0
    currentIndex = 0
    correct = 0
    wrong = 0
    timer = 0
    $(".accuracy").text("Typing Accuracy")
    $(".speed").text("Typing Speed")
    $(".wpm").text("WPM")
    if (wstarted===1){
        generateSentence(Ccount)
    } else {
        $(".sentence").text("Choose your Settings first")
    }
})
