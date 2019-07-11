import React, { useState, useEffect } from 'react';
import './App.css';
import quizQuestions from './api/quizQuestions';
import Result from './components/Result';
import Quiz from './components/Quiz';
import background from './api/Background';
import RetryButton from './components/Button';

const App = props => {
  const [counter, setCounter] = useState(0);
  const [questionId, setQuestionId] = useState(1);
  const [question, setQuestion] = useState('');
  const [answerOptions, setAnswerOptions] =  useState([]);
  const [answer, setAnswer] = useState('');
  const [answersCount, setAnswersCount] = useState({
      Iceland: 0,
      Belize: 0,
      NYC: 0,
      Fiji: 0,
      Brazil: 0 });
  const [result, setResult] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const shuffledAnswerOptions = quizQuestions.map((question) => shuffleArray(question.answers));

    background('beach').then(data => {
      setImage(data[Math.floor(Math.random() * data.length)])
    });
      setQuestion(quizQuestions[0].question);
      setAnswerOptions(shuffledAnswerOptions[0]);
  }, []);
  
  const shuffleArray = array => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  const setUserAnswer = answer => {
    setAnswersCount({
      ...answersCount,
      [answer]: answersCount[answer] + 1
    });
    setAnswer(answer);
  }

  const setNextQuestion = () => {
    const count = counter + 1;
    const id = questionId + 1;
    setCounter(count);
    setQuestionId(id);
    setQuestion(quizQuestions[count].question);
    setAnswerOptions(quizQuestions[count].answers);
    setAnswer('');
  }

  const getResults = () => {
    const answersCounter = answersCount;
    const answersCountKeys = Object.keys(answersCounter);
    const answersCountValues = answersCountKeys.map((key) => answersCounter[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);
  
    return answersCountKeys.filter((key) => answersCounter[key] === maxAnswerCount);
  }

 const setResults = result => {
    if (result.length === 1) {
      result = result[0];
    } else {
      result = 'Undetermined';
    }
    setResult(result);
    background(`${result}`).then(data => {
        setImage(data[Math.floor(Math.random() * data.length)])
      });  
  }

  const handleAnswerSelected = event => {
    setUserAnswer(event.currentTarget.value);
    if (questionId < quizQuestions.length) {
        setTimeout(() => setNextQuestion(), 300);
      } else {
        setTimeout(() => setResults(getResults()), 300);
      }
  }

  const reloadQuizHandler = () => {
    window.location.reload() 
  }

  const renderQuiz = () => {
    return (
      <React.Fragment>
        <div className="App-header">What's your next vacation spot?</div>
        <Quiz
          answer={answer}
          answerOptions={answerOptions}
          counter={counter}
          questionId={questionId}
          question={question}
          questionTotal={quizQuestions.length}
          onAnswerSelected={handleAnswerSelected}
        />
      </React.Fragment>
    );
  }
  
  const renderResult = () => {
    return (
      <React.Fragment>
          <Result quizResult={result} />
          <RetryButton reload={reloadQuizHandler} />
      </React.Fragment>  
    );  
  }
  
  document.body.style.backgroundImage = `url(${image})`;

  return (
    <React.Fragment>
        <div className="App">
            <div className="App-body">
            {!result ? renderQuiz() : renderResult()}
            </div>
        </div>
    </React.Fragment>
  )
}


export default App;