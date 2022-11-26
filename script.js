var col = 1;
var boxes = document.querySelectorAll(`.letra-${col}`);
var boxes = document.querySelectorAll(`.letra-${col}`);
let func = false;

if(localStorage.getItem('game-data')){
    
    let data = JSON.parse(localStorage.getItem('game-data'));
    
    boxes[0].classList.add('selected')
    boxes.forEach(box =>{
        box.classList.add('highlight')
    })
    
    data.row = 1;
    data.won = false;
    data.word = ['', '', '', '', ''];
    
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
    
    graphic(); //carrega o gráfico

}else{ //cria os dados se o local storage estiver vazio
    openModal('#howToPlay');



    let data = {
        row : 1,
        word : ['', '', '', '', ''],
        attempts : [],
        solution : setWord(),
        solutionLetters : {},
        wins : 0,
        losses : 0,
        winDistribution : [0, 0, 0, 0, 0, 0],
        winStreak : 0,
        maxStreak : 0 ,
        matches : 0,
        won : false
    }

    localStorage.setItem('game-data', JSON.stringify(data))

    contLettersSolution();
}

document.body.addEventListener('keyup', (event)=>{

    let data = JSON.parse(localStorage.getItem('game-data'));
    
    if(event.key.charCodeAt(0) >= 97 && event.key.charCodeAt(0) <= 122){

        addLetter(event.key);

    }else if(event.key === "Backspace"){

        delLetter();

    }else if(event.key === "Enter"){

        validWord();

        if($('#result').is(':visible')) restartGame();

    }
    // else if(event.key === "ArrowLeft"){
    //     if(col > 1) selectBox(`${data.row}-${parseInt(col) - 1}`)
        

    // }else if(event.key === "ArrowRight"){
    //     if(col < 5) selectBox(`${data.row}-${parseInt(col) + 1}`)
    // }
})

function addLetter(letra){

    let data = JSON.parse(localStorage.getItem('game-data'));

    if(data.word.includes('') && !data.won){

        document.getElementById(`${data.row}-${col}`).innerHTML = letra.toUpperCase();
        document.getElementById(`${data.row}-${col}`).setAttribute("value", letra);
        
        data.word.splice(col - 1, 1, letra.toLowerCase());

        selectBox(`${data.row}-${parseInt(col) + 1}`);
        
        localStorage.setItem('game-data', JSON.stringify(data));
    }

    boxes.forEach(box => {
        box.classList.remove('invalid')
    })

    func = false;
}

function delLetter(){

    let data = JSON.parse(localStorage.getItem('game-data'));

    if(data.word.some(item => item != '' ? true : false)){

        if(func){
            selectBox(`${data.row}-${col}`);
        }else{
            selectBox(`${data.row}-${parseInt(col) - 1}`);
        }
        
        document.getElementById(`${data.row}-${col}`).innerHTML = '';
        data.word.splice(col - 1, 1, '');
        
        localStorage.setItem('game-data', JSON.stringify(data));
    }
    
    boxes.forEach(box => {
        box.classList.remove('invalid')
    })

    func = false;
}

function validWord(){
    
    let data = JSON.parse(localStorage.getItem('game-data'));
    
    if(data.word.length == 5 && wordIn(data.word.join(''))){ //verifica se o tamanho da palavra é 5 e se ela é válida
        
        data.attempts.push(data.word);
        const solution = data.solution.split('');
        const word = data.word;
        
        data.word.forEach((letter, index) =>{ ; //verifica e coloca as cores
        
            const indexOf = solution.indexOf(letter);
            

            if(letter == data.solution.charAt(index)){
                
                document.getElementById(`${data.row}-${index + 1}`).classList.add('right');
                document.getElementById(`key-${letter}`).classList.add('right');
                document.getElementById(`key-${letter}`).classList.remove('wrong-place');
                
                boxes.forEach(box =>{
                    const indexOf = word.indexOf(letter);

                    if(box.getAttribute("value") == letter && box.classList.contains('wrong-place') && contLetters(letter, word) >  data.solutionLetters[letter]){
                        box.classList.remove('wrong-place');

                        if(indexOf > -1) word.splice(indexOf, 1, '');
                    }
                })
                
            }else if(solution.includes(letter)){
                
                document.getElementById(`${data.row}-${index + 1}`).classList.add('wrong-place');
                document.getElementById(`key-${letter}`).classList.add('wrong-place');     
                
            }else if(!data.solution.includes(letter)){
                document.getElementById(`key-${letter}`).classList.add('wrong');
            }

            if(indexOf > -1) solution.splice(indexOf, 1, '');
            
        })
        
        if(data.word.join('') == data.solution){ //case win
            
            data.won = true;
            document.getElementById('result-message').innerHTML = 'Parabéns, você acertou! :)';

            boxes.forEach(box =>{
                box.classList.remove('highlight');
                box.classList.remove('invalid');
                box.classList.remove('selected');
            })
            
            setTimeout(() => openResultModal(), 500)
            
        }else if(data.row >= 6){ //case lost
            
            document.getElementById('result-message').innerHTML = 'Não foi dessa vez :(';
            document.getElementById('message').innerHTML = 'A palavra era: ' + data.solution;

            boxes.forEach(box =>{
                box.classList.remove('highlight');
                box.classList.remove('invalid');
                box.classList.remove('selected');
            })

            setTimeout(() => openResultModal(), 500);

        }else{
            data.row++;
            col = 1;
            data.word = ['', '', '', '', ''];
            
            boxes.forEach(box =>{
                box.classList.remove('highlight');
                box.classList.remove('invalid');
                box.classList.remove('selected');
            })
            
            boxes = document.querySelectorAll(`.letra-${data.row}`);
            
            boxes[0].classList.add('selected')
            boxes.forEach(box =>{
                box.classList.add('highlight')
            })
        }
        
        localStorage.setItem('game-data', JSON.stringify(data));

    }else{
        boxes.forEach(box =>{
            box.classList.add('invalid');
        })
        
        return false;
    } 
}

function selectBox(id){
    boxes.forEach(box =>{
        box.classList.remove('selected');
    })

    func = true;

    col = id.charAt(2);

    if(col <= 5) document.getElementById(id).classList.add('selected');
}

function setWord(){
    let pos = Math.floor(Math.random() * palavras.length);
    let word = palavras[pos];

    let regexWord = /[\u00C0-\u00FF ]+/i;

    if(regexWord.test(word) || word.length != 5){
        setWord();

    }else{
        return word;
    }
}

function wordIn(word){

    if(palavrasBase.includes(word) ){
        return true;

    }   
}

function contLettersSolution(){
    let data = JSON.parse(localStorage.getItem('game-data'));
    
    for(let letter of data.solution) {
        data.solutionLetters[letter] = 0;
    }

    for(letter of data.solution){
        data.solutionLetters[letter]++;
    }

    localStorage.setItem('game-data', JSON.stringify(data));
}

function contLetters(letter, array){
    let cont = 0;

    for(let l of array){
        if(letter == l){
            cont++;
        }
    }

    return cont;
}

function restartGame(){

    let data = JSON.parse(localStorage.getItem('game-data'));
    
    if(data.won == true){
        data.wins++;
        data.winStreak++;
        if(data.winStreak > data.maxStreak){
            data.maxStreak = data.winStreak;
        }
        data.winDistribution[data.row - 1]++;
    }else{
        data.losses++;
        data.winStreak = 0;
    }
    data.row = 1;
    data.word = ['', '', '', '', ''];
    data.attempts = [];
    data.solution = setWord();
    data.won = false;
    data.matches++;
    // Object.keys(data.solutionLetters).forEach(key =>{data.solutionLetters[key] = 0});
    data.solutionLetters = {};

    localStorage.setItem('game-data', JSON.stringify(data));

    contLettersSolution();
    location.reload();
}

function openModal(id){
    $(id).modal({show: true});
}

function openResultModal(){
    $('#result').modal({show: true, backdrop: 'static', keyboard: false})  
    
}

function graphic(){

    const gameBoard = document.getElementById('graphic');
    let data = JSON.parse(localStorage.getItem('game-data'));
    
    for(let i = 0; i <= 5; i++){
        let bar = document.createElement('div');

        bar.classList.add('graphic-bar');
        bar.style.width = `${(data.winDistribution[i]/data.wins) * 100}%`;
        bar.innerHTML = data.winDistribution[i];

        gameBoard.appendChild(bar);
    }

    document.getElementById('matches').innerHTML = data.matches
    document.getElementById('winRate').innerHTML = `${Math.floor(data.wins/data.matches * 100)}%`
    document.getElementById('winStreak').innerHTML = data.winStreak
    document.getElementById('maxStreak').innerHTML = data.maxStreak

}