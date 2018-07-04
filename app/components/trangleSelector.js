import React from 'react'
import Pubsub from 'pubsub-js'
import TrangleBar from './trangleBar'
import '../less/trangleSelector.less'

class TrangleSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectors: {
                '商圈': [],
                '周期': [],
                '网点类型': [],
                '时刻': []
            },
            active: {
                '商圈': '商圈',
                '周期': '近7日',
                '网点类型': '全部',
                '时刻': '0时'
            },
            periodOption: [{id:1, value:'近7日'},{id:2, value:'近15日'},{id:3, value:'近1个月'},{id:3, value:'近2个月'}],
            parkOption: [{id:'',value: '全部'},{id:0,value:'实体'},{id:1,value:'虚拟'}],
            timeOption: [{id:0,value:'0点'},{id:1,value:'1点'},{id:2,value:'2点'},{id:3,value:'3点'},
                         {id:4,value:'4点'},{id:5,value:'5点'},{id:6,value:'6点'},{id:7,value:'7点'},
                         {id:8,value:'8点'},{id:9,value:'9点'},{id:10,value:'10点'},{id:11,value:'11点'},
                         {id:12,value:'12点'},{id:13,value:'13点'},{id:14,value:'14点'},{id:15,value:'15点'},
                         {id:16,value:'16点'},{id:17,value:'17点'},{id:18,value:'18点'},{id:19,value:'19点'},
                         {id:20,value:'20点'},{id:21,value:'21点'},{id:22,value:'22点'},{id:23,value:'23点'},],
            barState: {
                toggled: false,
                firstIn: true
            },
            bussAreaReq: {
                interface: 'park/getBusinessArea',
                cityId: this.props.city.value
            }
        }
    }

    callBar(item, e) {
        console.log(item);
        this.setState({
            barState: {
                toggled: true,
                firstIn: false
            }
        })
    }

    bussAreaRequest(p) {
        if (isParamValid(p, 'businessArea')) {
            axiosGet(p, (r) => {
                this.setState({
                    selectors: Object.assign({}, this.state.selectors, { '商圈': r })
                })
            })
        }
    }

    componentDidMount() {
        for (let s of this.props.selectors) {
            switch (s) {
                case '商圈':
                    this.bussAreaRequest(this.state.bussAreaReq);
                    break;
                case '周期':
                    this.setState({
                        selectors: Object.assign({}, this.state.selectors, { s: this.state.periodOption })
                    })
                    break;
                case '网点类型':
                    this.setState({
                        selectors: Object.assign({}, this.state.selectors, { s: this.state.parkOption })
                    })
                    break;
                case '时刻':
                    this.setState({
                        selectors: Object.assign({}, this.state.selectors, { s: this.state.timeOption })
                    })
                    break;
                default:
                    Tip.success(s + '选择器未初始化');
            }
        }

        Pubsub.subscribe('HIDE_ITEMLIST', () => {
            this.setState({
                barState: {
                    toggled: false,
                    firstIn: false
                }
            })
        });
        Pubsub.subscribe('ITEM_SELECTED', (msg, item) => {
            console.log(item);
        })
    }

    componentWillUnmount() {
        Pubsub.unsubscribe('HIDE_ITEMLIST');
        Pubsub.unsubscribe('ITEM_SELECTED');
    }

    render() {
        let Selector = this.props.selectors.map((item) => {
            if (!this.state.selectors[item]) {
                return (
                    <div key={this.props.selectors.indexOf(item)}>
                        <p onClick={this.callBar.bind(this, item)}>{this.state.activeName[item]}</p>
                        <TrangleBar data={this.state.selectors[item]} state={this.state.barState} />
                    </div>
                )
            }
        })
        return (
            <div className="component-trangleSelector">
                { Selector }
            </div>
        )
    }
}

export default TrangleSelector;
