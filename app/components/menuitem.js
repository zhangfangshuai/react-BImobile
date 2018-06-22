import React from 'react';
import Pubsub from 'pubsub-js';

class MenuItem extends React.Component {
    goto(item, e) {
        e.stopPropagation();
        Pubsub.publish('HIDE_MENU');
        Pubsub.publish('GO', item);
    }

    render() {
        let item = this.props.data;
        return (
            <li className={`components-menuitem${this.props.focus ? ' focus' : ''}`}>
                <img src={`/static/images/${this.props.focus? item.focus_icon : item.icon}`} alt="" />
                <span onClick={(e) => this.goto(item, e)}>{item.name}</span>
            </li>
        )
    }
}


export default MenuItem;
