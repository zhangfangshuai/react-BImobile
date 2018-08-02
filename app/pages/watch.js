import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import FlagTitle from '../components/flagTitle'
import SingleDatePicker from '../components/singleDatePicker'
import CarOption from '../components/carOption'
import Charts from '../components/charts'
import ChartGist from '../components/chartgist'
import Table from '../components/table'
import TableBody from '../components/tableBody'
import Pagination from '../components/pagination'
import DutyPerson from '../components/dutyPerson'
import InlineTranglePicker from '../components/inlineTranglePicker'

class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            masters: ['realCash', 'realCar', 'realOrder', 'realNewguy', 'realBattery'],
            currentCity: CITY_LIST[0],
            realCashData: { table: [] },
            realCashPage: 1,
            realCashReq: {
                interface: 'getOrderRealAmount',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset(),
                carType: 0
            },
            realCarData: { table: [] },
            realCarState: 0,  // 0:全部, 1:上架, 2:下架
            realCarPage: 1,
            realCarReq: {
                interface: 'getCarRealData',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset(),
                carType: 0
            },
            realOrderData: { table: [] },
            realOrderPage: 1,
            realOrderReq: {
                interface: 'getOrderRealData',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset(),
                carType: 0
            },
            realNewguyData: { table: [] },
            realNewguyPage: 1,
            realNewguyReq: {
                interface: 'getRegisterRealData',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset()
            },
            realBatteryData: { table: [] },
            realBatteryReq: {
                interface: 'getKpiCarPower',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset()
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        for (let mst of this.state.masters) {
            this.state[mst + 'Req'].cityId = c.value;
            this.axiosRequest(this.state[mst + 'Req'], mst);
        }
    }

    axiosRequest(p, master) {
        if (isParamValid(p, master)) {
            axiosGet(p, (r) => {
                this.setState((prevState) => {
                    prevState[master + 'Data'] = r;
                    prevState[master + 'Page'] && (prevState[master + 'Page'] = 1);
                })
            });
        }
    }

    handleDate(date, master) {
        this.state[master + 'Req'].dateId = date;
        this.axiosRequest(this.state[master + 'Req'], master, true);
    }
    handleCar(ct, master) {
        this.state[master + 'Req'].carType = ct;
        this.axiosRequest(this.state[master + 'Req'], master, true);
    }

    handlePage(p, master) {
        this.setState((prevState) => {
            prevState[master + 'Page'] = p;
        });
    }

    handlePick(idx, master) {
        this.setState({ realCarState: idx });
    }

    componentDidMount() {
        for (let mst of this.state.masters) {
            this.axiosRequest(this.state[mst + 'Req'], mst);
        }
    }

    render() {
        let cashTb, RC = this.state.realCashData.table, RCP = this.state.realCashPage;
        let CASH = RC.length < 10 ? RC : RC.slice((RCP-1)*PAGESIZE, RCP*PAGESIZE);
        if (CASH.length > 0) {
            cashTb = CASH.map((i, idx) => {
                return <TableBody key={idx} data={[i.hour_id, i.amount_hour, i.payamoun_hour, i.couponAmount_hour,
                    i.noPayAmount_hour, i.amount_hour_every, i.payamoun_hour_every, i.couponAmount_hour_every, i.noPayAmount_hour_every]} />
            })
        }

        let carTb, CT = this.state.realCarData.table, CTP = this.state.realCarPage;
        let CAR = CT.length < 10 ? CT : CT.slice((CTP-1)*PAGESIZE, CTP*PAGESIZE);
        if (CAR.length > 0) {
            carTb = CAR.map((i, idx) => {
                return <TableBody key={idx} data={[i.hour_id, i.car_num3, i.car_num4, i.car_num5,i.car_num6, i.car_num7,
                    i.car_num8, i.car_num9, i.car_num10, i.car_num11, i.car_num12, i.car_num14, i.car_num13, i.car_num15]} />
            })
        }

        let orderTb, OD = this.state.realOrderData.table, ODP = this.state.realOrderPage;
        let ORDER = OD.length < 10 ? OD : OD.slice((ODP-1)*PAGESIZE, ODP*PAGESIZE);
        if (ORDER.length > 0) {
            orderTb  = ORDER.map((i, idx) => {
                return <TableBody key={idx} data={[i.hour_id, i.ordernum_create_hour1, i.ordernum_up_hour1, i.ordernum_cancel_hour1,
                    i.ordernum_create_hour,i.ordernum_up_hour, i.ordernum_cancel_hour, i.ordernum_up_hour_every, i.sumMileage_hour_every, i.sumMinute_hour_every ]} />
            })
        }

        let newguyTb, N = this.state.realNewguyData.table, NP = this.state.realNewguyPage;
        let NEWGUY = N.length < 10 ? N : N.slice((NP-1)*PAGESIZE, NP*PAGESIZE);
        if (NEWGUY.length > 0) {
            newguyTb  = NEWGUY.map((i, idx) => {
                return <TableBody key={idx} data={[i.hour_id, i.users_reg_hour, i.users_audit_hour, i.deposit_users_hour, i.order_users_hour,i.orderfirst_users_hour ]} />
            })
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section>
                    <div className="wrap">
                        <FlagTitle self="flag-cash" name="实时收现" />
                        <div className="bulge-block">
                            <SingleDatePicker handleDate={this.handleDate.bind(this)} master="realCash" today={true} />
                        </div>
                        <CarOption handleCar={this.handleCar.bind(this)} master="realCash" />
                        <Charts self="small-chart" type='multi_line' data={this.state.realCashData} master="realCash" />
                    </div>
                    <div className="wrap clearTopGap">
                        <div className="hook"></div>
                        <Title name="实时营收概况" />
                        <Table self="realcash" tbody={cashTb}
                            thead={['时刻','累计收入','累计收现','累计优惠','累计未结算', '单均收入',
                              '单均收现','单均优惠','单均未结算']}/>
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.realCashData.table ? this.state.realCashData.table.length : 0}
                            pageSize={PAGESIZE}
                            master="realCash" />
                        <DutyPerson sectionId="1" city={this.state.currentCity} />
                    </div>
                </section>
                <section>
                    <div className="wrap bulge-wrap">
                        <FlagTitle self="flag-car" name="车辆概况" />
                        <div className="bulge-block">
                            <SingleDatePicker handleDate={this.handleDate.bind(this)} master="realCar" today={true} />
                        </div>
                        <CarOption handleCar={this.handleCar.bind(this)} master="realCar" />
                        <InlineTranglePicker type="carState" self="ITP-realCar" master="realCar" handlePick={this.handlePick.bind(this)} />
                        <Charts self="small-chart" type='multi_line_stacked' data={this.state.realCarData} carState={this.state.realCarState} />
                        <ChartGist master="realCar" state={this.state.realCarState} data={ this.state.realCarData } />
                  </div>
                  <div className="wrap clearTopGap">
                      <div className="hook"></div>
                      <Title name="实时车辆状况" />
                      <Table self="realcar" tbody={carTb}
                          thead={['时刻','整备中','待租','已预订','服务中-未取车','服务中-已取车','运维中','维修中',
                            '事故出险','物料缺失','机车离线','低电下架','停止运营','其他原因']}/>
                      <Pagination
                          handlePage={this.handlePage.bind(this)}
                          length={this.state.realCarData.table ? this.state.realCarData.table.length : 0}
                          pageSize={PAGESIZE}
                          master="realCar" />
                      <DutyPerson sectionId="2" city={this.state.currentCity} />
                  </div>
                </section>
                <section>
                    <div className="wrap bulge-wrap">
                        <FlagTitle self="flag-order" name="实时订单" />
                        <div className="bulge-block">
                            <SingleDatePicker handleDate={this.handleDate.bind(this)} master="realOrder" today={true} />
                        </div>
                        <CarOption handleCar={this.handleCar.bind(this)} master="realOrder" />
                        <Charts self="small-chart" type='multi_line' data={this.state.realOrderData} master="realOrder" />
                        <ChartGist master="realOrder" data={ this.state.realOrderData } />
                    </div>
                    <div className="wrap clearTopGap">
                        <div className="hook"></div>
                        <Title name="实时订单" />
                        <Table self="realorder" tbody={ orderTb }
                            thead={['时刻','订单量','取车订单量','取消订单量','累计订单量','累计取车订单量',
                              '累计取消订单量','车均单','车均里程','单均时长']} />
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.realOrderData.table ? this.state.realOrderData.table.length : 0}
                            pageSize={PAGESIZE}
                            master="realOrder" />
                        <DutyPerson sectionId="4" city={this.state.currentCity} />
                    </div>
                </section>
                <section>
                    <div className="wrap bulge-wrap">
                        <FlagTitle self="flag-newguy" name="新增用户" />
                        <div className="bulge-block">
                            <SingleDatePicker handleDate={this.handleDate.bind(this)} master="realNewguy" today={true} />
                        </div>
                        <Charts self="small-chart" type='multi_line' data={this.state.realNewguyData} master="realNewguy" />
                        <ChartGist master="realNewguy" data={ this.state.realNewguyData } />
                    </div>
                    <div className="wrap clearTopGap">
                        <div className="hook"></div>
                        <Title name="实时新增用户" />
                        <Table self="realnewguy" tbody={ newguyTb }
                            thead={['时刻','新增注册','新增双证','新增押金','新增下单','新增首单']} />
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.realNewguyData.table ? this.state.realNewguyData.table.length : 0}
                            pageSize={PAGESIZE}
                            master="realNewguy" />
                        <DutyPerson sectionId="5" city={this.state.currentCity} />
                    </div>
                </section>
                <section>
                    <div className="wrap bulge-wrap">
                        <FlagTitle self="flag-battery" name="车辆续航" />
                        <div className="bulge-block">
                            <SingleDatePicker handleDate={this.handleDate.bind(this)} master="realBattery" today={true} />
                        </div>
                        <Charts self="small-chart" type='bar' data={this.state.realBatteryData} master="realBattery" />
                        <ChartGist master="realBattery" data={ this.state.realBatteryData } />
                    </div>
                </section>
            </div>
        )
    }
}

export default Watch;
