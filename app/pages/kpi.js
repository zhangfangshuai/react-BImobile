import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import Charts from '../components/charts'

class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            nationData: [],
            nationReq: { interface: 'kpi/getMapData' },

        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        // for (let mst of ['realCash', 'realCar', 'realOrder', 'realNewguy', 'realBattery']) {
        //     this.state[mst + 'Req'].cityId = c.value;
        //     this.axiosRequest(this.state[mst + 'Req'], mst , true);
        // }
    }

    axiosRequest(p, master, pageflag) {
        if (isParamValid(p, master)) {
            axiosGet(p, (r) => {
                this.setState((prevState) => {
                    prevState[master + 'Data'] = r;
                    if (pageflag) { prevState[master + 'Page'] = 1; }
                })
            });
        }
    }

    componentDidMount() {
        // <Charts type='scatter' data={this.state.nationData} master="nation" />
        this.axiosRequest(this.state.nationReq, 'nation', false);
    }

    render() {
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section>
                    <div className="wrap clearTopGap">
                        <Title name="城市概览 - " variable={this.state.currentCity.text == '全国' ? '北京' : this.state.currentCity.text } />


                    </div>
                </section>
            </div>
        )
    }

}

export default Watch;
