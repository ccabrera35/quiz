import React, { Component, Fragment } from 'react';
import './App.css';
import quizQuestions from './api/quizQuestions';
import Result from './components/Result';
import Quiz from './components/Quiz';
import background from './api/Background';
import RetryButton from './components/Button';

class App extends Component {
  state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        Iceland: 0,
        Belize: 0,
        NYC: 0,
        Fiji: 0,
        Brazil: 0
      },
      result: '',
      image: '' 
    };

  componentDidMount() {
    const shuffledAnswerOptions = quizQuestions.map((question) => this.shuffleArray(question.answers));

    background('beach').then(data => {
      console.log(data)
      this.setState({ 
        image: data[Math.floor(Math.random() * data.length)]
      }) 
    })

    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }
  
  shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // Remaining elements 
    while (0 !== currentIndex) {
  
      // Random element is picked from the remaining elements
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      //  Random and current values are swapped
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  };

  setUserAnswer(answer) {
    this.setState((state) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: state.answersCount[answer] + 1
      },
      answer: answer
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: ''
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);
  
    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }

  setResults (result) {
    if (result.length === 1) {
      this.setState({ result: result[0]
       });
    } else {
      this.setState({ result: 'Undetermined' });
    }
    console.log(this.state.result)
    background(`${this.state.result}`).then(data => {
      this.setState({
        image: data[Math.floor(Math.random() * data.length)]
        })
      });  
  }

  handleAnswerSelected = (event) => {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
      }
  }

  reloadQuizHandler() {
    window.location.reload() 
  }

  renderQuiz() {
    return (
      <Fragment>
        <div className="App-header">What's your next vacation spot?</div>
        <Quiz
          answer={this.state.answer}
          answerOptions={this.state.answerOptions}
          counter={this.state.counter}
          questionId={this.state.questionId}
          question={this.state.question}
          questionTotal={quizQuestions.length}
          onAnswerSelected={this.handleAnswerSelected}
        />
      </Fragment>
    );
  }
  
  renderResult() {
    return (
      <Fragment>
          <Result quizResult={this.state.result} />
          <RetryButton reload={this.reloadQuizHandler} />
      </Fragment>  
    );  
  }
  
  render() { 
      document.body.style.backgroundImage = `url(${this.state.image})`;

      return (
        <Fragment>
        <div className="App">
        <div className="App-body">
        {!this.state.result ? this.renderQuiz() : this.renderResult()}
        </div>
        </div>
        </Fragment>
      )
  }
}


export default App;