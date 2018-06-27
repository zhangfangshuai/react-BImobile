import React from 'react'
import '../less/titleWithBubble.less'

class TitleWithBubble extends React.Component {

    render() {
        return (
            <div className="component-titleWithBubble">
                {this.props.name}
                <span className="bubble">TOP 10</span>
            </div>
        )
    }
}

export default TitleWithBubble;
