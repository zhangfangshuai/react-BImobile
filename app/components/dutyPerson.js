import React from 'react'
import '../less/dutyPerson.less'

class DutyPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: this.props.city,
            bbflag: false,
            bbStyle: { display: 'none' },
            boxStyle: { display: 'none' },
            inchargeReq: {
                interface: 'getPrincipal',
                id: this.props.sectionId,
                cityId: this.props.city.value
            },
            phone: '',
            person: ''
        }
    }

    showBubble() {
        this.state.bbflag = !this.state.bbflag;
        this.setState({
            bbStyle: {
                display: this.state.bbflag ? 'block' : 'none'
            }
        })
    }

    componentDidMount() {
        if (this.props.city.value == 1) {
              this.setState({
                  boxStyle: { display: 'none' }
              })
        } else {
            axiosGet(this.state.inchargeReq, (res) => {
                this.setState({
                    phone: res[0].sim,
                    person: res[0].liablename,
                    boxStyle: { display: 'block' }
                })
            }, false)
        }
    }

    componentDidUpdate(prevProps) {
        // 该条件避免update中使用setState造成死循环,
        // shouldComponentUpdate()以后可能废除,不用.
        if (this.state.currentCity != this.props.city) {
            if (this.props.city.value != 1) {
                this.state.inchargeReq.cityId = this.props.city.value;
                axiosGet(this.state.inchargeReq, (res) => {
                      if (res.length > 0) {
                          this.setState({
                              currentCity: this.props.city,
                              phone: res[0].sim,
                              person: res[0].liablename,
                              boxStyle: { display: 'block' }
                          })
                      } else {
                          this.setState({
                              boxStyle: { display: 'none' },
                              currentCity: this.props.city
                          })
                      }
                })
            } else {
                this.setState({
                    boxStyle: { display: 'none' },
                    currentCity: this.props.city
                })
            }
        }
    }


    render() {
        return (
            <div className="component-dutyPerson" style={this.state.boxStyle}>
                <p className="bubble" style={this.state.bbStyle}>
                    <a href={`tel:${this.state.phone}`}>{this.state.phone}</a>
                </p>
                <p className="person" onClick={this.showBubble.bind(this)}>责任人: {this.state.person}</p>
            </div>
        )
    }
}

export default DutyPerson;
