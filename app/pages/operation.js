import React from 'react'
import { CITY_LIST } from '../config/city_config'
import Header from '../components/header'
import Title from '../components/title'
import TitleWithBubble from '../components/titleWithBubble'
import CarOption from '../components/carOption'
import Table from '../components/table'
import DutyPerson from '../components/dutyPerson'

class Operation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            accidentData: [],
            accidentReq: {
                interface: 'getAccidentTop',
                cityId: CITY_LIST[0].value,
                carType: 0
            }
        }
    }

    accidentRequest(p) {
        if (isParamValid(p, 'accident')) {
            axiosGet(p, (res) => {
                this.setState({
                    accidentData: res.data
                }, false)
            })
        }
    }
    selectCity(city) {
        this.state.accidentReq.cityId = city.value;
        this.accidentRequest(this.state.accidentReq);
        this.setState({ currentCity: city })
    }

    handleCar(car) {
        this.state.accidentReq.carType = car;
        this.accidentRequest(this.state.accidentReq);
    }

    componentDidMount() {
        axiosGet(this.state.accidentReq, (res) => {
            this.setState({ accidentData: res.data });
        }, false)
    }

    render() {
        let A = this.state.accidentData
        if (A.length != 0) {
            var accidentTb = A.map((i) => {
                return (
                    <li key={A.indexOf(i)}>
                        <p>{A.indexOf(i) + 1}</p>
                        <p>{i.data0}</p>
                        <p>{i.data1}'%'</p>
                        <p>{i.data2}</p>
                    </li>
                )
            });
        }


        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section className="section-box">
                    <div className="wrap clearTopGap">
                        <TitleWithBubble name="保险/事故" />
                        <CarOption handleCar={this.handleCar.bind(this)} />
                        <Table self="accident" tbody={accidentTb}
                            thead={['排名','车牌号', '订单出险率', '出险次数']} />
                        <DutyPerson sectionId="53" city={this.state.currentCity} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Operation;
