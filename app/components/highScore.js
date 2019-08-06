import React, { Component } from 'react';

class HighScore extends Component {
    constructor() {
        super();
        this.state = {
            scores: []
        };
    }

    componentDidMount() {
        this.ref =  this.props.firebase.database().ref('highscore');

        this.ref.on('value', snapshot => {

            const snap = snapshot.val();
            console.log('snap', snapshot.val());
            this.setState({
                scores: Object.keys(snap).map(key => Object.assign(snap[key], { id: key })).sort((a, b) => b.score - a.score)
            });
        });
    }

    componentWillUnmount() {
        this.ref.off();
    }
    

    render() {
        return (
            <div>
                <div className="database-wrapper">
                    <div className="list-score">
                        <p>scores</p>
                        <ul>
                            {this.state.scores.map(item => (
                                <li key={item.id}>
                                    <span className="score">{item.score}</span>
                                    <span className="name">{item.name}</span> 
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button className="exit" onClick={this.props.hide} >exit</button>
            </div>
        );
    }
}

export default HighScore;
