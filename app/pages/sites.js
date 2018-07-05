import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import Table from '../components/table'
import DutyPerson from '../components/dutyPerson'
import DoubleDatePicker from '../components/doubleDatePicker'
import SingleDatePicker from '../components/singleDatePicker'
import Pagination from '../components/pagination'
import ThreeColSelector from '../components/threeColSelector'
import TranglePicker from '../components/tranglePicker'
import CarOption from '../components/carOption'

class Sites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[1],
            trangleData: [],
            parkData: [],
            parkPage:1,
            parkReq: {
                interface: 'park/getGeneralSituationData',
                cityId: 2
            },
            parkUpdateData: [],
            parkUpdatePage: 1,
            parkUpdateReq: {
                interface: 'park/getParkingUpdateData',
                cityId: 2,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            detailData: [],
            detailPage: 1,
            detailReq: {
                interface: 'park/getParkDetail',
                cityId: 2,
                reportType: 1,
                selectType: 1,
                parkingKind: '',
                businessareaid: '',
            },
            parkCarData: [],
            parkCarPage: 1,
            parkCarReq: {
                interface: 'park/getParkCarDetail',
                cityId: 2,
                dateId: getDateOffset(-1),
                hourId: '',
                businessareaid: ''
            },
            parkOrderData: [],
            parkOrderPage: 1,
            parkOrderReq: {
                interface: 'park/getParkOrderDetail',
                cityId: 2,
                typeId: 0,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        c.value == 1 && Tip.success('请选择具体城市');
        this.setState({ currentCity: c.value == 1 ? CITY_LIST[1] : c });
    }



    // 网点概况
    siteRequest(p) {
        if (isParamValid(p, 'siteBasic')) {
            axiosGet(p, (r) => {
                this.setState({
                    parkData: r,
                    parkPage: 1
                })
            });
        }
    }

    // 网店变更
    parkUpdateRequest(p) {
        if (isParamValid(p, 'parkUpdate')) {
            axiosGet(p, (r) => {
                this.setState({
                    parkUpdateData: r,
                    parkUpdatePage: 1
                })
            });
        }
    }
    handleDateParkChange(date, picker) {
        picker == 'start' ? this.state.parkUpdateReq.startDate = date : this.state.parkUpdateReq.endDate = date;
        if (isPickerValid(this.state.parkUpdateReq.startDate, this.state.parkUpdateReq.endDate)) {
            this.parkUpdateRequest(this.state.parkUpdateReq);
        }
    }
    handlePageParkUpdate(page) {
        this.setState({ parkUpdatePage: page });
    }

    // 网点明细
    detailRequest(p) {
        if (isParamValid(p, 'parkDetail')) {
            axiosGet(p, (r) => {
                this.setState({
                    detailData: r,
                    detailPage: 1
                })
            })
        }
    }
    handleTCSPark(index) {
        this.state.detailReq.selectType = index + 1;
        this.detailRequest(this.state.detailReq);
    }
    handleTPickDetail(cb) {
        cb.master.id == 0 ? this.state.detailReq.businessareaid = cb.item.businessareaid :
        cb.master.id == 1 ? this.state.detailReq.reportType = cb.item.id :
        cb.master.id == 2 ? this.state.detailReq.parkingKind = cb.item.id : '';
        this.detailRequest(this.state.detailReq);
    }
    handlePageParkDetail(page) {
        this.setState({ detailPage: page });
    }

    // 网点车辆
    parkCarRequest(p) {
        if (isParamValid(p, 'park_car')) {
            axiosGet(p, (r) => {
                this.setState({
                    parkCarData: r,
                    parkCarPage: 1
                })
            })
        }
    }
    handleDateParkCar(date) {
        this.state.parkCarReq.dateId = date;
        isParamValid(this.state.parkCarReq) && this.parkCarRequest(this.state.parkCarReq);
    }
    handleTPickCar(cb) {
        cb.master.id == 0 ? this.state.parkCarReq.businessareaid = cb.item.businessareaid :
        cb.master.id == 3 ? this.state.parkCarReq.hourId = cb.item.id : '';
        this.parkCarRequest(this.state.parkCarReq);
    }
    handlePageParkCar(page) {
        this.setState({ parkCarPage: page });
    }

    // 网点订单
    parkOrderRequest(p) {
        if (isParamValid(p, 'park_order')) {
            axiosGet(p, (r) => {
                this.setState({
                    parkOrderData: r,
                    parkOrderPage: 1
                })
            })
        }
    }
    handleDateParkOrder(date, picker) {
        picker == 'start' ? this.state.parkOrderReq.startDate = date : this.state.parkOrderReq.endDate = date;
        this.parkOrderRequest(this.state.parkOrderReq);
    }
    handleParkCar(carType) {
        this.state.parkOrderReq.typeId = carType;
        this.parkOrderRequest(this.state.parkOrderReq);
    }
    handlePageParkOrder(page) {
        this.setState({ parkOrderPage: page });
    }


    componentDidMount() {
        this.siteRequest(this.state.parkReq);
        this.parkUpdateRequest(this.state.parkUpdateReq);
        this.detailRequest(this.state.detailReq);
        this.parkCarRequest(this.state.parkCarReq);
        this.parkOrderRequest(this.state.parkOrderReq);
    }


    render() {
        let PD = this.state.parkData, PP = this.state.parkPage;
        let PARK = PD.length < 10 ? PD : PD.slice((PP-1)*PAGESIZE, PP*PAGESIZE);
        if (PARK.length > 0) {
            var parkTb = PARK.map((i) => {
                return (
                    <li key={PARK.indexOf(i)}>
                        <p>{i.kpiname}</p><p>{i.kpiCurrent}</p><p>{i.kpiYes}</p>
                        <p>{i.kpiTongbi}</p><p>{i.tongbiRate}</p>
                    </li>
                )
            });
        }

        let UD = this.state.parkUpdateData, UP = this.state.parkUpdatePage;
        let PARKUPDATE = UD.length < 10 ? UD : UD.slice((UP-1)*PAGESIZE, UP*PAGESIZE);
        if (PARKUPDATE.length > 0) {
            var parkUpdateTb = PARKUPDATE.map((i) => {
                return (
                    <li key={PARKUPDATE.indexOf(i)}>
                        <p><span>{i.parkName}</span></p><p>{i.parkType == 0 ? '实体' : '虚拟'}</p>
                        <p>{i.carportNum}</p><p>{i.updateType == 1 ? '开启' : '关闭'}</p>
                        <p>{time2date(i.updateDate).format('MM-dd')}</p>
                    </li>
                )
            })
        }

        let DD = this.state.detailData, DP = this.state.detailPage;
        let DETAIL = DD.length < 10 ? DD : DD.slice((DP-1)*PAGESIZE, DP*PAGESIZE);
        if (DETAIL.length > 0) {
            var parkDetailTb = DETAIL.map((i) => {
                return (
                    <li key={DETAIL.indexOf(i)}>
                        <p><span>{i.parkName}</span></p><p>{time2date(i.openDate).format('yyyy-MM-dd')}</p>
                        <p>{i.carportNum}</p><p>{i.executAvgnum}</p><p>{i.carportAvgorder}</p>
                        <p>{i.retrunAvgnum}</p><p>{i.userAvgnum}</p>
                    </li>
                )
            })
        }

        let PCD = this.state.parkCarData, PCP = this.state.parkCarPage;
        let PARKCAR = PCD.length < 10 ? PCD : PCD.slice((PCP-1)*PAGESIZE, PCP*PAGESIZE);
        if (PARKCAR.length > 0) {
            var parkCarTb = PARKCAR.map((i) => {
                return (
                    <li key={PARKCAR.indexOf(i)}>
                        <p><span>{i.parkName}</span></p><p>{i.parkingkind == 0 ? '实体' : '虚拟'}</p>
                        <p>{i.parkplacenums}</p><p>{i.useparkplacenums}</p><p>{i.orderparkplacecount}</p>
                        <p>{i.waitCarnum}</p><p>{i.poweroffCarnum}</p><p>{i.operoffCarnum}</p>
                        <p>{i.powerCarnum}</p>
                    </li>
                )
            })
        }

        let POD = this.state.parkOrderData, POP = this.state.parkOrderPage;
        let PARKORDER = POD.length < 10 ? POD : POD.slice((POP-1)*PAGESIZE, POP*PAGESIZE);
        if (PARKORDER.length > 0) {
            var parkOdTb = PARKORDER.map((i) => {
                return (
                    <li key={PARKORDER.indexOf(i)}>
                        <p><span>{i.parkName}</span></p><p>{i.operaTime}</p><p>{i.parkState == 0 ? '关闭' : '开启'}</p>
                        <p>{i.parkPlaceNum}</p><p>{i.createOrderNum}</p><p>{i.execOrderNum}</p>
                        <p>{i.execOrderRate}%</p><p>{i.finishOrderNum}</p><p>{i.retrunOrderNum}</p>
                        <p>{i.diffOrderNum}</p><p>{i.avgOrderMileage}</p><p>{i.avgOrderMinute}</p>
                        <p>{i.avgOrderPayamount}</p><p>{i.amount}</p><p>{i.payamount}</p>
                        <p>{i.placeAvgExecorder}</p><p>{i.placeAvgReturnorder}</p><p>{i.diffReturnorderRate}%</p>
                    </li>
                )
            })
        }
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="网点概况" />
                        <Table tbody={parkTb} thead={['指标名称','昨日','前日', '同比','同比增浮']} />
                        <DutyPerson sectionId="34" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="网点明细" />
                        <ThreeColSelector cols={['20佳', '20差', '全部']} handleTCS={this.handleTCSPark.bind(this)} />
                        <TranglePicker
                            selectors={['商圈','周期','网点类型']}
                            city={this.state.currentCity}
                            handleTPick={this.handleTPickDetail.bind(this)} />
                        <Table self="parkDetail" tbody={parkDetailTb}
                            thead={['网点名称','开启日期','车位数','车位均单','日均取车单','日均还车单','日均服务用户']} />
                        <Pagination
                            handlePage={this.handlePageParkDetail.bind(this)}
                            length={this.state.detailData ? this.state.detailData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="36" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="网点变更" />
                        <DoubleDatePicker handleDate={this.handleDateParkChange.bind(this)} />
                        <Table self="parkUpdate" tbody={parkUpdateTb}
                            thead={['网点名称','网点类别','车位数','变更','变更日期']} />
                        <Pagination
                            handlePage={this.handlePageParkUpdate.bind(this)}
                            length={this.state.parkUpdateData ? this.state.parkUpdateData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="35" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="网点车辆" />
                        <SingleDatePicker handleDate={this.handleDateParkCar.bind(this)} />
                        <TranglePicker
                            selectors={['商圈','时刻']}
                            city={this.state.currentCity}
                            handleTPick={this.handleTPickCar.bind(this)} />
                        <Table self="parkCar" tbody={parkCarTb}
                            thead={['网点名称','网点类型','车位数','已用车位','订单占用','待租车辆','低电下架','其他原因','电量不足80%']} />
                        <Pagination
                            handlePage={this.handlePageParkCar.bind(this)}
                            length={this.state.parkCarData ? this.state.parkCarData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="38" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className='wrap'>
                        <Title name="网点订单" />
                        <CarOption handleCar={this.handleParkCar.bind(this)} />
                        <DoubleDatePicker handleDate={this.handleDateParkOrder.bind(this)} />
                        <Table self="parkOrder" tbody={parkOdTb}
                            thead={['网点名称','运营开通时间','网点状态','车位数','下单量',
                              '取车单','订单执行率','当日完成单','当日还车单','异地还车单',
                              '单均里程','单均时长', '单均收现','总流水','总收线','取车车位均单',
                              '还车车位均单','异地还车率']} />
                        <Pagination
                            handlePage={this.handlePageParkOrder.bind(this)}
                            length={this.state.parkOrderData ? this.state.parkOrderData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="39" city={this.state.currentCity} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Sites;
