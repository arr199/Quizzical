
export const HomePage = ({ startQuizz  }) => {

    return(
        <section className="intro-section">
            <h1>Quizzical</h1>
            <p>Are you ready for a Trivia</p>
            <button 
            onClick={ () => startQuizz()} 
            className="start-btn">Start quiz</button>
       </section>

         )
}