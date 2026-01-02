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

async function generateSentence(count){
    Ccount = count
    const requestId = ++sentenceRequestId
    isLoading = 1
    $(".sentence").text("Loading...")
    try {
        const response = await fetch(`https://random-word-api.vercel.app/api?words=${count}`)
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
        }
        let words = await response.json()
        if (requestId !== sentenceRequestId) {
            return
        }
        if (!Array.isArray(words) || words.length === 0) {
            throw new Error("No words returned")
        }
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
        if (requestId === sentenceRequestId) {
            $(".sentence").text("Error loading sentence")
            console.error("Fetch error:",error)
            isLoading = 0
            $(".wpm").text("WPM")
        }
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
