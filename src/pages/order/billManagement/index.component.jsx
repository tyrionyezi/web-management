import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';
import _state from './index.state.js';
import { _scroll_x, _columns } from './data.js';
import { _dictionary } from '@utils'
import TabNav from './components/tabNav/index.component'
import Query from './components/query/index.component'


@observer
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
        }
    }

    cell_render = (data) => {
        data.map((item) => {
            item.render = (text, record, index) => {
                // if (item.dataIndex == 'operation') {
                //     return (
                //         <span style={{ color: '#03a9f4' }} to={this.to_router.bind(this,record.orderId)}>
                //             {/* <Link to={{ pathname: '/order/billManagement', query: { id: record.orderId } }}> */}
                //                 查看账单
                //             {/* </Link> */}
                //         </span>
                //     )
                // }
                if(item.dataIndex == 'billStatus') {
                    text = _dictionary.billStatus[text];
                }

                if(item.dataIndex == 'billType') {
                    text = _dictionary.billType[text];
                }
                return text;
            }
        })
    }

    componentWillMount() {
        _state.getQueryData();
        if(!!this.props.location.query) {
            this.setState({id: this.props.location.query.id})
        }

        this.cell_render(_columns)
    }
    componentDidMount() {
        // console.log( this.props.location.query)
    }

    render() {
        const rowSelection = {
            selectedRowKeys: _state.selectedRowKeys,
            onChange: _state.onSelectChange,
        };

        return (
            <div className="sub-page">
                <div className="query-box">
                    <Query
                        queryParams={_state.queryParams}
                        setQueryParams={_state.setQueryParams}
                        getQueryData={_state.getQueryData}
                    ></Query>
                </div>
                <TabNav
                    do_delete={_state.do_delete}
                ></TabNav>
                <Table
                    columns={_columns}
                    dataSource={_state.tableData}
                    bordered
                    rowKey={(record, i) => i}
                    scroll={{
                        x: _scroll_x
                    }}
                    onRow={(record) => {
                            return {
                                onDoubleClick: _state.getDetail.bind(this, record.orderId),
                            }
                        }
                    }
                    rowSelection={rowSelection}
                />

                {/* <Detail
                detail_visible={_state.detail_visible}
                set_detail_visible={_state.set_detail_visible}
                /> */}
            </div>
        );
    }
}

export default Index;
