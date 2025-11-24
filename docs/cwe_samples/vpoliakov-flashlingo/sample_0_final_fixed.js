'use strict';

function animate(element, animation) {
    element.classList.add(animation);
    setTimeout(() => {
        element.classList.remove(animation);
    }, 1000);	
}

function makeRequest(callback, url) {
    function request(command, url) {
        const xhr = new XMLHttpRequest();
        xhr.open(command, url, true);
        return xhr;
    }

    const xhr = request('GET', url);

    if (!xhr) throw 'Error, something went wrong...';
    xhr.onerror = () => { throw 'Error, something went wrong...'; };

    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        callback(data);
    };

    xhr.send();
}

function translate(callback, input, save) {
    const url = `query?action=${save ? 'save' : 'translate'}&message=${input}`;
    makeRequest(callback, url);
}

function getCards(callback) {
    const url = `query?action=getCards`;
    makeRequest(callback, url);
}

function updateCard(id, asked, answered) {
    const url = `query?action=updateCard&id=${id}&asked=${asked}&answered=${answered}`;
    makeRequest(() => {}, url);
}

function Card(self) {
    const className = self.className || 'card';
    return (
        <div className={className}>
            {self.children}
        </div>
    );
}

function Main(self) {
    if (self.view == 'add') {
        return (
            <main>
                <button id="review-view-button" onClick={self.app.reviewView}>Start Review</button>
                <div id="cards">
                    <Card><input id="input" placeholder="English" onKeyUp={self.app.inputListener} autoFocus/></Card>
                    <div id="buffer"></div>
                    <Card><p id="output">Translation</p></Card>
                </div>
                <button id="save" onClick={self.app.saveCard}>Save</button>
            </main>
        );
    } else if (self.view == 'review') {
        return (
            <main>
                <div id="buttons">
                    <button id="add-view-button" onClick={self.app.addView}>Add Cards</button>
                    <p id="correct">CORRECT!</p>
                    <button id="switch-user-button" onClick={self.app.switchUser}>Switch User</button>
                </div>
                <div id="review-cards">
                    <Card><div id="prompt"></div></Card>
                    <div id="buffer"></div>
                    <Card><input id="answer" onKeyPress={self.app.inputListener} autoFocus/></Card>
                </div>
                <button id="next" onClick={self.app.flipCard}>Next</button>
            </main>
        );
    } else {
        return <main></main>;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            card: {},
            cards: [],
            view: 'add'
        };
    }

    render = () => {
        return (
            <div id="container">
                <header>
                    <h1 id="title">flashlingo!</h1>
                </header>
                <Main view={this.state.view} app={this}></Main>
                <footer>
                    <p id="user">{this.state.user}</p>
                </footer>
            </div>
        );
    }

    addView = () => {
        this.setState({ view: 'add' });
    }
    
    pickCard = () => {
        const cards = this.state.cards;
        cards.map(card => { card.score = (1 - card.answered / (card.asked || 1))**2 + .1; });
        const scoresSum = cards.reduce((sum, card) => sum + card.score, 0);
        let pick = Math.random() * scoresSum;

        for (const card of cards) {
            pick -= card.score;

            if (pick <= 0) {
                this.state.card = card;
                document.getElementById('prompt').textContent = card.translation;
                document.getElementById('correct').style.display = 'none';
                return card;
            }
        }
    }

    reviewView = () => {
        this.setState({ view: 'review' });
        getCards(cards => {
            this.state.cards = cards;
            this.pickCard();
        });
    }

    flipCard = () => {
        const answer = document.getElementById('answer');
        const card = this.state.card;
        const correct = document.getElementById('correct');
        const prompt = document.getElementById('prompt');
        const promptCard = prompt.parentElement;
        const goodAnswer = answer.value.toLowerCase() == card.text.toLowerCase();

        if (goodAnswer) {
            card.answered++;
            correct.style.display = 'unset';
        } else {
            animate(promptCard, 'start-flip');
            prompt.textContent = card.text;
            animate(promptCard, 'end-flip');
        }

        card.asked++;
        updateCard(card.id, card.asked, card.answered);
        
        setTimeout(() => {
            this.pickCard();
            answer.value = '';
        }, goodAnswer ? 1000 : 2500);
    }

    inputListener = (event) => {
        const enterPressed = event.key == 'Enter';
        const backquotePressed = event.key == '\`';

        if (this.state.view == 'add') {
            if (enterPressed) {
                this.saveCard();
            } else {
                translate(
                    data => { document.getElementById('output').textContent = data; },
                    document.getElementById('input').value
                );
            }
        } else if (this.state.view == 'review') {
            if (enterPressed) this.flipCard();
        }

        return false;
    }

    saveCard = () => {
        translate(
            data => {
                document.getElementById('input').value = '';
                document.getElementById('output').textContent = 'Translation';
            },
            document.getElementById('input').value,
            true
        );
    }

    switchUser = () => {
        window.location.href = "/login.html";
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));