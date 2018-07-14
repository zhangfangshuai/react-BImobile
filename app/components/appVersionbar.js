import React from 'react'
import Pubsub from 'pubsub-js'
import VersionList from '../components/versionList'
import '../less/appVersionbar.less'

class AppVersionBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appVersions: [],
            appVersionReq: { interface: 'dau/getAppVersions' }
        }
    }

    appVersionRequest(p) {
        if (isParamValid(p, 'get_app_version')) {
            axiosGet(p, (r) => {
                r.unshift('全部');
                this.setState({
                    appVersions: r
                })
            })
        }
    }

    hideBar() {
        Pubsub.publish('HIDE_ITEMLIST');
    }

    componentDidMount() {
        this.appVersionRequest(this.state.appVersionReq);
    }

    render() {
        let  Items = this.state.appVersions.map((item, idx) => {
            return (
                <VersionList
                    key={idx}
                    data={item}
                    focus={this.props.cItem == item}
                    master={this.props.master}
                />
            )
        })
        let BS = this.props.state;
        return (
            <div className="component-appVersionBar">
                <div className={`version-mask${BS.toggled ? ' vmshow' : ' vmhide'}`}></div>
                <div className={`version${BS.toggled ? ' vshow' : BS.firstIn ? '' : ' vhide'}`}>
                    <div className="version-bar">
                        <p onClick={this.hideBar.bind(this)}>取消</p>
                        <p>请选择</p>
                    </div>
                    <ul>
                        { Items }
                    </ul>
                </div>
            </div>
        )
    }
}

export default AppVersionBar;
