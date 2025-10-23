let Ccount = 5
let capital = 0
let currentIndex = 0
let correct = 0
let wrong = 0
let final = 0
let timer = 0
let sett = 0
let cstarted = 0
let wstarted = 0
let start
let end
let totalTime
let length
let accuracy
let sentence

$(".point").click(function(){
    if (sett===0){
        $(".options").toggle()
    }
})

$(".capital").change(function(){
    cstarted = 1
    capital = $(this).prop("checked") ? 1:0
    generateSentence(Ccount)
})

$(".five").click(function(){
    wstarted = 1
    $(".cb").not(this).prop("checked",false)
    generateSentence(5)
})

$(".ten").click(function(){
    wstarted = 1
    $(".cb").not(this).prop("checked",false)
    generateSentence(10)
})

$(".twenty").click(function(){
    wstarted = 1
    $(".cb").not(this).prop("checked",false)
    generateSentence(20)
})

async function generateSentence(count){
    Ccount = count
    try {
        const response = await fetch(`https://random-word-api.vercel.app/api?words=${count}`)
        let words = await response.json()
        if (capital===1){
            words[0] = words[0][0].toUpperCase()+words[0].slice(1)
        }
        sentence = words.join(" ")+"."     
        $(".sentence").text(sentence)
        const Sentence = $(".sentence").text()
        const wordList = Sentence.split("")
        const changedWords = wordList
        .map(letter => `<span class="char">${letter}</span>`)
        .join("");
        $(".sentence").html(changedWords);

    } catch (error) {
        $(".sentence").text("Error loading sentence")
        console.error("Fetch error:",error)
    }
}

$(document).keypress(function(event) {
    if (cstarted===1 && wstarted===1){
        sett=1
        $(".options").hide()
        if (final===0){
            if (timer===0){
                start = new Date().getTime()
            }
            timer = timer+1
            let spans = $(".sentence span")
            let length = spans.length
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
                end = new Date().getTime()
                totalTime = Math.round((end-start)/1000)
                accuracy = Math.round((correct / spans.length) * 100)

                $(".accuracy").text(`Typing Accuracy : ${accuracy}%`)
                $(".speed").text(`Typing Speed : ${totalTime}s`)
            }
        }
    }
})

$(".start").click(function(){
    sett=0
    final=0
    capital = 0
    Ccount = 5
    currentIndex = 0
    correct = 0
    wrong = 0
    timer = 0
    cstarted = 0
    wstarted = 0
    $(".sentence").text("Choose your Settings first")
    $(".accuracy").text("Typing Accuracy")
    $(".speed").text("Typing Speed")
    $(".capital").prop("checked",false)
    $(".five").prop("checked",false)
    $(".ten").prop("checked",false)
    $(".twenty").prop("checked",false)

})

// Always focus the hidden input when page loads
$("#mobileInput").focus();

// Refocus if user taps anywhere (to reopen keyboard)
$(document).on("click touchstart", function() {
    $("#mobileInput").focus();
});

// Listen to input instead of keypress for mobile
$("#mobileInput").on("input", function(e) {
    let val = $(this).val();
    if (val.length > 0) {
        let key = val[val.length - 1]; // get last typed character
        $(document).trigger(jQuery.Event("keypress", { key: key }));
        $(this).val(""); // clear after processing
    }
});
