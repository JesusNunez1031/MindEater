import React, {Component} from 'react';
import TextField from "@material-ui/core/TextField/TextField";
import {Button} from "@material-ui/core";

import classes from './SignUp.module.css';

class SignUp extends Component {
    state = {
        username: {
            value: '',
            error: '',
            focused: false
        },
        email: {
            value: '',
            error: '',
            focused: false
        },
        password: {
            value: '',
            error: '',
            focused: false
        },
        repeatPassword: {
            value: '',
            error: '',
            focused: false
        }
    };

    handleChange = name => event => {
        const updatedField = {...this.state[name]};
        updatedField.value = event.target.value;
        updatedField.error = this.checkValidity(name, updatedField);

        this.setState({[name]: updatedField});
    };

    handleFocus = name => () => {
        const updatedField = {...this.state[name]};
        updatedField.focused = true;
        updatedField.error = this.checkValidity(name, updatedField);
        this.setState({[name]: updatedField});
    };

    checkValidity = (name, element) => {
        switch (name) {
            case 'password':
                return this.checkPassword(element);
            case 'repeatPassword':
                break;
            case 'email':
                break;
            case 'username':
                break;
            default:
                return '';
        }
    };

    checkPassword = (password) => {
        if (password.value.length === 0 && password.focused) {
            return '* Required';
        } else if (password.value.length < 6) {
            return 'Must have 6 or more characters';
        } else if (password.value.length > 26) {
            return 'Cannot be longer than 26 characters';
        } else if (password.value.search(/[A-Z]/) === -1) {
            return 'Must contain an uppercase character';
        } else if (password.value.search(/[a-z]/) === -1) {
            return 'Must contain an lowercase character';
        } else if (password.value.search(/\d/) === -1) {
            return'Must contain at least 1 digit';
        } else {
            return '';
        }
    };

    render() {
        return (
            <form className={classes.SignUp}>
                <TextField
                    name='username'
                    label='Username'
                    margin='normal'
                    value={this.state.username.value}
                    onChange={this.handleChange('username')}
                />
                <TextField
                    name='email'
                    label='Email'
                    type='email'
                    margin='normal'
                    helperText={this.state.email.error}
                    value={this.state.email.value}
                    onChange={this.handleChange('email')}

                />
                <TextField
                    name='password'
                    label='Password'
                    type='password'
                    margin='normal'
                    error={this.state.password.error.length > 0}
                    helperText={this.state.password.error}
                    value={this.state.password.value}
                    onChange={this.handleChange('password')}
                    onFocus={this.handleFocus('password')}
                />
                <TextField
                    name='repeatPassword'
                    label='Repeat Password'
                    type='password'
                    margin='normal'
                    value={this.state.repeatPassword.value}
                    onChange={this.handleChange('repeatPassword')}
                />
                <Button variant='contained'>Sign Up</Button>
            </form>
        );
    }
}

export default SignUp;