/**
 * Create: zhangfs by Atom
 * Time: 2018/07/04
 * Usage: <TranglePicker selectors={['商圈']} city={this.state.city} handleTPick={this.handleTPick.bind(this)} />
 **/

import React from 'react'
import Pubsub from 'pubsub-js'
import TrangleBar from './trangleBar'
import '../less/tranglePicker.less'

class TranglePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barState: {
                toggled: false,
                firstIn: true
            },
            bussOption: [],
            periodOption: [{id:1, value:'近7日'}, {id:2, value:'近15日'}, {id:3, value:'近1个月'}, {id:3, value:'近2个月'}],
            parkOption: [{id:'', value: '全部'}, {id:0, value:'实体'}, {id:1, value:'虚拟'}],
            hourOption: [{id:0,value:'0点'},{id:1,value:'1点'},{id:2,value:'2点'},{id:3,value:'3点'},
                         {id:4,value:'4点'},{id:5,value:'5点'},{id:6,value:'6点'},{id:7,value:'7点'},
                         {id:8,value:'8点'},{id:9,value:'9点'},{id:10,value:'10点'},{id:11,value:'11点'},
                         {id:12,value:'12点'},{id:13,value:'13点'},{id:14,value:'14点'},{id:15,value:'15点'},
                         {id:16,value:'16点'},{id:17,value:'17点'},{id:18,value:'18点'},{id:19,value:'19点'},
                         {id:20,value:'20点'},{id:21,value:'21点'},{id:22,value:'22点'},{id:23,value:'23点'},],
            bussAreaReq: {
                interface: 'park/getBusinessArea',
                cityId: 2
            },
            bussActive: '商圈',
            periodActive: '近7日',
            parkActive: '全部',
            hourActive: '0时',
            master: 0,  // 0:商圈; 1:周期; 2:网点类型; 4:时刻
            dataBar: []
        }
    }

    callBar(item, e) {
        e.stopPropagation();
        this.setState((prevState) => {
            switch (item) {
                case '商圈':
                    prevState.dataBar = this.state.bussOption;
                    prevState.master = 0;
                    break;
                case '近7日':
                    prevState.dataBar = this.state.periodOption;
                    prevState.master = 1;
                    break;
                case '全部':
                    prevState.dataBar = this.state.parkOption;
                    prevState.master = 2;
                    break;
                case '时刻':
                    prevState.dataBar = this.state.hourOption;
                    prevState.master = 3;
                    break;
                default:
                    Tip.success('该选择器还未配置');
            }
            prevState.barState.toggled = true;
            prevState.barState.firstIn = false;
        })
    }

    bussAreaRequest(p) {
        if (isParamValid(p, 'businessArea')) {
            axiosGet(p, (r) => {
                this.setState({
                    dataBar: r,
                    bussOption: r
                })
            });
        }
    }
    componentDidMount(){
        this.bussAreaRequest(this.state.bussAreaReq);
        Pubsub.subscribe('HIDE_ITEMLIST', () => {
            this.setState({
                barState: {
                    toggled: false,
                    firstIn: false
                }
            })
        });
        Pubsub.subscribe('ITEM_SELECTED', (msg, params) => {
            let cb = params.item.value || params.item.businessareaname;
            switch (params.master) {
                case 0:
                    this.setState({ bussActive: cb });
                    break;
                case 1:
                    this.setState({ periodActive: cb });
                    break;
                case 2:
                    this.setState({ parkActive: cb });
                    break;
                case 3:
                    this.setState({ hourActive: cb });
                    break;
                default:
                  Tip.success('该项还未被配置');
            }
            this.props.handleTPick(params);
        })
    }

    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_ITEMLIST');
    }

    render() {
        let bussHTML = null, periodHTML = null, parkHTML = null;
        for (let selector of this.props.selectors) {
            selector == '商圈' && bussHTML = <p onClick={this.callBar.bind(this, selector)}> { this.state.bussActive } </p>
            selector == '近七日' && periodHTML = <p onClick={this.callBar.bind(this, selector)}> { this.state.periodActive } </p>
            selector == '全部' && parkHTML = <p onClick={this.callBar.bind(this, selector)}> { this.state.periodActive } </p>
            selector == '时刻' && hourHTML = <p onClick={this.callBar.bind(this, selector)}> { this.state.hourActive } </p>
        }
        return (
            <div className="component-tranglePicker">
                <p onClick={this.callBar.bind(this, this.props.selectors[0])}>
                    { this.state.bussActive }
                </p>
                <p onClick={this.callBar.bind(this, this.props.selectors[1])}>
                    { this.state.periodActive }
                </p>
                <p onClick={this.callBar.bind(this, this.props.selectors[2])}>
                    { this.state.parkActive }
                </p>
                <TrangleBar data={this.state.dataBar} state={this.state.barState} master={this.state.master} />
            </div>

        )
    }
}

export default TranglePicker;
