import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import CarOption from '../components/carOption'

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            infoData: [],
            infoPage: 1,
            infoReq: {
                interface: 'getorderAnalyze',
                cityId: CITY_LIST[0].value,
                typeId: 0,
                dateId: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        console.log(c);
        this.setState({ currentCity: c });
    }

    handleCarInfo(carType) {
        console.log(carType);
    }

    render() {
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap">
                        <Title name="订单概况" />
                        <CarOption handleCar={this.handleCarInfo.bind(this)} />

                    </div>
                </section>
            </div>
        )
    }
}

export default Order;
