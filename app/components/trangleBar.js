import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/trangleBar.less'
import ItemList from './itemlist'

class TrangleBar extends React.Component {

    hideBar() {
        Pubsub.publish('HIDE_ITEMLIST');
    }

    render() {
        let Items = this.props.data.map((item) => {
            return (
                <ItemList
                    key={this.props.data.indexOf(item)}
                    data={item}
                    focus={this.props.cItem == item}
                    master={this.props.master}
                />
            )
        })

        let BS = this.props.state;
        return (
            <div className="component-trangleBar">
                <div className={`bar-mask bar-mask-${BS.toggled ? 'show' : 'hide'}`}></div>
                <div className={`bar bar-${BS.toggled ? 'show' : BS.firstIn ? '' : 'hide'}`}>
                    <div className="bar-body">
                        <p onClick={this.hideBar.bind(this)}>取消</p>
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

export default TrangleBar;
