/**
 * Create: zhangfs by Atom
 * Date: 2018/07/11
 * Sample <TableBody key={idx} data={[i.dateId, i.data]} />
 **/

import React from 'react'

class TableBody extends React.Component {

    render() {
        let Items = this.props.data.map((i, idx) => {
            return (
                <p key={idx}>
                    <span>{i}</span>
                </p>
            )
        })

        return (
            <li> { Items } </li>
        )
    }
}

export default TableBody;
