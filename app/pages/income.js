import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import CarOption from '../components/carOption'
import SingleDatePicker from '../components/singleDatePicker'
import DoubleDatePicker from '../components/doubleDatePicker'
import MultiColSelector from '../components/multiColSelector'
import Table from '../components/table'
import TableBody from '../components/tableBody'
import DutyPerson from '../components/dutyPerson'
import Pagination from '../components/pagination'

class Income extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            masters: ['income','recharge','hisIncome','debt'],
            currentCity: CITY_LIST[0],
            incomeData: [],
            incomeReq : {
                interface: 'getInComeDetail',
                cityId: CITY_LIST[0].value,
                carType: 0,
                dateId: getDateOffset(-1)
            },
            rechargeData: [],
            rechargeIndex: 0,
            rechargePage: 1,
            rechargeReq : {
                interface: 'getRechargeInfo',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            hisIncomeData: [],
            hisIncomePage: 1,
            hisIncomeReq: {
                interface: 'gethistoryEarning',
                cityId: CITY_LIST[0].value,
                typeId: 0,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            debtData: [],
            debtPage: 1,
            debtReq: {
                interface: 'getNopayEarning',
                cityId: CITY_LIST[0].value,
                typeId: 0,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            }
        };
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

    handleCar(ct, master) {
        master == 'income' ? this.state[master + 'Req'].carType = ct : this.state[master + 'Req'].typeId = ct
        this.axiosRequest(this.state[master + 'Req'], master);
    }

    handleSingleDate(date, master) {
        this.state[master + 'Req'].dateId = date;
        this.axiosRequest(this.state[master + 'Req'], master);
    }

    handleDoubleDate(date, picker, master) {
        picker == "start" ? this.state[master + 'Req'].startDate = date : this.state[master + 'Req'].endDate = date;
        if (isPickerValid(this.state[master + 'Req'].startDate, this.state[master + 'Req'].endDate)) {
            this.axiosRequest(this.state[master + 'Req'], master);
        } else {
            this.setState((prevState) => {
                prevState[master + 'Data'] = [];
                prevState[master + 'Page'] = 1;
            })
        }
    }

    handlePage(p, master) {
        this.setState((prevState) => {
            prevState[master + 'Page'] = p;
        });
    }

    handleTCS(cb) {
        this.setState({ rechargeIndex: cb });
    }

    componentDidMount() {
        for (let mst of this.state.masters) {
            this.axiosRequest(this.state[mst+'Req'], mst);
        }
    }

    render() {
        if (this.state.incomeData.data) {
            var incomeTb = this.state.incomeData.data.map((i, idx) => {
                let icon = <i className={i.data4 > 0 ? 'rise' : i.data4 == 0 ? '' : 'down'}></i>;
                return (
                    <li key={idx}>
                        <p>{i.data0}</p><p>{i.data1}</p><p>{i.data2}</p>
                        <p>{i.data3}</p><p>{i.data4+'%'}{icon}</p>
                    </li>
                )
            });
        }

        var RC = this.state.rechargeData, RCP = this.state.rechargePage;
        var RECHARGE = RC.length == 0 ? [] : RC.data.slice((RCP-1)*PAGESIZE, RCP*PAGESIZE);
        if (RECHARGE.length > 0) {
            let idx = this.state.rechargeIndex;
            var rechargeTb = RECHARGE.map((d, i) => {
                return (
                    <li key={i}>
                        <p>{d.data0}</p>
                        <p>{idx == 0 ? d.data1 : idx == 1 ? d.data5 : d.data9}</p>
                        <p>{idx == 0 ? d.data2 : idx == 1 ? d.data6 : d.data10}</p>
                        <p>{idx == 0 ? d.data3 : idx == 1 ? d.data7 : d.data11}</p>
                        <p>{idx == 0 ? d.data4 : idx == 1 ? d.data8 : d.data12}</p>
                        <p>{idx == 2 ? d.data13 : '--'}</p>
                    </li>
                )
            })
        }

        var H = this.state.hisIncomeData, HP = this.state.hisIncomePage;
        var HIS = H.length < 10 ? H : H.slice((HP-1)*PAGESIZE, HP*PAGESIZE);
        if (HIS.length > 0) {
            var hisIncomeTb = HIS.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.date_id, i.sumPayAmount, i.sumAmount, i.sumCouponAmount, i.sumnoPayAmount, i.sumnoPayAmount_t]} />
                )
            })
        }

        var DE = this.state.debtData, DEP = this.state.debtPage;
        var DEBT = DE.length < 10 ? DE : DE.slice((DEP-1)*PAGESIZE, DEP*PAGESIZE);
        if (DEBT.length > 0) {
            var debtTb = DEBT.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.date_id, i.noPay_sumAmount, i.noPay_user, i.noPay_Amount_old, i.noPay_Amount_new, i.noPay_amount_dep, i.noPay_amount_zmxy]} />
                )
            })
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="营收概况" />
                        <CarOption handleCar={this.handleCar.bind(this)} master="income"/>
                        <SingleDatePicker handleDate={this.handleSingleDate.bind(this)} master="income" />
                        <Table self="income" tbody={incomeTb} thead={['指标名称', '昨日', '前日', '同比', '同比增幅']} />
                        <DutyPerson sectionId="58" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="用户充值" />
                        <MultiColSelector cols={['500元以下', '500元以上', '合计']} handleTCS={this.handleTCS.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDoubleDate.bind(this)} master="recharge"/>
                        <Table self="recharge" tbody={rechargeTb} thead={['日期','用户数','次数','次均充值金额','充值金额','消费金额']} />
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.rechargeData.data ? this.state.rechargeData.data.length : 0}
                            pageSize={PAGESIZE}
                            master="recharge" />
                        <DutyPerson sectionId="59" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="历史营收分析" />
                        <CarOption handleCar={this.handleCar.bind(this)} master="hisIncome"/>
                        <DoubleDatePicker handleDate={this.handleDoubleDate.bind(this)} master="hisIncome"/>
                        <Table self="hisIncome" tbody={hisIncomeTb} thead={['日期','收现','收入','优惠','未结算','累计未结算']} />
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.hisIncomeData ? this.state.hisIncomeData.length : 0}
                            pageSize={PAGESIZE}
                            master="hisIncome" />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="未结算金额分析" />
                        <CarOption handleCar={this.handleCar.bind(this)} master="debt"/>
                        <DoubleDatePicker handleDate={this.handleDoubleDate.bind(this)} master="debt"/>
                        <Table self="debt" tbody={debtTb} thead={['日期','累计未结算','未结算用户','老用户未结算','新用户未结算','押金用户未结算','芝麻免押未结算']} />
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.debtData ? this.state.debtData.length : 0}
                            pageSize={PAGESIZE}
                            master="debt" />
                    </div>
                </section>
            </div>
        )
    }
}

export default Income;
