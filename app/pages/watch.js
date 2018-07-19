import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import FlagTitle from '../components/flagTitle'
import SingleDatePicker from '../components/singleDatePicker'
import CarOption from '../components/carOption'
import Charts from '../components/charts'
import Table from '../components/table'
import TableBody from '../components/tableBody'
import Pagination from '../components/pagination'
import DutyPerson from '../components/dutyPerson'

class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        for (let mst of ['realCash', 'realCar']) {
            this.state[mst + 'Req'].cityId = c.value;
            this.axiosRequest(this.state[mst + 'Req'], mst , true);
        }
    }

    axiosRequest(p, master, pageflag) {
        if (isParamValid(p, master)) {
            axiosGet(p, (r) => {
                console.log(r, master);
                this.setState((prevState) => {
                    prevState[master + 'Data'] = r;
                    if (pageflag) { prevState[master + 'Page'] = 1; }
                })
            });
        }
    }

    handleDate(date, master) {
        console.log(date, master);
        this.state[master + 'Req'].dateId = date;
        this.axiosRequest(this.state[master + 'Req'], master, true);
    }
    handleCar(ct, master) {
        console.log(ct, master);
        this.state[master + 'Req'].carType = ct;
        this.axiosRequest(this.state[master + 'Req'], master, true);
    }

    handlePage(p, master) {
        console.log(p, master);
        this.setState((prevState) => {
            prevState[master + 'Page'] = p;
        });
    }


    componentDidMount() {
        this.axiosRequest(this.state.realCashReq, 'realCash' , true);
        this.axiosRequest(this.state.realCarReq, 'realCar' , true);
    }

    render() {
        let RC = this.state.realCashData.table, RCP = this.state.realCashPage;
        let CASH = RC.length < 10 ? RC : RC.slice((RCP-1)*PAGESIZE, RCP*PAGESIZE);
        if (CASH.length > 0) {
            var cashTb = CASH.map((i, idx) => {
                return <TableBody key={i.hour_id} data={[i.hour_id, i.amount_hour, i.payamoun_hour, i.couponAmount_hour,
                    i.noPayAmount_hour, i.amount_hour_every, i.payamoun_hour_every, i.couponAmount_hour_every, i.noPayAmount_hour_every]} />
            })
        }

        let carTb;
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
                        <Charts self="small-chart" type='multi_line' data={this.state.realCashData} />
                    </div>
                    <div className="wrap clearTopGap">
                        <Title name="实时营收概况" />
                        <Table self="realcash" tbody={cashTb}
                            thead={['时刻','累计收入','累计收现','累计优惠','累计未结算', '单均收入', '单均收现','单均优惠','单均未结算']}/>
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
                        <Charts self="small-chart" type='multi_line_stacked' data={this.state.realCarData} carState={this.state.realCarState} />
                    </div>
                    <div className="wrap clearTopGap">
                        <Table self="realcash" tbody={carTb}
                            thead={['时刻','累计收入','累计收现','累计优惠','累计未结算', '单均收入', '单均收现','单均优惠','单均未结算']}/>
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.realCarData.table ? this.state.realCarData.table.length : 0}
                            pageSize={PAGESIZE}
                            master="realCash" />
                    </div>
                </section>
            </div>
        )
    }
}

export default Watch;
