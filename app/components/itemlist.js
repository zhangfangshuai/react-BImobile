import React from 'react'
import Pubsub from 'pubsub-js'
import '../less/itemlist.less'

class ItemList extends React.Component {

    selectItem(item, e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_ITEMLIST');
        Pubsub.publish('ITEM_SELECTED', item);
    }

    render() {
        let  item = this.props.data;
        return (
            <li className="component-itemlist">
                <span onClick={this.selectItem.bind(this, item)}>{item.value || item.businessareaname}</span>
            </li>
        )
    }
}

export default ItemList;
