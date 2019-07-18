import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
      return (
        <button 
          className="square" 
          style={{backgroundColor:props.bgColor}}
          onClick = {props.onClick}
        >
          {props.value}
        </button>
      );
}
  
  class Board extends React.Component {

    renderSquare(i) {
      //if the rendering square is one of the winning squares, set the background color to be yellow
      let bgColor = "white";
      if(this.props.winBoxes.includes(i)){
        bgColor = "yellow";
      };

      return (<Square 
      value={this.props.squares[i]}
      bgColor={bgColor}
      onClick={()=> this.props.onClick(i)}
      key={i}
      />);
    }

    //generating 9 squares in two loops
    generateBoard () {
      let table = [];
      let index = 0;
    
      for(let i=0; i<3; i++){
        let row = [];
        for(let j=0; j<3; j++){
          row.push(this.renderSquare(index));
          index++;
        };
        table.push(<div className="board-row">{row}</div>);
      }
      return table;
    }
  
    render() {
      return (
        <div>
            {this.generateBoard()}
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
        sortingOrder: true,
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

      if (calculateWinner(squares).winner || squares[i]){
        return;
      }

      newOrders.push(rowcolumn);
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        orders: newOrders,
        xIsNext: !this.state.xIsNext,
      });

    }

    jumpTo(step)  {
      this.setState({
        stepNumber: step,
        xIsNext: (step%2) === 0
      });
    }

    sorting(){
      this.setState({
        sortingOrder: !this.state.sortingOrder,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winnerInfo = calculateWinner(current.squares);
      const winner = winnerInfo.winner;
      const winBoxes = winnerInfo.winBoxes;
      const sortingOrder = this.state.sortingOrder;

      let moves = history.map((step, move) => {
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

      moves = sortingOrder ? moves : moves.reverse();

      const sort = <button onClick={() => this.sorting()}>Sorting</button>



      let status;
      if(winner){
        status = 'Winner' + winner;
      }else if(this.state.stepNumber===9){
        status = "Draw";
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} winBoxes={winBoxes} onClick ={(i) => this.handleClick(i)}/>
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
    let winnerInfo = {
      winner: null, 
      winBoxes: []
    };
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
        winnerInfo.winner = squares[a];
        winnerInfo.winBoxes = [a,b,c];
      }
    }
    return winnerInfo;
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