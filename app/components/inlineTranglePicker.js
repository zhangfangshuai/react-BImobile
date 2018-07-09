import React from 'react'
import Pubsub from 'pubsub-js'
import AppVersionBar from './appVersionbar'
import '../less/inlineTranglePicker.less'

class InlineTranglePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cItem: '全部',
            barState: {
                toggled: false,
                firstIn: true
            }
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
            // TODO: 修改了CITEM后如何更新axios请求
        })
    }
    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_ITEMLIST');
    }

    render() {
        let component;
        switch (this.props.type) {
            case "appVersion":
                component = <AppVersionBar barState={this.state.barState} />;
                break;
            default:
                component = '';
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
