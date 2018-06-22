import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/doubleDatePicker.less'

class DoubleDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: getDateOffset(-7),
            endDate: getDateOffset(-1)
        }
    }

    pickStartDate() {
        console.log(this.state.startDate);
        Pubsub.publish('TOGGLE_DATE');
    }

    pickEndDate() {
        console.log(this.state.endDate);
    }

    render() {
        return (
            <div className="doubleDatePicker">
                开始<span onClick={this.pickStartDate.bind(this)}> {this.state.startDate} </span>
                结束<span onClick={this.pickEndDate.bind(this)}> {this.state.endDate} </span>
            </div>
        )
    }
}

export default DoubleDatePicker;
