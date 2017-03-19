import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';

const styles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -115,
    marginTop: -125
};

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errors: '',
            isLoading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;

        this.setState({
            [target.name]: target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({errors: '', isLoading: true});
        console.log(this.state);

        axios.post('http://localhost:3000/login', {
            username: this.state.username,
            password: this.state.password
        }).then((res) => {
            console.log('all ok');
            console.log(res);
        }).catch(e => {
            let {response: {data:{message}}} = e;

            this.setState({errors: message, isLoading: false});
            console.log(this.state);
            console.log(message);
            console.log(e.response);
        });
    }

    render() {
        const {errors} = this.state;

        console.log(errors);
        return (
            <form onSubmit={this.handleSubmit} style={styles}>
                <h1>Pictures saver</h1>
                <div className="form-group">
                    <label>
                        Name:
                        <input type="text" className="form-control" name="username" value={this.state.username}
                               onChange={this.handleChange}/>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Password:
                        <input type="password" className="form-control" name="password" value={this.state.password}
                               onChange={this.handleChange}/>
                    </label>
                </div>
                {errors && <div className="errors">{errors}</div>}
                <button type="submit" className="btn btn-default">Login</button>
            </form>
        );
    }
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAutorized: false,
            path: '/'
        };
    }

    render() {
        return (
            <div>
                <h1>Hello</h1>
            </div>
        )
    }
}

function App() {
    return (
        <div>
            <LoginForm />
            <Dashboard />
        </div>
    );
}

ReactDom.render(
    (
        <App />
    ),
    document.getElementById('root')
);