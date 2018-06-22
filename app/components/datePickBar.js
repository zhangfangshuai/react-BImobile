import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/datePickBar.less'

class DatePickBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedYear: new Date().getFullYear(),
            selectedMonth: (new Date().getMonth() + 1) > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
            selectedDate: new Date().getDate()
        }
    }

    hidePicker(e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_PICKER');
    }

    today(e) {
        e.stopPropagation();
        this.setState({
            selectedYear: new Date().getFullYear(),
            selectedMonth: (new Date().getMonth() + 1) > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
            selectedDate: new Date().getDate()
        })
    }

    sure(e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_PICKER');
        let picked = this.state.selectedYear + this.state.selectedMonth + this.state.selectedDate;
        this.props.handlePicked(picked);
    }

    render() {
        let DS = this.props.dateBarState;
        return (
            <div className="component-datePickBar">
                <div className={`dpb-mask dpb-mask-${DS.toggled ? 'show' : 'hide'}`}></div>
                <div className={`dpb${DS.toggled ? ' dpb-show' : DS.firstIn ? '' : ' dpb-hide'}`}>
                    <div className="selected">
                        {`${this.state.selectedYear} / ${this.state.selectedMonth} / ${this.state.selectedDate}`}
                    </div>
                    <div className="scrollPicker">
                        <div className="yearPicker">{}</div>
                        <div className="monthPicker"></div>
                        <div className="datePicker"></div>
                    </div>
                    <div className="btnGroup">
                        <div className="cancle" onClick={this.hidePicker.bind(this)}>取消</div>
                        <div className="today" onClick={this.today.bind(this)}>今日</div>
                        <div className="sure" onClick={this.sure.bind(this)}>确定</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DatePickBar;
