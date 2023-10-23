import { decode } from "html-entities"

export const Questions = ({ answers,questions ,index , handleSelectAnswer , endGame , ...rest}) => {
    
    return (
      <div className="container">
        <h4 className="quizz-question">{decode(questions[index].question)}</h4>
        <ul  style={{ pointerEvents: endGame  && "none" }} className="quizz-answers">
          {
            answers[index].map((e,innerIndex ) => <li 
            className={    !endGame &&  e.isSelected ? "answer selected"
                           :endGame &&  e.isCorrect ? "answer right-answer" 
                           :endGame &&  e.isSelected && !e.isCorrect ? "answer wrong-answer"
                           :"answer"
                      }  
                    
            onClick={() => handleSelectAnswer(e, index, innerIndex)} 
            key={e.id}>{decode(e.answers)}</li> )
            
          }
        </ul>
        <hr className="question-separator"></hr>
      </div>
    ) 
}