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
            case 'stacked_area':
                option = this.stackedAreaOption(this.props.data);
                break;
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

    // option defined
    pieOption(data) {
        return {
            textStyle:{
                color:'#647888',
                fontSize:30
            },
            tooltip : {
                trigger: 'item',
                formatter: '{b}<br/>{c} ({d}%)',
                textStyle: { fontSize: 40 }
            },
            legend: {
                data: data.length,
                show: true,
                x: 'center',
                y: 'bottom'
            },

            series : [
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
                    data: data.series,
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

    stackedAreaOption(data) {
        return {
            color:['#09CA65','#0DB0FF','#FF7263','#F5A623','#C584FF','#4D68E5'],
            textStyle:{
                color:'#647888',
                fontSize:30
            },
            tooltip : {
                trigger: 'axis',
                textStyle : {
                    color: '#fff',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 24,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },

            },
            legend: {
                x: 'center',
                y: 'bottom',
                textStyle: { fontSize: 20 },
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
            xAxis : [
                {
                    type : 'category',
                    data : data.date,
                    axisLabel:{'fontSize':20}
                }
            ],
            yAxis : [
                {
                    name: '百分比',
                    nameTextStyle: { fontSize: 20 },
                    type : 'value',
                    axisLabel:{'fontSize':20}
                }
            ],
            series : [
                {
                    type: 'line',
                    name:'上架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:data.data1
                },
                {
                    type: 'line',
                    name:'故障下架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:data.data2
                },
                {
                    type: 'line',
                    name:'低电下架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:data.data3
                },
                {
                    type: 'line',
                    name:'运维下架率',
                    stack: true,
                    areaStyle: { opacity:1 },
                    data:data.data4
                }
            ]
        };
    }

};

export default Charts;
