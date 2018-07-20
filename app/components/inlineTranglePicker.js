/**
 * Create: zhangfs by Atom
 * Date: 2018/07/12
 * Sample: <InlineTranglePicker type=":type" master=":master" handlePick={this.handleFunc.bind(this)} />
 **/

import React from 'react'
import Pubsub from 'pubsub-js'
import AppVersionBar from './appVersionbar'
import TrangleBar from './trangleBar'
import '../less/inlineTranglePicker.less'

class InlineTranglePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cItem: '全部',
            master: this.props.master || '',
            barState: {
                toggled: false,
                firstIn: true
            },
            periodOption: [
                { id: 1, value: '近7日' },
                { id: 2, value: '近15日' },
                { id: 3, value: '近1个月' },
                { id: 4, value: '近2个月' }
            ],
            carStateOption: [
                { id: 0, value: '全部' },
                { id: 1, value: '上架' },
                { id: 2, value: '下架' }
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
        switch (this.props.type) {
            case 'appVersion':
                this.state.cItem = "全部";
                break;
            case 'period':
                this.state.cItem = "近七日";
                break;
            case 'carState':
                this.state.cItem = "全部";
                break;
            default:
                Tip.error('三角下拉类型异常');
        }

        Pubsub.subscribe('HIDE_ITEMLIST', () => {
            this.setState({
                barState: {
                    toggled: false,
                    firstIn: false
                }
            })
        })
        Pubsub.subscribe('ITEM_SELECTED', (msg, p) => {
            this.setState({
                cItem: p.item.value || p.item
            })
            let cb_data = p.item.id ? p.item.id.toString() : p.item.id == 0 ? '0' : p.item;
            this.props.handlePick(cb_data, this.props.master);
        })
    }
    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_ITEMLIST');
        Pubsub.unsubscribe('ITEM_SELECTED');
    }


    render() {
        let component;
        switch (this.props.type) {
            case "appVersion":
                component = <AppVersionBar state={this.state.barState} cItem={this.state.cItem} master={this.state.master}/>;
                break;
            case "period":
                component = <TrangleBar data={this.state.periodOption} state={this.state.barState} master={this.state.master} />
                break;
            case "carState":
                component = <TrangleBar data={this.state.carStateOption} state={this.state.barState} master={this.state.master} />
                break;
            default:
                component = '';
        }
        return (
            <div className={`component-inlineTranglePicker ${this.props.self || '' }`}>
                <div className="name" onClick={this.pickedIt.bind(this)}>{this.state.cItem}</div>
                { component }
            </div>
        )
    }
}

export default InlineTranglePicker;
