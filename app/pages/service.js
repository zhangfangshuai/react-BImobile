import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import DoubleDatePicker from '../components/doubleDatePicker'
import Table from '../components/table'
import Pagination from '../components/pagination'
import DutyPerson from '../components/dutyPerson'
import Charts from '../components/charts'

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
            pieReq: {
                interface: 'getWorkOrderType',
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            woDetailData: [],
            woDetailPage: 1,
            woDetailReq: {
                interface: 'getWorkOrderdetails',
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            worksData: [],
            worksPage: 1,
            worksReq: {
                interface: 'getWorkOrderAmount',
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

    // 工单类型分布饼图
    pieRequest(p) {
        if (isParamValid(p, 'workOrderPie')) {
            axiosGet(p, (r) => { this.setState({ pieData: r }); })
        }
    }
    handleDatePie(date, picker) {
        picker == 'start' ? this.state.pieReq.startDate = date : this.state.pieReq.endDate = date;
        this.pieRequest(this.state.pieReq);
    }

    // 工单类型详情
    woDetailRequest(p) {
        if (isParamValid(p, 'workOrderdetails')) {
            axiosGet(p, (r) => {
                this.setState({
                    woDetailData: r,
                    woDetailPage: 1
                })
            })
        }
    }
    handleDateWoDetail(date, picker) {
        picker == 'start' ? this.state.woDetailReq.startDate = date : this.state.woDetailReq.endDate;
        this.woDetailRequest(this.state.woDetailReq);
    }
    handlePageWoDetail(page) {
        this.setState({ woDetailPage: page });
    }

    // 工作量统计
    worksRequest(p) {
        if (isParamValid(p, 'workload')) {
            axiosGet(p, (r) => {
                this.setState ({
                    worksData: r,
                    worksPage: 1
                })
            })
        }
    }
    handleDateWorkload(date, picker) {
        picker == 'start' ? this.state.worksReq.startDate = date : this.state.worksReq.endDate = date;
        this.worksRequest(this.state.worksReq);
    }
    handlePageWorks(page) {
        this.setState({ worksPage: page });
    }

    componentDidMount() {
        this.serviceRequest(this.state.serviceReq);
        this.cardsRequest(this.state.cardsReq);
        this.pieRequest(this.state.pieReq);
        this.woDetailRequest(this.state.woDetailReq);
        this.worksRequest(this.state.worksReq);
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

        let WD = this.state.woDetailData, WP = this.state.woDetailPage;
        let WODETAIL = WD.length < 10 ? WD : WD.slice((WP-1)*PAGESIZE, WP*PAGESIZE);
        if (WODETAIL.length > 0) {
            var woTypeTb = WODETAIL.map((i) => {
                return (
                    <li key={WODETAIL.indexOf(i)}>
                        <p>{i.date_id}</p><p>{i.cl}%</p><p>{i.dd}%</p><p>{i.wd}%</p><p>{i.zc}%</p>
                    </li>
                )
            })
        }

        let WKD = this.state.worksData, WKP = this.state.worksPage;
        let WORKS = WKD.length < 10 ? WKD : WKD.slice((WKP-1)*PAGESIZE, WKP*PAGESIZE);
        if (WORKS.length > 0) {
            var worksTb = WORKS.map((i) => {
                return (
                    <li key={WORKS.indexOf(i)}>
                        <p>{i.date_id}</p><p>{i.total_num}</p><p>{i.ing_num}</p>
                        <p>{i.succ_num}</p><p>{i.succ_rate}%</p>
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
                        <Charts type="pie" data={this.state.pieData} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="工单类型详情" />
                        <DoubleDatePicker handleDate={this.handleDateWoDetail.bind(this)} />
                        <Table self="woType" tbody={woTypeTb}
                            thead={['日期','车辆使用占比','订单问题占比','网店问题占比','注册问题占比']} />
                        <Pagination
                            handlePage={this.handlePageWoDetail.bind(this)}
                            length={this.state.woDetailData ? this.state.woDetailData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="工单量统计" />
                        <DoubleDatePicker handleDate={this.handleDateWorkload.bind(this)} />
                        <Table self="woks" tbody={worksTb}
                            thead={['日期','工单总数','当日跟进中总数','当日新增工单(已完成)','完成率']} />
                        <Pagination
                            handlePage={this.handlePageWorks.bind(this)}
                            length={this.state.worksData ? this.state.worksData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Service;
