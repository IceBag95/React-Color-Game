import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [welcomeScreen, setWelcomeScreen] = useState(true) //fortwnetai MONO tin prwti fora, i sto refresh
  const currentColor = HexColor()
  const [myColor, setMyColor] = useState(`#${currentColor}`)
  const [answers, setAnswers] = useState(Shuffle(createAnswers(currentColor)))
  const [answerNames, setAnswerNames] = useState(fetchData());
  const [allAnswers, setallAnswers] = useState([]) //array of bool
  const [gameOver, setGameOver] = useState(false) // na ftiaxnei to telos gia na deixnei to score
  const [score, setScore] = useState(0)




  
  function RandomHexValueInStr(){
    

    const myNumberInt = Math.floor(Math.random()*15)

    let myNumberStr;

    switch (myNumberInt){
      case 10:
        myNumberStr = 'a'
        break
      case 11:
        myNumberStr = 'b'
        break
      case 12:
        myNumberStr = 'c'
        break
      case 13:
        myNumberStr = 'd'
        break
      case 14:
        myNumberStr = 'e'
        break
      case 15:
        myNumberStr = 'f'
        break
      default:
        myNumberStr = myNumberInt                     
    }


    return myNumberStr
  }

  function HexColor(){

    //6 τιμές για color + #
    let hexColorStr = ''
    for(let i=0; i<6; i++){
      hexColorStr += RandomHexValueInStr()
      
    }

    console.log(hexColorStr)
    return hexColorStr
  }

  function Shuffle(array){
    for (let i = array.length -1 ; i>0; i--){
      let randomIndex = Math.floor(Math.random() * array.length)
      let temp = array[i] 
      array[i] = array[randomIndex]
      array[randomIndex] = temp
    }

    return array;
  }


  function createAnswers(color){
    let wrongAnswer1, wrongAnswer2;
    let strArray = color.split('')
    
    while (true){
      const strArrayShuffled = Shuffle(strArray)
      if (strArrayShuffled.join('') !== color){
        wrongAnswer1 = strArrayShuffled.join('')
        break;
      }
    }

    while (true){
      const strArrayShuffled = Shuffle(strArray)
      if (strArrayShuffled.join('') !== wrongAnswer1 && strArrayShuffled.join('') !== color){
        wrongAnswer2 = strArrayShuffled.join('')
        break;
      }
    }

    return [`#${color}`,`#${wrongAnswer1}`,`#${wrongAnswer2}`]

  }
  
  
  useEffect(() => {
    
    const fetchAndSetAnswerNames = async () => {
      const fetchedData = await fetchData();
      setAnswerNames(f => [...fetchedData]);
    };
  
    fetchAndSetAnswerNames();



  },[answers])



  async function fetchData(){

    const A = []

    for (let i = 0; i < answers.length; i++){
      const item = answers[i]
      let response = await fetch(`https://www.thecolorapi.com/id?hex=${item.slice(1)}`)
      let data = await response.json()
  
      A.push(data.name.value)    

    }

    return A
  } 

      
      


  function onButtonClick(event){
    const ans = event.target.value
    const idx = answerNames.indexOf(ans)
    const updatedAllAnswers = [...allAnswers, (answers[idx]===myColor)]
    if ((answers[idx]===myColor)){
      setScore(s => s + 1)
    }
    setallAnswers(updatedAllAnswers) // theloume na deixnoume to score
    if (updatedAllAnswers.length < 10){
      const new_color = HexColor()
      //console.log(new_color)
      setMyColor(`#${new_color}`)
      setAnswers(Shuffle(createAnswers(new_color)));
    }
    else{
      setGameOver(g => !g )
    }
    
      
  }

  function RestartGame(){
    const currentColor = HexColor()
    setMyColor(`#${currentColor}`)
    setAnswers(Shuffle(createAnswers(currentColor)))
    setallAnswers([])
    setGameOver(false)
    setScore(0)
  }


  
  
  return(
    <div id='app-container'>
      <h1 id='app-title'>Guess The Color's Hex Value</h1>
      {welcomeScreen ? 
        <div id='welcome-screen'>
          <input  className='buttons'
                  type="button" 
                  value='Start Game'
                  onClick={() => setWelcomeScreen(w => !w)}/>
        </div>
      : !gameOver ? 
        (<div id='game-container'>
            <div  id='color-preview'
                    style={{backgroundColor: myColor}}>
                      {
                        //myColor
                      }
            </div>
            <div id='choice-container'>
              {
                answerNames.map((ans, index) => {
                                              return <input type='button'
                                                            value={ans}
                                                            key={index}
                                                            className='choices' 
                                                            id={`choice_${index}`}
                                                            onClick={(e) => onButtonClick(e)}/>
                                            })
              }
            </div>

            <input  className='choices'
                    id='pass-button'
                    type='button'
                    value='Pass'
                    onClick={(e) => onButtonClick(e)}/>
        </div>)
        :
        (<div id='game-over-container'>
          <h1>{score}/{allAnswers.length}</h1>
          <input  className='buttons'
                  type="button" 
                  value={'Start Over'}
                  onClick={RestartGame}/>
        </div>)

      }  

    </div>
  )
}

export default App
