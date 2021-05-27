import React, { Component } from "react";
import RCPagination from "rc-pagination";
import "rc-pagination/assets/index.css";

class Pagination extends Component {
    render() {
        const { current, total, pageSize, onChange } = this.props
        return (
            <div className="pagination">
                <RCPagination
                    current={current}
                    total={total}
                    onChange={onChange}
                    pageSize={pageSize}
                />
            </div>
        );
    }
}

export default Pagination;
