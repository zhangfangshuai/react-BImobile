import React from 'react'
import '../less/flagTitle.less'

class FlagTitle extends React.Component {

    render() {
        let self = this.props.self;
        return (
            <div className={`component-flagtitle${ ' '+self || ''}`}>
                { this.props.name }
            </div>
        )
    }
}

export default FlagTitle;
