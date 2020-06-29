import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let root = document.querySelector('#root');

function Square(props) {
    return (
        <button className='square'
            onClick={() => { props.onClick() }}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)} />
        );
    }

    render() {
        return (
            <div>
                <div className='board-row'>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className='board-row'>
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
            history: [{
                squares: Array(9).fill(null),
                movements: { 0: [''] }
            }],
            stepNumber: 0,
            xIsNext: true,
            boldedText: ['']
        }
    }

    handleClick(i) {
        // console.log(this.state.history)

        const history = this.state.history.slice(0,
            this.state.stepNumber + 1);

        // console.log(history);




        // THIS IS INTERESTING

        const current = history[history.length - 1];

        console.log(current.squares.slice());
        // expected: [null, null, null, null, null, null, null, null, null]

        const squares = current.squares.slice();

        console.log(squares);
        // expected: [null, null, null, null, null, null, null, null, null],
        // SUPRISE :D [null, null, null, "X", null, null, null, null, null]




        // const movements = current.movements;



        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let boldedText = Array(history.length).fill(['']);

        this.setState({
            history: history.concat({
                squares: squares
            }),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            boldedText: boldedText
        });
    }

    jumpTo(e, step) {
        let boldedText = Array(this.state.history.length).fill(['']);
        boldedText[step] = 'text-bold';

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            boldedText: boldedText
        });


    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            return (
                <li key={move}>
                    <button className={this.state.boldedText[move]} onClick={e => this.jumpTo(e, move)}>
                        {desc}
                    </button>
                    {/* give each player with location of each move */}
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' +
                (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        squares={current.squares}
                        onClick={i => {
                            this.handleClick(i)
                        }} />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <div>{moves}</div>
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

        if (squares[a] && squares[a] === squares[b]
            && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(<Game />, root);