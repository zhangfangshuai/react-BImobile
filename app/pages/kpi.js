import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import Charts from '../components/charts'
import VerticalGist from '../components/verticalgist'
import CarOption from '../components/carOption'
import Table from '../components/table'
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
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        for (let mst of ['cityGist','kpi']) {
            this.state[mst + 'Req'].cityId = c.value;
            this.axiosRequest(this.state[mst + 'Req'], mst);
        }
    }

    showArea() {
        console.log('showArea');
    }

    handleGist() {
        console.log('handle gist');
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
        this.state[master + 'Req'].carType = ct;
        this.axiosRequest(this.state[master + 'Req'], master);
    }

    componentDidMount() {
        this.axiosRequest(this.state.nationReq, 'nation');
        this.axiosRequest(this.state.cityGistReq, 'cityGist');
        this.axiosRequest(this.state.kpiReq, 'kpi');
    }

    render() {
        var ids = [], tbIds = [], K = this.state.kpiData, carcashTb, saleTb, lawTb;
        if (K.areaKpiList) {
            var table = [
                {id: 1000, name: "j", master: "carcash"},
                {id: 1002, name: "i", master: "sale"},
                {id: 1001, name: "m", master: "law"}
            ];
            // 获取table集
            for (let tb of table) {
                tbIds.push(tb.id);
            }
            // 获取大区集
            for (let area of K.areaKpiList) {
                ids.push(area.area_id);
            }
            for (let tb of table) {
                // ids.push(tb.id);
                carcashTb = K.areaKpiList.map((area, idx) => {
                    return <KpiArea data={K} item={area} ids={ids} tb={table[0]} tbIds={tbIds} key={idx} />
                })
                saleTb = K.areaKpiList.map((area, idx) => {
                    return <KpiArea data={K} item={area} ids={ids} tb={table[1]} tbIds={tbIds} key={idx} />
                })
                lawTb = K.areaKpiList.map((area, idx) => {
                    return <KpiArea data={K} item={area} ids={ids} tb={table[2]} tbIds={tbIds} key={idx} />
                })
            }
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section>
                    <div className="wrap clearTopGap">
                        <Title name="城市概览 - " variable={this.state.currentCity.text == '全国' ? '北京' : this.state.currentCity.text } />
                        <VerticalGist data={this.state.cityGistData} handleGist={this.handleGist.bind(this)} />
                        <div className="cityGistBtn">城市详情</div>
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="当月KPI-" variable="车均收现" />
                        <CarOption new={true} handleCar={this.handleCar.bind(this)} master="kpi" />
                        <Table self="kpi" tbody={carcashTb} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                <section>
                    <div className="wrap clearTopGap">
                        <div className="hook"></div>
                        <Title name="当月KPI-" variable="上架率" />
                        <Table self="kpi" tbody={saleTb} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="当月KPI-" variable="违法处理率" />
                        <Table self="kpi" tbody={lawTb} thead={['大区/城市','目标值','当前值','完成度']} />
                    </div>
                </section>
            </div>
        )
    }

}

export default Watch;
