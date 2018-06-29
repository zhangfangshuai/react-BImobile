import React from 'react'
import { CITY_LIST, PAGESIZE } from '../config/config'
import Header from '../components/header'
import Title from '../components/title'
import DoubleDatePicker from '../components/doubleDatePicker'
import Table from '../components/table'
import Pagination from '../components/pagination'

class Service extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: CITY_LIST[0],
            serviceData: [],
            servicePage: 1,
            serviceReq: {
                interface: 'getCustServerDetail',
                startDate: getDateOffset(-7),
                endDate: getDateOffset(-1)
            }
        }
    }

    selectCity(c) {
        this.setState({ currentCity: c });
    }

    serviceRequest(p) {
        if (isParamValid(p, 'serviceBase')) {
            axiosGet(p, (r) => {
                this.setState({ serviceData: r.data });
            })
        }
    }
    handleDateService(date, picker) {
        picker == 'start' ? this.state.serviceReq.startDate = date : this.state.serviceReq.endDate = date;
        this.serviceRequest(this.state.serviceReq);
    }
    handlePageService(page) {
        this.setState({ servicePage: page });
    }

    componentDidMount() {
        this.serviceRequest(this.state.serviceReq);
    }

    render() {
        let SD = this.state.serviceData, SP = this.state.servicePage;
        let SERVICE = SD.length < 10 ? SD : SD.slice((SP-1)*PAGESIZE, SP*PAGESIZE);
        if (SERVICE.length > 0) {
            var serviceTb = SERVICE.map((i) => {
                return (
                    <li key={SERVICE.indexOf(i)}>
                        <p>{i.date_id}</p><p>{i.total_num}</p><p>{i.ivr_num}</p><p>{i.topeople_num}</p>
                        <p>{i.success_num}</p><p>{i.success_rate}%</p><p>{i.phone_num}</p><p>{i.phonesucc_num}</p>
                        <p>{i.phonesucc_rate}%</p><p>{i.cpo}%</p><p>{i.agent_eff}</p><p>{i.first_rate}%</p>
                    </li>
                )
            })
        }

        return (
            <div className="container">
                <Header city={this.state.currentCity} handleCity={this.selectCity.bind(this)} />

                <section>
                    <div className="wrap clearTopGap">
                        <Title name="客服概况" />
                        <DoubleDatePicker handleDate={this.handleDateService.bind(this)} />
                        <Table self="service" tbody={serviceTb}
                            thead={['日期','总呼入量','IVR(自助服务)','转入人工','成功接起','接起率','外呼数量','外呼实际接通','接通率','CPO','人均接听量','首解率']} />
                        <Pagination
                            handlePage={this.handlePageService.bind(this)}
                            length={this.state.serviceData ? this.state.serviceData.length : 0}
                            pageSize={PAGESIZE} />
                    </div>
                </section>
            </div>
        )
    }
}

export default Service;
