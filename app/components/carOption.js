/**
 * Create: zhangfs by Atom
 * Time: 2018/07/03
 * Usage: <CarOption handleCar={this.handleCar.bind(this)} />
 **/

import React from 'react';
import '../less/carOption.less';

class CarOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ct: 0
        }
    }

    selectCar(type) {
        // 连续点击同一个,不重复执行
        this.setState((prevState) => {
            if (prevState.ct != type) {
                prevState.ct = type
                this.props.handleCar(type, 'car');
            }
        })
    }

    render() {
        return (
            <div className="carType-box">
                <p className={`car-type${this.state.ct == 0 ? ' active' : ''}`}
                   onClick={this.selectCar.bind(this, 0)}>全部</p>
                <p className={`car-type${this.state.ct == 1 ? ' active' : ''}`}
                   onClick={this.selectCar.bind(this, 1)}>电车</p>
                <p className={`car-type${this.state.ct == 2 ? ' active' : ''}`}
                   onClick={this.selectCar.bind(this, 2)}>燃油车</p>
            </div>
        )
    }
}

export default CarOption;
