import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import Table from '../components/table'
import DutyPerson from '../components/dutyPerson'
import DoubleDatePicker from '../components/doubleDatePicker'
import Pagination from '../components/pagination'
import ThreeColSelector from '../components/threeColSelector'
import TranglePicker from '../components/tranglePicker'

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
            }
        }
    }

    selectCity(c) {
        Tip.success('请选择具体城市')
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
    handleTPickDetail(params) {
        params.master == 0 ? this.state.detailReq.businessareaid = params.item.businessareaid :
        params.master == 1 ? this.state.detailReq.reportType = params.item.id :
        params.master == 2 ? this.state.detailReq.parkingKind = params.item.id : '';
        this.detailRequest(this.state.detailReq);
    }
    handlePageParkDetail(page) {
        this.setState({ detailPage: page });
    }


    componentDidMount() {
        this.siteRequest(this.state.parkReq);
        this.parkUpdateRequest(this.state.parkUpdateReq);
        this.detailRequest(this.state.detailReq);
    }

    render() {
        let SD = this.state.parkData, SP = this.state.parkPage;
        let PARK = SD.length < 10 ? SD : SD.slice((SP-1)*PAGESIZE, SP*PAGESIZE);
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

        let PD = this.state.parkUpdateData, PP = this.state.parkUpdatePage;
        let PARKUPDATE = PD.length < 10 ? PD : PD.slice((PP-1)*PAGESIZE, PP*PAGESIZE);
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
                        <Title name="网点明细" />
                        <ThreeColSelector cols={['20佳', '20差', '全部']} handleTCS={this.handleTCSPark.bind(this)} />
                        <TranglePicker
                            selectors={['商圈','近7日','全部']}
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
            </div>
        )
    }
}

export default Sites;
