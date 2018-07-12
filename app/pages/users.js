import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import MultiColSelector from '../components/multiColSelector'
import InlineTranglePicker from '../components/inlineTranglePicker'

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            AddPeriod: false
        }
    }

    selectCity(c) {
        console.log(c);
        this.setState({ currentCity: c });
    }

    handleFunnel(index) {  // 累计0, 新增1-[近7日2；近15日3；近30日4；近60日5]
        console.log(index);
        index == 1 ? this.setState({ AddPeriod: true }) : this.setState({ AddPeriod: false });
    }
    handleTransfer(idx) {
        console.log(idx);
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
                    </div>
                </section>
            </div>
        )
    }
}

export default Users;
