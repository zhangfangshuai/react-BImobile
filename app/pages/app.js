import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import InlineTranglePicker from '../components/inlineTranglePicker'
import MultiColSelector from '../components/multiColSelector'
import SingleDatePicker from '../components/singleDatePicker'
import Charts from '../components/charts'
import DoubleDatePicker from '../components/doubleDatePicker'
import Table from '../components/table'
import TableBody from '../components/tableBody'
import Pagination from '../components/pagination'

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
            },
            dauListData: [],
            dauListPage: 1,
            dauListReq: {
                interface: 'dau/getDauListReport',
                cityId: CITY_LIST[0].value,
                appVersion: '',
                os: 0,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            startListData: [],
            startListPage: 1,
            startListReq: {
                interface: 'dau/getOpenListReport',
                cityId: CITY_LIST[0].value,
                appVersion: '',
                os: 0,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            cityData: [],
            cityPage: 1,
            cityReq: {
                interface: 'dau/getDauCityList',
                dateId: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        this.state.dauFunnelReq.cityId = c.value;
        this.dauFunnelRequest(this.state.dauFunnelReq);
        this.state.dauListReq.cityId = c.value;
        this.dauListRequest(this.state.dauListReq);
        this.state.startListReq.cityId = c.value;
        this.startListRequest(this.state.startListReq);
        this.state.cityReq.cityId = c.value;
        this.cityRequest(this.state.cityReq);
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

    // DAU List TODO: 三角选择互相干扰问题
    dauListRequest(p) {
        if (isParamValid(p, 'dau_list')) {
            axiosGet(p, (r) => {
                this.setState({
                    dauListData: r,
                    dauListPage: 1
                })
            })
        }
    }

    handlePickDAUList(v, master) {
        this.state.dauListReq.appVersion = v;
        this.state.startListReq.appVersion = v;
        this.dauListRequest(this.state.dauListReq);
        this.startListRequest(this.state.startListReq);
    }
    handleTCSDAUList(idx) {
        this.state.dauListReq.os = idx == 2 ? '' : idx;
        this.state.startListReq.os = idx == 2 ? '' : idx;
        this.dauListRequest(this.state.dauListReq);
        this.startListRequest(this.state.startListReq);
    }
    handleDateDAUList(date, picker) {
        picker == 'start' ? this.state.dauListReq.startDate = date : this.state.dauListReq.endDate = date;
        picker == 'start' ? this.state.startListReq.startDate = date : this.state.startListReq.endDate = date;
        this.dauListRequest(this.state.dauListReq);
        this.startListRequest(this.state.startListReq);
    }
    handlePageDauList(page) {
        this.setState({ dauListPage: page })
    }

    // 不同用户启动分析
    startListRequest(p) {
        if (isParamValid(p, 'start_list')) {
            axiosGet(p, (r) => {
                this.setState({
                    startListData: r,
                    startListPage: 1
                })
            })
        }
    }
    handlePageStartList(page) {
        this.setState({ startListPage: page })
    }

    // 不同城市对比
    cityRequest(p) {
        if (isParamValid(p, 'cities_Comparison')) {
            axiosGet(p, (r) => {
                this.setState({
                    cityData: r,
                    cityPage: 1
                })
            })
        }
    }
    handleDateCity(date) {
        this.state.cityReq.dateId = date;
        this.cityRequest(this.state.cityReq);
    }

    componentDidMount() {
        this.dauFunnelRequest(this.state.dauFunnelReq);
        this.dauListRequest(this.state.dauListReq);
        this.startListRequest(this.state.startListReq);
        this.cityRequest(this.state.cityReq);
    }


    render() {
        let DLD = this.state.dauListData, DLP = this.state.dauListPage;
        let LIST = DLD.length < 10 ? DLD : DLD.slice((DLP-1)*PAGESIZE, DLP*PAGESIZE);
        if (LIST.length  > 0) {
            var dauListTb = LIST.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.dateId, i.startapp, i.pickupcar, i.returncar, i.downorder]} />
                )
            });
        }

        let SLD = this.state.startListData, SLP = this.state.startListPage;
        let START = SLD.length < 10 ? SLD : SLD.slice((SLP-1)*PAGESIZE, SLP*PAGESIZE);
        if (START.length > 0) {
            var startListTb = START.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.dateId, i.openappRegusers, i.openappAuditusers, i.openappUsableusers]} />
                )
            });
        }

        let C = this.state.cityData, CP = this.state.cityPage;
        let CITY = C.length < 10 ? C : C.slice((CP-1)*PAGESIZE, CP*PAGESIZE);
        if (CITY.length > 0) {
            var cityTb = CITY.map((i, idx) => {
                return (
                    <TableBody key={idx}
                      data={[i.cityName, i.dauUsers, i.usableUsers, i.openappUsablenum, i.usableRate+'%', i.pickupcarUsers, i.returncarUsers, i.downorderUsers, i.orderRate+'%']} />
                )
            });
        }
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />
                <section>
                    <div className="wrap clearTopGap">
                        <Title name="DAU漏斗" />
                        <InlineTranglePicker type="appVersion" master="dauFunnel" handlePick={this.handlePickVersion.bind(this)} />
                        <MultiColSelector cols={['IOS', '安卓', '全部']} handleTCS={this.handleTCS.bind(this)} />
                        <SingleDatePicker handleDate={this.handleDateFunnel.bind(this)} />
                        <Charts self="small-chart" type="funnel" data={this.state.dauFunnelData.nums} />
                        <Charts self="small-chart" type="funnel" data={this.state.dauFunnelData.userNum} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="DAU统计报表" />
                        <InlineTranglePicker type="appVersion" master="dauList" handlePick={this.handlePickDAUList.bind(this)} />
                        <MultiColSelector cols={['IOS', '安卓', '全部']} handleTCS={this.handleTCSDAUList.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDateDAUList.bind(this)} />
                        <Table self="dauList" tbody={dauListTb}
                            thead={['日期','APP启动人数','点击取车网点','点击还车网点','点击预约车量']} />
                        <Pagination
                            handlePage={this.handlePageDauList.bind(this)}
                            length={this.state.dauListData ? this.state.dauListData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="不同类型用户启动APP报表" />
                        <Table self="startList" tbody={startListTb}
                            thead={['日期','注册用户启动人次','双证用户启动人次','可用车用户启动人次']} />
                        <Pagination
                            handlePage={this.handlePageStartList.bind(this)}
                            length={this.state.startListData ? this.state.startListData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="不同城市对比" />
                        <SingleDatePicker handleDate={this.handleDateCity.bind(this)} />
                        <Table self="city-compare" tbody={cityTb}
                            thead={['城市','DAU人数','可用车用户数','可用车打开人数', '可用车用户占比', '点击取车网点', '点击还车网点','点击预定车辆','订单转化率']} />
                    </div>
                </section>
            </div>
        )
    }
}

export default App;
