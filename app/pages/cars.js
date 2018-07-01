import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import DoubleDatePicker from '../components/doubleDatePicker'
import Table from '../components/table'
import Pagination from '../components/pagination'
import DutyPerson from '../components/dutyPerson'
import ThreeColSelector from '../components/threeColSelector'
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
            onlineReq: {
                interface: 'car/getKpiCarRate',
                cityId: CITY_LIST[0].value,
                hourId: 10,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            }
        }
    }

    handleCity(c) {
        this.setState({ currentCity: c });
    }

    // 车辆概况
    carsRequest(p) {
        if (isParamValid(p, 'carsInfo')) {
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
        if (isParamValid(p, 'online')) {
            axiosGet(p, (r) => { this.setState({ onlineData: r }) });
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

    componentDidMount() {
        this.carsRequest(this.state.carsReq);
        this.onlineRequest(this.state.onlineReq);
    }

    render() {
        let CD = this.state.carsData, CP = this.state.carsPage;
        let CARS = CD.length < 10 ? CD : CD.slice((CP-1)*PAGESIZE, CP*PAGESIZE);
        if (CARS.length > 0) {
            var carsTb = CARS.map((i) => {
                return (
                    <li key={CARS.indexOf(i)}>
                        <p>{i.dateId}</p><p>{i.totalCarNum}</p><p>{i.operateCarNum}</p><p>{i.onNum}</p>
                        <p>{i.offNum}</p><p>{i.lowVoltageNum}</p><p>{i.upkeepNum}</p><p>{i.accidentNum}</p>
                        <p>{i.maintainNum}</p><p>{i.offlineNum}</p><p>{i.missMateriailNum}</p>
                    </li>
                )
            });
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
                        <ThreeColSelector cols={['10点', '17点', '全天']}
                            handleTCS={this.handleTCS.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDateOnline.bind(this)}/>
                        <Charts type="stacked_area" data={this.state.onlineData} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Cars;
