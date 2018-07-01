import React from 'react'
import '../less/charts.less'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'

class Charts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartSize: {
                width: '100%',
                height: '100%'
            }
        }
    }

    initChart() {
        let chart = echarts.init(this.refs.chart), option;
        switch (this.props.type) {
            case 'pie':
                option = this.pieOption(this.props.data);
                break;
            case 'line_stacked_area':
                option = this.stackedAreaOption(this.props.data);
                break;
            case 'line_basic':
                option = this.lineOption(this.props.data);
                break
        }
        chart.setOption(option)
    }

    componentDidMount() {
        this.initChart();
    }

    componentDidUpdate() {
        this.initChart();
    }

    render() {
        return (
            <div className={`component-charts ${this.props.self || ''}`}>
                <div ref="chart" style={this.state.chartSize}></div>
            </div>
        )
    }


    /*
     * Create: zhangfs with Atom by 2018/07/01
     * Func: option generator
     */
    pieOption(opt) {
        return {
            textStyle: { color: '#647888', fontSize: 24},
            tooltip : {
                trigger: 'item',
                formatter: '{b}<br/>{c} ({d}%)',
                textStyle: { fontSize: 40 }
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: opt.length
            },
            series: [
                {
                    type: 'pie',
                    legendHoverLink: true,
                    radius : '60%',
                    center: ['50%', '35%'],
                    label: {
                        normal: {
                            show: false,
                            position: 'outside'
                        },
                    },
                    data: opt.series,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    }

    stackedAreaOption(opt) {
        return {
            color:['#09CA65','#0DB0FF','#FF7263','#F5A623','#C584FF','#4D68E5'],
            textStyle:{ color:'#647888', fontSize:24 },
            tooltip : {
                trigger: 'axis',
                textStyle: { color: '#fff', fontWeight: 'bold' },
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data:[
                    { name:'上架率', icon : 'circle' },
                    { name:'故障下架率', icon : 'circle' },
                    { name:'低电下架率', icon : 'circle' },
                    { name:'运维下架率', icon : 'circle' }
                ]
            },
            grid: {
                top:'10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: [{ type: 'category', data: opt.date }],
            yAxis: [{
                    name: '百分比',
                    nameTextStyle: { fontSize:24 },
                    type : 'value',
                    axisLabel: { fontSize:24 }
            }],
            series: [
                {
                    type: 'line',
                    name:'上架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:opt.data1
                }, {
                    type: 'line',
                    name:'故障下架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:opt.data2
                }, {
                    type: 'line',
                    name:'低电下架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:opt.data3
                }, {
                    type: 'line',
                    name:'运维下架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:opt.data4
                }
            ]
        };
    }

    lineOption(opt) {
        return {
            color : ['#09CA65'],
            textStyle:{ color:'#647888', fontSize:24 },
            tooltip: {
                trigger: 'axis',
                textStyle: { color: '#fff', fontWeight: 'bold' },
            },
            legend: {
                x: 'center',
                y: 'top',
                data:[{ name:'数量', icon: 'circle' }],
            },
            grid:{ left: '10%', right:'15%' },
            xAxis:  [{ type: 'category', data: opt.axisList }],
            yAxis: [{ type: 'value', name: '数量' }],
            series: [{
                name:'离线数',
                type:'line',
                lineStyle: { width:7 },
                data: opt.dataList,
            }]
        }
    }


};

export default Charts;
