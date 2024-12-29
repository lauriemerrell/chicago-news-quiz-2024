import './App.css';
import { useState } from 'react'
import quiz_data from './quiz_data.json'
import Button from 'react-bootstrap/Button'

function App() {

  const [showStart, setShowStart] = useState(true)
  const [inProgress, setInProgress] = useState(false)

  const StartPage = () => {
    return (
      // center vertically: https://stackoverflow.com/questions/52284288/how-to-vertically-and-horizontally-center-a-component-in-react
      <div style={{
        position: 'fixed', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)', 
        'overflow-y': 'scroll'
    }}>
      <div><h1>How closely did you follow Chicago local news in 2024?</h1></div>
      <div><p>Test your knowledge with this 20 question quiz!</p></div>
      <div><StartButton/></div>
      <div style={{'paddingTop': '10%'}}>
        <p>Created by Laurie Merrell</p>
        <p>Accurate as of December 29, 2024</p>
        <p><a href="https://bsky.app/profile/laurie-merrell.bsky.social">Follow me on Bluesky</a> / <a href="https://github.com/lauriemerrell/chicago-news-quiz-2024">See the code on GitHub</a></p>
      </div>
      </div>
    )
  }

  const StartButton = () => { 
    return (<Button onClick={startButtonClick} size="lg">
      Start quiz
    </Button>)
  }

  const startButtonClick = () => {
      setShowStart(false)
      setInProgress(true)
  }

  // starting code from: https://www.codevertiser.com/quiz-app-using-reactjs/
  const Quiz = () => {

    // use this to disable questions once they're completed
    // really this should be a component state thing but oh well
    const disabledQuestionArray = Array(quiz_data.length).fill(false)

    // use this to show question correct state once they're completed
    // really this should also be a component state thing but oh well
    const questionEmojiArray = Array(quiz_data.length).fill('')

    // use this to track individual response button states
    // really this should also be a component state thing but oh well
    const answerArray = {}
    quiz_data.map((entry, i) => {
      answerArray[entry['questionId']] = Array(entry['answers'].length).fill("outline-primary")
     });
    
    // initialize quiz state 
    const [completedQuestionsCount, setCompletedQuestionsCount] = useState(0)
    const [correctQuestionsCount, setCorrectQuestionsCount] = useState(0)
    const [incorrectQuestionsCount, setIncorrectQuestionsCount] = useState(0)
    const [completedQuestions, setCompletedQuestions] = useState(disabledQuestionArray)
    const [responseState, setResponseState] = useState(answerArray)  
    const [questionEmojis, setQuestionEmojis] = useState(questionEmojiArray)
    
    // what happens when you click a response button
    const answerButtonClick = (answer, entry, index, index2) => {
      setCompletedQuestionsCount((prev) => prev + 1)

      // disable all the questions in the group after one is clicked
      const newCompletedQuestionState = [...completedQuestions]
      newCompletedQuestionState.splice(index, 1, true)
      setCompletedQuestions(newCompletedQuestionState)

      // track whether the clicked button was correct so it can turn red or green
      // and also update the question emoji
      const newThisQuestion = [...responseState[entry['questionId']]]
      const newEmojiArray = [...questionEmojis]
      
      // check if answer was correct and increment counters & change button state accordingly
      if (entry['correctAnswer'].includes(answer['answer'])) {
        setCorrectQuestionsCount((prev) => prev + 1)
        newEmojiArray.splice(index, 1, '✅')
        newThisQuestion.splice(index2, 1, 'success')
      } else {
        setIncorrectQuestionsCount((prev) => prev + 1)
        newEmojiArray.splice(index, 1, '❌')
        newThisQuestion.splice(index2, 1, 'danger')
      }
      const newResponseState = {...responseState, [entry['questionId']]: newThisQuestion}
      setResponseState(newResponseState)
      setQuestionEmojis(newEmojiArray)
    }
    
    // results display
    const FinalDisplay = () => {
      return(      
      <div>
        <h2 style={{'paddingTop': '20px'}}>Your results:</h2>
        <strong>You got {correctQuestionsCount} questions correct for a score of {Math.round(correctQuestionsCount / completedQuestionsCount * 100)}% on the Chicago local news quiz 2024!</strong> <br/>
        {/* https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react  */}
        {/* really this should pass a showStart state back up but I am not going to figure that out right now */}
        <div style={{'paddingTop': '20px'}}><Button onClick={() => window.location.reload(false)}>Click here to start over</Button></div>
      </div>
    )
    }

    return (
      <div className="Quiz">
      
        {quiz_data.map((entry, index) => (
          <div>
            <p style={{'paddingTop': '20px'}}><strong>{questionEmojis[index]} {entry['question']}</strong></p>
            

              <div>
                {'image_id' in entry &&
                  <div>
                    <img 
                      src={require('./images/' + entry['image_id'] + '.jpg')}
                      alt={entry['alt']}
                      height="150" width="auto">
                    </img>
                    <br/>
                    <br/>
                  </div>
                }
                <div className='btn-group-vertical'>
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
        <p> Chicago Local News Quiz 2024 </p>
      </header>

      {showStart && <StartPage/>}
      {inProgress && <Quiz/>}

    </div>
    
  );
}

export default App;
