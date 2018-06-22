import React from 'react'
import { CITY_LIST } from '../config/city_config'
import Header from '../components/header'
import Title from '../components/title'
import CarOption from '../components/carOption'
import SingleDatePicker from '../components/singleDatePicker'
import DoubleDatePicker from '../components/doubleDatePicker'
import ThreeColSelector from '../components/threeColSelector'
import DutyPerson from '../components/dutyPerson'
import Table from '../components/table.js'

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

    handleDDP(startDate, endDate) {
        console.log(startDate, endDate);
    }

    componentDidMount() {
        axiosGet(this.state.incomeReq, (res) => {
            this.setState({ incomeData: res });
        }, false);
        axiosGet(this.state.rechargeReq, (res) => {
            this.setState({ rechargeData: res });
            sessionStorage.RECHARGE = JSON.stringify(res);
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
        if (this.state.rechargeData.length != 0) {
            var rechargeTb = this.state.rechargeData.data.map((d) => {
                return (
                    <li key={this.state.rechargeData.data.indexOf(d)}>
                        <p>{d.data0}</p>
                        <p>{this.state.rechargeIndex == 0 ? d.data1 : this.state.rechargeIndex == 1 ? d.data5 : d.data9}</p>
                        <p>{this.state.rechargeIndex == 0 ? d.data2 : this.state.rechargeIndex == 1 ? d.data6 : d.data10}</p>
                        <p>{this.state.rechargeIndex == 0 ? d.data3 : this.state.rechargeIndex == 1 ? d.data7 : d.data11}</p>
                        <p>{this.state.rechargeIndex == 0 ? d.data4 : this.state.rechargeIndex == 1 ? d.data8 : d.data12}</p>
                        <p>{this.state.rechargeIndex == 2 ? d.data13 : '--'}</p>
                    </li>
                )
            })
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section className="section-box">
                    <div className="wrap clearTopGap">
                        <Title name="营收概况" />
                        <CarOption handleCar={this.handleIncome.bind(this)} />
                        <SingleDatePicker handleDate={this.handleIncome.bind(this)} />
                        <Table tbody={incomeTb}
                            thead={['指标名称', '昨日', '前日', '同比', '同比增幅']} />
                        <DutyPerson sectionId="58" />
                    </div>
                </section>

                <section className="section-box">
                    <div className="wrap">
                        <Title name="用户充值" />
                        <ThreeColSelector
                            cols={['500元以下', '500元以上', '合计']}
                            handleTCS={this.handleTCS.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDDP.bind(this)} />
                        <Table self="recharge" tbody={rechargeTb}
                            thead={['日期', '用户数', '次数', '次均充值金额', '充值金额', '消费金额']} />
                        <DutyPerson sectionId="59" />
                    </div>
                </section>
            </div>
        )
    }
}

export default Income;
