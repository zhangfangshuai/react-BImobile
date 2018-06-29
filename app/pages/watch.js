import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'

class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0]
        }
    }

    selectCity(c) {
        console.log(c);
        this.setState({ currentCity: c });
    }

    render() {
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
            </div>
        )
    }
}

export default Watch;
