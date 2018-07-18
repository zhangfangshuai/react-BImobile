import React from 'react'
import '../less/flagTitle.less'

class FlagTitle extends React.Component {

    render() {
        return (
            <div className="component-flagtitle">
                {this.props.name}
            </div>
        )
    }
}

export default FlagTitle;
