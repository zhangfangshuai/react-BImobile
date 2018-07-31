import React from 'react'

class KpiArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityStyle: { 'display': 'none' }
        }
    }

    showArea(id, ids, tbIds) {
        console.log(id, idArr);
        // TODO: 展开城市详情列表
        // if (id == 7) {
        //     Tip.success('北京已是具体城市');
        // } else if (id != 0) {
        //     for (let x of ids) {
        //         for (let y of tbIds) {
        //             console.log('');
        //         }
        //     }
        // }
    }

    render() {
        var kpiCity,
            K = this.props.data,
            area = this.props.item,
            ids = this.props.ids,
            tb = this.props.tb,
            tbIds = this.props.tbIds;
        if (K['areaId_' + area.area_id]) {
            kpiCity = K['areaId_'+area.area_id].map((city, idx) => {
                return (
                    <li className={`kpiCity Area_${tb.id + area.area_id}`} style={this.state.cityStyle} key={idx}>
                        <p><span>{city.cityname}</span></p>
                        <p>{city['kpi_goal'+tb.name]}</p>
                        <p>{city['kpi_current'+tb.name]}</p>
                        <p>{city['kpi_rate'+tb.name]+'%'}</p>
                    </li>
                )
            })
        }

        return (
            <div>
                <li className="kpiArea">
                    <p onClick={this.showArea.bind(this, area.area_id, ids, tbIds)}>{area.area_name}</p>
                    <p>{area['kpi_goal'+tb.name]}</p>
                    <p>{area['kpi_current'+tb.name]}</p>
                    <p>{area['kpi_rate'+tb.name]+'%'}</p>
                </li>
                { kpiCity }
            </div>
        )
    }
}

export default KpiArea;
