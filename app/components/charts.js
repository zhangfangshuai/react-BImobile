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
        chart.clear(); // 如果不clear(), 当已有堆叠数超过即将渲染的堆叠数时,会出现堆叠数错误
        switch (this.props.type) {
            case 'pie':
                option = this.pieOption(this.props.data);
                break;
            case 'line':
                option = this.lineOption(this.props.data);
                break;
            case 'multi_line':
                option = this.multiLineOption(this.props.data);
                break;
            case 'line_stacked_area':
                option = this.stackedAreaOption(this.props.data);
                break;
            case 'multi_line_stacked':
                option = this.multiStackedOption(this.props.data);
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
            legend: { y: 'bottom', itemGap: 60 },
            grid: { left:'10%', top:'6%', bottom: '13%' },
            yAxis: [{ name: '百分比', type: 'value', nameTextStyle: {fontSize:24}, axisLabel: {fontSize:24} }],
            xAxis: [{ type: 'category', data: opt.date }],
            series: [
                { type: 'line', name:'上架率', stack: true, areaStyle: { opacity:1 }, data:opt.data1 },
                { type: 'line', name:'故障下架率', stack: true, areaStyle: { opacity:1 }, data:opt.data2 },
                { type: 'line', name:'低电下架率', stack: true, areaStyle: { opacity:1 }, data:opt.data3 },
                { type: 'line', name:'运维下架率', stack: true, areaStyle: { opacity:1 }, data:opt.data4 }
            ]
        };
    }

    lineOption(opt) {
        return {
            color : ['#09CA65'],
            textStyle:{ color:'#647888', fontSize: 40 },
            tooltip: {
                trigger: 'axis',
                textStyle: { color: '#fff', fontWeight: 'bold' },
            },
            legend: { show: false },
            grid:{ left:'10%' },
            yAxis: [{ type: 'value', name: '数量' }],
            xAxis:  [{
                type: 'category',
                data: opt.xaxis
            }],
            series: [
                { type:'line', lineStyle:{ width:4 }, name:'离线数', data: opt.series }
            ]
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

    multiLineOption(opt) {
        return {
            color : ['#09CA65','#F5A623','#0DB0FF','#FF7263','#C584FF','#4D68E5'],
            textStyle:{ color:'#647888', fontSize: 24 },
            tooltip: { trigger: 'axis' },
            legend: { itemGap: 60, y: 'bottom', },
            grid:{ left: '13%', top:"2%", bottom:"15%" },
            yAxis: { type: 'value' },
            xAxis: {
                type : 'category',
                data : opt.data1
            },
            series: [
                { type:'line', smooth:true, lineStyle:{width:4}, name:'收入', data: opt.data2 },
                { type:'line', smooth:true, lineStyle:{width:4}, name:'收现', data: opt.data3 },
                { type:'line', smooth:true, lineStyle:{width:4}, name:'优惠', data: opt.data4 },
                { type:'line', smooth:true, lineStyle:{width:4}, name:'未结算', data: opt.data5 }
            ]
        }
    }

    multiStackedOption(opt) {
        let option = {
            color: ['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
            textStyle: { color:'#647888', fontSize:30 },
            tooltip: { trigger: 'axis' },
            grid: { top: "5%", bottom:"15%" },
            legend: { itemGap: 30, y:'bottom' },
            yAxis: { type:'value' },
            xAxis: { type:'category', data: opt.data1 },
            series: [
                { areaStyle:{opacity:1}, type:'line', stack:'all', name:'上架', data: opt.data2 },
                { areaStyle:{opacity:1}, type:'line', stack:'all', name:'下架', data: opt.data3 },
                { areaStyle:{opacity:1}, type:'line', stack:'all', name:'停止运营', data: opt.data4 }
            ]
        };

        switch (this.props.carState) {
          case '0':  // 全部
            option.series = [
                { areaStyle:{opacity:1}, type:'line', stack:'all', name:'上架', data: opt.data2 },
                { areaStyle:{opacity:1}, type:'line', stack:'all', name:'下架', data: opt.data3 },
                { areaStyle:{opacity:1}, type:'line', stack:'all', name:'停止运营', data: opt.data4 }
            ]
            break;
          case '1':  // 上架
            option.series = [
                { areaStyle:{opacity:1}, type:'line', stack:'on', name:'待租', data: opt.data5 },
                { areaStyle:{opacity:1}, type:'line', stack:'on', name:'已预订', data: opt.data6 },
                { areaStyle:{opacity:1}, type:'line', stack:'on', name:'服务中-未取车', data: opt.data7 },
                { areaStyle:{opacity:1}, type:'line', stack:'on', name:'服务中-已取车', data: opt.data8 }
            ]
            break;
          case '2':  // 下架
            option.series = [
                { areaStyle:{opacity:1}, type:'line', stack:'off', name:'运维中', data: opt.data9 },
                { areaStyle:{opacity:1}, type:'line', stack:'off', name:'充电中', data: opt.data10 },
                { areaStyle:{opacity:1}, type:'line', stack:'off', name:'低续航', data: opt.data11 },
                { areaStyle:{opacity:1}, type:'line', stack:'off', name:'车机离线', data: opt.data12 },
                { areaStyle:{opacity:1}, type:'line', stack:'off', name:'物料缺失', data: opt.data13 },
                { areaStyle:{opacity:1}, type:'line', stack:'off', name:'其他原因', data: opt.data14 }
            ]
        }
        return option;
    }

};

export default Charts;
