import React from 'react';
import '../less/baritem.less';

class BarItem extends React.Component {
    render() {
        return (
            <ul className="component-baritem">
                <li>{this.props.data}</li>
            </ul>
        )
    }
}

export default BarItem;
