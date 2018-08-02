/**
 * Create: zhangfs by Atom
 * Date: 2018/07/09
 * type参数: 图表类型;  data参数: 构建图形的参数;  master: option.series所属图形
 * Sample: <Charts type="bar" data={this.state.data} />
 */

import React from 'react'
import { CHINAJSON } from '../config/config'
import '../less/charts.less'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/funnel'
import 'echarts/lib/chart/scatter'
// import 'echarts/lib/component/geo'
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

    initChart(prevProps) {
        let chart = echarts.init(this.refs.chart), option;
        switch (this.props.type) {
            case 'pie':
                option = this.pieOption(this.props.data);
                break;
            case 'circle':
                option = this.circleOption(this.props.data);
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
                chart.clear();  // 如果不clear(), 当已有堆叠数超过即将渲染的堆叠数时,会出现堆叠数错误
                option = this.multiStackedOption(this.props.data);
                break;
            case 'bar':
                option = this.barOption(this.props.data);
                break;
            case 'funnel':
                option = this.funnelOption(this.props.data);
                break;
            case 'scatter':
                // echarts.registerMap('china', this.state.geoCoordMap);
                option = this.scatterOption(this.props.data);
                break;
        }
        // console.log(option, 'option');
        chart.setOption(option);
        setTimeout(function (){
      	    window.onresize = function () {
      	    	  chart.resize();
      	    }
      	},200)

    }

    componentDidMount() {
        this.initChart();
    }

    componentDidUpdate(prevProps) {
        // 防止堆叠图分页的时候也刷新图表
        if (prevProps.data != this.props.data || prevProps.carState != this.props.carState) {
             this.initChart(prevProps);
        }
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
     * Func: 图表数据option设置
     */
    pieOption(opt) {
        return {
            color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
            textStyle:{ fontSize:28 },
            tooltip : {
                trigger: 'item',
                formatter: "{b} <br/>{c} ({d}%)",
                textStyle:{ fontSize:28 }
            },
            legend: {
                show: (this.props.hasLegend ? true : false),
                y: 'bottom',
                data: opt.legend
            },
            series: [
                { type:'pie', radius:[0,'60%'], center:['50%','42%'], label:{show:true }, name:'占比类型', data: opt.series }
            ]
        }
    }

    circleOption(opt) {
        return {
            color: ["#00C466","#D5D9DD"],
            textStyle: { fontSize:28 },
            series: [{
                type:'pie',
                radius: ['100%', '90%'],
                label: { show: true, position: 'center', formatter:'{c}%' },
                data:[
                    { value:opt, name:'', label:{ show:true } },
                    { value:100, name:'', label:{ show:false } }
                ]
            }]
        }
    }

    stackedAreaOption(opt) {
        return {
            color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
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
            color : ['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
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
        let option = {
            color: ['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
            label: { position:'bottom' },
            legend: { y:'bottom', fontSize:30 },
            textStyle: { color:'#647888', fontSize:30 },
            tooltip: {
                trigger: 'axis',
                textStyle: { color: '#fff', fontWeight: 'bold' },
            },
            grid: { left: '2%', bottom: '6%', containLabel: true },
            yAxis: { type: 'value', axisLabel:{'fontSize':30,'interval':0} },
            xAxis: {
                type: 'category',
                data: opt.axis,
                axisLabel:{'fontSize':30,'interval':0,'rotate':90}
            },
            series: [
                { name:'', type: 'bar', lineStyle:{ color:'#5B9BD5'}, data: opt.series }
            ]
        }

        switch (this.props.master) {
            case 'realBattery':
                option.xAxis.data = opt.data1;
                option.series = [
                    { type:'bar', name: '100%-80%', stack:'battery', data: opt.data6 },
                    { type:'bar', name: '80%-60%', stack:'battery', data: opt.data5 },
                    { type:'bar', name: '60%-40%', stack:'battery', data: opt.data4 },
                    { type:'bar', name: '40%-20%', stack:'battery', data: opt.data3 },
                    { type:'bar', name: '20%-0%', stack:'battery', data: opt.data2 }
                ];
                break;
            case 'cancelReason':
                option.color = ['#09CA65'];
                option.series = [ { name:'', type:'bar', lineStyle:{color:'#5B9BD5'}, data: opt.series } ];
                break;
        }
        return option;
    }

    funnelOption(opt) {
        return {
            color:['#98ecc0','#59E39B','#2fca78','#0bbb5f','#079c4e'],
            tooltip: { trigger: 'item', textStyle: { fontSize: 28 } },
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
        let option = {
            color : ['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
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
        // different charts series
        switch (this.props.master) {
            case 'realOrder':
                option.series = [
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'下单量', data: opt.data2 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'取车单', data: opt.data3 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'取消订单', data: opt.data4 }
                ]
                break;
            case 'realCash':
                option.series = [
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'收入', data: opt.data2 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'收现', data: opt.data3 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'优惠', data: opt.data4 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'未结算', data: opt.data5 }
                ]
                break;
            case 'realNewguy':
                option.series = [
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'注册', data: opt.data2 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'双证', data: opt.data3 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'押金', data: opt.data4 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'下单用户', data: opt.data5 },
                    { type:'line', smooth:true, lineStyle:{width:4}, name:'首单用户', data: opt.data6 }
                ]
                break;
        }

        return option;
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

    // KPI全国地图
    scatterOption(opt) {
        if (!opt.length) return {};
        let option = {
            title: {
                text: '开城城市分布情况',
                subtext: 'KPI考核',
                x: 'center'
            },
            geo: {
                map: 'china',
                roam: true,  // 移动:move; 缩放:scale; 都有:true; 默认都无：false
                zoom: 1.2,
                center: [104, 35],
                label: { show: false },
                itemStyle: {
                    normal: { areaColor: '#323c48', borderColor: '#111' },
                    emphasis: { areaColor: '#2d333a' }
                }
            },
            series: [
                {
                    name: 'city',
                    zlevel: 1,
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: opt,
                    symbolSize: [65,65],
                    symbol: 'image://static/images/hotpot.png',
                    label: { emphasis: { show: false } },
                }, {
                    name: 'cityActive',
                    zlevel: 2,
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: [opt[0]],
                    symbolSize: [90,90],
                    symbol: 'image://static/images/hotpot_chose.png',
                    label: { emphasis: { show: false } },
                }
            ]
        }
        return option;
    };

};

export default Charts;
