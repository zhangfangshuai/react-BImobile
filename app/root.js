import React from 'react';
import ReactDOM from 'react-dom';
import { Router, HashRouter, hashHistory, Route, Redirect, Switch } from 'react-router-dom';
import Pubsub from 'pubsub-js';
import { MENU_LIST } from './config/menu_config';
import './less/master.less';

import Menu from './components/menu';
import Login from './pages/login';
import Watch from './pages/watch';
import Income from './pages/income';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu: {},
            menuState: {
                toggled: false,
                firstIn: true
            },
            user: {
                nickname: sessionStorage.nickname,
                picker: ''
            }
        }
    }
    componentWillMount() {
        for ( let m of MENU_LIST ){
            if (m.access) {
                this.setState({
                    currentMenu: m
                })
                return;
            }
        }
    }

    componentDidMount() {
        Pubsub.subscribe('TOGGLE_MENU', () => {
            this.setState({
                menuState: {
                  toggled: true,
                  firstIn: false
                }
            })
        });
        Pubsub.subscribe('HIDE_MENU', () => {
            this.setState({
                menuState: {
                  toggled: false,
                  firstIn: false
                }
            })
        });
        Pubsub.subscribe('GO', (msg, item) => {
            this.setState({ currentMenu: item });
        });
    }

    componentWillUnmount() {
        Pubsub.unsubscribe('TOGGLE_MENU');
        Pubsub.unsubscribe('HIDE_MENU');
        Pubsub.unsubscribe('GO');
    }

    render() {
        let view = this.state.currentMenu.id;
        view = 10;
        return (
            <div>
                <Menu
                    menuState={this.state.menuState}
                    user={this.state.user}
                    cItem={this.state.currentMenu} />

                    { view == 2 && <Watch city={this.state.currentCity}/> }
                    { view == 3 && <Watch city={this.state.currentCity}/> }
                    { view == 4 && <Watch city={this.state.currentCity}/> }
                    { view == 64 && <Watch city={this.state.currentCity}/> }
                    { view == 5 && <Watch city={this.state.currentCity}/> }
                    { view == 6 && <Watch city={this.state.currentCity}/> }
                    { view == 7 && <Watch city={this.state.currentCity}/> }
                    { view == 8 && <Watch city={this.state.currentCity}/> }
                    { view == 9 && <Watch city={this.state.currentCity}/> }
                    { view == 10 && <Income city={this.state.currentCity}/> }
            </div>
        )
    }
}

class Root extends React.Component {
    render() {
        return (
            <HashRouter history={hashHistory}>
                <Switch>
                    <Route exact path='/' component={ () => <Redirect to='/login' /> } />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/app' component={App} />
                </Switch>
            </HashRouter>
        );
    }
}

export default Root;
