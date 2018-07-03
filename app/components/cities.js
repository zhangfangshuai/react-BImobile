import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/cities.less'
import { CITY_LIST } from '../config/config'
import CityItem from './cityitem'

class Cities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cityList: CITY_LIST,
            cityReq: {
                interface: 'getCity'
            }
        };
    }

    componentWillMount() {
        axiosGet(this.state.cityReq, (res) => {
            this.setState({
                cityList: res
            })
        }, false)
    }

    hideCity() {
        Pubsub.publish('HIDE_CITY');
    }

    render() {
        let Items = this.state.cityList.map((item) => {
            return (
                <CityItem
                    key={item.value}
                    data={item}
                    focus={this.props.cItem == item}
                />
            )
        })
        let CS = this.props.cityState;
        return (
            <div className="component-cities">
              <div className={`cities-mask cities-mask-${CS.toggled ? 'show' : 'hide'}`}></div>
              <div className={`cities cities-${CS.toggled ? 'show' : CS.firstIn ? '' : 'hide'}`}>
                  <div className="cities-bar">
                      <p onClick={this.hideCity.bind(this)}>取消</p>
                      <p>请选择</p>
                  </div>
                  <ul>
                      { Items  }
                  </ul>
              </div>
            </div>
        )
    }
}

export default Cities;
