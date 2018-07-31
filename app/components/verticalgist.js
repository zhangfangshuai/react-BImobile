import React from 'react'
import '../less/verticalgist.less'

class VerticalGist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    render() {
        var G = this.props.data;
        return (
            <div className="component-verticalGist">
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
        )
    }
}

export default VerticalGist;
