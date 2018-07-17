/**
 * Create: zhangfs by Atom
 * Date: 2018/07/09
 * type参数: 图表类型;  data参数: 构建图形的参数
 * Sample: <Charts type="bar" data={this.state.data} />
 */

import React from 'react'
import '../less/charts.less'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/funnel'
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
                break;
            case 'bar':
                option = this.barOption(this.props.data);
                break;
            case 'funnel':
                option = this.funnelOption(this.props.data);
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


    /*
     * Create: zhangfs with Atom by 2018/07/01
     * Func: 接受一个包含legend和series字段的对象参数
     */
    pieOption(opt) {
        return {
            color:['#09CA65','#00F977','#D0DFEE','#FFC32B'],
            textStyle:{ fontSize:28 },
            tooltip : {
                trigger: 'item',
                formatter: "{b} <br/>{c} ({d}%)",
                textStyle:{ fontSize:28 }
            },
            legend: {
                show: (this.props.hasLegend ? true : false),
                x: 'center',
                y: 'bottom',
                data: opt.legend
            },
            series : [
                {
                    name: '占比类型',
                    type: 'pie',
                    radius : '75%',
                    label: { show: true },
                    data: opt.series
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

    barOption(opt) {
        return {
            color : ['#09CA65'],
            label:{ position:'bottom' },
            legend: { fontSize:30 },
            textStyle:{
                color:'#647888',
                fontSize:30
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle : {
                    color: '#fff',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 24,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },
            },
            grid: {
                left: '2%',
                // right: '4%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: opt.axis,
                axisLabel:{'fontSize':30,'interval':0,'rotate':90}
            },
            yAxis: {
                type: 'value',
                axisLabel:{'fontSize':30,'interval':0}
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: opt.series,
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color: '#5B9BD5'
                            }
                        }
                    }
                }
            ]
        }
    }

    funnelOption(opt) {
        return {
            color:['#98ecc0','#59E39B','#2fca78','#0bbb5f','#079c4e'],
            tooltip: {
                trigger: 'item',
                textStyle: { fontSize: 28 }
            },
            series: [ {
                name:'DAU占比分析',
                type:'funnel',
                width: '80%',
                left: '10%',
                min: 0,
                // max: 100,  // 大于max宽度显示为100%
                data: opt,
                label: {
                    fontSize: 24,
                    position: 'inside',
                    formatter: (p) => {
                        let r = this.funnelOption(this.props.data).series[0].data;
                        let key = p.name.slice(0, p.name.length-2)
                        if (p.dataIndex == 0 ) {
                            return key + ": " + (p.value ? p.value : '-') + "人次";
                        } else {
                          var perc = (r[p.dataIndex].value / r[p.dataIndex-1].value * 100).toFixed(2);
                          return key +": " + (isNaN(perc) ? '-' : perc) + '%';
                        }
                    }
                }
            }]
        }
    }

};

export default Charts;
