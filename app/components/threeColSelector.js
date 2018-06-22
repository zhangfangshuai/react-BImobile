import React from 'react';
import '../less/threeColSelector.less';

class ThreeColSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: this.props.cols[0]
        }
    }

    selectTerm(c) {
        this.setState({
            active: c
        });
        this.props.handleTCS(this.props.cols.indexOf(c));
    }

    render() {
        let colItem = this.props.cols.map((col) => {
            return (
                <p key={this.props.cols.indexOf(col)}
                    onClick={this.selectTerm.bind(this, col)}
                    className={col === this.state.active ? 'active' : ''}>
                    { col }
                </p>
            )
        })

        return (
            <div className="threeColSelector">
                { colItem }
            </div>
        )
    }
}

export default ThreeColSelector;
