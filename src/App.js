import './App.css';
import { useState } from 'react'
import quiz_data from './quiz.json'
import Button from 'react-bootstrap/Button'

function App() {

  const [showStart, setShowStart] = useState(true)
  const [inProgress, setInProgress] = useState(false)

  const StartButton = () => { 
    return (<Button onClick={startButtonClick}>
      Start quiz!
    </Button>)
  }

  const startButtonClick = () => {
      setShowStart(false)
      setInProgress(true)
  }

  // starting code from: https://www.codevertiser.com/quiz-app-using-reactjs/
  const Quiz = () => {

    const disabledQuestionArray = Array(quiz_data.length).fill(false)

    const answerArray = {}

    // get response state for each response element
   quiz_data.map((entry, i) => {
      answerArray[entry['questionId']] = Array(entry['answers'].length).fill("primary")
    });

    const [completedQuestionsCount, setCompletedQuestionsCount] = useState(0)
    const [correctQuestionsCount, setCorrectQuestionsCount] = useState(0)
    const [incorrectQuestionsCount, setIncorrectQuestionsCount] = useState(0)
    const [completedQuestions, setCompletedQuestions] = useState(disabledQuestionArray)
    const [responseState, setResponseState] = useState(answerArray)  

    const answerButtonClick = (answer, entry, index, index2) => {
      setCompletedQuestionsCount((prev) => prev + 1)
      // disable all the questions in the group after one is clicked
      const allQuestions = completedQuestions.map((disabled, i) => {
        if (i === index) {
          // disable this question's buttons
          return true;
        } else {
          // the rest haven't changed
          return disabled;
        }
      });

      setCompletedQuestions(allQuestions);
      const newThisQuestion = [...responseState[entry['questionId']]]
      
      if (entry['correctAnswer'].includes(answer['answer'])) {
        setCorrectQuestionsCount((prev) => prev + 1)
        newThisQuestion.splice(index2, 1, 'success')
      } else {
        setIncorrectQuestionsCount((prev) => prev + 1)
        newThisQuestion.splice(index2, 1, 'danger')
      }
      const newResponseState = {...responseState, [entry['questionId']]: newThisQuestion}
      setResponseState(newResponseState)
    }

    const FinalDisplay = () => {
      return(      
      <div>
        Completed questions: {completedQuestionsCount} <br/>
        Correct questions: {correctQuestionsCount} <br/>
        Incorrect questions: {incorrectQuestionsCount} <br/>
      </div>
    )
    }

    return (
      <div className="quiz-container">
      
        {quiz_data.map((entry, index) => (
          <div>
            <h2>{entry['question']}</h2>
            

              <div>
                {'image_id' in entry &&
                  <div>
                    <img 
                      src={require('./images/' + entry['image_id'] + '.jpg')}
                      width="200">
                    </img>
                    <br/>
                    <br/>
                  </div>
                }
                <div class='btn-group-vertical'>
                  {entry['answers'].map((answer, index2) => (
                    <Button 
                    onClick={() => answerButtonClick({answer}, {...entry}, index, index2)} 
                    disabled={completedQuestions[index]}
                    variant={responseState[entry['questionId']][index2]}
                    >
                      {answer}
                    </Button>
                  
                )
              )}
            </div>
            </div>


          </div>
        )
        )}

      {completedQuestionsCount == quiz_data.length && <FinalDisplay/>}
      </div>  

    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Chicago News Quiz 2024
        </p>
      </header>
      <h1>
        How closely did you follow local news in 2024?
      </h1>

      {showStart && <StartButton/>}
      {inProgress && <Quiz/>}

    </div>
  );
}

export default App;
