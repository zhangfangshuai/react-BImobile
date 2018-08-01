import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import Charts from '../components/charts'
import VerticalGist from '../components/verticalGist'
import CarOption from '../components/carOption'
import Table from '../components/table'
import TableBody from '../components/tableBody'
import KpiArea from '../components/kpiArea'

class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            nationData: [],  // 全国地图用
            nationReq: { interface: 'kpi/getMapData' },
            cityGistData: [],
            cityGistReq: {
                interface: 'kpi/getKPICityData',
                cityId: CITY_LIST[1].value
            },
            kpiData: [],
            kpiReq: {
                interface: 'kpi/getCurrMonthKpiData',
                cityId: CITY_LIST[0].value,
                typeId: 1
            },
            coreData: [],
            coreReq: {
                interface: 'kpi/getCoreIndex',
                cityId: CITY_LIST[0].value
            },
            cityActive: {
                'display': 'none'
            },
            nationActive: {
                'display': 'block'
            }
        }
    }

    selectCity(c) {
        this.setState({
            currentCity: c,
            cityActive: { 'display': c.value == 1 ? 'none' : 'block' },
            nationActive: { 'display': c.value == 1 ? 'block' : 'none' }
        });
        for (let mst of ['cityGist','kpi','core']) {
            this.state[mst + 'Req'].cityId = c.value;
            this.axiosRequest(this.state[mst + 'Req'], mst);
        }

    }

    cityActive() {
        this.setState({
            cityActive: {
                'display': 'block'
            },
            nationActive: {
                'display': 'none'
            }
        })
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
        this.state[master + 'Req'].typeId = ct;
        this.axiosRequest(this.state[master + 'Req'], master);
    }
    updKpiGist(ct, master) {
        this.setState((prevState) => {
            let ASS = prevState.coreData.assess[0];
            switch (ct) {
              case 0:  // 新电车
                ASS.kpi_coCurrent = ASS.kpi_currentf;
                ASS.kpi_coGoal = ASS.kpi_goalf;
                ASS.kpi_coRate = ASS.kpi_ratef;
                break;
              case 1:  // 全部
                ASS.kpi_coCurrent = ASS.kpi_currenta;
                ASS.kpi_coGoal = ASS.kpi_goala;
                ASS.kpi_coRate = ASS.kpi_ratea;
                break;
              case 2: // 老电车
                ASS.kpi_coCurrent = ASS.kpi_currentg;
                ASS.kpi_coGoal = ASS.kpi_goalg;
                ASS.kpi_coRate = ASS.kpi_rateg;
                break;
              case 3: // 油车
                ASS.kpi_coCurrent = ASS.kpi_currenth;
                ASS.kpi_coGoal = ASS.kpi_goalh;
                ASS.kpi_coRate = ASS.kpi_rateh;
                break;
            }
        })
    }

    componentDidMount() {
        this.axiosRequest(this.state.nationReq, 'nation');
        this.axiosRequest(this.state.cityGistReq, 'cityGist');
        this.axiosRequest(this.state.kpiReq, 'kpi');
        this.axiosRequest(this.state.coreReq, 'core');
    }

    render() {
        var K = this.state.kpiData;
        if (K.areaKpiList) {
              var carcashTb = K.areaKpiList.map((area, idx) => {
                  return <KpiArea data={K} item={area} variable={'j'} key={idx} />
              })
              var saleTb = K.areaKpiList.map((area, idx) => {
                  return <KpiArea data={K} item={area} variable={'i'} key={idx} />
              })
              var lawTb = K.areaKpiList.map((area, idx) => {
                  return <KpiArea data={K} item={area} variable={'m'} key={idx} />
              })
        }

        var C = this.state.coreData;
        if (C.kpi1) {
            var coreCarTb = C.kpi1.map((i, idx) => {
                return <TableBody key={idx} data={[i.kpiname, i.kpi_yes,i.month_total,i.kpi_tongbi,i.tongbi_rate+'%']} />
            })
            var coreSiteTb = C.kpi2.map((i, idx) => {
                return <TableBody key={idx} data={[i.kpiname, i.kpi_yes,i.month_total,i.kpi_tongbi,i.tongbi_rate+'%']} />
            })
            var coreUserTb = C.kpi3.map((i, idx) => {
                return <TableBody key={idx} data={[i.kpiname, i.kpi_yes,i.month_total,i.kpi_tongbi,i.tongbi_rate+'%']} />
            })
            var coreOrderTb = C.kpi4.map((i, idx) => {
                return <TableBody key={idx} data={[i.kpiname, i.kpi_yes,i.month_total,i.kpi_tongbi,i.tongbi_rate+'%']} />
            })
            var coreIncomeTb = C.kpi5.map((i, idx) => {
                return <TableBody key={idx} data={[i.kpiname, i.kpi_yes,i.month_total,i.kpi_tongbi,i.tongbi_rate+'%']} />
            })
        }

        var yes = getDateOffset(-1);
        var yesterday = yes.slice(0,4)+'-'+yes.slice(4,6)+'-'+yes.slice(6,8);

        var RATE = this.state.coreData.assess ? this.state.coreData.assess[0] : {kpi_ratef:0, kpi_rated:0, kpi_ratec:0, kpi_ratee:0};
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section>
                    <div className="wrap clearTopGap">
                        <Title name="城市概览 - " variable={this.state.currentCity.text == '全国' ? '北京' : this.state.currentCity.text } />
                        <VerticalGist data={this.state.cityGistData} master="kpi_nation" />
                        <div className="cityGistBtn" style={this.state.nationActive} onClick={this.cityActive.bind(this)}>城市详情</div>
                    </div>
                </section>

                <section style={this.state.cityActive}>
                    <div className="wrap">
                        <Title name="当月KPI" />
                        <div className="subText">截至{yesterday}</div>
                        <CarOption new={true} handleCar={this.updKpiGist.bind(this)} master="core" />
                        <Charts self="city-kpi" type="circle" data={RATE.kpi_coRate || RATE.kpi_ratea}/>
                        <Charts self="city-kpi" type="circle" data={RATE.kpi_rated}/>
                        <Charts self="city-kpi" type="circle" data={RATE.kpi_ratec}/>
                        <Charts self="city-kpi" type="circle" data={RATE.kpi_ratee}/>
                        <VerticalGist data={RATE} master="kpi_city" />
                    </div>
                </section>

                <section style={this.state.nationActive}>
                    <div className="wrap">
                        <Title name="当月KPI-车均收现" />
                        <CarOption new={true} handleCar={this.handleCar.bind(this)} master="kpi" />
                        <Table self="kpi" tbody={carcashTb} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                <section style={this.state.nationActive}>
                    <div className="wrap clearTopGap">
                        <div className="hook"></div>
                        <Title name="当月KPI-上架率" />
                        <Table self="kpi" tbody={saleTb} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                <section style={this.state.nationActive}>
                    <div className="wrap">
                        <Title name="当月KPI-违法处理率" />
                        <Table self="kpi" tbody={lawTb} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                <section style={this.state.nationActive}>
                    <div className="wrap">
                        <Title name="核心指标-车辆" />
                        <Table tbody={coreCarTb} thead={['指标名称','昨日','前日','同比','同比增幅']}/>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="核心指标-网点" />
                        <Table tbody={coreSiteTb} thead={['指标名称','昨日','前日','同比','同比增幅']}/>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="核心指标-用户" />
                        <Table tbody={coreUserTb} thead={['指标名称','昨日','前日','同比','同比增幅']}/>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="核心指标-订单" />
                        <Table tbody={coreOrderTb} thead={['指标名称','昨日','前日','同比','同比增幅']}/>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="核心指标-营收" />
                        <Table tbody={coreIncomeTb} thead={['指标名称','昨日','前日','同比','同比增幅']}/>
                    </div>
                </section>
            </div>
        )
    }

}

export default Watch;
