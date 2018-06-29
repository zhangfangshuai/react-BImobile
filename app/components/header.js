import React from 'react';
import Pubsub from 'pubsub-js';
import '../less/header.less';

import Cities from './cities';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: this.props.city,
            cityState: {
                toggled: false,
                firstIn: true
            }
        }
    }

    toggleMenu(e) {
        e.stopPropagation();
        Pubsub.publish('TOGGLE_MENU');
    }

    toggleCity(e) {
        e.stopPropagation();
        this.setState({
            cityState: {
                toggled: true,
                firstIn: false
            }
        })
    }

    componentDidMount() {
        Pubsub.subscribe('HIDE_CITY', () => {
            this.setState({
                cityState: {
                    toggled: false,
                    firstIn: false
                }
            })
        });
        Pubsub.subscribe('CITY_SELECTED', (event, item) => {
            this.setState((prevState) => {
                prevState.city = item;
                this.props.handleCity(prevState.city);
            })
        })
    }

    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_CITY');
        Pubsub.unsubscribe('CITY_SELECTED');
    }

    render() {
        return (
            <div className="components-header">
                <img onClick={this.toggleMenu.bind(this)}
                    src="/static/images/icon_menu.png" alt="" />
                <img src="/static/images/gofun.png" alt="" />
                <div
                    className={`location${this.props.disLocat ? ' locat-hide' : ' locat-show'}`}
                    onClick={this.toggleCity.bind(this)}>{this.state.city.text}</div>
                <img
                    className={`location-icon${this.props.disLocat ? ' locat-hide' : ' locat-show'}`}
                    src="/static/images/icon_location.png" alt=""
                    onClick={this.toggleCity.bind(this)} />
                <div className={`empty${this.props.disLocat ? ' locat-show' : ' locat-hide'}`} />
                <Cities city={this.state.city} cityState={this.state.cityState} />
            </div>
        );
    }
};

export default Header;
