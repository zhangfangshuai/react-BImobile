import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import TitleWithBubble from '../components/titleWithBubble'
import CarOption from '../components/carOption'
import Table from '../components/table'
import DutyPerson from '../components/dutyPerson'
import DoubleDatePicker from '../components/doubleDatePicker'
import SingleDatePicker from '../components/singleDatePicker'
import Pagination from '../components/pagination'

class Operation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            accidentData: [],
            accidentReq: {
                interface: 'getAccidentTop',
                cityId: CITY_LIST[0].value,
                carType: 0
            },
            lawData: [],
            lawPage: 1,
            lawReq: {
                interface: 'getPeccancyInfo',
                cityId: CITY_LIST[0].value,
                carType: 0,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            detailData: [],
            detailPage: 1,
            detailReq: {
                interface: 'getPeccancyDetail',
                cityId: CITY_LIST[0].value,
                carType: 0,
                dateId: getDateOffset(-1)
            }
        }
    }
    // 切换城市
    selectCity(city) {
        this.setState({ currentCity: city })
        this.state.accidentReq.cityId = city.value;
        this.accidentRequest(this.state.accidentReq);
        this.state.lawReq.cityId = city.value;
        this.lawRequest(this.state.lawReq);
        this.state.detailReq.cityId = city.value;
        this.detailRequst(this.state.detailReq);
    }

    accidentRequest(p) {
        if (isParamValid(p, 'Top 10')) {
            axiosGet(p, (res) => {
                this.setState({ accidentData: res.data });
            })
        }
    }

    handleTop10(car) {
        this.state.accidentReq.carType = car;
        this.accidentRequest(this.state.accidentReq);
    }

    lawRequest(p) {
        if (isParamValid(p, 'peccancyInfo')) {
            axiosGet(p, (res) => {
                this.setState({
                    lawData: res.data,
                    lawPage: 1
                });
            })
        }
    }
    handleCarLaw(car) {
        this.state.lawReq.carType = car;
        this.lawRequest(this.state.lawReq);
    }
    handleDateLaw(date, picker) {
        picker == 'start' ? this.state.lawReq.startDate = date : this.state.lawReq.endDate = date;
        if (isPickerValid(this.state.lawReq.startDate, this.state.lawReq.endDate)) {
            this.lawRequest(this.state.lawReq);
        }
    }
    handlePageLaw(page) {
        this.setState({ lawPage: page });
    }

    detailRequst(p) {
        if (isParamValid(p, 'peccancyDetail')) {
            axiosGet(p, (res) => {
                this.setState({
                    detailData: res.data,
                    detailPage: 1
                })
            })
        }
    }
    handleCarDetail(car) {
        this.state.detailReq.carType = car;
        this.detailRequst(this.state.detailReq);
    }
    handleDateDetail(date) {
        this.state.detailReq.dateId = date;
        isPickerValid(this.state.detailReq.dateId) && this.detailRequst(this.state.detailReq);
    }
    handlePageDetail(page) {
        this.setState({ detailPage: page });
    }

    componentDidMount() {
        axiosGet(this.state.accidentReq, (res) => {
            this.setState({ accidentData: res.data });
        })
        axiosGet(this.state.lawReq, (res) => {
            this.setState({ lawData: res.data });
        })
        axiosGet(this.state.detailReq, (res) => {
            this.setState({ detailData: res.data });
        })
    }

    render() {
        let A = this.state.accidentData, accidentTb;
        if (A.length > 0) {
            accidentTb = A.map((i) => {
                return (
                    <li key={A.indexOf(i)}>
                        <p>{A.indexOf(i) + 1}</p> <p>{i.data0}</p>
                        <p>{i.data1}'%'</p> <p>{i.data2}</p>
                    </li>
                )
            });
        }

        let LD = this.state.lawData, LP = this.state.lawPage;
        let L = LD.length < 10 ? LD : LD.slice((LP-1)*PAGESIZE, LP*PAGESIZE);
        if (L.length > 0) {
            var illegalTb = L.map((i) => {
                return (
                    <li key={L.indexOf(i)}>
                        <p>{i.data0}</p><p>{i.data5}</p><p>{i.data1}</p>
                        <p>{i.data2.toFixed(2)}'%'</p><p>{i.data3}</p>
                        <p>{i.data4.toFixed(2)}</p>
                    </li>
                )
            });
        }

        let DD = this.state.detailData, DP = this.state.detailPage;
        let DETAIL = DD.length < 10 ? DD : DD.slice((DP-1)*PAGESIZE, DP*PAGESIZE);
        if (DETAIL.length > 0) {
            var detailTb = DETAIL.map((i) => {
                let mark = i.detail > 3 ? '***' : '';
                return (
                    <li key={DETAIL.indexOf(i)}>
                        <p>{i.data0}</p><p>{i.data1}</p><p>{i.data2}</p><p>{i.data3}</p>
                        <p style={{color: 'red'}}>{mark}</p>
                    </li>
                )
            });
        }
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section className="section-box">
                    <div className="wrap clearTopGap">
                        <TitleWithBubble name="保险/事故" />
                        <CarOption handleCar={this.handleTop10.bind(this)} />
                        <Table self="accident" tbody={accidentTb}
                            thead={['排名','车牌号', '订单出险率', '出险次数']} />
                        <DutyPerson sectionId="53" city={this.state.currentCity} />
                    </div>
                </section>

                <section className="section-box">
                    <div className="wrap">
                        <Title name="违法概况" />
                        <CarOption handleCar={this.handleCarLaw.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDateLaw.bind(this)} />
                        <Table self="illegal" tbody={illegalTb}
                            thead={['日期','累计违法订单','单均违法次数','违法率','未处理违法','平均处理天数']} />
                        <Pagination
                            handlePage={this.handlePageLaw.bind(this)}
                            length={this.state.lawData ? this.state.lawData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="55" city={this.state.currentCity} />
                    </div>
                </section>

                <section className="section-box">
                    <div className="wrap">
                        <Title name="车辆违法详情" />
                        <CarOption handleCar={this.handleCarDetail.bind(this)} />
                        <SingleDatePicker handleDate={this.handleDateDetail.bind(this)} />
                        <Table self="" tbody={detailTb}
                            thead={['车牌号','违法次数','已处理','未处理','报警']} />
                        <Pagination
                            handlePage={this.handlePageDetail.bind(this)}
                            length={this.state.detailData ? this.state.detailData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="56" city={this.state.currentCity} />
                  </div>
                </section>
            </div>
        )
    }
}

export default Operation;
