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
import DutyPerson from '../components/dutyPerson'

class Kpi extends React.Component {
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
            cityActive: { 'display': 'block' },
            nationActive: { 'display': 'block' }
        }
    }

    selectCity(c) {
        this.setState({
            currentCity: c,
            cityActive: { 'display': c.value == 1 ? 'none' : 'block' },
            nationActive: { 'display': c.value == 1 ? 'block' : 'none' }
        });
        for (let mst of ['cityGist','kpi','core']) {
            this.state[mst + 'Req'].cityId = (mst == 'cityGist' && c.value ==1) ? 2 : c.value;
            this.axiosRequest(this.state[mst + 'Req'], mst);
        }

    }

    cityDetail() {
        this.setState({
            cityActive: { 'display': 'block' },
            nationActive: { 'display': 'none' }
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
        this.setState({
            cityActive: { 'display': 'none' },
            nationActive: { 'display': 'block' }
        })
    }

    render() {
        var K = this.state.kpiData, kpis = new Array(3), kpiVar = ['j','i','m'];
        if (K.areaKpiList) {
              for (let k = 0; k < 3; k++) {
                  kpis[k] = K.areaKpiList.map((area, idx) => {
                      return <KpiArea key={idx} data={K} item={area} variable={kpiVar[k]} />
                  })
              }
        }

        var C = this.state.coreData, core = new Array(5);
        if (C.kpi1) {
            for (let c = 1; c <= 5; c++ ) {
                core[c] = C['kpi'+c].map((i, idx) => {
                    let icon = <i className={i.tongbi_rate > 0 ? 'rise' : i.tongbi_rate == 0 ? '' : 'down'}></i>;
                    return (
                        <li key={idx}>
                            <p>{i.kpiname}</p><p>{i.kpi_yes}</p><p>{i.month_total}</p>
                            <p>{i.kpi_tongbi}</p><p>{i.tongbi_rate+'%'}{icon}</p>
                        </li>
                    )
                });
            }
        }

        var coreObj = [
            {id:1, name:'车辆'},
            {id:2, name:'网点'},
            {id:3, name:'用户'},
            {id:4, name:'订单'},
            {id:5, name:'营收'}
        ];
        let coreHTML = coreObj.map((i,idx) => {
            return (
                <section key={idx}>
                    <div className="wrap">
                        <Title name="核心指标-" variable={i.name} />
                        <Table tbody={core[i.id]} thead={['指标名称','昨日','前日','同比','同比增幅']} />
                        <DutyPerson sectionId={i.id+9} city={this.state.currentCity} />
                    </div>
                </section>
            )
        })

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
                        <div className="cityGistBtn" style={this.state.nationActive} onClick={this.cityDetail.bind(this)}>城市详情</div>
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
                        <Table self="kpi" tbody={kpis[0]} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                <section style={this.state.nationActive}>
                    <div className="wrap clearTopGap">
                        <div className="hook"></div>
                        <Title name="当月KPI-上架率" />
                        <Table self="kpi" tbody={kpis[1]} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                <section style={this.state.nationActive}>
                    <div className="wrap">
                        <Title name="当月KPI-违法处理率" />
                        <Table self="kpi" tbody={kpis[2]} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                { coreHTML }
            </div>
        )
    }

}

export default Kpi;
