import React from 'react'
import '../less/charts.less'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'

class Charts extends React.Component {

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

    initChart() {
        let pie = echarts.init(this.refs.pie);
        let option = this.pieOption(this.props.data);
        pie.setOption(option)
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
                <div ref="pie" style={{width:"100%", height:"100%"}}></div>
            </div>
        )
    }
};

export default Charts;
