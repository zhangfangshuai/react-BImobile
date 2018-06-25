import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/singleDatePicker.less'
import DatePickBar from './datePickBar.js'

class SingleDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.selfId,
            offset: -1,
            pickedDate: getDateOffset(-1),
            week: getWeekOffset(-1),
            dateBarState: {
                toggled: false,
                firstIn: true
            }
        }
    }

    updateOffset(x) {
        this.setState((prevState) => {
            return {
                offset: prevState.offset + x
            }
        })
    }

    updateDate(type = 'prev') {
        type === 'prev' ? this.updateOffset(-1) : this.state.pickedDate < new Date().format('yyyyMMdd') ? this.updateOffset(1) : '';
        this.setState((prevState) => {
            return {
                pickedDate: getDateOffset(prevState.offset),
                week: getWeekOffset(prevState.offset)
            }
        })
        this.setState((prevState) => {
            this.state.pickedDate != prevState.pickedDate && this.props.handleDate(prevState.pickedDate, "date")
        })
    }

    pickDate() {
        this.setState({
            dateBarState: {
                toggled: true,
                firstIn: false
            }
        })
    }

    handlePicked(date) {
        let nowDate = new Date().format('yyyyMMdd');
        if (date <= nowDate) {
            let tmp = new Date(date.slice(0,4), parseInt(date.slice(4, 6)-1), date.slice(6, 8));
            // 只获取当日0时0分0秒时间
            let nowTmp = new Date(nowDate.slice(0,4), parseInt(nowDate.slice(4, 6)-1), nowDate.slice(6, 8));
            let offsetDay = Math.ceil(Math.abs(tmp.getTime() - nowTmp.getTime()) / (3600 * 24 * 1e3));
            this.setState((prevState) => {
                prevState.pickedDate = date;
                prevState.week = updateWeek(date);
                prevState.offset = offsetDay;
                this.props.handleDate(date, "date");
            })
        } else {
            Tip.error('日期选择不合理');
        }


    }

    componentDidMount() {
        Pubsub.subscribe('HIDE_PICKER', () => {
            this.setState({
                dateBarState: {
                    toggled: false,
                    firstIn: false
                }
            })
        });
    }

    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_PICKER');
    }

    render() {
        return (
            <div className="component-singleDatePicker">
                <div className="preDateBtn" onClick={this.updateDate.bind(this, 'prev')}>前一天</div>
                <div className="showDate" onClick={this.pickDate.bind(this)}>
                    <div className="appDateTime" >{this.state.pickedDate}</div>
                    <span>{this.state.week}</span>
                </div>
                <div className="nextDateBtn" onClick={this.updateDate.bind(this, 'next')}>后一天</div>
                <DatePickBar dateBarState={this.state.dateBarState} nowDate={this.state.pickedDate} handlePicked={this.handlePicked.bind(this)} />
            </div>
        )
    }
}

export default SingleDatePicker;
