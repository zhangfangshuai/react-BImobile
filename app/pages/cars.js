import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import DoubleDatePicker from '../components/doubleDatePicker'
import Table from '../components/table'
import TableBody from '../components/tableBody'
import Pagination from '../components/pagination'
import DutyPerson from '../components/dutyPerson'
import MultiColSelector from '../components/multiColSelector'
import Charts from '../components/charts'

class Cars extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            carsData: [],
            carsPage: 1,
            carsReq: {
                interface: 'car/getKpiCarInfo',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            onlineData: [],
            onlineAvg: 0,
            onlineReq: {
                interface: 'car/getKpiCarRate',
                cityId: CITY_LIST[0].value,
                hourId: 10,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            offlineData: [],
            offlineReq: {
                interface: 'car/getKpiCarofflineData',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            offlineTableData: [],
            offlineTablePage: 1,
            offlineTableReq: {
                interface: 'car/getCarofflineTableData',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            }
        }
    }

    handleCity(c) {
        this.setState({ currentCity: c });
        this.state.carsReq.cityId = c.value;
        this.carsRequest(this.state.carsReq);
        this.state.onlineReq.cityId = c.value;
        this.onlineRequest(this.state.onlineReq);
        this.state.offlineReq.cityId = c.value;
        this.offlineRequest(this.state.offlineReq);
        this.state.offlineTableReq.cityId = c.value;
        this.offlineTableRequest(this.state.offlineTableReq);
    }

    // 车辆概况
    carsRequest(p) {
        if (isParamValid(p, 'cars_info')) {
            axiosGet(p, (r) => {
                this.setState({
                    carsData: r,
                    carsPage: 1
                })
            });
        }
    }
    hanldeDateCars(date, picker) {
        picker == 'start' ? this.state.carsReq.startDate = date : this.state.carsReq.endDate = date;
        this.carsRequest(this.state.carsReq);
    }
    handlePageCars(page) {
        this.setState({ carsPage: page });
    }

    // 上架率
    onlineRequest(p) {
        if (isParamValid(p, 'cars_online')) {
            axiosGet(p, (r) => {
                this.setState({
                    onlineData: r,
                    onlineAvg: r.AvgPutawayRate
                })
            });
        }
    }
    handleTCS(index) {
        let timestamp = index == 0 ? 10 : index == 1 ? 17 : -1;
        this.state.onlineReq.hourId = timestamp;
        this.onlineRequest(this.state.onlineReq);
    }
    handleDateOnline(date, picker) {
        picker == 'start' ? this.state.onlineReq.startDate = date : this.state.onlineReq.endDate = date;
        this.onlineRequest(this.state.onlineReq);
    }

    // 离线图
    offlineRequest(p) {
        if (isParamValid(p, 'cars_offline')) {
            axiosGet(p, (r) => { this.setState({ offlineData: r }) });
        }
    }
    handleDateOffline(date, picker) {
        if (picker == 'start') {
            this.state.offlineReq.startDate = date;
            this.state.offlineTableReq.startDate = date;
        } else {
            this.state.offlineReq.endDate = date;
            this.state.offlineTableReq.endDate = date;
        }
        this.offlineRequest(this.state.offlineReq);
        this.offlineTableRequest(this.state.offlineTableReq);
    }

    // 离线状况
    offlineTableRequest(p) {
        if (isParamValid(p, 'car_offline_table')) {
            axiosGet(p, (r) => {
                this.setState({
                    offlineTableData: r.table,
                    offlineTablePage: 1
                });
            })
        }
    }
    handlePageOfflineTable(page) {
        this.setState({ offlineTablePage: page });
    }


    componentDidMount() {
        this.carsRequest(this.state.carsReq);
        this.onlineRequest(this.state.onlineReq);
        this.offlineRequest(this.state.offlineReq);
        this.offlineTableRequest(this.state.offlineTableReq);
    }

    render() {
        let CD = this.state.carsData, CP = this.state.carsPage;
        let CARS = CD.length < 10 ? CD : CD.slice((CP-1)*PAGESIZE, CP*PAGESIZE);
        if (CARS.length > 0) {
            var carsTb = CARS.map((i, idx) => {
                return <TableBody key={idx}
                  data={[i.dateId, i.totalCarNum, i.operateCarNum, i.onNum, i.offNum, i.lowVoltageNum, i.upkeepNum, i.accidentNum, i.maintainNum, i.offlineNum, i.missMateriailNum]} />
            });
        }

        let OD = this.state.offlineTableData, OP = this.state.offlineTablePage;
        let ODT = OD.length < 10 ? OD : OD.slice((OP-1)*PAGESIZE, OP*PAGESIZE);
        if (ODT.length > 0) {
            var offlineTb = ODT.map((i,idx) => {
                return <TableBody key={idx} data={[i.data0, i.data1, i.data2]} />
            })
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.handleCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="车辆概况" />
                        <DoubleDatePicker handleDate={this.hanldeDateCars.bind(this)} />
                        <Table self="cars" tbody={carsTb}
                            thead={['日期','总购置车辆','可运营车辆','上架车辆','下架车辆','低电下架','运维下架','事故下架','维修下架','离线下架','物料缺失下架']} />
                        <Pagination
                            handlePage={this.handlePageCars.bind(this)}
                            length={this.state.carsData ? this.state.carsData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="40" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="上架率" />
                        <MultiColSelector cols={['10点', '17点', '全天']}
                            handleTCS={this.handleTCS.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDateOnline.bind(this)}/>
                        <Charts self="cars_online" type="line_stacked_area" data={this.state.onlineData} />
                        <div className="onlineAvg">平均上架率: {this.state.onlineAvg}%</div>
                        <DutyPerson sectionId="41" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="机车离线图" />
                        <DoubleDatePicker handleDate={this.handleDateOffline.bind(this)}/>
                        <Charts self="cars_offline" type="line_basic" data={this.state.offlineData} />
                        <DutyPerson sectionId="42" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="机车离线状况" />
                        <Table self="cars_offline_data" tbody={offlineTb} thead={['城市','日期','离线数量']} />
                        <Pagination
                            handlePage={this.handlePageOfflineTable.bind(this)}
                            length={this.state.offlineTableData ? this.state.offlineTableData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="43" city={this.state.currentCity} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Cars;
