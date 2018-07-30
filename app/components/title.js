import React from 'react';
import '../less/title.less';

class Title extends React.Component {

    render() {
        return (
            <div className="component-title">{this.props.name + (this.props.variable || '')}</div>
        )
    }
}


export default Title;
