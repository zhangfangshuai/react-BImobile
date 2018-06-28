import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import CarOption from '../components/carOption'
import SingleDatePicker from '../components/singleDatePicker'
import DoubleDatePicker from '../components/doubleDatePicker'
import ThreeColSelector from '../components/threeColSelector'
import Table from '../components/table'
import DutyPerson from '../components/dutyPerson'
import Pagination from '../components/pagination'

class Income extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            }
        };
    }

    selectCity(c) {
        this.state.incomeReq.cityId = c.value;
        if (isParamValid(this.state.incomeReq, 'income')) {
            axiosGet(this.state.incomeReq, (res) => {
                this.setState({
                    incomeData: res
                })
            }, false)
        }
        this.state.rechargeReq.cityId = c.value;
        if (isParamValid(this.state.rechargeReq, 'income')) {
            axiosGet(this.state.rechargeReq, (res) => {
                this.setState({
                    rechargeData: res,
                    rechargeIndex: 0,
                    rechargePage: 1
                });
            }, false)
        }
        this.setState({
            currentCity: c
        })
    }

    handleIncome(cb, type) {
        type === "car" ? this.state.incomeReq.carType = cb : this.state.incomeReq.dateId = cb;
        if (isParamValid(this.state.incomeReq, 'income')) {
            axiosGet(this.state.incomeReq, (res) => {
                this.setState({
                    incomeData: res
                })
            }, false)
        }
    }

    handleTCS(cb) {
        this.setState({
            rechargeIndex: cb
        })
    }


    handleDDP(date, picker) {
        picker == "start" ? this.state.rechargeReq.startDate = date : this.state.rechargeReq.endDate = date;
        if (isPickerValid(this.state.rechargeReq.startDate, this.state.rechargeReq.endDate)) {
            axiosGet(this.state.rechargeReq, (res) => {
                this.setState({
                    rechargeData: res,
                    rechargePage: 1
                })
            }, false)
        } else {
            this.setState({
                rechargeData: [],
                rechargePage: 1
            })
        }
    }

    handlePage(page) {
        this.setState({
            rechargePage: page
        })
    }

    componentDidMount() {
        axiosGet(this.state.incomeReq, (res) => {
            this.setState({ incomeData: res });
        }, false);
        axiosGet(this.state.rechargeReq, (res) => {
            this.setState({ rechargeData: res });
        }, false)
    }

    render() {
        if (this.state.incomeData.length != 0) {
            var incomeTb = this.state.incomeData.data.map((item) => {
                return (
                    <li key={this.state.incomeData.data.indexOf(item)}>
                        <p>{item.data0}</p>
                        <p>{item.data1}</p>
                        <p>{item.data2}</p>
                        <p>{item.data3}</p>
                        <p>{item.data4}</p>
                    </li>
                )
            });
        }

        let D = this.state.rechargeData, P = this.state.rechargePage;
        let RECHARGE = D.length == 0 ? [] : D.data.slice((P-1)*PAGESIZE, P*PAGESIZE);
        if (RECHARGE.length != 0) {
            let idx = this.state.rechargeIndex;
            var rechargeTb = RECHARGE.map((d) => {
                return (
                    <li key={RECHARGE.indexOf(d)}>
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

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="营收概况" />
                        <CarOption handleCar={this.handleIncome.bind(this)} />
                        <SingleDatePicker handleDate={this.handleIncome.bind(this)} />
                        <Table self="income" tbody={incomeTb}
                            thead={['指标名称', '昨日', '前日', '同比', '同比增幅']} />
                        <DutyPerson sectionId="58" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="用户充值" />
                        <ThreeColSelector
                            cols={['500元以下', '500元以上', '合计']}
                            handleTCS={this.handleTCS.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDDP.bind(this)}/>
                        <Table self="recharge" tbody={rechargeTb}
                            thead={['日期', '用户数', '次数', '次均充值金额', '充值金额', '消费金额']} />
                        <Pagination
                            handlePage={this.handlePage.bind(this)}
                            length={this.state.rechargeData.data ? this.state.rechargeData.data.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="59" city={this.state.currentCity} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Income;
