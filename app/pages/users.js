import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import MultiColSelector from '../components/multiColSelector'
import InlineTranglePicker from '../components/inlineTranglePicker'
import Charts from '../components/charts'

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
                reportId: 1
            }
        }
    }

    selectCity(c) {
        console.log(c);
        this.setState({ currentCity: c });
    }

    // 用户转化
    transferRequest(p) {
        if (isParamValid(p, 'user_transfer')) {
            axiosGet(p, (r) => {
                this.setState({
                    transferData: r.reverse()
                })
            })
        }
    }
    handleFunnel(index) {  // 累计0, 新增1-[近7日2；近15日3；近30日4；近60日5]
        console.log(index);
        this.state.transferReq.reportId = index == 0 ? 1 : 2;  // 累计1, 新增默认为2
        this.transferRequest(this.state.transferReq);
        index == 1 ? this.setState({ AddPeriod: true }) : this.setState({ AddPeriod: false });
    }
    handleTransfer(idx) {
        console.log(idx);
    }

    componentDidMount() {
        this.transferRequest(this.state.transferReq);
    }

    render() {
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
            </div>
        )
    }
}

export default Users;
