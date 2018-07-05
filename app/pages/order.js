import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import CarOption from '../components/carOption'
import SingleDatePicker from '../components/singleDatePicker'
import Table from '../components/table'
import DutyPerson from '../components/dutyPerson'
import DoubleDatePicker from '../components/doubleDatePicker'
import Pagination from '../components/pagination'

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
            },
            detailData: [],
            detailPage: 1,
            detailReq: {
                interface: 'getHistoryOrder',
                cityId: CITY_LIST[0].value,
                typeId: 0,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        this.state.infoReq.cityId = c.value;
        this.infoRequest(this.state.infoReq);
        this.state.detailReq.cityId = c.value;
        this.detailRequest(this.state.detailReq);
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

    // 历史订单详情
    detailRequest(p) {
        if (isParamValid(p, 'order_history')) {
            axiosGet(p, (r) => {
                this.setState({
                    detailData: r,
                    detailPage: 1
                })
            })
        }
    }
    handleCarDetail(carType) {
        this.state.detailReq.typeId = carType;
        this.detailRequest(this.state.detailReq);
    }
    handleDateDetail(date, picker) {
        picker == 'start' ? this.state.detailReq.startDate = date : this.state.detailReq.endDate = date;
        this.detailRequest(this.state.detailReq);
    }
    handlePageDetail(page) {
        this.setState({ detailPage: page });
    }



    componentDidMount() {
        this.infoRequest(this.state.infoReq);
        this.detailRequest(this.state.detailReq);
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

        let DD = this.state.detailData, DP = this.state.detailPage;
        let DETAIL = DD.length < 10 ? DD : DD.slice((DP-1)*PAGESIZE, DP*PAGESIZE);
        if (DETAIL.length > 0) {
            var detailTb = DETAIL.map((i) => {
                return (
                    <li key={DETAIL.indexOf(i)}>
                        <p>{i.date_id}</p><p>{i.avg_sumAmount}</p><p>{i.avg_sumPayAmount}</p>
                        <p>{i.car_avgamount}</p><p>{i.car_avgpayamount}</p><p>{i.order_total}</p>
                        <p>{i.order_up}</p><p>{i.order_cancel}</p><p>{i.order_real_avg}</p>
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

                <section>
                    <div className="wrap">
                        <Title name="历史订单详情" />
                        <CarOption handleCar={this.handleCarDetail.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDateDetail.bind(this)} />
                        <Table self="order-history" tbody={detailTb}
                            thead={['日期','单均收入','单均收现','车均收入','车均收现','下单量','取车单','取消单','车均单']} />
                        <Pagination
                            handlePage={this.handlePageDetail.bind(this)}
                            length={this.state.detailData ? this.state.detailData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="" city={this.state.currentCity} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Order;
