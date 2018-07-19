import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import MultiColSelector from '../components/multiColSelector'
import InlineTranglePicker from '../components/inlineTranglePicker'
import Charts from '../components/charts'
import DoubleDatePicker from '../components/doubleDatePicker'
import Table from '../components/table'
import TableBody from '../components/tableBody'
import Pagination from '../components/pagination'
import DutyPerson from '../components/dutyPerson'
import MonthPicker from '../components/monthPicker'

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            AddPeriod: false,
            transferData: [],
            transferReq: {
                interface: 'MUser/MuserTransformData',
                cityId: CITY_LIST[0].value,
                reportId: 1   // 累计0, 新增1-[近7日2, 近15日3, 近30日4, 近60日5]
            },
            registData: [],
            registPage: 1,
            registReq: {
                interface: 'User/SignInTableData',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            licenceData: [],
            licencePage: 1,
            licenceReq: {
                interface: 'User/DoubleCertificale',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            validUserData: [],
            validUserPage: 1,
            validUserReq: {
                interface: 'User/UsableCarUser',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            dealData: [],
            dealPage: 1,
            dealReq: {
                interface: 'User/PlaceAnOrder',
                cityId: CITY_LIST[0].value,
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            },
            pieData: [],
            pieReq: {
                interface: 'MUser/getOrderUserRate',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset().slice(0,6)
            },
            orderUserData: [],
            orderUserPage: 1,
            orderUserReq: {
                interface: 'MUser/getFactOrderTotals',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset().slice(0,6)
            },
            newGuyData: [],
            newGuyPage: 1,
            newGuyReq: {
                interface: 'MUser/getfirstOrderUser',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset().slice(0,6)
            },
            recallData: [],
            recallPage: 1,
            recallReq: {
                interface: 'MUser/getthisMonthRecallUser',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset().slice(0,6)
            },
            stayData: [],
            stayPage: 1,
            stayReq: {
                interface: 'MUser/getthisMonthKeep',
                cityId: CITY_LIST[0].value,
                dateId: getDateOffset().slice(0,6)
            }
        }
    }

    // 用户转化
    transferRequest(p) {
        if (isParamValid(p, 'user_transfer')) {
            axiosGet(p, (r) => { this.setState({ transferData: r.reverse() }) });
        }
    }
    handleFunnel(index) {
        this.state.transferReq.reportId = index == 0 ? 1 : 2;  // 累计1, 新增默认为近七日2
        this.transferRequest(this.state.transferReq);
        index == 1 ? this.setState({ AddPeriod: true }) : this.setState({ AddPeriod: false });
    }
    handleTransfer(idx) {
        // 累计为1, 因此此处比组件种默认的id多1;
        this.state.transferReq.reportId = idx + 1;
        this.transferRequest(this.state.transferReq);
    }


    // 注册用户分析
    registRequest(p) {
        if (isParamValid(p, 'user_regist')) {
            axiosGet(p, (r) => {
                this.setState({
                    registData: r,
                    registPage: 1
                })
            });
        }
    }
    handleDateRegist(date, picker) {
        picker == 'start' ? this.state.registReq.startDate = date : this.state.registReq.endDate = date;
        this.registRequest(this.state.registReq);
    }
    handlePageRegist(p) {
        this.setState({ registPage: p });
    }

    // 双证绑定
    licenceRequest(p) {
        if (isParamValid(p, 'user_licence')) {
            axiosGet(p, (r) => {
                this.setState({
                    licenceData: r,
                    licencePage: 1
                })
            });
        }
    }
    handleDateLicence(date, picker) {
        picker == 'start' ? this.state.licenceReq.startDate = date : this.state.licenceReq.endDate = date;
        this.licenceRequest(this.state.licenceReq);
    }
    handlePageLicence(page) {
        this.setState({ licencePage: page });
    }

    // 可用车用户
    validUserRequest(p) {
        if (isParamValid(p, 'valid_user')) {
            axiosGet(p, (r) => {
                this.setState({
                    validUserData: r,
                    validUserPage: 1
                })
            });
        }
    }
    handleDateValidUser(date, picker) {
        picker == 'start' ? this.state.validUserReq.startDate = date : this.state.validUserReq.endDate = date;
        this.validUserRequest(this.state.validUserReq);
    }
    handlePageValidUser(page) {
        this.setState({ validUserPage: page });
    }

    // 下单用户
    dealRequest(p) {
        if (isParamValid(p, 'user_deal')) {
            axiosGet(p, (r) => {
                this.setState({
                    dealData: r,
                    dealPage: 1
                })
            });
        }
    }
    handleDateDeal(date, picker) {
        picker == 'start' ? this.state.dealReq.startDate = date : this.state.dealReq.endDate = date;
        this.dealRequest(this.state.dealReq);
    }
    handlePageDeal(page) {
        this.setState({ dealPage: page });
    }

    // 订单用户数据分析
    orderUserRequest(p) {
        if (isParamValid(p, 'order_user')) {
            axiosGet(p, (r) => {
                this.setState({
                    orderUserData: r,
                    orderUserPage: 1
                })
            });
        }
    }

    // 订单用户占比分析
    pieRequest(p) {
        if (isParamValid(p, 'order_user_pie')) {
            axiosGet(p, (r) => {
              r.legend = r.arr;
              r.series = r.listData;
              this.setState({ pieData: r })
            });
        }
    }
    handleMonthOrderUser(m) {
        this.state.pieReq.dateId = m;
        this.pieRequest(this.state.pieReq);
        this.state.orderUserReq.dateId = m;
        this.orderUserRequest(this.state.orderUserReq);
    }
    handlePageorderUser(p) {
        this.setState({ orderUserPage: p });
    }

    // 首单用户分析
    newGuyRequest(p) {
        if (isParamValid(p, 'first_order')) {
            axiosGet(p, (r) => {
                this.setState({
                    newGuyData: r,
                    newGuyPage: 1
                })
            });
        }
    }
    handleMonthNewGuy(m) {
        this.state.newGuyReq.dateId = m;
        this.newGuyRequest(this.state.newGuyReq);
    }
    handlePageNewGuy(p) {
        this.setState({ newGuyPage: p });
    }

    // 留存用户分析
    stayRequest(p) {
        if (isParamValid(p, 'first_order')) {
            axiosGet(p, (r) => {
                this.setState({
                    stayData: r,
                    stayPage: 1
                })
            });
        }
    }
    handleMonthStay(m) {
        this.state.stayReq.dateId = m;
        this.stayRequest(this.state.stayReq);
    }
    handlePageStay(p) {
        this.setState({ stayPage: p });
    }

    // 召回用户
    recallRequest(p) {
        if (isParamValid(p, 'recall_user')) {
            axiosGet(p, (r) => {
                this.setState({
                    recallData: r,
                    recallPage: 1
                })
            });
        }
    }
    handleMonthRecall(m) {
        this.state.recallReq.dateId = m;
        this.recallRequest(this.state.recallReq);
    }
    handlePageRecall(p) {
        this.setState({ recallPage: p });
    }


    // 挂载
    componentDidMount() {
        this.transferRequest(this.state.transferReq);
        this.registRequest(this.state.registReq);
        this.licenceRequest(this.state.licenceReq);
        this.validUserRequest(this.state.validUserReq);
        this.dealRequest(this.state.dealReq);
        this.orderUserRequest(this.state.orderUserReq);
        this.pieRequest(this.state.pieReq);
        this.newGuyRequest(this.state.newGuyReq);
        this.recallRequest(this.state.recallReq);
        this.stayRequest(this.state.stayReq);
    }

    selectCity(c) {
        this.setState({ currentCity: c });
        this.state.transferReq.cityId = c.value;
        this.transferRequest(this.state.transferReq);
        this.state.registReq.cityId = c.value;
        this.registRequest(this.state.registReq);
        this.state.licenceReq.cityId = c.value;
        this.licenceRequest(this.state.licenceReq);
        this.state.validUserReq.cityId = c.value;
        this.validUserRequest(this.state.validUserReq);
        this.state.dealReq.cityId = c.value;
        this.dealRequest(this.state.dealReq);
        this.state.orderUserReq.cityId = c.value;
        this.orderUserRequest(this.state.orderUserReq);
        this.state.pieReq.cityId = c.value;
        this.pieRequest(this.state.pieReq);
        this.state.newGuyReq.cityId = c.value;
        this.newGuyRequest(this.state.newGuyReq);
        this.state.stayReq.cityId = c.value;
        this.stayRequest(this.state.stayReq);
        this.state.recallReq.cityId = c.value;
        this.recallRequest(this.state.recallReq);
    }


    render() {
        let E = this.state.dealData, EP = this.state.dealPage;
        let DEAL = E.length < 10 ? E : E.slice((EP-1)*PAGESIZE, EP*PAGESIZE);
        if (DEAL.length > 0) {
            var dealTb = DEAL.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.date_id, i.users_order, i.users_fristorder, i.users_oldorder, i.users_fristorder_rate+'%', i.users_oldorder_rate+'%', i.users_order_rate+'%']} />
                )
            })
        }

        let R = this.state.registData, RP = this.state.registPage;
        let REGIST = R.length < 10 ? R : R.slice((RP-1)*PAGESIZE, RP*PAGESIZE);
        if (REGIST.length > 0) {
            var registTb = REGIST.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.date_id, i.users_reg_t, i.users_reg, i.users_reg_inviter, i.inviter_rate]} />
                )
            })
        }

        let L = this.state.licenceData, LP = this.state.licencePage;
        let LICENCE = L.length < 10 ? L : L.slice((LP-1)*PAGESIZE, LP*PAGESIZE);
        if (LICENCE.length > 0) {
            var licenceTb = LICENCE.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.date_id, i.users_audit_t, i.users_id_t, i.users_drive_t, i.users_audit_new, i.users_id_new, i.users_drive_new, i.audit_rate+'%']} />
                )
            })
        }

        let V = this.state.validUserData, VP = this.state.validUserPage;
        let VALID = V.length < 10 ? V : V.slice((VP-1)*PAGESIZE, VP*PAGESIZE);
        if (VALID.length > 0) {
            var validUserTb = VALID.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.date_id, i.users_usable_t, i.deposit_users1_t, i.deposit_users2_t,
                      i.zmxy_users_t, i.users_usable, i.deposit_users1, i.deposit_users2, i.zmxy_users, i.users_usable_rate+'%']} />
                )
            })
        }

        let O = this.state.orderUserData, OP = this.state.orderUserPage;
        let ORDER = O.length < 10 ? O : O.slice((OP-1)*PAGESIZE, OP*PAGESIZE);
        if (ORDER.length > 0) {
            var orderUserTb = ORDER.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.cityName, i.orderUsersTotal, i.ordersMonth, i.fristorderUsers,
                      i.oldorderUsers, i.orderAvg, i.retainUsers, i.recallUsers, i.fristuserRate+'%', i.olduserRate+'%']} />
                )
            })
        }

        let N = this.state.newGuyData, NP = this.state.newGuyPage;
        let NEW = N.length < 10 ? N : N.slice((NP-1)*PAGESIZE, NP*PAGESIZE);
        if (NEW.length > 0) {
            var newGuyTb = NEW.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.cityName, i.fristorder_users, i.fristorder_nums, i.fristorder_avg, i.fristorder_rate+'%']} />
                )
            })
        }

        let S = this.state.stayData, SP = this.state.stayPage;
        let STAY = S.length < 10 ? S : S.slice((SP-1)*PAGESIZE, SP*PAGESIZE);
        if (STAY.length > 0) {
            var stayTb = STAY.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.cityName, i.retain_users, i.firstorder_users_last, i.nextorder_users_last,
                      i.retain_orders, i.retain_users_avg, i.retain_users_rate+'%']} />
                )
            })
        }

        let RC = this.state.recallData, RCP = this.state.recallPage;
        let RECALL = RC.length < 10 ? RC : RC.slice((RCP-1)*PAGESIZE, RCP*PAGESIZE);
        if (RECALL.length > 0) {
            var recallTb = RECALL.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.cityName, i.recall_users, i.recall_orders, i.recall_users_avg,
                      i.recall_users_rate+'%', i.retain_rate+'%']} />
                )
            })
        }
        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="用户转化" />
                        { this.state.AddPeriod && <InlineTranglePicker type="period" master="transfer" handlePick={this.handleTransfer.bind(this)} /> }
                        <MultiColSelector cols={['累计','新增']} handleTCS={this.handleFunnel.bind(this)}/>
                        <Charts type="funnel" data={this.state.transferData} />
                        <DutyPerson sectionId="15" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="下单用户分析" />
                        <DoubleDatePicker handleDate={this.handleDateDeal.bind(this)} />
                        <Table self="user-deal" tbody={dealTb}
                            thead={['日期','下单用户数','首单用户数','老用户数','首单用户占比','老用户占比','转化率']} />
                        <Pagination
                            handlePage={this.handlePageDeal.bind(this)}
                            length={this.state.dealData ? this.state.dealData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="27" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="注册用户分析" />
                        <DoubleDatePicker handleDate={this.handleDateRegist.bind(this)} />
                        <Table self="regist" tbody={registTb}
                            thead={['日期','累计注册','新增注册','老拉新注册','老拉新占比']} />
                        <Pagination
                            handlePage={this.handlePageRegist.bind(this)}
                            length={this.state.registData ? this.state.registData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="22" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="双证用户分析" />
                        <DoubleDatePicker handleDate={this.handleDateLicence.bind(this)} />
                        <Table self="licence" tbody={licenceTb}
                            thead={['日期','累计双证绑定数','累计身份证绑定数','累计驾照绑定数','新增双证绑定数','新增身份证绑定数','新增驾照绑定数','双证用户转化率']} />
                        <Pagination
                            handlePage={this.handlePageLicence.bind(this)}
                            length={this.state.licenceData ? this.state.licenceData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="24" city={this.state.currentCity} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="可用车用户分析" />
                        <DoubleDatePicker handleDate={this.handleDateValidUser.bind(this)} />
                        <Table self="validUser" tbody={validUserTb}
                            thead={['日期','累计可用车用户','累计基础押金用户','累计升级押金用户','累计芝麻信用用户','新增可用车用户','新增基础押金用户','新增升级押金用户','新增芝麻信用用户','转化率']} />
                        <Pagination
                            handlePage={this.handlePageValidUser.bind(this)}
                            length={this.state.validUserData ? this.state.validUserData.length : 0}
                            pageSize={PAGESIZE} />
                        <DutyPerson sectionId="26" city={this.state.currentCity} />
                  </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="订单用户占比分析" />
                        <MonthPicker handleMonth={this.handleMonthOrderUser.bind(this)} />
                        <Charts self="small-chart" type="pie" data={this.state.pieData} />
                    </div>
                    <div className="wrap clearTopGap">
                        <Title name="订单用户数据分析" />
                        <Table self="order-user" tbody={orderUserTb}
                            thead={['城市','总订单用户数','总订单数','首单用户数','老用户数','订单用户下单频率','留存用户数','召回用户数','首单用户占比','老用户占比']} />
                        <Pagination
                            handlePage={this.handlePageorderUser.bind(this)}
                            length={this.state.orderUserData ? this.state.orderUserData.length : 0}
                            pageSize={PAGESIZE} />
                  </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="首单用户分析" />
                        <MonthPicker handleMonth={this.handleMonthNewGuy.bind(this)} />
                        <Table self="newGuy" tbody={newGuyTb}
                            thead={['城市','首单用户数','首单用户订单数','下单频率','首单用户占比']} />
                        <Pagination
                            handlePage={this.handlePageNewGuy.bind(this)}
                            length={this.state.newGuyData ? this.state.newGuyData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="留存用户分析" />
                        <MonthPicker handleMonth={this.handleMonthStay.bind(this)} />
                        <Table self="user-stay" tbody={stayTb}
                            thead={['城市','留存用户数','上月首单用户数','上月老用户数','留存下单量','留存下单频次','本月留存率']} />
                        <Pagination
                            handlePage={this.handlePageStay.bind(this)}
                            length={this.state.stayData ? this.state.stayData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>

                <section>
                    <div className="wrap">
                        <Title name="召回用户分析" />
                        <MonthPicker handleMonth={this.handleMonthRecall.bind(this)} />
                        <Table self="user-recall" tbody={recallTb}
                            thead={['城市','召回用户数','召回下单数','下单频次','召回占比','本月召回率']} />
                        <Pagination
                            handlePage={this.handlePageRecall.bind(this)}
                            length={this.state.recallData ? this.state.recallData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Users;
