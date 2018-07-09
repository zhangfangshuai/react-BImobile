import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import InlineTranglePicker from '../components/inlineTranglePicker'

class App extends React.Component {
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
                <section>
                    <div className="wrap clearTopGap">
                        <Title name="DAU漏斗" />
                        <InlineTranglePicker type="appVersion" />
                    </div>
                </section>
            </div>
        )
    }
}

export default App;
