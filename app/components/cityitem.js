import React from 'react';
import Pubsub from 'pubsub-js';
import '../less/cityitem.less';

class CityItem extends React.Component {
    getCityItem(item, e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_CITY');
        Pubsub.publish('CITY_SELECTED', item);
    }

    render() {
        let item = this.props.data;
        return (
            <li className="component-cityitem">
                <span onClick={this.getCityItem.bind(this, item)}>{item.text}</span>
            </li>
        )
    }
}

export default CityItem;
