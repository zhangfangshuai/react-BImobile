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
            dataBar: []
        }
    }

    callBar(item, e) {
        e.stopPropagation();
        this.setState((prevState) => {
            switch (item) {
                case '商圈':
                    prevState.dataBar = this.state.bussOption;
                    break;
                case '近7日':
                    prevState.dataBar = this.state.periodOption;
                    break;
                case '全部':
                    prevState.dataBar = this.state.parkOption;
                    break;
                case '时刻':
                    prevState.dataBar = this.state.hourOption;
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
        Pubsub.subscribe('ITEM_SELECTED', (msg, item) => {
            // TODO: 选出谁应该呗更新
        })
    }

    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_ITEMLIST');
    }

    render() {
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
                <TrangleBar data={this.state.dataBar} state={this.state.barState} />
            </div>

        )
    }
}

export default TranglePicker;
