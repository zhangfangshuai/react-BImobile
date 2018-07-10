import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import InlineTranglePicker from '../components/inlineTranglePicker'
import ThreeColSelector from '../components/threeColSelector'
import SingleDatePicker from '../components/singleDatePicker'
import Charts from '../components/charts'
import DoubleDatePicker from '../components/doubleDatePicker'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            dauFunnelData: [],
            dauFunnelReq: {
                interface: 'dau/getReportByPeople',
                cityId: CITY_LIST[0].value,
                appVersion: '',
                os: 0,
                dateId: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        this.state.dauFunnelReq.cityId = c.value;
        this.dauFunnelRequest(this.state.dauFunnelReq);
    }


    // DAU Funnel
    dauFunnelRequest(p) {
        if (isParamValid(p, 'dau_funnel')) {
            axiosGet(p, (r) => {
                this.setState({
                    dauFunnelData: r
                })
            })
        }
    }
    handlePickVersion(v, master) {
        console.log(v, master);
        this.state.dauFunnelReq.appVersion = v == '全部' ? '' : v;
        this.dauFunnelRequest(this.state.dauFunnelReq);
    }
    handleTCS(idx) {
        this.state.dauFunnelReq.os = idx == 2 ? '' : idx;
        this.dauFunnelRequest(this.state.dauFunnelReq);
    }
    handleDateFunnel(date) {
        this.state.dauFunnelReq.dateId = date;
        this.dauFunnelRequest(this.state.dauFunnelReq);
    }

    // DAU List
    handlePickDAUList(v, master) {
        console.log(v, master);
    }
    handleTCSDAUList(idx) {
        console.log(idx);
    }
    handleDateDAUList(date, picker) {
        console.log(date);
    }

    componentDidMount() {
        this.dauFunnelRequest(this.state.dauFunnelReq);
    }


    render() {
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section>
                    <div className="wrap clearTopGap">
                        <Title name="DAU漏斗" />
                        <InlineTranglePicker type="appVersion" master="dauFunnel" handlePick={this.handlePickVersion.bind(this)} />
                        <ThreeColSelector cols={['IOS', 'Android', '全部']} handleTCS={this.handleTCS.bind(this)} />
                        <SingleDatePicker handleDate={this.handleDateFunnel.bind(this)} />
                        <Charts self="daufunnel" type="funnel" data={this.state.dauFunnelData.nums} />
                        <Charts self="daufunnel" type="funnel" data={this.state.dauFunnelData.userNum} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="DAU统计报表" />
                        <InlineTranglePicker type="appVersion" master="dauList" handlePick={this.handlePickDAUList.bind(this)} />
                        <ThreeColSelector cols={['IOS', 'Android', '全部']} handleTCS={this.handleTCSDAUList.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDateDAUList.bind(this)} />
                    </div>
                </section>
            </div>
        )
    }
}

export default App;
