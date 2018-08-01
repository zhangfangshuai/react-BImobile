import React from 'react'

class KpiArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityState: { 'display': 'none' },
            boolean: false
        }
    }

    showArea(actId) {
        // TODO: 打开一个面板同时关闭另一个面板
        if (actId == 7) {
            Tip.success('北京已是具体城市!');
            return ;
        }
        this.setState((prevState) => {
            prevState.boolean = !this.state.boolean,
            prevState. cityState = {
                'display': prevState.boolean ? 'block' : 'none'
            }
        })
    }

    render() {
        var kpiCity,
            K = this.props.data,
            V = this.props.variable,
            area = this.props.item;

        if (K['areaId_' + area.area_id]) {
            kpiCity = K['areaId_'+area.area_id].map((city, idx) => {
                return (
                    <li className="kpiCity" style={this.state.cityState} key={idx}>
                        <p><span>{city.cityName}</span></p>
                        <p>{city['kpi_goal'+V]}</p>
                        <p>{city['kpi_current'+V]}</p>
                        <p>{city['kpi_rate'+V]+'%'}</p>
                    </li>
                )
            })
        }

        return (
            <div>
                <li className="kpiArea">
                    <p onClick={this.showArea.bind(this, area.area_id)}>{area.area_name}</p>
                    <p>{area['kpi_goal'+V]}</p>
                    <p>{area['kpi_current'+V]}</p>
                    <p>{area['kpi_rate'+V]+'%'}</p>
                </li>
                { kpiCity }
            </div>
        )
    }
}

export default KpiArea;
