import React from 'react';
import '../less/table.less';

class Table extends React.Component {

    render() {
        let thList = this.props.thead.map((item) => {
            return (
                <p key={this.props.thead.indexOf(item)}>
                    { item }
                </p>
            )
        })

        return (
          <div className="scroll-cont">
              <div className={`headLine ${this.props.self || ''}`}> { thList } </div>
              <ul className={this.props.self || ''}> { this.props.tbody } </ul>
          </div>
        )
    }
}

export default Table;
