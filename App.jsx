import { useState, useEffect } from "react"
import './style.css'
import { nanoid } from "nanoid"
import { Questions } from "./Components/Questions"
import { shuffleArray } from "./Utils/shuffleArray"
import { HomePage } from "./Components/HomePage"
import { getQuestions } from "./Utils/getQuestions"

function useQuestions()
{
  const [questions, setQuestions] = useState([])       // THE WHOLE ARRAY FROM THE API
  const [answers , setAnswers] = useState()            // AN ARRAY OF OBJECT  WITH 4 PROPERTIES ({answer,isSelected,isCorrect,id})
  const [endQuizz,setEndQuizz] = useState(false)   
  
  useEffect(() => {
    if (!questions) return
    //CREATING AN ARRAY WITH THE INCORRECT AND CORRECT ANSWERS ALLTOGETHER
    const answersArray = questions.map( (e) => [...e.incorrect_answers,e.correct_answer])
    // CREATING AN ARRAY  OF THE CORRECT ANSWERS (WILL USE IT TO CREATE AN OBJECT PROPERTY BELOW)
    const correctAnswerList = questions.map(e => e.correct_answer)                            
    //SHUFFLING THE ARRAY
    const newShuffleArray =  answersArray.map( (e) =>  shuffleArray([...e]))
    //CHANGING EVERY ELEMENT OF THE ANSWERS TO AN OBJECT WITH 3 PROPERTIES
      const newArray = newShuffleArray.map( ( e,index ) => {
          return  e = e.map((i) => {
            return   {
                answers:i,
                isSelected:false,
                isCorrect:correctAnswerList.includes(i),                                 ///HERE
                id:nanoid(),
                
            }})
    })
    //MY NEW OBJECT ARRAY
    setAnswers(newArray)

},[questions])

  return   {answers ,setAnswers , questions, setQuestions , endQuizz ,setEndQuizz}
}


export default  function App (){
   
  const [startQuizz,setStartQuizz ] = useState(false)              
             // A STATE TO DETERMINE WHEN THE QUIZZ END
  const {answers ,setAnswers , questions, setQuestions , endQuizz ,setEndQuizz } = useQuestions()
  const [correctAnswerCount , setCorrectAnswerCount] = useState(0) // COUNT THE NUMBER OF CORRECT ANSWER PER QUIZZ, NOT TOTAL
  


    //GETTING THE DATA FROM THE API 
  useEffect( () => {
      if (endQuizz) return
      getQuestions().then(setQuestions)

  } , [endQuizz])
   
  // GETTING THE ANSWER THAT I CLICK ON
  function handleSelectAnswer(e,answerIndex,index){
      if (endQuizz) return
      const newAnswer = [...answers]
      
      newAnswer[answerIndex].map( (e) => {
        if (newAnswer[answerIndex][index].answers === e.answers){
          //SETTING IS-SELECTED TO TRUTH WHEN CLICK ON THE ANSWER
           e.isSelected = !e.isSelected
        }
        // SETTING THE REST OF THE ANSWER IS-SELECTED TO FALSE
        else {
           e.isSelected = false
       
        }})
           
        setAnswers(newAnswer)
    }
    // HANDLE CHECK-ANSWERS BUTTON
  function checkAnswers () {
       // COUNT THE CORRECT ANSWER SELECTED TO DISPLAY AT THE END
        answers.forEach(e  =>  e.forEach( i => i.isSelected && i.isCorrect && setCorrectAnswerCount(e => e+1) ))
        // IF THERE IS AT LEAST 1 ANSWER SELECTED IN EVERY QUESTION WE CAN END THE QUIZZ
        if (answers.every( e => e.some(  i =>  i.isSelected)) && !endQuizz)
        {
          setEndQuizz(!endQuizz)
        }
        else if (endQuizz)
        {
            setEndQuizz(!endQuizz)
            setCorrectAnswerCount(0)
        }
   }
   //////// RENDERING HERE ////////////
  return(
        <main>
            {!startQuizz &&
              <HomePage
              startQuizz={ () => setStartQuizz(true)} 
              />
            }
           
            {startQuizz && 
            //ONCE WE CLICK THE START BTN WE RENDER THE QUIZZ BELOW
           <section className="main-section">
                {questions.map( (e,index) => 
                <Questions 
                questions={questions}
                answers={answers}
                endGame={endQuizz}
                index={index}
                key={index}
                handleSelectAnswer={handleSelectAnswer}
                />
               
            ) }
                <button  
                onClick={checkAnswers} 
                className="check-answers-btn start-btn">{endQuizz ?"Play again" : "Check Answers"  }
                </button>
                
                {endQuizz && <p className="correct-answer">You scored {correctAnswerCount}/{questions.length} correct answers </p>   }
            </section>
            }
        </main>
        )
}  