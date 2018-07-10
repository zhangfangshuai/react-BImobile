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
      console.log(this.props.master);
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
                component = <AppVersionBar barState={this.state.barState} cItem={this.state.cItem}/>;
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
