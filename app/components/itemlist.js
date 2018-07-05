import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/itemlist.less'

class ItemList extends React.Component {

    selectItem(item, master, e) {
        e.stopPropagation();
        let p = {
            item: item,
            master: master
        }
        Pubsub.publish('HIDE_ITEMLIST');
        Pubsub.publish('ITEM_SELECTED', p);
    }

    render() {
        let  item = this.props.data;
        return (
            <li className="component-itemlist" onClick={this.selectItem.bind(this, item, this.props.master)}>
                <span> { item.value || item.businessareaname } </span>
            </li>
        )
    }
}

export default ItemList;
