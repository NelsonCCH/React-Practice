import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
      return (
        <button 
          className="square" 
          onClick = {props.onClick}
        >
          {props.value}
        </button>
      );
}
  
  class Board extends React.Component {

    renderSquare(i) {
      return (<Square 
      value={this.props.squares[i]}
      onClick={()=> this.props.onClick(i)}
      key={i}
      />);
    }

    generateRow () {
      let table = [];
      let index = -1;
    
      for(let i=0; i<3; i++){
        let column = [];
        for(let j=0; j<3; j++){
          index++;
          column.push(this.renderSquare(index));
        };
        table.push(<div className="board-row">{column}</div>);
      }
      return table;
    }
  
    render() {
      return (
        <div>
            {this.generateRow()}
         </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber:0,
        orders: [],
        xIsNext: true
      }
   }

    handleClick(i){
      //history array starts with an empty board
      //while orders should start with nth, until first move is made, so there are +1 difference in handling the two
      const history = this.state.history.slice(0, this.state.stepNumber +1);
      const current = history[history.length -1];
      const squares = current.squares.slice();
      const rowcolumn = getRowColumn(i);
      const newOrders = this.state.orders.slice(0, this.state.stepNumber);
    
      console.log(i + "is clicked");

      if (calculateWinner(squares) || squares[i]){
        return;
      }

      newOrders.push(rowcolumn);
      console.log(newOrders);
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        orders: newOrders,
        xIsNext: !this.state.xIsNext,
        sortingDesc: true,
      });

      console.log(this.state.orders);
    }

    jumpTo(step)  {
      this.setState({
        stepNumber: step,
        xIsNext: (step%2) === 0
      });
    }

    sorting(){
      this.setState({
        sortingDesc: !this.sortingDesc,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const sortingDesc = this.state.sortingDesc;

      const moves = history.map((step, move) => {
        let desc = move ?
          'Go to move #' + move + ' (' + this.state.orders[move-1] +')':
          'Go to game start';
        desc = (move===this.state.stepNumber) ? <b>{desc}</b> : desc;
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}
            </button>
          </li>
        )
      });

      moves = sortingDesc ? moves : moves.reverse();

      const sort = <button onClick={() => this.sorting()}>Sorting</button>



      let status;
      if(winner){
        status = 'Winner' + winner;
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick ={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <div>{sort}</div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
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

  function getRowColumn(number){
    const getRowColumn = [
      [0,0],
      [0,1],
      [0,2],
      [1,0],
      [1,1],
      [1,2],
      [2,0],
      [2,1],
      [2,2],
    ]
    return getRowColumn[number];
  }