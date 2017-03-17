import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';

const styles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -90,
    marginTop: -125
};

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
        console.log(this.state);
        axios.post('http://localhost:3000/login', {
            username: this.state.username,
            password: this.state.password
        });

        event.preventDefault();
    }

    render() {
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
                <button type="submit" className="btn btn-default">Submit</button>
            </form>
        );
    }
}

ReactDom.render(
    (
        <LoginForm />
    ),
    document.getElementById('root')
);