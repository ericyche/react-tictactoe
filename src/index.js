import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Header() {
  return (
    <h1 className="header">Tic Tac Toe</h1>
  );
}

function Square(props) {
  let className = "square";
  if (props.value === "X") {
    className = "square xChar"
  } else if (props.value === "O") {
    className = "square oChar"
  } else if (props.status) {
    className = "square oTurn";
  } else {
    className = "square xTurn";
  }

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    console.log(this.props.x)
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        status={this.props.status}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let className = "button"
      if (winner) {
        if (winner == "X") {
          className += " buttonX"
        } else {
          className += " buttonO"
        }
      }
      else if (move > 0) {
        className += move % 2 == 0 ? " buttonO" : " buttonX";
      }
      const desc = move ? "Go to move #" + move : "Go to game state";
      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let resultClassName = "result"
    if (this.state.stepNumber == 9 && !winner) {
      status = "Result: Tie"
      resultClassName = "resultTie"
    } else if (winner) {
      status = "Winner : " + winner;
      if (winner == "X") {
        resultClassName = "resultXWin"
      } else {
        resultClassName = "resultOWin"
      }
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <Header />
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            status={this.state.xIsNext}
          />
        </div>

        <div className="game-info">
          <div className={resultClassName}><h2>{status}</h2></div>
          <div className="moves">{moves}</div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
