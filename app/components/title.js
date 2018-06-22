import React from 'react';
import '../less/title.less';

class Title extends React.Component {

    render() {
        return (
            <div className="component-title">{this.props.name}</div>
        )
    }
}


export default Title;
