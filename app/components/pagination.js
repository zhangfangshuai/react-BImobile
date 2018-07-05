/**
 * Create: zhangfs by Atom
 * Time: 2018/07/01
 * Usage: <Pagination handlePage={this.handlePage.bind(this)} length={length} pageSize={PAGESIZE} />
 **/


import React from 'react'
import '../less/pagination.less'

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
    }

    updatePage(type = 'prev') {
        let all = parseInt(this.props.length / this.props.pageSize) + 1;
        this.setState((prevState) => {
            (type === 'prev' && this.state.page > 1) && (prevState.page = this.state.page - 1);
            (type === 'next' && this.state.page < all) && (prevState.page = this.state.page + 1);
            this.props.handlePage(prevState.page);
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.length != this.props.length) {
            this.setState({
                page: 1
            })
        }
    }

    render() {
        return (
            <div className="component-pagination">
                <span onClick={this.updatePage.bind(this, 'prev')}>
                    {'<'}
                </span>
                <span>
                    {this.state.page} / {parseInt(this.props.length / this.props.pageSize) + 1}
                </span>
                <span onClick={this.updatePage.bind(this, 'next')}>
                    {'>'}
                </span>
            </div>
        )
    }
}

export default Pagination;
