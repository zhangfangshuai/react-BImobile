import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import CarOption from '../components/carOption'
import SingleDatePicker from '../components/singleDatePicker'
import Table from '../components/table'
import DutyPerson from '../components/dutyPerson'
import DoubleDatePicker from '../components/doubleDatePicker'

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            infoData: [],
            infoReq: {
                interface: 'getorderAnalyze',
                cityId: CITY_LIST[0].value,
                typeId: 0,
                dateId: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
    }

    // 订单概况
    infoRequest(p) {
        isParamValid(p, 'car_info') && axiosGet(p, (r) => { this.setState({ infoData: r }) });
    }
    handleCarInfo(carType) {
        this.state.infoReq.typeId = carType;
        this.infoRequest(this.state.infoReq);
    }
    handleDateInfo(date) {
        this.state.infoReq.dateId = date;
        this.infoRequest(this.state.infoReq);
    }


    componentDidMount() {
        this.infoRequest(this.state.infoReq);
    }

    render() {
        if (this.state.infoData.length > 0) {
            var infoTb = this.state.infoData.map((i) => {
                let icon = <i className={i.avg_rate > 0 ? 'rise' : i.avg_rate == 0 ? '' : 'down'}></i>;
                return (
                    <li key={this.state.infoData.indexOf(i)}>
                        <p>{i.kpiname}</p><p>{i.month_t}</p><p>{i.month_avg}</p>
                        <p>{i.month_last_t}</p><p>{i.month_last_avg}</p><p>{i.avg_rate}{icon}</p>
                    </li>
                )
            })
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap">
                        <Title name="订单概况" />
                        <CarOption handleCar={this.handleCarInfo.bind(this)} />
                        <SingleDatePicker handleDate={this.handleDateInfo.bind(this)} />
                        <Table self="order-info" tbody={infoTb}
                            thead={['指标名称','本月累计','本月平均值','上月累计','上月平均值','平均值增幅']} />
                        <DutyPerson sectionId="32" city={this.state.currentCity} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Order;
