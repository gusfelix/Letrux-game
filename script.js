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
        // solutionLetters : {a:0, b:0, c:0, d:0, e:0, f:0, g:0, h:0, i:0, j:0, k:0, l:0, m:0, n:0, o:0, p:0, q:0, r:0, s:0, t:0, u:0, v:0, w:0, x:0, y:0, z:0, },
        wins : 0,
        losses : 0,
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
        document.getElementById(`${data.row}-${col}`).setAttribute("value", letra);
        data.word.push(letra.toLowerCase());

        col++;
        localStorage.setItem('game-data', JSON.stringify(data));
    }
}

function delLetter(){

    let data = JSON.parse(localStorage.getItem('game-data'));

    if(col > 1){
        col--;
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

    if(data.word.length == 5 && wordIn(data.word.join(''))){ // 

        const solution = data.solution.split('');
        
        data.word.forEach((letter, index) =>{ ; //verifica e coloca as cores
        
            const indexOf = solution.indexOf(letter);

            if(letter == data.solution.charAt(index)){
                
                document.getElementById(`${data.row}-${index + 1}`).classList.add('right');
                document.getElementById(`key-${letter}`).classList.add('right');
                document.getElementById(`key-${letter}`).classList.remove('wrong-place');

                boxes.forEach(box =>{
                    if(box.getAttribute("value") == letter && box.classList.contains('wrong-place')){
                        box.classList.remove('wrong-place');
                    }
                })
                
                
            }else if(solution.includes(letter) ){
                
                document.getElementById(`${data.row}-${index + 1}`).classList.add('wrong-place');
                document.getElementById(`key-${letter}`).classList.add('wrong-place');     
                
                if(indexOf > -1){
                    solution.splice(indexOf, 1, '');
                }
                
            }else{
                document.getElementById(`key-${letter}`).classList.add('wrong');
            }

        })
        
        if(data.word.join('') == data.solution){ //case win
            
            data.won = true;

            document.getElementById('result-message').innerHTML = 'Parabéns, você acertou!';
            
            setTimeout(() => openModal(), 1000)
            
        }else if(data.row >= 6){ //case lost
            
            document.getElementById('result-message').innerHTML = 'Não foi dessa vez :(';
            document.getElementById('message').innerHTML = 'A palavra era: ' + data.solution;
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

    if(palavrasBase.includes(word)){
        return true;

    }else{
        boxes.forEach(box =>{
            box.classList.add('invalid');
        })
        
        return false;
    }    
}

function restartGame(){

    let data = JSON.parse(localStorage.getItem('game-data'));
    
    if(data.won == true){
        data.wins++;
        data.winStreak++;
    }else{
        data.winStreak = 0;
    }
    data.row = 1;
    data.word = [];
    data.attempts = [];
    data.solution = setWord();

    data.won = false;
    data.matches++;

    localStorage.setItem('game-data', JSON.stringify(data))

    location.reload();
}

function openModal(id){
    $('#result').modal({show: true})
}