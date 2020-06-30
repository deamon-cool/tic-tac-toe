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
                key={`square ${i}`}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)} />
        );
    }

    render() {
        let board = [];
        let squares = [];

        for (let i = 0; i < 9; i++) {
            squares.push(this.renderSquare(i));

            if (i % 3 === 2) {
                board.push(<div key={`row${i}`} className='board-row'>{squares}</div>);
                squares = [];
            }
        }

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            movements: [''],
            stepNumber: 0,
            xIsNext: true,
            boldedText: [''],
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,
            this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        let movements = this.state.movements.slice(0,
            this.state.stepNumber + 1);
        const row = (i / 3).toString().split('.')[0];
        const col = (i % 3).toString();
        const move = `${this.state.xIsNext ? 'X' : 'O'}: ${row}, ${col}`;
        movements.push(move);

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let boldedText = Array(history.length).fill(['']);

        this.setState({
            history: history.concat({
                squares: squares,
            }),
            movements: movements,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            boldedText: boldedText
        });
    }

    jumpTo(step) {
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
        const movements = this.state.movements;

        const historyMoves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            const moves = movements.slice(0, move + 1).map(movement => {
                return <div key={movement}>{movement}</div>;
            });

            return (
                <li key={move}>
                    <button className={this.state.boldedText[move]} onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                    <div className='movements'>
                        {moves}
                    </div>
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
                    <button onClick={() => this.handleSort}>Ascending/Descending order</button>
                    <div>{historyMoves}</div>
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