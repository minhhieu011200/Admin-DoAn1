import React, { useState, useEffect } from 'react';
// import io from "socket.io-client";
import moment from 'moment'
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import orderAPI from '../Api/orderAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'

// const socket = io('https://hieusuper20hcm.herokuapp.com/', {
//     transports: ['websocket'], jsonp: false
// });
// socket.connect();

function Order(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '4',
        search: ''
    })
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [status, setStatus] = useState('0');
    const [search, setSearch] = useState('')
    const [order, setOrder] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [totalMoney, setTotalMoney] = useState(0)


    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const od = await orderAPI.statistic(query)
            console.log(od)
            setTotalPage(od.totalPage)
            setOrder(od.orders)
            setTotalMoney(od.totalMoney)
        }

        fetchAllData()
    }, [filter])



    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    const handleSearch = () => {
        setFilter({
            ...filter,
            page: '1',
            search: search,
            status: status,
            startDate: moment(startDate).format('L'),
            endDate: moment(endDate).add(1, 'days').format('L')
        })
    }

    return (
        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Order</h4>
                                <div>
                                    <input className="form-control w-40" type="text" placeholder="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <div className="d-flex my-3">
                                    <div className="mr-5">
                                        <label htmlFor="start">Ngày bắt đầu</label><br />
                                        <DatePicker
                                            closeOnScroll={true}
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            id="start"
                                            isClearable
                                        />
                                    </div>
                                    <div className="mr-5">
                                        <label htmlFor="start">Ngày kết thúc</label><br />
                                        <DatePicker
                                            closeOnScroll={true}
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            isClearable
                                        />
                                    </div>
                                    <div className="mr-5">
                                        <label htmlFor="status">Tình trạng đơn hàng</label><br />
                                        <select name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="0">Tất cả</option>
                                            <option value="1" >Đang xử lý</option>
                                            <option value="2" >Đã xác nhận</option>
                                            <option value="3" >Đang giao</option>
                                            <option value="4" >Hoàn thành</option>
                                            <option value="5" >Đơn bị hủy</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="button" onClick={handleSearch} style={{ cursor: 'pointer', color: 'white' }} className="btn btn-success my-2" >Tìm Kiếm</button>
                                <h4 className="card-title">TotalMoney: {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(totalMoney) + ' VNĐ'}</h4>
                                <div className="table-responsive mt-3">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>CreateDate</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Status</th>
                                                <th>Total Money</th>
                                                <th>Payment Methods</th>
                                                <th>Payment</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                order && order.map((value, index) => (
                                                    <tr key={index}>
                                                        <td className="name">{value._id}</td>
                                                        <td className="li-product-price">
                                                            <span className="amount">
                                                                {new Intl.DateTimeFormat("it-IT", {
                                                                    year: "numeric",
                                                                    month: "numeric",
                                                                    day: "numeric",
                                                                    hour: "numeric",
                                                                    minute: "numeric",
                                                                    second: "numeric"
                                                                }).format(new Date(value.createDate))}
                                                            </span>
                                                        </td>
                                                        <td className="name">{value.id_note ? value.id_note.fullname : ""}</td>
                                                        <td className="name">{value.id_user ? value.id_user.email : ""}</td>
                                                        <td className="name">{value.id_note ? value.id_note.phone : ""}</td>
                                                        <td className="name">{value.address}</td>
                                                        <td>
                                                            {(() => {
                                                                switch (value.status) {
                                                                    case "1": return "Đang xử lý";
                                                                    case "2": return "Đã xác nhận";
                                                                    case "3": return "Đang giao";
                                                                    case "4": return "Hoàn thành";
                                                                    default: return "Đơn bị hủy";
                                                                }
                                                            })()}
                                                        </td>
                                                        <td className="name">{value.total}</td>
                                                        <td className="name">{value.id_payment.pay_name}</td>
                                                        <td className="name">{value.pay === true ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"/order/detail/" + value._id} className="btn btn-info mr-1">Detail</Link>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by Minh Hiếu.
            </footer>
        </div>
    );
}

export default Order;