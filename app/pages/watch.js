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

class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            realCashData: {
                table: []
            },
            realCashPage: 1,
            realCashReq: {
                interface: 'getOrderRealAmount',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset(),
                carType: 0
            }
        }
    }

    selectCity(c) {
        console.log(c);
        this.setState({ currentCity: c });
    }

    // 实时收现
    realCashRequest(p) {
        if (isParamValid(p, 'real_cash')) {
            axiosGet(p, (r) => {
                this.setState({ realCashData: r });
            })
        }
    }
    handleDateRealCash(date) {
        this.state.realCashReq.dateId = date;
        this.realCashRequest(this.state.realCashReq);
    }
    handleCarRealCash(carType) {
        console.log(carType);
    }
    handlePageCash(p) {
        this.setState({ realCashPage: p });
    }

    componentDidMount() {
        this.realCashRequest(this.state.realCashReq);
    }

    render() {
        let RC = this.state.realCashData.table, RCP = this.state.realCashPage;
        let CASH = RC.length < 10 ? RC : RC.slice((RCP-1)*PAGESIZE, RCP*PAGESIZE);
        if (CASH.length > 0) {
          var realcashTb;
            var realcashTb = CASH.map((i, idx) => {
                return <TableBody key={i.hour_id} data={[i.hour_id, i.amount_hour, i.payamoun_hour, i.couponAmount_hour,
                    i.noPayAmount_hour, i.amount_hour_every, i.payamoun_hour_every, i.couponAmount_hour_every, i.noPayAmount_hour_every]} />
            })
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section>
                    <div className="wrap">
                        <FlagTitle name="实时收现" />
                        <div className="bulge-block">
                            <SingleDatePicker handleDate={this.handleDateRealCash.bind(this)} today={true} />
                        </div>
                        <CarOption handleCar={this.handleCarRealCash.bind(this)} />
                        <Charts self="realcash-line" type='multi_line' data={this.state.realCashData} />
                    </div>
                    <div className="wrap clearTopGap">
                        <Title name="实时营收概况" />
                        <Table self="realcash" tbody={realcashTb}
                            thead={['时刻','累计收入','累计收现','累计优惠','累计未结算', '单均收入', '单均收现','单均优惠','单均优惠','单均未结算']}/>
                        <Pagination
                            handlePage={this.handlePageCash.bind(this)}
                            length={this.state.realCashData.table ? this.state.realCashData.table.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Watch;
