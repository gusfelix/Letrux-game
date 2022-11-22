let col = 1;
let boxes = document.querySelectorAll(`.letra-${col}`);

boxes.forEach(box =>{
    box.classList.add('highlight')
})

if(localStorage.getItem('game-data')){

    let data = JSON.parse(localStorage.getItem('game-data'));

    data.row = 1;
    data.won = false;
    data.word = [];

    localStorage.setItem('game-data', JSON.stringify(data))

    for(let w of data.attempts){       

        for(let l of w){
            addLetter(l);
        }
        
        validWord();
        
        let data = JSON.parse(localStorage.getItem('game-data'));
        data.attempts.pop();


        localStorage.setItem('game-data', JSON.stringify(data))
    }

}else{
    let data = {
        row : 1,
        word : [],
        attempts : [],
        solution : setWord(),
        solutionLetters : {a:0, b:0, c:0, d:0, e:0, f:0, g:0, h:0, i:0, j:0, k:0, l:0, m:0, n:0, o:0, p:0, q:0, r:0, s:0, t:0, u:0, v:0, w:0, x:0, y:0, z:0, },
        wins : 0,
        winStreak : 0,
        matches : 1,
        won : false
    }

    localStorage.setItem('game-data', JSON.stringify(data))
}

document.body.addEventListener('keyup', (event)=>{
    
    if(event.key.charCodeAt(0) >= 97 && event.key.charCodeAt(0) <= 122){

        addLetter(event.key);

    }else if(event.key === "Backspace"){

        delLetter();

    }else if(event.key === "Enter"){

        validWord();
    }
})

function addLetter(letra){

    let data = JSON.parse(localStorage.getItem('game-data'));

    if(col <= 5 && !data.won){
        document.getElementById(`${data.row}-${col}`).innerHTML = letra.toUpperCase();
        data.word.push(letra.toLowerCase());

        col += 1;
        localStorage.setItem('game-data', JSON.stringify(data));
    }
}

function delLetter(){

    let data = JSON.parse(localStorage.getItem('game-data'));

    if(col > 1){
        col -= 1;
        document.getElementById(`${data.row}-${col}`).innerHTML = '';
        data.word.pop();

        localStorage.setItem('game-data', JSON.stringify(data));
    }

    if(document.getElementById(`${data.row}-${col}`).classList.contains('invalid')){
        boxes.forEach(box => {
            box.classList.remove('invalid')
        })
    }
}

function validWord(){

    let data = JSON.parse(localStorage.getItem('game-data'));

    if(data.word.length == 5 && wordIn(data.word.join(''))){

        let solutionA = data.solution.split('');
        
        for(let l in data.word){
            if(data.word[l] == solutionA[l]){
                
                document.getElementById(`${data.row}-${parseInt(l) + 1}`).classList.add('right');
                document.getElementById(`key-${data.word[l]}`).classList.add('right');
                document.getElementById(`key-${data.word[l]}`).classList.remove('wrong-place');
                
            }else if(solutionA.some(item => {return item == data.word[l] ? true : false})){
                
                document.getElementById(`${data.row}-${parseInt(l) + 1}`).classList.add('wrong-place');
                document.getElementById(`key-${data.word[l]}`).classList.add('wrong-place');
                
            }else{
                document.getElementById(`key-${data.word[l]}`).classList.add('wrong');
            }
        }

        
        if(data.word.join('') == data.solution){ //case win
            
            data.won = true;
            data.winStreak += 1;
            data.wins += 1;
            
            setTimeout(() => openModal(), 1000)
            
        }else if(data.row >= 6){ //case lost
            
            data.winStreak = 0;
            
            setTimeout(() => openModal(), 1000)
        }
        
        data.attempts.push(data.word);
        data.row  += 1;
        col = 1;
        data.word = [];
            

        localStorage.setItem('game-data', JSON.stringify(data));
        
        boxes.forEach(box =>{
            box.classList.remove('highlight');
            box.classList.remove('invalid');
        })
        
        boxes = document.querySelectorAll(`.letra-${data.row}`);
        
        boxes.forEach(box =>{
            box.classList.add('highlight')
        })

    }
}

function setWord(){
    let pos = Math.floor(Math.random() * palavras.length);
    let word = palavras[pos];

    let regexWord = /[\u00C0-\u00FF ]+/i

    if(regexWord.test(word) || word.length != 5){
        setWord();
    }else{

        


        return word;
    }
}

function wordIn(word){
    for(let wordA of palavrasBase){

        if(wordA == word){
            return true;
        }
    }
    
    boxes.forEach(box =>{
        box.classList.add('invalid');
    })
    
    console.log('nao tem');
    return false;
}

function restartGame(){

    let data = JSON.parse(localStorage.getItem('game-data'));

    data.row = 1;
    data.word = [];
    data.attempts = [];
    data.solution = setWord();
    data.won = null;
    data.matches += 1;

    localStorage.setItem('game-data', JSON.stringify(data))

    location.reload();
}

function openModal(){
    $('#result').modal({show: true})
}