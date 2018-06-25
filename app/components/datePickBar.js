import React from 'react'
import Pubsub from 'pubsub-js'
import BarItem from './baritem'
import '../less/datePickBar.less'

class DatePickBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            picker: {
                year: [],
                month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                date: [],
            },
            picked: {
                year: this.props.nowDate.slice(0,4),
                month: parseInt(this.props.nowDate.slice(4,6)) - 1,
                date: this.props.nowDate.slice(6,8)
            },
            preScrollIndex: 0
        }
    }

    cancel(e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_PICKER');
    }

    today(e) {
        e.stopPropagation();
        this.setState({
            picked: {
                year: new Date().getFullYear(),
                month: (new Date().getMonth() + 1) > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
                date: new Date().getDate()
            }
        })


    }

    sure(e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_PICKER');
        let picked = this.state.picked.year + this.state.picked.month + this.state.picked.date;
        this.props.handlePicked(picked);
    }

    autoMatch(bar, e) {
        e.preventDefault();
        console.log(this.refs[bar].scrollTop);
        let index = parseInt((this.refs[bar].scrollTop + 40) / 100);
        if (index < this.state.picker[bar].length && Math.abs(index - this.state.preScrollIndex) > 0) {
            if (bar == 'year') {
                this.setState((prevState) => {
                    prevState.picked = Object.assign({}, prevState.picked, { year: prevState.picker.year[index] });
                    prevState.preScrollIndex = index;
                    this.refreshDays(prevState);
                })
            } else if (bar == 'month') {
                this.setState((prevState) => {
                    prevState.picked = Object.assign({}, prevState.picked, { month: prevState.picker.month[index] });
                    prevState.preScrollIndex = index;
                    this.refreshDays(prevState);
                })
            } else {
                this.setState({
                    picked: Object.assign({}, this.state.picked, { date: this.state.picker.date[index] })
                })
            }
        }
    }

    refreshDays(_state) {
        let days = [], dayNum = 30;
        if ( ['01','03','05','07','08','10','12'].indexOf(_state.picked.month) >= 0 ) {
            dayNum = 31;
        } else if ( _state.picked.month == '02' ) {
            let Y = parseInt(_state.picked.year);
            dayNum = 28;  // 平年
            if ((Y % 4 == 0) && (Y % 100 != 0) || (Y % 400 == 0)) {
                dayNum = 29  // 闰年
            }
        }
        for (let i = 1; i <= dayNum; i++) {
            i < 10 ? days.push('0'+i) : days.push(i.toString());
        }
        _state.picker = Object.assign({}, _state.picker, { date: days });
    }

    resetScrollPosition(picked) {
        console.log(picked);
        this.refs.year.scrollTop = (parseInt(picked.year) - 2017) * 100;
        this.refs.month.scrollTop = parseInt(picked.month) * 100;
        this.refs.date.scrollTop = (parseInt(picked.date) - 1) * 100;
    }

    componentDidMount() {
        let loop = new Date().getFullYear() - 2016;
        for (let i = 0; i <= loop; i++) {
            this.state.picker.year.push(2016 + i);
        }
        this.resetScrollPosition(this.state.picked);
        this.setState((prevState) => {
            this.refreshDays(prevState);
        })
    }

    render() {
        let yearBar = this.state.picker.year.map((item) => {
            return (
                <BarItem key={this.state.picker.year.indexOf(item)} data={item} />
            )
        })
        let monthBar = this.state.picker.month.map((item) => {
            return (
                <BarItem key={this.state.picker.month.indexOf(item)} data={item} />
            )
        })
        let dateBar = this.state.picker.date.map((item) => {
            return (
                <BarItem key={this.state.picker.date.indexOf(item)} data={item} />
            )
        })
        let DS = this.props.dateBarState;

        return (
            <div className="component-datePickBar">
                <div className={`dpb-mask dpb-mask-${DS.toggled ? 'show' : 'hide'}`}></div>
                <div className={`dpb${DS.toggled ? ' dpb-show' : DS.firstIn ? '' : ' dpb-hide'}`}>
                    <div className="selected">
                        <span onChange={this.refreshDays.bind(this)}>{this.state.picked.year}</span> /&nbsp;
                        <span onChange={this.refreshDays.bind(this)}>{this.state.picked.month}</span> /&nbsp;
                        <span>{this.state.picked.date}</span>
                    </div>
                    <div className="scrollPicker">
                        <div onScroll={this.autoMatch.bind(this, 'year')} ref='year'>{yearBar}</div>
                        <div onScroll={this.autoMatch.bind(this, 'month')} ref='month'>{monthBar}</div>
                        <div onScroll={this.autoMatch.bind(this, 'date')} ref='date'>{dateBar}</div>
                    </div>
                    <div className="btnGroup">
                        <div onClick={this.cancel.bind(this)}>取消</div>
                        <div onClick={this.today.bind(this)}>今日</div>
                        <div onClick={this.sure.bind(this)}>确定</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DatePickBar;
