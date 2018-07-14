import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/itemlist.less'

class VersionList extends React.Component {

    selectItem(e) {
        e.stopPropagation();
        let p = {
            item: this.props.data,
            master: this.props.master
        }
        Pubsub.publish('HIDE_ITEMLIST');
        Pubsub.publish('ITEM_SELECTED', p);
    }

    render() {
        return (
            <li className="component-itemlist" onClick={this.selectItem.bind(this)}>
                <span> { this.props.data } </span>
            </li>
        )
    }
}

export default VersionList;
