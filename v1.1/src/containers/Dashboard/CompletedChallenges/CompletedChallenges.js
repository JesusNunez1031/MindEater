import React, {Component} from 'react';
import classes from "./CompletedChallenges.module.css";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Card from "@material-ui/core/Card/Card";
import Check from "@material-ui/icons/CheckCircleOutline"
import Divider from "@material-ui/core/Divider/Divider";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import fire from "../../../fire";

class CompletedChallenges extends Component {

    state = {
        username: "Guest",
        completedChallenges: 0
    };

    componentDidMount() {
        fire.auth().onAuthStateChanged(this.updateUsername);
        const user = fire.auth().currentUser;
        if (user) {
            this.updateUsername(user);
        }
    }

    updateUsername = (user) => {
        if (user) {
            fire.database().ref('/users/' + user.uid + '/username')
                .once('value')
                .then(snapshot => {
                    console.log("USER Snapshot", snapshot);
                    if (snapshot.val()) {
                        console.log("USER Snapshot Val", snapshot.val());
                        this.setState({username: snapshot.val()});
                    }
            }).catch(error => {
                alert(error.message)
            });
            this.setListener(user);
        }
    };


    setListener = (user) => {
        fire.database().ref('/users/' + user.uid + '/completedChallenges')
            .on('child_added', snapshot => {
                this.getCompletedChallenges(user);
            });
    };

    getCompletedChallenges = (user) => {
        fire.database().ref('/users/' + user.uid + '/completedChallenges')
            .once('value')
            .then(snapshot => {
                this.setState({completedChallenges: snapshot.numChildren()});
            })
            .catch(error => {
                alert(error.message)
            });
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.username !== this.state.username) {
            const user = fire.auth().currentUser;
            if (user) {
                this.getCompletedChallenges(user);
            }
        }
    }

    render() {
        return (
            <div>
                <Card className={classes.CardStyle}>
                    <CardHeader style={{background: "#4CAF50"}}/>
                    <div style={{marginTop: 20}}>
                        <div className={classes.Box}>
                            <Check style={{width: 70, height: 70, color: "white"}}/>
                        </div>
                    </div>
                    <CardContent>
                        <Typography style={{fontWeight:"bold"}} gutterBottom variant={"h4"} component={"h2"}>
                            Completed Challenges
                        </Typography>
                        <Typography style={{fontSize:18}} component={'p'}>
                            {this.state.username}'s progress:
                        </Typography>
                    </CardContent>
                    <Divider className={classes.Divider}/>
                    <CardActions>
                        <h4>You have completed a total of {this.state.completedChallenges} challenges</h4>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default CompletedChallenges;