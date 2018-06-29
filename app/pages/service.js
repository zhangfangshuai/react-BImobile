import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import DoubleDatePicker from '../components/doubleDatePicker'
import Table from '../components/table'
import Pagination from '../components/pagination'
import DutyPerson from '../components/dutyPerson'

class Service extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            serviceData: [],
            servicePage: 1,
            serviceReq: {
                interface: 'getCustServerDetail',
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            cardsData: [],
            cardsPage: 1,
            cardsReq: {
                interface: 'getDoubleCardDetail',
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            pieData: [],
            piePage: 1,
            pieReq: {
                interface: 'getWorkOrderType',
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: CITY_LIST[0]});
        Tip.success('该功能无城市区分');
    }
    // 客服概况
    serviceRequest(p) {
        if (isParamValid(p, 'serviceBase')) {
            axiosGet(p, (r) => {
                this.setState({
                    serviceData: r.data,
                    servicePage: 1
                });
            })
        }
    }
    handleDateService(date, picker) {
        picker == 'start' ? this.state.serviceReq.startDate = date : this.state.serviceReq.endDate = date;
        this.serviceRequest(this.state.serviceReq);
    }
    handlePageService(page) {
        this.setState({ servicePage: page });
    }

    // 双证审核详情
    cardsRequest(p) {
        if (isParamValid(p, 'doubleCard')) {
            axiosGet(p, (r) => {
                this.setState({
                    cardsData: r.data,
                    cardsPage: 1
                });
            })
        }
    }
    handleDateCard(date, picker) {
        picker == 'start' ? this.state.cardsReq.startDate = date: this.state.cardsReq.endDate = date;
        this.cardsRequest(this.state.cardsReq);
    }
    handlePageCards(page) {
        this.setState({ cardsPage: page });
    }

    // 工单类型分布
    pieRequest(p) {
        if (isParamValid(p, 'workOrderPie')) {
            axiosGet(p, (r) => {
                this.setState({
                    pieData: r.data,
                    piePage: 1
                });
            })
        }
    }
    handleDatePie(date, picker) {
        picker == 'start' ? this.state.pieReq.startDate = date : this.state.pieReq.endDate = date;
        this.pieRequest(this.state.pieReq);
    }

    componentDidMount() {
        this.serviceRequest(this.state.serviceReq);
        this.cardsRequest(this.state.cardsReq);
        this.pieRequest(this.state.pieReq);
    }

    render() {
        let SD = this.state.serviceData, SP = this.state.servicePage;
        let SERVICE = SD.length < 10 ? SD : SD.slice((SP-1)*PAGESIZE, SP*PAGESIZE);
        if (SERVICE.length > 0) {
            var serviceTb = SERVICE.map((i) => {
                return (
                    <li key={SERVICE.indexOf(i)}>
                        <p>{i.date_id}</p><p>{i.total_num}</p><p>{i.ivr_num}</p><p>{i.topeople_num}</p>
                        <p>{i.success_num}</p><p>{i.success_rate}%</p><p>{i.phone_num}</p><p>{i.phonesucc_num}</p>
                        <p>{i.phonesucc_rate}%</p><p>{i.cpo}%</p><p>{i.agent_eff}</p><p>{i.first_rate}%</p>
                    </li>
                )
            })
        }

        let CD = this.state.cardsData, CP = this.state.cardsPage;
        let CARDS = CD.length < 10 ? CD : CD.slice((CP-1)*PAGESIZE, CP*PAGESIZE);
        if (CARDS.length > 0) {
            var cardsTb = CARDS.map((i) => {
                return (
                    <li key={CARDS.indexOf(i)}>
                        <p>{i.date_id}</p><p>{i.user_card_num}</p><p>{i.car_card_num}</p><p>{i.double_card_num}</p>
                        <p>{i.user_card_rate}%</p><p>{i.car_card_rate}%</p><p>{i.double_card_rate}%</p>
                    </li>
                )
            })
        }
        return (
            <div className="container">
                <Header city={this.state.currentCity} disLocat={true} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="客服概况" />
                        <DoubleDatePicker handleDate={this.handleDateService.bind(this)} />
                        <Table self="service" tbody={serviceTb}
                            thead={['日期','总呼入量','IVR(自助服务)','转入人工','成功接起','接起率','外呼数量','外呼实际接通','接通率','CPO','人均接听量','首解率']} />
                        <Pagination
                            handlePage={this.handlePageService.bind(this)}
                            length={this.state.serviceData ? this.state.serviceData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="双证审核详情" />
                        <DoubleDatePicker handleDate={this.handleDateCard.bind(this)} />
                        <Table self="cards" tbody={cardsTb}
                            thead={['日期','身份证提交人数','驾照提交人数','双证提交人数','身份证审核通过率','驾照审核通过率','双证审核通过率']} />
                        <Pagination
                            handlePage={this.handlePageCards.bind(this)}
                            length={this.state.cardsData ? this.state.cardsData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="工单类型分布" />
                        <DoubleDatePicker handleDate={this.handleDatePie.bind(this)} />
                        
                    </div>
                </section>
            </div>
        )
    }
}

export default Service;
