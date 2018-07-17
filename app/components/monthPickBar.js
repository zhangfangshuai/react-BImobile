import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/monthPickBar.less'
import BarItem from './baritem'

class MonthPickBar extends React.Component {
    constructor(props) {
        super(props);
        let tmpM = parseInt(this.props.now.slice(4, 6)) - 1;
        this.state = {
            picker: {
                // 预置数据只起占位作用,并不参与真实效果,如果今年大于2024年,需要继续往后增加占位数据
                year: ['2016','2017','2018','2019','2020','2021','2022','2023','2024'],
                month: ['01','02','03','04','05','06','07','08','09','10','11','12']
            },
            picked: {
                year: this.props.now.slice(0,4),
                month: tmpM > 9 ? tmpM + '' : '0' + tmpM
            },
            preScrollIndex: 0
        }
    }

    cancel(e) {
        e.stopPropagation();
        let renewBar = {
            year: this.props.now.slice(0,4),
            month: parseInt(this.props.now.slice(4,6)) - 1
        }
        Pubsub.publish('HIDE_PICKER');
        this.resetScrollPosition(renewBar);
    }

    moon(e) {
        e.stopPropagation();
        this.setState((prevState) =>  {
            let d = new Date();
            prevState.picked = {
                year: d.getFullYear().toString(),
                month: d.getMonth() > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1),
            }
            // 矫正月份加1产生的滚动条多滚动的问题
            let resetScrollerPicked = {
                year: prevState.picked.year,
                month: parseInt(prevState.picked.month) - 1,
            }
            this.resetScrollPosition(resetScrollerPicked);
        })
    }

    sure(e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_PICKER');
        let cb = this.state.picked.year + this.state.picked.month;
        this.props.handlePicked(cb);
    }

    autoMatch(bar, e) {
        let index = parseInt((this.refs[bar].scrollTop + 40) / 100);
        if (index < this.state.picker[bar].length && Math.abs(index - this.state.preScrollIndex) > 0) {
            if (bar == 'year') {
                this.setState((prevState) => {
                    prevState.picked = Object.assign({}, prevState.picked, { year: prevState.picker.year[index] });
                    prevState.preScrollIndex = index;
                    this.refreshMonths(prevState);
                })
            } else if (bar == 'month') {
                this.setState((prevState) => {
                    prevState.picked = Object.assign({}, prevState.picked, { month: prevState.picker.month[index] });
                    prevState.preScrollIndex = index;
                    this.refreshMonths(prevState);
                })
            }
        }
    }

    refreshYears(_state) {
        let Ys = [], loop = new Date().getFullYear() - 2016;
        for (let i = 0; i <= loop; i++) {
            Ys.push(2016 + i + '');
        }
        _state.picker = Object.assign({}, _state.picker, { year: Ys });
    }

    refreshMonths(_state) {
        let Ms = [], loop = 12;
        if (_state.picked.year == new Date().getFullYear()) {
            loop = new Date().getMonth() + 1;
        }
        for (let i = 1; i <= loop; i++) {
            i < 10 ? Ms.push('0'+i) : Ms.push(i.toString());
        }
        _state.picker = Object.assign({}, _state.picker, { month: Ms });
    }

    resetScrollPosition(rn) {
        this.refs.year.scrollTop = (parseInt(rn.year) - 2016) * 100;
        this.refs.month.scrollTop = parseInt(rn.month) * 100;
    }

    componentDidMount() {
        this.setState((prevState) => {
            this.refreshYears(prevState);
            this.refreshMonths(prevState);
            this.resetScrollPosition(this.state.picked);
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.now != this.props.now) {
            let renewBar = {
              year: this.props.now.slice(0,4),
              month: parseInt(this.props.now.slice(4,6)) - 1,
            }
            this.resetScrollPosition(renewBar);
        }
    }

    render() {
        let yearBar = this.state.picker.year.map((item, i) => {
            return (
                <BarItem key={i} data={item} />
            )
        })
        let monthBar = this.state.picker.month.map((item, i) => {
            return (
                <BarItem key={i} data={item} />
            )
        })

        let MS = this.props.barState;
        return (
            <div className="component-monthPickBar">
                <div className={`mask mask-${MS.toggled ? 'show' : 'hide'}`}></div>
                <div className={`mpb${MS.toggled ? ' mpb-show' : MS.firstIn ? '' : ' mpb-hide'}`}>
                    <div className="selected">
                        <span>{this.state.picked.year}</span>
                        <span>{this.state.picked.month}</span>
                    </div>
                    <div className="marquee"></div>
                    <div className="scrollPicker">
                        <div onScroll={this.autoMatch.bind(this, 'year')} ref='year'>{yearBar}</div>
                        <div onScroll={this.autoMatch.bind(this, 'month')} ref='month'>{monthBar}</div>
                    </div>
                    <div className="btnGroup">
                        <div onClick={this.cancel.bind(this)}>取消</div>
                        <div onClick={this.moon.bind(this)}>本月</div>
                        <div onClick={this.sure.bind(this)}>确定</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MonthPickBar;
