/**
 * Create: zhangfs by Atom
 * Time: 2018/07/06
 * Usage: <DoubleDatePicker handleDate={this.handleDate.bind(this)} />
 **/

import React from 'react'
import Pubsub from 'pubsub-js'
import DatePickBar from './datePickBar'
import '../less/doubleDatePicker.less'

class DoubleDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pickerActive: '',
            pickedDate: getDateOffset(-7),
            startDate: getDateOffset(-7),
            endDate: getDateOffset(-1),
            dateBarState: {
                toggled: false,
                firstIn: true
            }
        }
    }

    pickStartDate() {
        this.setState({
            pickedDate: this.state.startDate,
            pickerActive: 'start',
            dateBarState: {
                toggled: true,
                firstIn: false
            }
        })
    }

    pickEndDate() {
        this.setState({
            pickedDate: this.state.endDate,
            pickerActive: 'end',
            dateBarState: {
                toggled: true,
                firstIn: false
            }
        })
    }

    handlePicked(date) {
        this.state.pickerActive == "start" ? this.setState({ startDate: date }) : this.setState({ endDate: date });
        this.props.handleDate(date, this.state.pickerActive);
    }

    componentDidMount() {
        Pubsub.subscribe('HIDE_PICKER', () => {
            this.setState({
                dateBarState: {
                    toggled: false,
                    firstIn: false
                }
            })
        })
    }

    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_PICKER');
    }

    render() {
        return (
            <div className="component-doubleDatePicker">
                开始 <span onClick={this.pickStartDate.bind(this)}> {this.state.startDate} </span>
                结束 <span onClick={this.pickEndDate.bind(this)}> {this.state.endDate} </span>
                <DatePickBar
                    dateBarState={this.state.dateBarState}
                    nowDate={this.state.pickedDate}
                    handlePicked={this.handlePicked.bind(this)} />
            </div>
        )
    }
}

export default DoubleDatePicker;
