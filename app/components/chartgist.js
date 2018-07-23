import React from 'react'
import '../less/chartgist.less'

class ChartGist extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let GIST = this.props.data;
        return (
            <div className="component-chartgist">
                { this.props.master == 'realCar' && this.props.state == 0 &&
                  <div className="cols3">
                      <ul>
                          <li>后台车辆: <font>{ GIST.sumData0 }</font></li>
                          <li>上架车辆: <font>{ GIST.sumData1 }</font></li>
                          <li>实时上架率: <font>{ GIST.sumData2 + '%' }</font></li>
                      </ul>
                      <ul>
                          <li>运维下架: <font>{ GIST.sumData3 }</font></li>
                          <li>停运车辆: <font>{ GIST.sumData16 }</font></li>
                          <li>可运营车辆: <font>{ GIST.sumData17 }</font></li>
                      </ul>
                  </div> }

                { this.props.master == 'realCar' && this.props.state == 1 &&
                  <div className="cols2">
                      <ul>
                          <li>待租: <font>{ GIST.sumData6 }</font></li>
                          <li>已预订: <font>{ GIST.sumData7 }</font></li>
                      </ul>
                      <ul>
                          <li>服务中-未取车: <font>{ GIST.sumData8 }</font></li>
                          <li>服务中-已取车: <font>{ GIST.sumData9 }</font></li>
                      </ul>
                  </div> }

                { this.props.master == 'realCar' && this.props.state == 2 &&
                  <div className="cols3">
                      <ul>
                          <li>运维中: <font>{ GIST.sumData10 }</font></li>
                          <li>充电中: <font>{ GIST.sumData11 }</font></li>
                          <li>物料缺失: <font>{ GIST.sumData13 }</font></li>
                      </ul>
                      <ul>
                          <li>机车离线: <font>{ GIST.sumData14 }</font></li>
                          <li>低续航: <font>{ GIST.sumData4 }</font></li>
                          <li>其他原因: <font>{ GIST.sumData15 }</font></li>
                      </ul>
                  </div> }

                { this.props.master == 'realOrder' &&
                  <div className="cols3">
                      <ul>
                          <li>今日下单量: <font>{ GIST.sumData0 }</font></li>
                          <li>今日取车单: <font>{ GIST.sumData1 }</font></li>
                          <li>单均里程: <font>{ GIST.sumData4 }</font></li>
                      </ul>
                      <ul>
                          <li>车均单: <font>{ GIST.sumData3 }</font></li>
                          <li>今日取消单: <font>{ GIST.sumData2 }</font></li>
                          <li>单均时长: <font>{ GIST.sumData5 }</font></li>
                      </ul>
                  </div> }

                { this.props.master == 'realNewguy' &&
                  <div className="cols3">
                      <ul>
                          <li>今日注册数: <font>{ GIST.sumData0 }</font></li>
                          <li>今日新增双证: <font>{ GIST.sumData1 }</font></li>
                          <li></li>
                      </ul>
                      <ul>
                          <li>今日下单量: <font>{ GIST.sumData2 }</font></li>
                          <li>今日押金额: <font>{ GIST.sumData3 }</font></li>
                          <li>今日首单: <font>{ GIST.sumData4 }</font></li>
                      </ul>
                  </div> }

                { this.props.master == 'realBattery' &&
                  <div className="cols2">
                      <ul>
                          <li>待租65%以下: <font>{ GIST.sumData0 }</font></li>
                          <li>下架65%以下: <font>{ GIST.sumData1 }</font></li>
                      </ul>
                  </div> }
            </div>
        )
    }
}

export default ChartGist;
