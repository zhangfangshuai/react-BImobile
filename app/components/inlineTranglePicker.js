/**
 * Create: zhangfs by Atom
 * Date: 2018/07/12
 * Sample: <InlineTranglePicker type=":type" master=":master" handlePick={this.handleFunc.bind(this)} />
 **/

import React from 'react'
import Pubsub from 'pubsub-js'
import AppVersionBar from './appVersionbar'
import PeriodBar from './periodbar'
import '../less/inlineTranglePicker.less'

class InlineTranglePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cItem: '全部',
            barState: {
                toggled: false,
                firstIn: true
            },
            periodData: [
                {id:1, value:'近7日'},
                {id:2, value:'近15日'},
                {id:3, value:'近1个月'},
                {id:3, value:'近2个月'}
            ]
        }
    }

    pickedIt() {
        this.setState({
            barState: {
                toggled: true,
                firstIn: false
            }
        })
    }

    componentDidMount() {
        Pubsub.subscribe('HIDE_ITEMLIST', () => {
            this.setState({
                barState: {
                    toggled: false,
                    firstIn: false
                }
            })
        })
        Pubsub.subscribe('ITEM_SELECTED', (msg, item) => {
            this.setState({
                cItem: item
            })
            this.props.handlePick(item, this.props.master);
        })
    }
    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_ITEMLIST');
    }


    render() {
        let component;
        switch (this.props.type) {
            case "appVersion":
                this.state.cItem = '全部';
                component = <AppVersionBar barState={this.state.barState} cItem={this.state.cItem}/>;
                break;
            case "period":
                this.state.cItem = '近7日';
                component = <PeriodBar barState={this.state.barState} cItem={this.state.cItem}/>;
                break;
            default:
                component = '';
                Tip.error('选择器类型匹配异常')
        }
        return (
            <div className="component-inlineTranglePicker">
                <div className="name" onClick={this.pickedIt.bind(this)}>{this.state.cItem}</div>
                { component }
            </div>
        )
    }
}

export default InlineTranglePicker;
