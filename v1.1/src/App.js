import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import Authentication from "./containers/Authentication/Authentication";
import Navigation from "./components/Navigation/Navigation";
import Dashboard from "./containers/Dashboard/Dashboard";
import MyChallenges from "./containers/MyChallenges/MyChallenges";


class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/' component={Authentication} exact/>
                    <Route path='/' component={Navigation} />
                </Switch>

                {/*TODO: Add routes to other pages here once created.*/}
                <Route path='/dashboard' component={Dashboard} exact/>
                <Route path='/my-challenges' component={MyChallenges} exact/>
            </div>
        );
    }
}

export default App;
