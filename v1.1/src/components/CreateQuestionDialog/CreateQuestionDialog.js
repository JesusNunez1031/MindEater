import React, {Component} from 'react';
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import withMobileDialog from "@material-ui/core/es/withMobileDialog/withMobileDialog";

import classes from './CreateQuestionDialog.module.css';
import TextField from "@material-ui/core/TextField/TextField";
import Options from "./Options/Options";

class CreateQuestionDialog extends Component {

    state = {
        open: false,
        optionsValue: null,
        correctOption: null,
        question: {
            value: '',
            error: '',
            focused: false,
            valid: false
        },
        hint: {
            value: '',
            error: '',
            focused: false,
            valid: false
        },
        explanation: {
            value: '',
            error: '',
            focused: false,
            valid: false
        },

        options: {
            value: [
                {
                    value: '',
                    error: '',
                    focused: false,
                },
                {
                    value: '',
                    error: '',
                    focused: false,
                },
                {
                    value: '',
                    error: '',
                    focused: false,
                },
                {
                    value: '',
                    error: '',
                    focused: false,
                }
            ],
            error: '',
            focused: false,
            valid: false
        }
    };

    checkOptions = (options) => {
        const updatedOptions = {...options};

        let updatedOptionsValid = true;
        const updatedOptionsValue = [];
        for (let option of updatedOptions.value) {
            const updatedOption = {...option};
            updatedOption.error = this.checkOption(updatedOption);
            updatedOptionsValid = updatedOptionsValid && updatedOption.error.length === 0;
            updatedOptionsValue.push(updatedOption);
        }
        updatedOptions.error = this.checkCorrectOption();
        updatedOptionsValid = updatedOptionsValid && updatedOptions.error.length === 0;

        updatedOptions.value = updatedOptionsValue;
        updatedOptions.valid = updatedOptionsValid;

        this.setState({options: updatedOptions})
    };

    checkValidity = (name, element) => {
        // TODO:
        switch (name) {
            case 'options':
                return this.checkOptions(element);
            case 'email':
                return this.checkEmail(element);
            default:
                return '';
        }
    };

    checkOption = (option) => {
        if (option.value.length === 0 && option.focused) {
            return '* Required';
        } else if (option.value.length > 15) {
            return 'Cannot be longer than 15 characters';
        } else {
            return '';      // No error
        }
    };

    checkCorrectOption = () => {
        if (this.state.correctOption === null) {
            return 'You must check the correct option';
        } else {
            return '';
        }
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleChange = event => {
        const updatedOptions = {...this.state.options};
        updatedOptions.error = '';
        this.setState({optionsValue: event.target.value, correctOption: event.target.value, options: updatedOptions});
    };

    handleOptionChange = index => event => {
        const updatedOptions = {...this.state.options};

        const updatedOption = updatedOptions.value[index];
        updatedOption.value = event.target.value.trim();
        updatedOptions.value[index] = updatedOption;

        this.checkOptions(updatedOptions);
    };

    handleOptionFocus = index => () => {

        const updatedOptions = {...this.state.options};

        const updatedOption = updatedOptions.value[index];
        if (!updatedOption.focused) {
            updatedOption.focused = true;
            updatedOptions.value[index] = updatedOption;

            this.checkOptions(updatedOptions);
        }
    };

    handleFieldChange = name => event => {
        const updatedField = {...this.state[name]};
        updatedField.value = event.target.value;
        this.setState({[name]: updatedField});
    };

    handleSave = (event) => {
        event.preventDefault();
        this.handleClose();
    };

    handleCancel = (event) => {
        event.preventDefault();
        this.handleClose();
    };

    render() {
        const {fullScreen} = this.props;
        return (
            <div>
                <Button
                    onClick={this.handleClickOpen}
                >
                    Add Question
                </Button>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="create-question-dialog-title"
                >
                    <DialogTitle id="create-question-dialog-title">Question</DialogTitle>
                    <DialogContent className={classes.root}>
                        <form className={classes.Form}>
                            <TextField
                                label="Question"
                                multiline
                                rowsMax="4"
                                margin="normal"
                                fullWidth
                                onChange={this.handleFieldChange('question')}
                                value={this.state.question.value}
                            />
                            <Options
                                options={this.state.options}
                                optionChanged={this.handleOptionChange}
                                optionFocused={this.handleOptionFocus}
                                value={this.state.optionsValue}
                                changed={this.handleChange}
                            />
                            <TextField
                                label="Hint"
                                multiline
                                rowsMax="4"
                                margin="normal"
                                fullWidth
                                onChange={this.handleFieldChange('hint')}
                                value={this.state.hint.value}
                            />
                            <TextField
                                label="Explanation"
                                multiline
                                rowsMax="4"
                                margin="normal"
                                fullWidth
                                onChange={this.handleFieldChange('explanation')}
                                value={this.state.explanation.value}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.handleCancel}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleSave}
                            color="primary" autoFocus
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withMobileDialog('xs')(CreateQuestionDialog);