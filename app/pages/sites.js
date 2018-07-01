import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'

class Sites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[1]
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
    }

    render() {
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="网点概况" />
                    </div>
                </section>
            </div>
        )
    }
}

export default Sites;
