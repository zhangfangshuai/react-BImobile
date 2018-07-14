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
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
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


    componentDidMount() {
        this.transferRequest(this.state.transferReq);
        this.registRequest(this.state.registReq);
    }

    render() {
        let R = this.state.registData, RP = this.state.registPage;
        let REGIST = R.length < 10 ? R : R.slice((RP-1)*PAGESIZE, RP*PAGESIZE);
        if (REGIST.length > 0) {
            var registTb = REGIST.map((i, idx) => {
                return (
                    <TableBody key={idx} data={[i.date_id, i.users_reg_t, i.users_reg, i.users_reg_inviter, i.inviter_rate]} />
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
                    </div>
                </section>
            </div>
        )
    }
}

export default Users;
