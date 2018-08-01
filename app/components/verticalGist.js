import React from 'react'
import '../less/verticalGist.less'

class VerticalGist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    render() {
        var G = this.props.data, kpiGist;
        if (this.props.master == "kpi_nation") {
            kpiGist = <div className="component-verticalGist">
                <ul>
                    <li>{G.opentime}</li>
                    <li>{G.users_reg_t}</li>
                    <li>{G.deposit_num}</li>
                </ul>
                <ul>
                    <li>开城日期</li>
                    <li>累计注册用户</li>
                    <li>可用车用户</li>
                </ul>
                <ul>
                    <li>{G.car_total}</li>
                    <li>{G.parking}</li>
                    <li>{G.order_avg}</li>
                </ul>
                <ul>
                    <li>运营车辆</li>
                    <li>场站规模</li>
                    <li>车均单</li>
                </ul>
                <ul>
                    <li>{G.orders_month}</li>
                    <li>{G.car_avgpayamount}</li>
                    <li>{G.car_total}</li>
                </ul>
                <ul>
                    <li>订单量</li>
                    <li>车均收现</li>
                    <li>DAU人数</li>
                </ul>
            </div>
        } else if(this.props.master == "kpi_city") {
            kpiGist = <div className="component-verticalGist kpiCity">
                <ul>
                    <li>{G.kpi_coCurrent || G.kpi_currenta}</li>
                    <li>{G.kpi_currentd}</li>
                    <li>{G.kpi_currentc}</li>
                    <li>{G.kpi_currente}</li>
                </ul>
                <ul>
                    <li>车均单</li>
                    <li>单均收现</li>
                    <li>上架率</li>
                    <li>新增双证绑定用户</li>
                </ul>
                <ul>
                    <li>{G.kpi_coGoal || G.kpi_goala}</li>
                    <li>{G.kpi_goald}</li>
                    <li>{G.kpi_goalc}</li>
                    <li>{G.kpi_goale}</li>
                </ul>
                <ul>
                    <li>目标值</li>
                    <li>目标值</li>
                    <li>目标值</li>
                    <li>目标值</li>
                </ul>
            </div>
        }

        return (
            <div className="component-verticalGist">
                { kpiGist }
            </div>

        )
    }
}

export default VerticalGist;
