/**
 * Create: zhangfs by Atom
 * Time: 2018/07/16
 * Usage: <MonthPicker handleMonth={this.handleMonth.bind(this)} />
 **/

import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/monthPicker.less'
import MonthPickBar from './monthPickBar'

class MonthPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            pickedMonth: getDateOffset().slice(0,6),
            monthBarState: {
                toggled: false,
                firstIn: true
            }
        }
    }

    updateOffset(x) {
        this.state.offset = this.state.offset + x;
    }

    updateMonth(type = 'prev') {
        if (type === 'prev') {
            this.updateOffset(-1);
        } else if(this.state.pickedMonth < new Date().format('yyyyMM')) {
            this.updateOffset(1);
        } else {
            return;
        }
        let d = new Date().getMonth();
        let p = new Date();
        p.setMonth(d + this.state.offset);
        let u = p.format('yyyyMM');
        this.setState({
            pickedMonth: u
        })
        this.props.handleMonth(u);
    }

    pickMonth() {
        this.setState({
            monthBarState: {
                toggled: true,
                firstIn: false
            }
        })
    }

    handlePicked(m) {
        this.setState({
            pickedMonth: m
        });
        this.props.handleMonth(m);
    }

    componentDidMount() {
        Pubsub.subscribe('HIDE_PICKER', () => {
            this.setState({
                monthBarState: {
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
            <div className="component-monthPicker">
                <div className="prev" onClick={this.updateMonth.bind(this, 'prev')}>
                    上一月
                </div>
                <div className="monthCont" onClick={this.pickMonth.bind(this)}>
                    <p> { this.state.pickedMonth } </p>
                </div>
                <div className="next" onClick={this.updateMonth.bind(this, 'next')}>
                    下一月
                </div>
                <MonthPickBar
                    barState={this.state.monthBarState}
                    now={this.state.pickedMonth}
                    handlePicked={this.handlePicked.bind(this)} />
            </div>
        )
    }
}

export default MonthPicker;
