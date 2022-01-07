import React, {Component} from "react";
import Snake from "./Snake";
import Food from "./Food";
import {findByLabelText} from "@testing-library/react";
import FormWithName from "./Form";

let typeFood;
let apple = new Object();
apple.score=1;
apple.color="green";
let carrot =new Object();
carrot.score=5;
carrot.color="orange";
let mouse =new Object();
mouse.score=10;
mouse.color="gray";

let arr = [apple, carrot, mouse]; //food types;
const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

export const getRandomFoodType = () => {
  typeFood = arr[Math.floor(Math.random() * arr.length)];
  console.log(typeFood.score);
  console.log(typeFood.color);
  return typeFood;
}

const initialState = {
  food: getRandomCoordinates(),
  foodType: getRandomFoodType(),
  score: 0,
  speed: 200,
  direction: 'RIGHT',
  snakeDots: [
    [0,0],
    [2,0]
  ]
}

class App extends Component {
  state = initialState;
  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  onKeyDown = (e) => {
    e = e || Event;
    switch (e.keyCode) {
      case 38:
        // if(this.state.direction == 'DOWN')
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length -1];

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2,head[1]];
        break;
      case 'LEFT':
        head = [head[0]-2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    })
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0]>= 100 || head[1]>=100 || head[0]<0 || head[1]<0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop(); //remove from end;
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    let score = this.state.score;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState({score: score+typeFood.score})
      this.setState({
        food: getRandomCoordinates(),
        foodType: getRandomFoodType(),
      })
      this.enlargeSnake();
      this.increaseSpeed();
      // setInterval(this.moveSnake, this.state.speed);
      console.log(this.state.speed);
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  // increaseSpeed (speed) {
  //     speed = speed - 10 *(speed > 10)
  // }
  increaseSpeed() {
    if (this.state.score >= 10) {
      let wholePartScore=Math.floor(this.state.score/10);
      let snakeSpeed = this.state.speed;
      this.setState({
        speed: snakeSpeed - 10*(snakeSpeed>10)*wholePartScore
      })
    }
  }

  onGameOver() {
    alert(`Game Over. Snake length is ${this.state.snakeDots.length}`);
    this.setState(initialState)
  }

  render() {
    return (
        <div>
          <FormWithName/>
          <div className="info">Counting points: {this.state.score}</div>
          {/*<div className="button">*/}
          {/*    <button>STOP</button>*/}
          {/*    <button>PLAY</button>*/}
          {/*</div>*/}
          <div className="game-area">
            <Snake snakeDots={this.state.snakeDots}/>
            <Food dot={this.state.food} color={typeFood.color}/>
          </div>
        </div>
    );
  }
}

export default App;
