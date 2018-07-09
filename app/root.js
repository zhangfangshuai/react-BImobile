import React from 'react'
import ReactDOM from 'react-dom'
import { Router, HashRouter, hashHistory, Route, Redirect, Switch } from 'react-router-dom'
import Pubsub from 'pubsub-js'
import { MENU_LIST } from './config/config'
import './less/master.less'

import Menu from './components/menu'
import Login from './pages/login'
import Watch from './pages/watch'
import App from './pages/app'
import Order from './pages/order'
import Parks from './pages/parks'
import Cars from './pages/cars'
import Service from './pages/service'
import Operation from './pages/operation'
import Income from './pages/income'


class Root_App extends React.Component {
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
        if (!view) {
            window.location.href = "./#/login";
            return null;
        } else {
            return (
                <div>
                    <Menu menuState={this.state.menuState} user={this.state.user} cItem={this.state.currentMenu} />
                    { view == 2 && <App city={this.state.currentCity}/> }
                    { view == 3 && <Watch city={this.state.currentCity}/> }
                    { view == 4 && <Watch city={this.state.currentCity}/> }
                    { view == 64 && <App city={this.state.currentCity}/> }
                    { view == 5 && <Order city={this.state.currentCity}/> }
                    { view == 6 && <Parks city={this.state.currentCity}/> }
                    { view == 7 && <Cars city={this.state.currentCity}/> }
                    { view == 8 && <Service city={this.state.currentCity}/> }
                    { view == 9 && <Operation city={this.state.currentCity}/> }
                    { view == 10 && <Income city={this.state.currentCity}/> }
                </div>
            )
        }
    }
}

class Root extends React.Component {
    render() {
        return (
            <HashRouter history={hashHistory}>
                <Switch>
                    <Route exact path='/' component={ () => <Redirect to='/login' /> } />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/cockpit' component={Root_App} />
                </Switch>
            </HashRouter>
        );
    }
}

export default Root;
